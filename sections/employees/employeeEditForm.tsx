'use client';

import React, {useState, useEffect, useRef} from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EmployeeFormData, EmployeeFormErrors, Employee } from '@/types/employee';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';
import * as Yup from 'yup';
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";

// Local storage key for employees (same as in employeeList)
const EMPLOYEES_STORAGE_KEY = 'healthcare_employees';

// Local storage helpers (from app/dashboard/employees/utils/storage.ts)
function getEmployees(): Employee[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    }

    return [];
}

function saveEmployees(employees: Employee[]): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    }
}

function getEmployeeById(id: string): Employee | null {
    const employees = getEmployees();
    return employees.find((emp) => emp.id === id) || null;
}

function updateEmployee(id: string, employeeData: Partial<Employee>): Employee | null {
    const employees = getEmployees();
    const employeeIndex = employees.findIndex((emp) => emp.id === id);

    if (employeeIndex === -1) {
        return null;
    }

    employees[employeeIndex] = {
        ...employees[employeeIndex],
        ...employeeData,
        id,
        updatedAt: new Date().toISOString(),
    };

    saveEmployees(employees);

    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('employees-updated'));
    }

    return employees[employeeIndex];
}

function emailExists(email: string, excludeId?: string): boolean {
    const employees = getEmployees();
    return employees.some((emp) => emp.email === email && emp.id !== excludeId);
}

// Yup schema for edit mode (password optional)
const employeeEditSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .required('First name is required'),
    lastName: Yup.string()
        .trim()
        .min(2, 'Last name must be at least 2 characters')
        .required('Last name is required'),
    email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
    location: Yup.string().required('Location is required'),
    role: Yup.string().required('Role is required'),
    password: Yup.string()
        .nullable()
        .test(
            "password-optional-validation",
            "Password must be at least 8 characters and contain uppercase, lowercase, and a number",
            function (value) {
                if (!value) return true; // empty hoy to ok

                const minLength = value.length >= 8;
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);

                return minLength && hasUpper && hasLower && hasNumber;
            }
        ),
    phoneNumber: Yup.string().optional(),
    profilePic: Yup.mixed().nullable(),
});

async function validateEmployeeFormEditYup(formData: EmployeeFormData): Promise<{
    isValid: boolean;
    errors: EmployeeFormErrors;
}> {
    try {
        await employeeEditSchema.validate(formData, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (err) {
        if (err instanceof Yup.ValidationError) {
            const errors: EmployeeFormErrors = {};
            err.inner.forEach((e) => {
                if (e.path) {
                    (errors as any)[e.path] = e.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { form: 'Validation failed' } as EmployeeFormErrors };
    }
}

// File to base64 helper (from utils/validation.ts)
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

const LOCATION_OPTIONS = [
    { value: 'Main Clinic', label: 'Main Clinic' },
    { value: 'Branch Clinic', label: 'Branch Clinic' },
    { value: 'Urgent Care', label: 'Urgent Care' },
    { value: 'Remote', label: 'Remote' },
];

const ROLE_OPTIONS = [
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Administrator', label: 'Administrator' },
    { value: 'Staff', label: 'Staff' },
];

export interface EmployeeEditFormProps {
    formData: EmployeeFormData;
    errors: EmployeeFormErrors;
    isLoading?: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onFileSelect?: (file: File | null) => void;
    onCancel?: () => void;
    submitButtonText?: string;
}

export function EmployeeEditForm({
                                     formData,
                                     errors,
                                     isLoading = false,
                                     onSubmit,
                                     onChange,
                                     onFileSelect,
                                     onCancel,
                                     submitButtonText = 'Update Employee',
                                 }: EmployeeEditFormProps) {
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof formData.profilePic === 'string') {
            setProfilePicUrl(formData.profilePic);
        } else if (formData.profilePic instanceof File) {
            const url = URL.createObjectURL(formData.profilePic);
            setProfilePicUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setProfilePicUrl(null);
        }
    }, [formData.profilePic]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
            }}
            className="w-full px-6 py-10"
            noValidate
        >
            <div className="w-full flex flex-col lg:flex-row gap-10 items-start">

                {/* LEFT SIDE – SMALL PROFILE CARD */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center w-full lg:w-[420px] h-auto">

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading}
                    />

                    {/* PROFILE IMAGE (click to upload) */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-50 h-50 rounded-full overflow-hidden border-2 border-gray-200 shadow cursor-pointer hover:opacity-80 transition"
                    >
                        {profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                                {(formData.firstName || formData.lastName) ? (
                                    <span className="text-3xl font-bold text-white">
                  {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                </span>
                                ) : (
                                    <svg
                                        className="w-14 h-14 text-white/80"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT SIDE – FULL WIDTH FORM */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Input
                            type="text"
                            name="firstName"
                            label="First Name"
                            value={formData.firstName}
                            onChange={onChange}
                            error={errors.firstName}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            type="text"
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={onChange}
                            error={errors.lastName}
                            required
                            disabled={isLoading}
                        />

                        <div className="md:col-span-2">
                            <Input
                                type="email"
                                name="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={onChange}
                                error={errors.email}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Select
                            name="location"
                            label="Location"
                            value={formData.location}
                            onChange={onChange}
                            options={LOCATION_OPTIONS}
                            error={errors.location}
                            required
                            disabled={isLoading}
                        />

                        <Select
                            name="role"
                            label="Role"
                            value={formData.role}
                            onChange={onChange}
                            options={ROLE_OPTIONS}
                            error={errors.role}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            type="tel"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formData.phoneNumber || ''}
                            onChange={onChange}
                            error={errors.phoneNumber}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            name="password"
                            label="New Password (Optional)"
                            value={formData.password || ''}
                            onChange={onChange}
                            error={errors.password}
                            placeholder="Leave empty to keep current password"
                            required={false}
                            disabled={isLoading}
                            helperText="Leave empty to keep current password"
                        />

                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-4 pt-8 mt-6 border-t border-gray-200">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                            {submitButtonText}
                        </Button>
                    </div>

                </div>

            </div>
        </form>
    );
}

export default function EditEmployeePage() {
    const router = useRouter();
    const params = useParams();
    const toaster = useToaster();
    const employeeId = params.id as string;

    const [formData, setFormData] = useState<EmployeeFormData>({
        firstName:'',
        lastName:'',
        email:'',
        location: '',
        role: '',
        phoneNumber: '',
        password: '',
        profilePic: null,
    });
    const [errors, setErrors] = useState<EmployeeFormErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load employee data
        const loadEmployee = () => {
            const employee = getEmployeeById(employeeId);

            if (!employee) {
                toaster.error('Employee not found');
                router.push('/dashboard/employees');
                return;
            }

            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                location: employee.location,
                role: employee.role,
                phoneNumber: employee.phoneNumber || '',
                password: '',
                profilePic: employee.profilePic || null,
            });
            setIsLoading(false);
        };

        loadEmployee();
    }, [employeeId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form with Yup (password optional)
        const validation = await validateEmployeeFormEditYup(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            toaster.error('Please fix the errors in the form');
            return;
        }

        // Check if email already exists (excluding current employee)
        if (emailExists(formData.email, employeeId)) {
            setErrors({ ...errors, email: 'An employee with this email already exists' });
            toaster.error('An employee with this email already exists');
            return;
        }

        setIsSaving(true);

        try {
            // Convert profilePic file to base64 if it's a new file
            let profilePicUrl: string | undefined = undefined;
            if (formData.profilePic instanceof File) {
                profilePicUrl = await fileToBase64(formData.profilePic);
            } else if (typeof formData.profilePic === 'string') {
                profilePicUrl = formData.profilePic;
            }

            // Update employee
            const updated = updateEmployee(employeeId, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                location: formData.location,
                role: formData.role,
                phoneNumber: formData.phoneNumber || undefined,
                profilePic: profilePicUrl,
            });

            if (!updated) {
                toaster.error('Employee not found');
                return;
            }

            toaster.success('Employee updated successfully!');
            setTimeout(() => {
                router.push('/dashboard/employees');
            }, 1000);
        } catch (error) {
            toaster.error('Failed to update employee. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof EmployeeFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileSelect = (file: File | null) => {
        setFormData((prev) => ({ ...prev, profilePic: file }));
    };

    if (isLoading) {
        return (
            <DashboardLayout
                title="Edit Employee"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Employees', href: '/dashboard/employees' },
                    { label: 'Edit' },
                ]}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <>
            <Toaster toasts={toaster.toasts} onRemove={toaster.removeToast} />
            <DashboardLayout
                title="Edit Employee"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Employees', href: '/dashboard/employees' },
                    { label: 'Edit' },
                ]}
            >
                <div className="w-full">
                    <EmployeeEditForm
                        formData={formData}
                        errors={errors}
                        isLoading={isSaving}
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        onFileSelect={handleFileSelect}
                        onCancel={() => router.push('/dashboard/employees')}
                        submitButtonText="Update Employee"
                    />
                </div>
            </DashboardLayout>
        </>
    );
}
