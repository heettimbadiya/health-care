"use client";

import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";

import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

import { LOCATION_OPTIONS, ROLE_OPTIONS } from "../utils/constants";
import { EmployeeFormData, EmployeeFormErrors } from "@/types/employee";

export interface EmployeeEditFormProps {
  formData: EmployeeFormData;
  errors: EmployeeFormErrors;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onFileSelect?: (file: File | null) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}


const employeeSchema = Yup.object().shape({
  firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name too short"),

  lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name too short"),

  email: Yup.string()
      .required("Email is required")
      .email("Please enter a valid email"),

  phoneNumber: Yup.string().when([], {
    is: (value: string | undefined) => value && value.length > 0,
    then: (schema) =>
        schema.matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),

  location: Yup.string().required("Location is required"),

  role: Yup.string().required("Role is required"),

  password: Yup.string().when([], {
    is: (value: string | undefined) => value && value.length > 0,
    then: (schema) => schema.min(6, "Password must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

/* -------------------------------------------------------------------------- */

export function EmployeeEditForm({
                                   formData,
                                   errors,
                                   isLoading = false,
                                   onSubmit,
                                   onChange,
                                   onFileSelect,
                                   onCancel,
                                   submitButtonText = "Update Employee",
                                 }: EmployeeEditFormProps) {
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<EmployeeFormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------------------------------------------- */
  /*                    Auto Preview When Uploading Image                   */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    if (typeof formData.profilePic === "string") {
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
    if (onFileSelect) onFileSelect(file);
  };

  /* ---------------------------------------------------------------------- */
  /*                           HANDLE SUBMIT + YUP                          */
  /* ---------------------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLocalErrors({}); // reset old errors

      await employeeSchema.validate(formData, { abortEarly: false });

      onSubmit(e); // <-- your existing submit call
    } catch (err: any) {
      const newErrors: EmployeeFormErrors = {};

      err.inner.forEach((item: any) => {
        newErrors[item.path as keyof EmployeeFormErrors] = item.message;
      });

      setLocalErrors(newErrors);
      console.log("Validation Errors:", newErrors);
    }
  };

  /* ---------------------------------------------------------------------- */

  return (
      <form onSubmit={handleSubmit} className="w-full px-6 py-10" noValidate>
        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT SIDE – PROFILE CARD */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center w-full lg:w-[420px] h-auto">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
            />

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
                    {formData.firstName?.[0] || ""}
                          {formData.lastName?.[0] || ""}
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

          {/* RIGHT SIDE – FORM */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={onChange}
                  error={localErrors.firstName}
                  required
                  disabled={isLoading}
              />

              <Input
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={onChange}
                  error={localErrors.lastName}
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
                    error={localErrors.email}
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
                  error={localErrors.location}
                  required
                  disabled={isLoading}
              />

              <Select
                  name="role"
                  label="Role"
                  value={formData.role}
                  onChange={onChange}
                  options={ROLE_OPTIONS}
                  error={localErrors.role}
                  required
                  disabled={isLoading}
              />

              <Input
                  type="tel"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber || ""}
                  onChange={onChange}
                  error={localErrors.phoneNumber}
                  disabled={isLoading}
              />

              <PasswordInput
                  name="password"
                  label="New Password (Optional)"
                  value={formData.password || ""}
                  onChange={onChange}
                  error={localErrors.password}
                  placeholder="Leave empty to keep current password"
                  required={false}
                  disabled={isLoading}
                  helperText="Leave empty to keep current password"
              />
            </div>

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
