'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Employee } from '@/types/employee';
import { getEmployees, deleteEmployee } from '../utils/storage';
import { useToaster } from '@/hooks/useToaster';

export interface EmployeeListProps {
  onRefresh?: () => void;
}

export function EmployeeList({ onRefresh }: EmployeeListProps) {
  const router = useRouter();
  const toaster = useToaster();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const loadEmployees = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getEmployees();
      setEmployees(data);
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    // Initial load
    loadEmployees();

    // Reload when page gains focus
    const handleFocus = () => {
      loadEmployees();
    };

    // Listen for custom event when employees are updated
    const handleEmployeesUpdate = () => {
      loadEmployees();
      if (onRefresh) {
        onRefresh();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('employees-updated', handleEmployeesUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('employees-updated', handleEmployeesUpdate);
    };
  }, [onRefresh]);

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      const success = deleteEmployee(employee.id);
      if (success) {
        loadEmployees();
        toaster.success('Employee deleted successfully');
      } else {
        toaster.error('Failed to delete employee');
      }
    }
  };

  const handleSort = (column: string, direction: 'asc' | 'desc' | null) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Sort and paginate data
  const processedData = useMemo(() => {
    let sorted = [...employees];

    if (sortColumn && sortDirection) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sortColumn]?.toString().toLowerCase() || '';
        const bValue = (b as any)[sortColumn]?.toString().toLowerCase() || '';
        
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return sorted.slice(startIndex, endIndex);
  }, [employees, currentPage, pageSize, sortColumn, sortDirection]);

  const columns: TableColumn<Employee>[] = [
    {
      key: 'firstName',
      title: 'Name',
      dataIndex: 'firstName',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center">
          {record.profilePic ? (
            <img
              className="h-10 w-10 rounded-full mr-3 object-cover"
              src={record.profilePic}
              alt={`${record.firstName} ${record.lastName}`}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-primary-600 font-medium text-sm">
                {record.firstName[0]}{record.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName} {record.lastName}
            </div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
    },
    {
      key: 'location',
      title: 'Location',
      dataIndex: 'location',
      sortable: true,
    },
    {
      key: 'phoneNumber',
      title: 'Phone',
      dataIndex: 'phoneNumber',
      render: (value) => value || '-',
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 100,
      render: (_, record) => {
        const menuItems: DropdownMenuItem[] = [
          {
            label: 'Edit',
            onClick: () => router.push(`/dashboard/employees/${record.id}/edit`),
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
          },
          {
            label: 'Delete',
            onClick: () => handleDelete(record),
            variant: 'danger',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ),
          },
        ];

        return (
          <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu
              align="right"
              items={menuItems}
              trigger={
                <button
                  type="button"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Actions"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={processedData}
        loading={loading}
        emptyMessage="No employees found. Click 'Create Employee' to add one."
        pagination={{
          current: currentPage,
          pageSize,
          total: employees.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        sorting={{
          column: sortColumn,
          direction: sortDirection,
          onSort: handleSort,
        }}
        rowKey="id"
        onRowClick={(record) => router.push(`/dashboard/employees/${record.id}/edit`)}
      />
    </div>
  );
}

