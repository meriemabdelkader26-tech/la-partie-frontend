# Authentication Middleware

This middleware handles role-based access control for the application.

## Features

✅ **Role-Based Access Control**

- Admin users (isStaff) can access `/admin/*` routes
- Influencer users can access `/influencer/*` routes
- Company users can access `/company/*` routes

✅ **Automatic Redirects**

- Unauthorized users are redirected to their appropriate dashboard
- Logged-in users trying to access login/register are redirected to their dashboard
- Expired tokens automatically redirect to login

✅ **Token Expiration Check**

- Automatically checks JWT token expiration
- Clears expired tokens and redirects to login

## How It Works

### 1. Login Process

When a user logs in:

1. JWT token is stored in cookies
2. User role and staff status are stored in separate cookies
3. User is redirected to their appropriate dashboard based on role

### 2. Middleware Protection

The middleware runs on every request and:

1. Checks if the route requires authentication
2. Validates the JWT token
3. Checks token expiration
4. Verifies the user has the correct role for the route
5. Redirects if unauthorized

### 3. Protected Routes

**Admin Routes** (`/admin/*`)

- Accessible by: Users with `isStaff: true`
- Others redirected to their role-based dashboard

**Influencer Routes** (`/influencer/*`)

- Accessible by: Users with `role: "influencer"` or admins
- Others redirected to their role-based dashboard

**Company Routes** (`/company/*`)

- Accessible by: Users with `role: "company"` or admins
- Others redirected to their role-based dashboard

### 4. Public Routes

These routes are accessible without authentication:

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify-email` - Email verification

## Usage in Components

### Check User Role

```typescript
import { useUserRole } from "@/app/hooks/use-user-role";

function MyComponent() {
  const { isAdmin, isInfluencer, isCompany, role } = useUserRole();

  if (isAdmin) {
    return <AdminContent />;
  }

  if (isInfluencer) {
    return <InfluencerContent />;
  }

  if (isCompany) {
    return <CompanyContent />;
  }
}
```

### Sign Out

```typescript
import { useSessionStore } from "@/stores/use-session-store";

function SignOutButton() {
  const { signOut } = useSessionStore();

  const handleSignOut = () => {
    signOut(); // Clears all cookies and session
    window.location.href = "/login";
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

## Cookies Used

- `token` - JWT authentication token
- `userRole` - User's role (influencer, company)
- `isStaff` - Whether user is admin/staff (true/false)

All cookies:

- Expire when the JWT token expires
- Use `Strict` SameSite policy
- Are secure in production
- Are automatically cleared on sign out

## Security Notes

⚠️ **Important**: This middleware provides client-side route protection. Always validate permissions on the backend/API as well.

The middleware:

- Prevents unauthorized navigation
- Improves user experience
- Reduces unnecessary API calls
- Does NOT replace backend authorization
