# Database Documentation

## Schema Overview
The database is built on PostgreSQL within the Supabase ecosystem. It uses custom enums and relational constraints to maintain data integrity.

## Table Definitions

### 1. `profiles`
Extends the internal `auth.users` table.
- **Fields**: `id`, `email`, `full_name`, `role`, `is_active`.
- **Trigger**: Automatically created on user signup via `handle_new_user()`.

### 2. `tournaments`
The top-level container for all events.
- **Fields**: `name`, `slug`, `description`, `season`, `venue`, `registration_start`, `registration_end`, `auction_date`, `max_teams`, `budget_per_team`, `minimum_bid`, `bid_increment`, `status`.

### 3. `teams`
Competing entities within a tournament.
- **Fields**: `name`, `owner_id`, `tournament_id`, `budget_remaining`, `players_count`.

### 4. `players`
The player registry.
- **Fields**: `name`, `category` (GK, DEF, MID, STR), `base_price`, `auction_status` (available, sold, etc.).

### 5. `auctions` & `auction_players`
Defines an auction event and the queue of players scheduled for that event.

### 6. `bids`
Records every bid placed.
- **Fields**: `auction_id`, `player_id`, `team_id`, `amount`, `status` (active, outbid, won).

## Atomic Functions (PL/pgSQL)

### `place_bid`
- Validates that the auction is live.
- Checks if the team owner has enough `budget_remaining`.
- Verifies the bid meets the `min_bid_increment`.
- Marks previous bids as `outbid` and inserts the new bid in one transaction.

### `confirm_sale`
- Verifies the auctioneer's authority.
- Moves the player to `sold` status.
- Deducts the winning amount from the team's budget.
- Updates the team's player count.

## Enums
- `user_role`: `super_admin`, `admin`, `auctioneer`, `team_owner`, `captain`, `viewer`.
- `auction_status`: `draft`, `live`, `paused`, `completed`.
- `player_category`: `goalkeeper`, `defender`, `midfielder`, `striker`.
- `tournament_status`: `Draft`, `Registration Open`, `Registration Closed`, `Auction Scheduled`, `Auction Live`, `Completed`, `Cancelled`.
