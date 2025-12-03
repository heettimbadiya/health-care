'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ForgotPasswordFormData, FormErrors } from '@/types/auth';

export default function ForgotPassword() {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: '',
    });
    const [errors, setErrors] = useState<FormErrors<ForgotPasswordFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors<ForgotPasswordFormData> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAlert(null);

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Mock API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate success
            setIsSubmitted(true);
            setAlert({
                type: 'success',
                message: 'Password reset instructions have been sent to your email.',
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Failed to send reset email. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof ForgotPasswordFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (isSubmitted) {
        return (
            <AuthCard
                title="Check Your Email"
                subtitle="We've sent password reset instructions to your email address"
            >
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-sm">
                        If an account exists with <strong>{formData.email}</strong>, you will receive
                        password reset instructions shortly.
                    </p>
                    <p className="text-gray-500 text-xs">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        size="lg"
                        fullWidth
                        onClick={() => {
                            setIsSubmitted(false);
                            setFormData({ email: '' });
                            setAlert(null);
                        }}
                    >
                        Try Different Email
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="Enter your email address and we'll send you reset instructions"
        >
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

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

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    Send Reset Instructions
                </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                    Sign in
                </Link>
            </div>
        </AuthCard>
    );
}
