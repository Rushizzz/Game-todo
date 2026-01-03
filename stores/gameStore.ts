import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Difficulty, GameState, Task } from '../types/game';
import { calculateLevelFromXp } from '../utils/leveling';

interface GameActions {
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    completeTask: (taskId: string) => { levelUp: boolean };
    deleteTask: (taskId: string) => void;
    damagePlayer: (amount: number) => void;
    healPlayer: (amount: number) => void;
    checkDailyReset: () => void;
    resetGame: () => void;
    setUserName: (name: string) => void;
}

const INITIAL_STATE: Omit<GameState, 'tasks'> = {
    attributes: {
        intelligence: { name: 'intelligence', level: 1, xp: 0, totalXp: 0 },
        strength: { name: 'strength', level: 1, xp: 0, totalXp: 0 },
        love: { name: 'love', level: 1, xp: 0, totalXp: 0 },
        network: { name: 'network', level: 1, xp: 0, totalXp: 0 },
        family: { name: 'family', level: 1, xp: 0, totalXp: 0 },
    },
    hp: 100,
    maxHp: 100,
    userName: 'Hunter',
    history: [],
    lastLogin: Date.now(),
};

const XP_REWARDS: Record<Difficulty, number> = {
    trivial: 50,
    easy: 100,
    medium: 250,
    hard: 500,
    epic: 1000,
};

export const useGameStore = create<GameState & GameActions>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,
            tasks: [],

            addTask: (taskData) => {
                const newTask: Task = {
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                    completed: false,
                    ...taskData,
                };
                set((state) => ({ tasks: [newTask, ...state.tasks] }));
            },

            updateTask: (taskId, updates) => {
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
                }));
            },

            completeTask: (taskId) => {
                const state = get();
                const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
                if (taskIndex === -1) return { levelUp: false };

                const task = state.tasks[taskIndex];
                if (task.completed) return { levelUp: false }; // Already completed

                // Calculate Rewards
                const xpGain = XP_REWARDS[task.difficulty];
                let levelUp = false;

                // Update Attribute
                const attr = state.attributes[task.attribute];
                const newTotalXp = attr.totalXp + xpGain;
                const newLevel = calculateLevelFromXp(newTotalXp);

                if (newLevel > attr.level) {
                    levelUp = true;
                }

                const newAttributes = {
                    ...state.attributes,
                    [task.attribute]: {
                        ...attr,
                        totalXp: newTotalXp,
                        xp: newTotalXp,
                        level: newLevel,
                    },
                };

                // If secondary attribute exists
                if (task.attributeSecondary) {
                    const attr2 = state.attributes[task.attributeSecondary];
                    const xp2 = Math.floor(xpGain * 0.5);
                    const newTotalXp2 = attr2.totalXp + xp2;
                    const newLevel2 = calculateLevelFromXp(newTotalXp2);
                    if (newLevel2 > attr2.level) levelUp = true;

                    newAttributes[task.attributeSecondary] = {
                        ...attr2,
                        totalXp: newTotalXp2,
                        xp: newTotalXp2,
                        level: newLevel2,
                    };
                }

                // Update Tasks
                const updatedTasks = [...state.tasks];
                updatedTasks[taskIndex] = { ...task, completed: true, completedAt: Date.now() };

                set((state) => ({
                    tasks: updatedTasks,
                    attributes: newAttributes,
                }));

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                return { levelUp };
            },

            deleteTask: (taskId) => {
                set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
            },

            damagePlayer: (amount) => {
                set((state) => {
                    const newHp = Math.max(0, state.hp - amount);
                    if (newHp === 0) {
                        // Death logic could go here
                    }
                    return { hp: newHp };
                });
            },

            healPlayer: (amount) => {
                set((state) => ({ hp: Math.min(state.maxHp, state.hp + amount) }));
            },

            checkDailyReset: () => {
                const state = get();
                const lastDate = new Date(state.lastLogin).toDateString();
                const today = new Date().toDateString();

                if (lastDate !== today) {
                    // Reset daily tasks
                    const resetTasks = state.tasks.map(t => {
                        if (t.isDaily) {
                            return { ...t, completed: false, completedAt: undefined };
                        }
                        return t;
                    });

                    set({ tasks: resetTasks, lastLogin: Date.now() });
                }
            },

            setUserName: (name) => set({ userName: name }),

            resetGame: () => {
                set({ ...INITIAL_STATE, tasks: [] });
            },
        }),
        {
            name: 'game-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.checkDailyReset();
            }
        }
    )
);
