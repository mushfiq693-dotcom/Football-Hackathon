-- Seed script for Football Auction Platform
-- Note: Replace UUIDs with actual auth.users IDs after user creation in Supabase Auth

-- Insert Mock Profiles (Admin, Captains, Auctioneer)
INSERT INTO public.profiles (id, email, full_name, role, is_active)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@footballauction.com', 'System Admin', 'super_admin', true),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'captain@footballauction.com', 'Captain Alex', 'captain', true),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'auctioneer@footballauction.com', 'Master Auctioneer', 'auctioneer', true)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;

-- Insert Mock Tournament
INSERT INTO public.tournaments (id, name, slug, description, season, max_teams, budget_per_team, status, created_by)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Premier League Auction 2026',
    'premier-league-auction-2026',
    'Official Player Draft for Premier League Season 2026',
    '2026',
    8,
    100000000, -- 1,000,000.00 base budget
    'active',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Teams (Captains)
INSERT INTO public.teams (id, tournament_id, name, short_name, color_primary, owner_id, budget_remaining)
VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Red Strikers FC',
    'RSFC',
    '#EF4444',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    100000000
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Players
INSERT INTO public.players (id, tournament_id, name, category, base_price, age, nationality, stats, auction_status)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Lionel Messi',
    'striker',
    10000000,
    38,
    'Argentina',
    '{"goals": 32, "assists": 18, "rating": 9.4}',
    'available'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Kevin De Bruyne',
    'midfielder',
    8000000,
    34,
    'Belgium',
    '{"goals": 12, "assists": 25, "rating": 9.1}',
    'available'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Virgil van Dijk',
    'defender',
    7000000,
    33,
    'Netherlands',
    '{"tackles": 84, "clean_sheets": 14, "rating": 8.8}',
    'available'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Alisson Becker',
    'goalkeeper',
    6000000,
    32,
    'Brazil',
    '{"saves": 102, "clean_sheets": 16, "rating": 8.7}',
    'available'
  )
ON CONFLICT (id) DO NOTHING;
