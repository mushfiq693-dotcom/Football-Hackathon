import { create } from 'zustand';
import type { Bid } from '@/types/auction';

interface CurrentPlayerInfo {
  id: string;
  name: string;
  category: string;
  base_price: number;
  photo_url: string | null;
}

interface AuctionState {
  // Auction room state
  auctionId: string | null;
  auctionStatus: 'draft' | 'scheduled' | 'live' | 'paused' | 'completed' | 'cancelled' | null;
  currentPlayer: CurrentPlayerInfo | null;
  currentHighestBid: Bid | null;
  bidHistory: Bid[];
  timerSeconds: number;
  isTimerRunning: boolean;

  // Presence
  onlineUsers: Array<{ user_id: string; role: string }>;

  // Actions
  setAuctionId: (id: string) => void;
  setAuctionStatus: (status: AuctionState['auctionStatus']) => void;
  setCurrentPlayer: (player: CurrentPlayerInfo | null) => void;
  addBid: (bid: Bid) => void;
  setHighestBid: (bid: Bid | null) => void;
  setBidHistory: (bids: Bid[]) => void;
  setTimer: (seconds: number) => void;
  setTimerRunning: (running: boolean) => void;
  setOnlineUsers: (users: AuctionState['onlineUsers']) => void;
  reset: () => void;
}

const initialState = {
  auctionId: null,
  auctionStatus: null,
  currentPlayer: null,
  currentHighestBid: null,
  bidHistory: [],
  timerSeconds: 0,
  isTimerRunning: false,
  onlineUsers: [],
};

export const useAuctionStore = create<AuctionState>((set) => ({
  ...initialState,

  setAuctionId: (auctionId) => set({ auctionId }),
  setAuctionStatus: (auctionStatus) => set({ auctionStatus }),
  setCurrentPlayer: (currentPlayer) => set({ currentPlayer }),

  addBid: (bid) =>
    set((state) => ({
      bidHistory: [bid, ...state.bidHistory],
      currentHighestBid: bid,
    })),

  setHighestBid: (currentHighestBid) => set({ currentHighestBid }),
  setBidHistory: (bidHistory) => set({ bidHistory }),
  setTimer: (timerSeconds) => set({ timerSeconds }),
  setTimerRunning: (isTimerRunning) => set({ isTimerRunning }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  reset: () => set(initialState),
}));
