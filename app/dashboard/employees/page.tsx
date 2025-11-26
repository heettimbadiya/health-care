'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import Button from '@/components/ui/Button';
import { EmployeeList } from './components/EmployeeList';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function EmployeesPage() {
  const router = useRouter();
  const toaster = useToaster();

  return (
    <>
      <Toaster toasts={toaster.toasts} onRemove={toaster.removeToast} />
      <DashboardLayout
        title="Employees"
        description="Manage healthcare employees"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Employees' },
        ]}
        actions={
          <Button
            onClick={() => router.push('/dashboard/employees/create')}
          >
            Create Employee
          </Button>
        }
      >
        <EmployeeList />
      </DashboardLayout>
    </>
  );
}
