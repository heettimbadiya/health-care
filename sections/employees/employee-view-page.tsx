'use client';

import React, { useRef } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import Button from '@/components/ui/Button';
import { EmployeeList } from '@/sections/employees/employeeList';
import { useToaster } from '@/hooks/useToaster';
import Toaster from '@/components/ui/Toaster';

export default function EmployeeViewPage() {
    const toaster = useToaster();
    const employeeListRef = useRef<{ openCreateModal: () => void }>(null);

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
                        onClick={() => {
                            // Trigger modal opening in EmployeeList via custom event
                            window.dispatchEvent(new CustomEvent('open-create-employee-modal'));
                        }}
                    >
                        Create Employee
                    </Button>
                }
            >
                <EmployeeList ref={employeeListRef} />
            </DashboardLayout>
        </>
    );
}
