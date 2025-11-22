import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    timestamp: number;
}

export interface Activity {
    id: string;
    name: string;
    amount: number; // Positive for income, negative for expense
    emoji: string;
}

interface DopamineState {
    balance: number;
    transactions: Transaction[];
    activities: Activity[];
    lastResetDate: string | null;

    // Actions
    addTransaction: (title: string, amount: number) => void;
    addActivity: (name: string, amount: number, emoji: string) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;
    checkDailyReset: () => void;
    resetStore: () => void; // For debugging
}

const DEFAULT_ACTIVITIES: Activity[] = [
    { id: '1', name: 'Cold Shower', amount: 20, emoji: '🚿' },
    { id: '2', name: 'Workout', amount: 30, emoji: '💪' },
    { id: '3', name: 'Reading', amount: 15, emoji: '📚' },
    { id: '4', name: 'Doomscrolling', amount: -15, emoji: '📱' },
    { id: '5', name: 'Junk Food', amount: -20, emoji: '🍔' },
    { id: '6', name: 'Procrastination', amount: -10, emoji: '⏳' },
];

export const useDopamineStore = create<DopamineState>()(
    persist(
        (set, get) => ({
            balance: 100,
            transactions: [],
            activities: DEFAULT_ACTIVITIES,
            lastResetDate: null,

            addTransaction: (title, amount) => {
                const newTransaction: Transaction = {
                    id: Math.random().toString(36).substring(7), // Simple ID
                    title,
                    amount,
                    type: amount >= 0 ? 'INCOME' : 'EXPENSE',
                    timestamp: Date.now(),
                };

                set((state) => ({
                    balance: state.balance + amount,
                    transactions: [newTransaction, ...state.transactions],
                }));
            },

            addActivity: (name, amount, emoji) => {
                const newActivity: Activity = {
                    id: Math.random().toString(36).substring(7),
                    name,
                    amount,
                    emoji,
                };
                set((state) => ({ activities: [...state.activities, newActivity] }));
            },

            updateActivity: (id, updates) => {
                set((state) => ({
                    activities: state.activities.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                }));
            },

            deleteActivity: (id) => {
                set((state) => ({
                    activities: state.activities.filter((a) => a.id !== id),
                }));
            },

            checkDailyReset: () => {
                const today = new Date().toISOString().split('T')[0];
                const { lastResetDate } = get();

                if (lastResetDate !== today) {
                    set({
                        balance: 100,
                        lastResetDate: today,
                        // Optional: Archive transactions or clear them? 
                        // User spec: "UserBalance: Starts at 100 DU daily". 
                        // Implies balance reset. We'll keep history for the Ledger though.
                    });
                }
            },

            resetStore: () => {
                set({
                    balance: 100,
                    transactions: [],
                    activities: DEFAULT_ACTIVITIES,
                    lastResetDate: null,
                });
            },
        }),
        {
            name: 'dopamine-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
