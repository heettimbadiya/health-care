'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarMenuItems, SidebarMenuItem } from '@/config/sidebar';
import Logo from '@/components/ui/Logo';

export interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (slug: string) => {
    if (slug === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(slug);
  };
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Ensure navigation works even if form interferes
    e.preventDefault();
    router.push(href);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const renderMenuItem = (item: SidebarMenuItem, level: number = 0) => {
    const active = isActive(item.slug);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;
    
    const baseClasses = `
      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
      ${level > 0 ? 'ml-6' : ''}
      ${active
        ? 'bg-primary-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }
    `;

    return (
      <div key={item.slug} className={level > 0 ? 'mt-1' : ''}>
        <Link
          href={item.slug}
          onClick={(e) => handleLinkClick(e, item.slug)}
          className={baseClasses}
        >
          {Icon && (
            <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
          )}
          <span>{item.title}</span>
          {item.badge && (
            <span className={`ml-auto px-2 py-0.5 text-xs font-medium rounded-full ${
              active ? 'bg-white text-primary-600' : 'bg-gray-200 text-gray-700'
            }`}>
              {item.badge}
            </span>
          )}
        </Link>
        {hasChildren && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-16 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-y-0 h-[calc(100vh-4rem)] lg:h-full
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6 border-b border-gray-200 lg:hidden">
            <Logo size="md" showText={true} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {sidebarMenuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
}

