'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EmployeeForm } from '../../components/EmployeeForm';
import { EmployeeFormData, EmployeeFormErrors, Employee } from '@/types/employee';
import { validateEmployeeForm, fileToBase64 } from '../../utils/validation';
import { getEmployeeById, updateEmployee, emailExists } from '../../utils/storage';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const toaster = useToaster();
  const employeeId = params.id as string;
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
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

    // Validate form (password optional in edit mode)
    const validation = validateEmployeeForm(formData, 'edit', employeeId);
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
        <div className="w-full max-w-4xl mx-auto">
          <EmployeeForm
            formData={formData}
            errors={errors}
            mode="edit"
            isLoading={isSaving}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onFileSelect={handleFileSelect}
            onCancel={() => router.back()}
            showPassword={true}
            showPhoneNumber={true}
            showProfilePic={true}
          />
        </div>
      </DashboardLayout>
    </>
  );
}
