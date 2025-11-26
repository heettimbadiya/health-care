# Enterprise-Grade Architecture Overview

This document describes the complete folder structure and architecture of the Healthcare Incentive Management System.

## 📁 Folder Structure

```
health-care/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── page.tsx             # Dashboard home
│   │   ├── employees/           # Employee module
│   │   │   ├── page.tsx         # Employee listing
│   │   │   ├── create/
│   │   │   │   └── page.tsx     # Create employee
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit employee
│   │   ├── patients/            # (Future)
│   │   ├── incentives/          # (Future)
│   │   └── reports/             # (Future)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (redirects)
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── auth/                    # Auth-specific components
│   │   ├── AuthCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   └── ui/                      # Global UI components
│       ├── Input.tsx
│       ├── PasswordInput.tsx
│       ├── Select.tsx
│       ├── FileUpload.tsx
│       ├── Button.tsx
│       ├── Table.tsx
│       ├── Alert.tsx
│       ├── Logo.tsx
│       ├── Toaster.tsx
│       └── index.ts
│
├── layouts/                      # Layout components
│   ├── DashboardLayout.tsx      # Main dashboard layout
│   ├── Navbar.tsx               # Top navigation bar
│   ├── Sidebar.tsx              # Dynamic sidebar
│   ├── Breadcrumbs.tsx          # Breadcrumb navigation
│   └── index.ts
│
├── lib/                          # Core utilities and logic
│   └── auth/                    # Authentication system
│       ├── Provider.tsx         # AuthProvider context
│       ├── utils.ts             # Auth utility functions
│       └── index.ts             # Exports
│
├── theme/                        # Global theme system
│   ├── index.ts                 # Theme configuration
│   ├── utils.ts                 # Theme utility functions
│   └── Provider.tsx             # ThemeProvider context
│
├── config/                       # Configuration files
│   └── sidebar.ts               # Dynamic sidebar menu config
│
├── hooks/                        # Custom React hooks
│   └── useToaster.ts            # Toast notification hook
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                  # Auth-related types
│   └── employee.ts              # Employee-related types
│
└── public/                       # Static assets
```

## 🎨 Theme System

The global theme system is located in `/theme` and provides:

- **Colors**: Primary (blue), Secondary (green), Gray, Success, Error, Warning, Info
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation shadows
- **Border Radius**: Rounded corner values
- **Component Variants**: Pre-defined component styles

All components automatically use theme values through Tailwind CSS classes.

## 🔐 Authentication System

Located in `/lib/auth`:

- **AuthProvider**: React context provider managing auth state
- **useAuth()**: Hook to access auth state and methods
- **Protected Routes**: Automatic redirect to login if not authenticated
- **LocalStorage**: Dummy authentication using localStorage (replace with real API)

## 📋 Dynamic Sidebar

The sidebar is configured in `/config/sidebar.ts`:

```typescript
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
  // Add more items here...
];
```

Simply add or update menu items in this array, and the sidebar UI will automatically update.

## 📊 Global Table Component

The `Table` component in `/components/ui/Table.tsx` provides:

- Frontend pagination with page size selector
- Sortable columns
- Loading states
- Empty state messaging
- Custom column rendering
- Row click handlers
- Fully typed with TypeScript

## 📝 Form Components

All form components are located in `/components/ui`:

- **Input**: Text input with validation
- **PasswordInput**: Password input with show/hide toggle
- **Select**: Dropdown select with options
- **FileUpload**: File upload with image preview
- **Button**: Multiple variants and sizes

All components follow the healthcare theme and are fully responsive.

## 🏗️ Layout System

The layout system in `/layouts` provides:

- **DashboardLayout**: Main layout wrapper with navbar, sidebar, breadcrumbs
- **Navbar**: Top navigation with user info and logout
- **Sidebar**: Dynamic sidebar generated from config
- **Breadcrumbs**: Auto-generated from pathname or custom items

## 👥 Employee Module

Complete CRUD module for managing employees:

- **Listing Page** (`/dashboard/employees`): Uses global Table component
- **Create Page** (`/dashboard/employees/create`): Full form with validation
- **Edit Page** (`/dashboard/employees/[id]/edit`): Edit existing employees

Features:
- Phone number and profile picture visible only in edit mode
- Form validation
- Image upload with preview
- Toast notifications
- LocalStorage persistence

## 🚀 Getting Started

1. All components use the theme system automatically
2. Protected routes use `ProtectedRoute` wrapper
3. Dashboard pages use `DashboardLayout` for consistent UI
4. Sidebar updates automatically when you modify `/config/sidebar.ts`
5. Breadcrumbs generate automatically from pathname

## 🔄 Adding New Modules

1. Create pages in `/app/dashboard/[module-name]`
2. Add menu item to `/config/sidebar.ts`
3. Use `DashboardLayout` for consistent UI
4. Use global components from `/components/ui`
5. Create types in `/types/[module-name].ts`

The system is fully modular and scalable!

