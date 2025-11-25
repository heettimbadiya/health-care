export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinicLocation?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export type FormErrors<T> = {
  [K in keyof T]?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

