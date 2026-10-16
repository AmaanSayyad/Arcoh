/**
 * Wallet state slice for Zustand store
 * Manages wallet connection status and address
 * 
 * Note: This slice is now primarily used for storing wallet state.
 * Actual wallet connection is handled by BNB Wallet integration in lib/bnb/wallet.ts
 */

import { StateCreator } from "zustand";
import { readStored, removeStored, writeStored } from "@/lib/brand/browserStore";

export interface WalletState {
  // State
  address: string | null;
  walletBalance: number;
  isConnected: boolean;
  isConnecting: boolean;
  network: string | null;
  preferredNetwork: string | null;
  selectedCurrency: string | null;
  error: string | null;
  isConnectModalOpen: boolean;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshWalletBalance: () => Promise<void>;
  clearError: () => void;
  setConnectModalOpen: (open: boolean) => void;

  // Setters for wallet integration
  setAddress: (address: string | null) => void;
  setIsConnected: (connected: boolean) => void;
  setNetwork: (network: 'ARC' | null) => void;
  setPreferredNetwork: (network: 'ARC' | null) => void;
  setSelectedCurrency: (currency: string | null) => void;
}

/**
 * Create wallet slice for Zustand store
 * Handles wallet state management for multi-chain integration
 */
export const createWalletSlice: StateCreator<WalletState> = (set, get) => ({
  // Initial state
  address: null,
  walletBalance: 0,
  isConnected: false,
  isConnecting: false,
  network: null,
  // Default preferred network for new sessions.
  // Users can switch networks via the connect modal / UI.
  preferredNetwork: (typeof window !== 'undefined' &&
    (readStored('arcoh.network', ['achoh.network', 'solnomo_preferred_network']) === 'ARC'
      ? 'ARC'
      : null)) || 'ARC',
  selectedCurrency: null,
  error: null,
  isConnectModalOpen: false,

  /**
   * Connect wallet
   * Note: Actual connection is handled by Privy integration
   */
  connect: async () => {
    set({ isConnectModalOpen: true });
  },

  /**
   * Disconnect wallet
   * Note: Actual disconnection is handled by Privy integration
   */
  disconnect: () => {
    console.log('Disconnect called - handled by Privy');
    const state = get() as any;
    const accountType = state.accountType;

    // Reset state
    set({
      address: null,
      walletBalance: 0,
      isConnected: false,
      isConnecting: false,
      network: null,
      selectedCurrency: null,
      error: null
    } as any);

    // Only clear profile data if we are NOT in demo mode AND don't have an access code
    // When exiting demo mode, we want to keep the accessCode to show the "Demo Mode" button
    // Also if the user just refreshed, we want to keep the accessCode if it exists
    const currentAccessCode = state.accessCode;
    if (accountType !== 'demo' && !currentAccessCode) {
      set({
        // @ts-ignore - Profile slice fields
        username: null,
        // @ts-ignore - Profile slice fields
        accessCode: null
      } as any);
    }
  },

  /**
   * Refresh token balance for connected wallet
   */
  refreshWalletBalance: async () => {
    const { address, isConnected, network } = get();

    if (!isConnected || !address || !network) {
      return;
    }

    try {
      if (network === 'ARC') {
        const { readEvmWalletBalance } = await import('@/lib/chains/evmTreasury');
        const bal = await readEvmWalletBalance('ARC', address, 'USDC');
        set({ walletBalance: bal });
      }
    } catch (error) {
      console.error("Error refreshing wallet balance:", error);
    }
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set connect modal visibility
   */
  setConnectModalOpen: (open: boolean) => {
    set({ isConnectModalOpen: open });
  },

  /**
   * Set address (used by wallet integration)
   */
  setAddress: (address: string | null) => {
    set({ address });
  },

  /**
   * Set connected status (used by wallet integration)
   */
  setIsConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },

  /**
   * Set active network (BNB, SOL, SUI, XLM, XTZ, NEAR, STRK, PUSH or APT)
   */
  setNetwork: (network: 'ARC' | null) => {
    set({ network });
  },

  setPreferredNetwork: (network: 'ARC' | null) => {
    const effective = network;
    set({ preferredNetwork: effective });
    if (typeof window !== 'undefined') {
      if (effective) {
        writeStored('arcoh.network', effective);
      } else {
        removeStored('arcoh.network', ['achoh.network', 'solnomo_preferred_network']);
      }
    }
  },

  /**
   * Set selected currency for the current network
   */
  setSelectedCurrency: (currency: string | null) => {
    const normalized = 'USDC';
    set({ selectedCurrency: normalized });
    if (typeof window !== 'undefined') {
      writeStored('arcoh.play.currency', normalized);
    }
    const { isConnected, address } = get();
    if (isConnected && address) {
      void get().refreshWalletBalance();
      void (get() as { fetchBalance?: (address: string) => Promise<void> }).fetchBalance?.(address);
    }
  }
});
