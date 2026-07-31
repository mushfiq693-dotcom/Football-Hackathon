export const APP_NAME = 'Football Auction';
export const APP_DESCRIPTION = 'Real-time football player auction platform';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  AUCTIONEER: 'auctioneer',
  TEAM_OWNER: 'team_owner',
  CAPTAIN: 'captain',
  VIEWER: 'viewer',
} as const;

export const AUCTION_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PLAYER_AUCTION_STATUS = {
  AVAILABLE: 'available',
  IN_BIDDING: 'in_bidding',
  SOLD: 'sold',
  UNSOLD: 'unsold',
} as const;

export const PLAYER_CATEGORIES = {
  GOALKEEPER: 'goalkeeper',
  DEFENDER: 'defender',
  MIDFIELDER: 'midfielder',
  STRIKER: 'striker',
} as const;

export const TOURNAMENT_STATUS = {
  DRAFT: 'draft',
  REGISTRATION: 'registration',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const BID_STATUS = {
  ACTIVE: 'active',
  OUTBID: 'outbid',
  WON: 'won',
  CANCELLED: 'cancelled',
} as const;

export const DEFAULT_BID_TIMER_SECONDS = 15;
export const DEFAULT_MIN_BID_INCREMENT = 50000; // in smallest currency unit
export const DEFAULT_BUDGET_PER_TEAM = 10000000;
export const DEFAULT_MAX_TEAMS = 8;
export const DEFAULT_MAX_PLAYERS_PER_TEAM = 15;
export const DEFAULT_MIN_PLAYERS_PER_TEAM = 11;

export const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password'];
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];
