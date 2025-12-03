/**
 * Employee Form Validation Utilities
 */

import { EmployeeFormData, EmployeeFormErrors } from '@/types/employee';

/**
 * Validate employee form data
 */
export function validateEmployeeForm(
  formData: EmployeeFormData,
  mode: 'create' | 'edit' = 'create',
  excludeEmailId?: string
): { isValid: boolean; errors: EmployeeFormErrors } {
  const errors: EmployeeFormErrors = {};

  // First Name
  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Last Name
  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Email
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Location
  if (!formData.location) {
    errors.location = 'Location is required';
  }

  // Role
  if (!formData.role) {
    errors.role = 'Role is required';
  }

  // Password (required in create mode)
  if (mode === 'create') {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and a number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}


