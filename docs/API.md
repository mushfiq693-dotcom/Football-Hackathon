# API Documentation

## Overview
The project follows a hybrid approach:
1. **Client-Side Data Access**: Direct use of the Supabase Client for standard CRUD (secured via RLS).
2. **Server-Side API Routes**: Located in `src/app/api/` for complex operations or those requiring elevated privileges.

## Core Utilities

### `requireAuth`
A Higher-Order Function (HOF) found in `src/lib/auth-guard.ts` used to wrap Next.js Route Handlers.
- **Features**: JWT validation, Profile fetching, Role verification, and Account status check.

## Key Endpoints (Planned/Current)

### Auth
- `POST /api/auth/callback`: Handles Supabase Auth redirect and session set.

### Auctions (In Development)
- `POST /api/auctions/[id]/start`: Begins a live auction session.
- `POST /api/auctions/[id]/bid`: Invokes the `place_bid` RPC function.
- `POST /api/auctions/[id]/confirm`: Invokes the `confirm_sale` RPC function.

## RPC Methods
While technically not HTTP endpoints, these are the primary "API" for critical bidding logic via `supabase.rpc()`:
- `place_bid(auction_id, player_id, team_id, bidder_id, amount)`
- `confirm_sale(auction_id, player_id, auctioneer_id)`
