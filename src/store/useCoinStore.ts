import { create } from "zustand";

export const INITIAL_USD_BALANCE = 10000;

export interface CoinState {
    bitcoinPrice: number;
    updateBitcoinPrice: (bitcoinPrice: number) => void;
    usdBalance: number;
    updateUsdBalance: (usdBalance: number) => void;
    btcBalance: number;
    updateBtcBalance: (btcBalance: number) => void;
    transactions: any[];
    updateTransactions: (transactions: any[]) => void;
    operationStatus: string;
    updateOperationStatus: (operationStatus: string) => void;
    pendingOperation: boolean;
    updatePendingOperation: (pendingOperation: boolean) => void;
    history: any[];
    updateHistory: (history: any[]) => void;
}

export const useCoinStore = create<CoinState>((set) => ({
    bitcoinPrice: 0,
    usdBalance: INITIAL_USD_BALANCE,
    btcBalance: 0,
    transactions: [],
    operationStatus: '',
    pendingOperation: false,
    history: [],
    updateUsdBalance: (usdBalance: number) => set({ usdBalance }),
    updateBtcBalance: (btcBalance: number) => set({ btcBalance }),
    updateTransactions: (transactions: any[]) => set({ transactions }),
    updateOperationStatus: (operationStatus: string) => set({ operationStatus }),
    updatePendingOperation: (pendingOperation: boolean) => set({ pendingOperation }),
    updateHistory: (history: any[]) => set({ history }),
    updateBitcoinPrice: (bitcoinPrice: number) => set({ bitcoinPrice }),
}));
