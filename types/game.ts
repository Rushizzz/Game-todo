export type AttributeName = 'intelligence' | 'strength' | 'love' | 'network' | 'family';

export interface Attribute {
    name: AttributeName;
    level: number;
    xp: number;
    totalXp: number; // Cumulative XP
}

export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'epic';

export interface Task {
    id: string;
    title: string;
    description?: string;
    difficulty: Difficulty;
    attribute: AttributeName; // Primary attribute
    attributeSecondary?: AttributeName; // Optional secondary
    completed: boolean;
    isDaily: boolean;
    createdAt: number;
    completedAt?: number;
}

export interface GameState {
    attributes: Record<AttributeName, Attribute>;
    hp: number;
    maxHp: number;
    userName: string;
    tasks: Task[];
    history: { date: string; xpGained: number }[]; // Simple history tracking
    lastLogin: number;
}
