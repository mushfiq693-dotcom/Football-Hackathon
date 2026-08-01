# Authentication & Authorization

## Overview
The platform uses **Supabase Auth** for identity management and a custom Role-Based Access Control (RBAC) system for authorization.

## Authentication Flow
1. **Signup/Login**: Users authenticate via email/password through the `/login` or `/register` routes.
2. **Session Persistence**: JWTs are stored in cookies and managed via `@supabase/ssr`.
3. **Middleware**: `middleware.ts` intercepts requests to ensure:
   - Unauthenticated users are redirected to `/login`.
   - Authenticated users cannot access `/login` (redirected to `/dashboard`).

## User Roles
Access is determined by the `role` field in the `profiles` table:

| Role | Permissions |
| :--- | :--- |
| **Super Admin** | Full access to everything, including system configuration. |
| **Admin** | Manage tournaments, players, and teams. |
| **Auctioneer** | Start/Stop auctions, confirm sales, manage bidding flow. |
| **Team Owner / Captain** | Place bids, manage their own team's roster. |
| **Viewer** | Read-only access to auction rooms and stats. |

## Authorization Patterns

### API Security
API routes are protected using the `requireAuth` higher-order function:
```typescript
export const POST = requireAuth(async (req, { user }) => {
  // Logic only for authenticated users
}, ['admin', 'auctioneer']); // Optional role restriction
```

### UI Protection
The `useAuth` hook provides helper functions like `isAdmin()`, `isAuctioneer()`, and `isCaptain()` to conditionally render UI elements based on the current user's profile.
