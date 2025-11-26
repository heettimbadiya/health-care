'use client';

import React from 'react';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import FileUpload from '@/components/ui/FileUpload';
import Button from '@/components/ui/Button';
import { EmployeeFormData, EmployeeFormErrors } from '@/types/employee';
import { LOCATION_OPTIONS, ROLE_OPTIONS } from '../utils/constants';

export interface EmployeeFormProps {
  formData: EmployeeFormData;
  errors: EmployeeFormErrors;
  mode: 'create' | 'edit';
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileSelect?: (file: File | null) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  showPassword?: boolean;
  showPhoneNumber?: boolean;
  showProfilePic?: boolean;
}

export function EmployeeForm({
  formData,
  errors,
  mode,
  isLoading = false,
  onSubmit,
  onChange,
  onFileSelect,
  onCancel,
  submitButtonText,
  showPassword = true,
  showPhoneNumber = false,
  showProfilePic = false,
}: EmployeeFormProps) {
  const defaultSubmitText = mode === 'create' ? 'Create Employee' : 'Update Employee';

  return (
    <form 
      onSubmit={(e) => {
        // Only prevent default for form submission, not for navigation
        e.preventDefault();
        onSubmit(e);
      }}
      className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6" 
      noValidate
    >
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="text"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={onChange}
          error={errors.firstName}
          placeholder="John"
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
          placeholder="Doe"
          required
          disabled={isLoading}
        />
      </div>

      {/* Email */}
      <Input
        type="email"
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        placeholder="john.doe@healthcare.com"
        required
        disabled={isLoading}
      />

      {/* Location and Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          name="location"
          label="Location"
          value={formData.location}
          onChange={onChange}
          options={LOCATION_OPTIONS}
          error={errors.location}
          placeholder="Select location"
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
          placeholder="Select role"
          required
          disabled={isLoading}
        />
      </div>

      {/* Phone Number - Conditional (only in edit mode) */}
      {showPhoneNumber && (
        <Input
          type="tel"
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber || ''}
          onChange={onChange}
          error={errors.phoneNumber}
          placeholder="+1234567890"
          disabled={isLoading}
        />
      )}

      {/* Password - Conditional (can appear in both modes) */}
      {showPassword && (
        <PasswordInput
          name="password"
          label={mode === 'create' ? 'Password' : 'New Password (Optional)'}
          value={formData.password || ''}
          onChange={onChange}
          error={errors.password}
          placeholder={mode === 'create' ? 'Enter password' : 'Leave empty to keep current password'}
          required={mode === 'create'}
          disabled={isLoading}
          helperText={mode === 'create' ? 'Must be at least 8 characters with uppercase, lowercase, and a number' : 'Leave empty to keep current password'}
        />
      )}

      {/* Profile Picture - Conditional (only in edit mode) */}
      {showProfilePic && (
        <FileUpload
          name="profilePic"
          label="Profile Picture"
          accept="image/*"
          onFileSelect={onFileSelect}
          error={errors.profilePic}
          preview={true}
          disabled={isLoading}
          defaultValue={typeof formData.profilePic === 'string' ? formData.profilePic : undefined}
        />
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
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
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {submitButtonText || defaultSubmitText}
        </Button>
      </div>
    </form>
  );
}

