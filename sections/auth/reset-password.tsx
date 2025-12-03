'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ResetPasswordFormData, FormErrors } from '@/types/auth';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FormErrors<ResetPasswordFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, you'd validate the token from the URL
        const tokenParam = searchParams.get('token');
        setToken(tokenParam);

        if (!tokenParam) {
            setAlert({
                type: 'error',
                message: 'Invalid or missing reset token. Please request a new password reset.',
            });
        }
    }, [searchParams]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors<ResetPasswordFormData> = {};

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
        setAlert(null);

        if (!token) {
            setAlert({
                type: 'error',
                message: 'Invalid reset token. Please request a new password reset.',
            });
            return;
        }

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
                message: 'Your password has been reset successfully!',
            });

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Failed to reset password. The token may have expired. Please request a new reset link.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof ResetPasswordFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (isSubmitted) {
        return (
            <AuthCard
                title="Password Reset Successful"
                subtitle="Your password has been updated"
            >
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-sm">
                        You can now sign in with your new password.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => router.push('/auth/login')}
                >
                    Go to Sign In
                </Button>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Reset Your Password"
            subtitle="Enter your new password below"
        >
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {!token && (
                <Alert
                    type="error"
                    message="Invalid or missing reset token. Please request a new password reset."
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <PasswordInput
                    name="password"
                    label="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Enter your new password"
                    required
                    autoComplete="new-password"
                    helperText="Must be at least 8 characters with uppercase, lowercase, and a number"
                    disabled={isLoading || !token}
                />

                <PasswordInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Re-enter your new password"
                    required
                    autoComplete="new-password"
                    disabled={isLoading || !token}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading || !token}
                >
                    Reset Password
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

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <AuthCard title="Loading..." subtitle="Please wait">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            </AuthCard>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}

