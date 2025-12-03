/**
 * Employee Module Constants
 */

import { SelectOption } from '@/components/ui/Select';

export const LOCATION_OPTIONS: SelectOption[] = [
  { value: 'Main Clinic', label: 'Main Clinic' },
  { value: 'Branch Clinic', label: 'Branch Clinic' },
  { value: 'Urgent Care', label: 'Urgent Care' },
  { value: 'Remote', label: 'Remote' },
];

export const ROLE_OPTIONS: SelectOption[] = [
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Nurse', label: 'Nurse' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Staff', label: 'Staff' },
];


