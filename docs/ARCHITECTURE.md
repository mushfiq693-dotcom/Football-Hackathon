# Architecture Documentation

## System Overview
The platform follows a modern "Backend-as-a-Service" (BaaS) architecture, leveraging **Next.js** for the frontend and **Supabase** for the entire backend infrastructure.

## Tech Stack
- **Frontend**: 
  - **Framework**: Next.js 16 (App Router)
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS 4
  - **State Management**: Zustand (for Auth and Auction Room synchronization)
  - **Icons**: Lucide React
- **Backend (Supabase)**:
  - **Database**: PostgreSQL
  - **Authentication**: Supabase Auth (JWT-based)
  - **Real-time**: Supabase Realtime (WebSockets for bid updates)
  - **Storage**: Supabase Storage (for logos and player photos)

## Architectural Patterns

### 1. Server-Side vs. Client-Side
- **Server Components**: Used for data fetching in static/slow-changing areas like Settings or Player lists.
- **Client Components**: Used for the "Live Auction Room" and Auth forms where high interactivity is required.

### 2. Security (RLS)
Security is enforced at the database level using **Row Level Security (RLS)**. This ensures that even if a client-side request is compromised, the database only permits actions allowed by the user's role and ownership.

### 3. Real-Time Synchronization
The Auction Room utilizes a shared Zustand store that syncs with Supabase Realtime channels. 
- **Broadcast**: Used for transient data like "User X is typing" or "Bid increased".
- **Database Changes**: Used for persistent state like the final sale confirmation.

### 4. Atomic Business Logic
Critical operations (like placing a bid) are not performed via client-side calculations. Instead, they invoke **RPC (Remote Procedure Calls)** to PostgreSQL functions. This guarantees that bid increments and budget checks are processed in a single, isolated transaction.
