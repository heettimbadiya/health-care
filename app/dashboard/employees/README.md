# Employee Module

This module follows a scalable, reusable architecture pattern similar to MUI Admin templates. The structure is organized for easy maintenance and extensibility.

## Folder Structure

```
app/dashboard/employees/
├── components/          # Reusable components
│   ├── EmployeeForm.tsx      # Shared form component (used by Create & Edit)
│   ├── EmployeeList.tsx      # List view component
│   └── index.ts              # Component exports
├── utils/               # Utility functions
│   ├── storage.ts            # localStorage operations
│   ├── validation.ts         # Form validation logic
│   ├── constants.ts          # Module constants (options, etc.)
│   └── index.ts              # Utility exports
├── create/              # Create page
│   └── page.tsx
├── [id]/                # Dynamic routes
│   └── edit/
│       └── page.tsx
├── page.tsx             # Listing page
└── README.md            # This file
```

## Components

### EmployeeForm
A reusable form component that handles both create and edit modes with conditional field visibility:

**Props:**
- `formData`: Form data state
- `errors`: Validation errors
- `mode`: 'create' | 'edit'
- `isLoading`: Loading state
- `onSubmit`: Submit handler
- `onChange`: Input change handler
- `onFileSelect`: File upload handler
- `onCancel`: Cancel handler (optional)
- `showPassword`: Toggle password field visibility (default: true)
- `showPhoneNumber`: Toggle phone number field visibility (default: false)
- `showProfilePic`: Toggle profile picture field visibility (default: false)

**Conditional Fields:**
- **Password**: Visible in both create and edit modes
  - Required in create mode
  - Optional in edit mode (user can leave empty to keep current password)
- **Phone Number**: Only visible in edit mode (`showPhoneNumber={true}`)
- **Profile Picture**: Only visible in edit mode (`showProfilePic={true}`)

### EmployeeList
A reusable list component that displays employees in a table with sorting, pagination, and actions.

## Utilities

### storage.ts
Handles all localStorage operations:
- `getEmployees()`: Get all employees
- `getEmployeeById(id)`: Get employee by ID
- `createEmployee(data)`: Create new employee
- `updateEmployee(id, data)`: Update existing employee
- `deleteEmployee(id)`: Delete employee
- `emailExists(email, excludeId?)`: Check if email exists

### validation.ts
Contains form validation logic:
- `validateEmployeeForm(formData, mode, excludeEmailId?)`: Validate form data
- `fileToBase64(file)`: Convert file to base64 string

### constants.ts
Module constants:
- `LOCATION_OPTIONS`: Available location options
- `ROLE_OPTIONS`: Available role options

## Pages

### Listing Page (`page.tsx`)
Displays the employee list using the `EmployeeList` component. Includes a "Create Employee" button in the header.

### Create Page (`create/page.tsx`)
Uses the `EmployeeForm` component with:
- `mode="create"`
- `showPassword={true}`
- `showPhoneNumber={false}`
- `showProfilePic={false}`

### Edit Page (`[id]/edit/page.tsx`)
Uses the `EmployeeForm` component with:
- `mode="edit"`
- `showPassword={true}` (optional password update)
- `showPhoneNumber={true}`
- `showProfilePic={true}`

## Usage Pattern

This structure allows for easy extension:

1. **Add new fields**: Update `EmployeeForm` and validation logic
2. **Add new views**: Create new pages using existing components
3. **Modify behavior**: Update utilities without touching component logic
4. **Reuse components**: Use `EmployeeForm` and `EmployeeList` in other modules

## Benefits

- ✅ **DRY Principle**: Single form component for create and edit
- ✅ **Separation of Concerns**: Logic separated from UI
- ✅ **Reusability**: Components can be used across the app
- ✅ **Maintainability**: Clear folder structure and responsibilities
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Scalability**: Easy to extend with new features


