# Development Guide

## Local Setup

### 1. Prerequisites
- Node.js (Latest LTS)
- Supabase CLI (for local database development)
- Docker (required for Supabase local stack)

### 2. Environment Variables
Create a `.env.local` file in the root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
supabase start
supabase migration up
supabase db seed
```

## Coding Standards

### 1. Components
- Use **Server Components** by default.
- Use `'use client'` only when state, hooks, or event listeners are required.
- Follow the atomic design pattern (UI components in `src/components/ui`, complex ones in `src/components/auth`, etc.).

### 2. Styling
- Use **Tailwind CSS 4**. 
- Prefer utility classes over custom CSS.
- Adhere to the theme variables defined in `globals.css`.

### 3. State Management
- **Auth**: Use `useAuthStore`.
- **Auction**: Use `useAuctionStore`.
- Avoid prop-drilling; use local state (`useState`) only for isolated UI logic.

### 4. Git Workflow
- Create feature branches: `feat/feature-name`.
- Create bugfix branches: `fix/bug-name`.
- Use descriptive commit messages.

## Verification
Before submitting a PR, ensure:
- `npm run lint` passes.
- The app builds successfully with `npm run build`.
- No sensitive keys are committed.
