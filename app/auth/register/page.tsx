'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { RegisterFormData, FormErrors } from '@/types/auth';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function RegisterPage() {
  const router = useRouter();
  const toaster = useToaster();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    clinicLocation: '',
  });
  const [errors, setErrors] = useState<FormErrors<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors<RegisterFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and a number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Mock API call with localStorage
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('healthcare_users') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === formData.email);
      
      if (userExists) {
        toaster.error('An account with this email already exists.');
        setIsLoading(false);
        return;
      }
      
      // Store user in localStorage (dummy storage - never do this in production!)
      const newUser = {
        email: formData.email,
        password: formData.password, // In real app, hash this!
        firstName: formData.firstName,
        lastName: formData.lastName,
        clinicLocation: formData.clinicLocation || undefined,
      };
      existingUsers.push(newUser);
      localStorage.setItem('healthcare_users', JSON.stringify(existingUsers));
      
      // Show success message
      toaster.success('Registered successfully! Redirecting to login...');
      
      // Redirect to Login page after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (error) {
      toaster.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <Toaster toasts={toaster.toasts} onRemove={toaster.removeToast} />
      <AuthCard
        title="Create Your Account"
        subtitle="Join our healthcare portal to get started"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="John"
            required
            autoComplete="given-name"
            disabled={isLoading}
          />

          <Input
            type="text"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Doe"
            required
            autoComplete="family-name"
            disabled={isLoading}
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <Input
          type="text"
          name="clinicLocation"
          label="Clinic Location (Optional)"
          value={formData.clinicLocation}
          onChange={handleChange}
          error={errors.clinicLocation}
          placeholder="Main Clinic"
          autoComplete="organization"
          disabled={isLoading}
        />

        <PasswordInput
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a strong password"
          required
          autoComplete="new-password"
          helperText="Must be at least 8 characters with uppercase, lowercase, and a number"
          disabled={isLoading}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
    </>
  );
}

