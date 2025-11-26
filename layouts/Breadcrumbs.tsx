'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { theme } from '@/theme';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
}

export function Breadcrumbs({ items, homeLabel = 'Dashboard' }: BreadcrumbsProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Auto-generate breadcrumbs from pathname if items not provided
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(pathname, homeLabel);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Ensure navigation works even if form interferes
    e.preventDefault();
    router.push(href);
  };

  return (
    <nav className="flex py-1" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400  whitespace-nowrap"
                  onClick={(e) => handleLinkClick(e, item.href!)}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function generateBreadcrumbs(pathname: string, homeLabel: string): BreadcrumbItem[] {
  const parts = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: homeLabel, href: '/dashboard' }];

  let currentPath = '';
  
  parts.forEach((part, index) => {
    currentPath += `/${part}`;
    
    // Skip dashboard in breadcrumbs if it's the first part
    if (index === 0 && part === 'dashboard') {
      return;
    }
    
    const label = part
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    items.push({
      label,
      href: index === parts.length - 1 ? undefined : currentPath,
    });
  });

  return items;
}

