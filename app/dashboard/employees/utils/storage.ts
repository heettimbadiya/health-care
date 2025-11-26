/**
 * Employee Storage Utilities
 * Handles all localStorage operations for employees
 */

import { Employee } from '@/types/employee';

const EMPLOYEES_STORAGE_KEY = 'healthcare_employees';

/**
 * Get all employees from localStorage
 */
export function getEmployees(): Employee[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  
  return [];
}

/**
 * Save employees to localStorage
 */
export function saveEmployees(employees: Employee[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  }
}

/**
 * Get employee by ID
 */
export function getEmployeeById(id: string): Employee | null {
  const employees = getEmployees();
  return employees.find((emp) => emp.id === id) || null;
}

/**
 * Create a new employee
 */
export function createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employeeData,
    id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  employees.push(newEmployee);
  saveEmployees(employees);
  
  // Dispatch event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('employees-updated'));
  }
  
  return newEmployee;
}

/**
 * Update an existing employee
 */
export function updateEmployee(id: string, employeeData: Partial<Employee>): Employee | null {
  const employees = getEmployees();
  const employeeIndex = employees.findIndex((emp) => emp.id === id);
  
  if (employeeIndex === -1) {
    return null;
  }
  
  employees[employeeIndex] = {
    ...employees[employeeIndex],
    ...employeeData,
    id, // Preserve ID
    updatedAt: new Date().toISOString(),
  };
  
  saveEmployees(employees);
  
  // Dispatch event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('employees-updated'));
  }
  
  return employees[employeeIndex];
}

/**
 * Delete an employee
 */
export function deleteEmployee(id: string): boolean {
  const employees = getEmployees();
  const filtered = employees.filter((emp) => emp.id !== id);
  
  if (filtered.length === employees.length) {
    return false; // Employee not found
  }
  
  saveEmployees(filtered);
  
  // Dispatch event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('employees-updated'));
  }
  
  return true;
}

/**
 * Check if email already exists
 */
export function emailExists(email: string, excludeId?: string): boolean {
  const employees = getEmployees();
  return employees.some(
    (emp) => emp.email === email && emp.id !== excludeId
  );
}

