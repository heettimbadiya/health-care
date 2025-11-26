'use client';

import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { EmployeeFormData, EmployeeFormErrors } from '@/types/employee';
import { LOCATION_OPTIONS, ROLE_OPTIONS } from '../utils/constants';

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
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      noValidate
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Profile Picture at Top */}
        <div className="lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white p-6 lg:p-8">
          <div className="flex flex-col items-center w-full">
            {/* Upload Button - Above Image */}
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isLoading}
              className="mb-4 p-3 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Upload profile picture"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />

            {/* Circular Profile Picture */}
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                    {formData.firstName || formData.lastName ? (
                      <span className="text-5xl font-semibold text-primary-600">
                        {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
                      </span>
                    ) : (
                      <svg
                        className="w-24 h-24 text-gray-400"
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
          </div>
        </div>

        {/* Right Side - Form Fields in Responsive Grid */}
        <div className="flex-1 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
              {/* First Name - spans 1 column, wraps to full width on small screens */}
              <div className="sm:col-span-1">
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
              </div>

              {/* Last Name - spans 1 column */}
              <div className="sm:col-span-1">
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

              {/* Email - spans 2 columns on large screens, full width on small */}
              <div className="sm:col-span-2 lg:col-span-2">
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
              </div>

              {/* Location - spans 1 column */}
              <div className="sm:col-span-1">
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
              </div>

              {/* Role - spans 1 column */}
              <div className="sm:col-span-1">
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

              {/* Phone Number - spans 1 column */}
              <div className="sm:col-span-1">
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
              </div>

              {/* Password - spans 1 column, wraps to full width */}
              <div className="sm:col-span-1 lg:col-span-1">
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
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {submitButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
