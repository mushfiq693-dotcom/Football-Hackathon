-- Update tournament_status enum and tournaments table

-- 1. Create the new enum type
CREATE TYPE tournament_status_new AS ENUM (
  'Draft', 
  'Registration Open', 
  'Registration Closed', 
  'Auction Scheduled', 
  'Auction Live', 
  'Completed', 
  'Cancelled'
);

-- 2. Add temporary column to tournaments
ALTER TABLE tournaments ADD COLUMN status_new tournament_status_new DEFAULT 'Draft';

-- 3. Map old statuses to new statuses (if any exist)
UPDATE tournaments SET status_new = 'Draft' WHERE status = 'draft';
UPDATE tournaments SET status_new = 'Registration Open' WHERE status = 'registration';
UPDATE tournaments SET status_new = 'Auction Scheduled' WHERE status = 'active'; -- assumption
UPDATE tournaments SET status_new = 'Completed' WHERE status = 'completed';
UPDATE tournaments SET status_new = 'Cancelled' WHERE status = 'archived';

-- 4. Drop old column and rename new one
ALTER TABLE tournaments DROP COLUMN status;
ALTER TABLE tournaments RENAME COLUMN status_new TO status;
ALTER TABLE tournaments ALTER COLUMN status SET NOT NULL;

-- 5. Drop old enum type
DROP TYPE tournament_status;
ALTER TYPE tournament_status_new RENAME TO tournament_status;

-- 6. Add new fields to tournaments table
ALTER TABLE tournaments 
  ADD COLUMN venue TEXT,
  ADD COLUMN registration_start TIMESTAMPTZ,
  ADD COLUMN registration_end TIMESTAMPTZ,
  ADD COLUMN auction_date TIMESTAMPTZ,
  ADD COLUMN minimum_bid BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN bid_increment BIGINT NOT NULL DEFAULT 50000;

-- 7. Add index for new fields
CREATE INDEX idx_tournaments_auction_date ON tournaments(auction_date);
