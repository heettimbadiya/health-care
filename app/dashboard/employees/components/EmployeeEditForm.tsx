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
    // <form
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     onSubmit(e);
    //   }}
    //   className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    //   noValidate
    // >
    //   <div className="flex flex-col lg:flex-row">
    //     {/* Left Side - Profile Picture at Top */}
    //     <div className="w-full lg:w-72 xl:w-80 2xl:w-96 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 lg:bg-white flex-shrink-0">
    //       <div className="flex flex-col items-center w-full p-6 lg:p-8">
    //         {/* Upload Button - Above Image */}
    //         <button
    //           type="button"
    //           onClick={handleUploadClick}
    //           disabled={isLoading}
    //           className="mb-4 p-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
    //           aria-label="Upload profile picture"
    //         >
    //           <svg
    //             className="w-6 h-6"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //           >
    //             <path
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth={2}
    //               d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    //             />
    //           </svg>
    //         </button>
    //
    //         {/* Hidden File Input */}
    //         <input
    //           ref={fileInputRef}
    //           type="file"
    //           accept="image/*"
    //           onChange={handleFileChange}
    //           className="hidden"
    //           disabled={isLoading}
    //         />
    //
    //         {/* Circular Profile Picture */}
    //         <div className="relative">
    //           <div className="w-40 h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
    //             {profilePicUrl ? (
    //               <img
    //                 src={profilePicUrl}
    //                 alt="Profile"
    //                 className="w-full h-full object-cover"
    //               />
    //             ) : (
    //               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
    //                 {formData.firstName || formData.lastName ? (
    //                   <span className="text-4xl lg:text-5xl font-bold text-white">
    //                     {formData.firstName?.[0] || ''}{formData.lastName?.[0] || ''}
    //                   </span>
    //                 ) : (
    //                   <svg
    //                     className="w-20 h-20 lg:w-24 lg:h-24 text-white/80"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       strokeWidth={2}
    //                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //                     />
    //                   </svg>
    //                 )}
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //
    //     {/* Right Side - Form Fields */}
    //     <div className="flex-1 p-6 lg:p-8 min-w-0">
    //       <div className="space-y-6">
    //         {/* Personal Information Section - 2 Column Grid */}
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //           {/* First Name */}
    //           <Input
    //             type="text"
    //             name="firstName"
    //             label="First Name"
    //             value={formData.firstName}
    //             onChange={onChange}
    //             error={errors.firstName}
    //             placeholder="John"
    //             required
    //             disabled={isLoading}
    //           />
    //
    //           {/* Last Name */}
    //           <Input
    //             type="text"
    //             name="lastName"
    //             label="Last Name"
    //             value={formData.lastName}
    //             onChange={onChange}
    //             error={errors.lastName}
    //             placeholder="Doe"
    //             required
    //             disabled={isLoading}
    //           />
    //
    //           {/* Email - Full width */}
    //           <div className="md:col-span-2">
    //             <Input
    //               type="email"
    //               name="email"
    //               label="Email Address"
    //               value={formData.email}
    //               onChange={onChange}
    //               error={errors.email}
    //               placeholder="john.doe@healthcare.com"
    //               required
    //               disabled={isLoading}
    //             />
    //           </div>
    //
    //           {/* Location */}
    //           <Select
    //             name="location"
    //             label="Location"
    //             value={formData.location}
    //             onChange={onChange}
    //             options={LOCATION_OPTIONS}
    //             error={errors.location}
    //             placeholder="Select location"
    //             required
    //             disabled={isLoading}
    //           />
    //
    //           {/* Role */}
    //           <Select
    //             name="role"
    //             label="Role"
    //             value={formData.role}
    //             onChange={onChange}
    //             options={ROLE_OPTIONS}
    //             error={errors.role}
    //             placeholder="Select role"
    //             required
    //             disabled={isLoading}
    //           />
    //
    //           {/* Phone Number */}
    //           <Input
    //             type="tel"
    //             name="phoneNumber"
    //             label="Phone Number"
    //             value={formData.phoneNumber || ''}
    //             onChange={onChange}
    //             error={errors.phoneNumber}
    //             placeholder="+1234567890"
    //             disabled={isLoading}
    //           />
    //
    //           {/* Password */}
    //           <PasswordInput
    //             name="password"
    //             label="New Password (Optional)"
    //             value={formData.password || ''}
    //             onChange={onChange}
    //             error={errors.password}
    //             placeholder="Leave empty to keep current password"
    //             required={false}
    //             disabled={isLoading}
    //             helperText="Leave empty to keep current password"
    //           />
    //         </div>
    //
    //         {/* Form Actions */}
    //         <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
    //           {onCancel && (
    //             <Button
    //               type="button"
    //               variant="outline"
    //               onClick={onCancel}
    //               disabled={isLoading}
    //               className="w-full sm:w-auto"
    //             >
    //               Cancel
    //             </Button>
    //           )}
    //           <Button
    //             type="submit"
    //             isLoading={isLoading}
    //             disabled={isLoading}
    //             className="w-full sm:w-auto"
    //           >
    //             {submitButtonText}
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </form>
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
