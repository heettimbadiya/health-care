'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { LoginFormData, FormErrors } from '@/types/auth';
import { setAuthToken, generateDummyToken, setUserData } from '@/lib/auth';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function LoginPage() {
  const router = useRouter();
  const toaster = useToaster();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('healthcare_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === formData.email);
      
      // Check if user exists and password matches
      if (!user) {
        toaster.error('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
        return;
      }
      
      if (user.password !== formData.password) {
        toaster.error('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
        return;
      }
      
      // Generate and store token
      const token = generateDummyToken();
      setAuthToken(token);
      
      // Store user data
      setUserData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        clinicLocation: user.clinicLocation,
      });
      
      // Show success message
      toaster.success('Successfully logged in! Redirecting...');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      toaster.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  return (
    <>
      <Toaster toasts={toaster.toasts} onRemove={toaster.removeToast} />
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to access your healthcare portal"
      >
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

          <div>
            <PasswordInput
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={isLoading}
            />
          <div className="mt-2 flex items-center justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link
          href="/auth/register"
          className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          Create an account
        </Link>
      </div>
    </AuthCard>
    </>
  );
}

