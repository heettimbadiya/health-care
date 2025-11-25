import React from 'react';
import Link from 'next/link';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizes[size]} bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-md`}>
        <svg
          className="h-full w-full p-2 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-gray-800`}>
          HealthCare<span className="text-primary-600">Portal</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;

