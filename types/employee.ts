/**
 * Employee types
 */

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  role: string;
  phoneNumber?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  role: string;
  phoneNumber?: string;
  password?: string;
  profilePic?: File | string | null;
}

export type EmployeeFormErrors = {
  [K in keyof EmployeeFormData]?: string;
};

