'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeFormData, EmployeeFormErrors } from '@/types/employee';
import { validateEmployeeForm, fileToBase64 } from '../utils/validation';
import { createEmployee, emailExists } from '../utils/storage';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function CreateEmployeePage() {
  const router = useRouter();
  const toaster = useToaster();
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validation = validateEmployeeForm(formData, 'create');
    if (!validation.isValid) {
      setErrors(validation.errors);
      toaster.error('Please fix the errors in the form');
      return;
    }

    // Check if email already exists
    if (emailExists(formData.email)) {
      setErrors({ ...errors, email: 'An employee with this email already exists' });
      toaster.error('An employee with this email already exists');
      return;
    }

    setIsLoading(true);

    try {
      // Convert profilePic file to base64 if present
      let profilePicUrl: string | undefined;
      if (formData.profilePic instanceof File) {
        profilePicUrl = await fileToBase64(formData.profilePic);
      }

      // Create employee
      createEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        location: formData.location,
        role: formData.role,
        phoneNumber: formData.phoneNumber || undefined,
        profilePic: profilePicUrl,
      });

      toaster.success('Employee created successfully!');
      setTimeout(() => {
        router.push('/dashboard/employees');
      }, 1000);
    } catch (error) {
      toaster.error('Failed to create employee. Please try again.');
    } finally {
      setIsLoading(false);
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

  return (
    <>
      <Toaster toasts={toaster.toasts} onRemove={toaster.removeToast} />
      <DashboardLayout
        title="Create Employee"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Employees', href: '/dashboard/employees' },
          { label: 'Create' },
        ]}
      >
        <div className="w-full max-w-4xl mx-auto">
          <EmployeeForm
            formData={formData}
            errors={errors}
            mode="create"
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onFileSelect={handleFileSelect}
            onCancel={() => router.back()}
            showPassword={true}
            showPhoneNumber={false}
            showProfilePic={false}
          />
        </div>
      </DashboardLayout>
    </>
  );
}
