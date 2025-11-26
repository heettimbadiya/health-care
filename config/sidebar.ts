/**
 * Dynamic Sidebar Configuration
 * Add or update menu items here to automatically update the sidebar UI
 */

import { ReactNode } from 'react';
import {
  DashboardIcon,
  UsersIcon,
  ReportsIcon,
  PatientsIcon,
  IncentivesIcon,
  SettingsIcon,
} from './sidebar-icons';

export type SidebarMenuIcon = React.ComponentType<{ className?: string }>;

export interface SidebarMenuItem {
  title: string;
  slug: string;
  icon?: SidebarMenuIcon;
  children?: SidebarMenuItem[];
  permission?: string | string[];
  badge?: string | number;
}

/**
 * Sidebar menu configuration
 * Update this array to modify the sidebar menu
 */
export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    title: 'Dashboard',
    slug: '/dashboard',
    icon: DashboardIcon,
  },
  {
    title: 'Employees',
    slug: '/dashboard/employees',
    icon: UsersIcon,
  },
  {
    title: 'Patients',
    slug: '/dashboard/patients',
    icon: PatientsIcon,
  },
  {
    title: 'Incentives',
    slug: '/dashboard/incentives',
    icon: IncentivesIcon,
  },
  {
    title: 'Reports',
    slug: '/dashboard/reports',
    icon: ReportsIcon,
  },
  {
    title: 'Settings',
    slug: '/dashboard/settings',
    icon: SettingsIcon,
  },
];
