'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/components/ui/Table';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Modal } from '@/components/ui/Modal';
import { Employee } from '@/types/employee';
import { getEmployees, deleteEmployee } from '../utils/storage';
import { useToaster } from '@/hooks/useToaster';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeFormData, EmployeeFormErrors } from '@/types/employee';
import { validateEmployeeForm, fileToBase64 } from '../utils/validation';
import { createEmployee, emailExists } from '../utils/storage';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export interface EmployeeListProps {
  onRefresh?: () => void;
}

export interface EmployeeListRef {
  openCreateModal: () => void;
}

export const EmployeeList = React.forwardRef<EmployeeListRef, EmployeeListProps>(
  ({ onRefresh }, ref) => {
    const router = useRouter();
    const toaster = useToaster();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    
    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
  
  // Create form state
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    role: '',
    phoneNumber: '',
    password: '',
    profilePic: null,
  });
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [isCreating, setIsCreating] = useState(false);

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

    // Listen for custom event to open create modal
    const handleOpenCreateModal = () => {
      setIsCreateModalOpen(true);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('employees-updated', handleEmployeesUpdate);
    window.addEventListener('open-create-employee-modal', handleOpenCreateModal);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('employees-updated', handleEmployeesUpdate);
      window.removeEventListener('open-create-employee-modal', handleOpenCreateModal);
    };
  }, [onRefresh]);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }

    const query = searchQuery.toLowerCase();
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const email = employee.email.toLowerCase();
      const role = employee.role.toLowerCase();
      const location = employee.location.toLowerCase();
      const phone = employee.phoneNumber?.toLowerCase() || '';

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query) ||
        location.includes(query) ||
        phone.includes(query)
      );
    });
  }, [employees, searchQuery]);

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    const success = deleteEmployee(employeeToDelete.id);
    
    setTimeout(() => {
      setIsDeleting(false);
      if (success) {
        loadEmployees();
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
        toaster.success('Employee deleted successfully');
      } else {
        toaster.error('Failed to delete employee');
      }
    }, 500);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc' | null) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Sort and paginate data
  const processedData = useMemo(() => {
    let sorted = [...filteredEmployees];

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
  }, [filteredEmployees, currentPage, pageSize, sortColumn, sortDirection]);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validation = validateEmployeeForm(formData, 'create');
    if (!validation.isValid) {
      setErrors(validation.errors);
      toaster.error('Please fix the errors in the form');
      return;
    }

    // Check if email already exists
    if (emailExists(formData.email)) {
      setErrors({ ...errors, email: 'An employee with this email already exists' });
      toaster.error('An employee with this email already exists');
      return;
    }

    setIsCreating(true);

    try {
      // Convert profilePic file to base64 if present
      let profilePicUrl: string | undefined;
      if (formData.profilePic instanceof File) {
        profilePicUrl = await fileToBase64(formData.profilePic);
      }

      // Create employee
      createEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        location: formData.location,
        role: formData.role,
        phoneNumber: formData.phoneNumber || undefined,
        profilePic: profilePicUrl,
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        role: '',
        phoneNumber: '',
        password: '',
        profilePic: null,
      });
      setErrors({});

      toaster.success('Employee created successfully!');
      setIsCreateModalOpen(false);
      loadEmployees();
    } catch (error) {
      toaster.error('Failed to create employee. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof EmployeeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCreateFileSelect = (file: File | null) => {
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };

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
            onClick: () => handleDeleteClick(record),
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
    <>
      <div className="w-full space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} found
          </div>
        </div>

        <Table
          columns={columns}
          data={processedData}
          loading={loading}
          emptyMessage={
            searchQuery
              ? `No employees found matching "${searchQuery}". Try a different search term.`
              : "No employees found. Click 'Create Employee' to add one."
          }
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredEmployees.length,
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

      {/* Create Employee Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          if (!isCreating) {
            setIsCreateModalOpen(false);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              location: '',
              role: '',
              phoneNumber: '',
              password: '',
              profilePic: null,
            });
            setErrors({});
          }
        }}
        title="Create Employee"
        size="lg"
      >
        <div className="px-6 py-6">
          <EmployeeForm
            formData={formData}
            errors={errors}
            mode="create"
            isLoading={isCreating}
            onSubmit={handleCreateSubmit}
            onChange={handleCreateChange}
            onFileSelect={handleCreateFileSelect}
            onCancel={() => {
              if (!isCreating) {
                setIsCreateModalOpen(false);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  location: '',
                  role: '',
                  phoneNumber: '',
                  password: '',
                  profilePic: null,
                });
                setErrors({});
              }
            }}
            showPassword={true}
            showPhoneNumber={false}
            showProfilePic={false}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
          }
        }}
        employee={employeeToDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
});

EmployeeList.displayName = 'EmployeeList';
