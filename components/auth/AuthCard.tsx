import React from 'react';
import Logo from '../ui/Logo';

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
            )}
          </div>
          <div className="space-y-6">{children}</div>
          {footer && (
            <div className="mt-6 pt-6 border-t border-gray-200">{footer}</div>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HealthCare Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthCard;

