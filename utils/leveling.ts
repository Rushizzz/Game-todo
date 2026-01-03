/**
 * Leveling Logic
 * Formula: TotalXP(L) = 500 * L * (L - 1)
 * This means:
 * L1: 0 XP
 * L2: 1000 XP (Gap 1000)
 * L3: 3000 XP (Gap 2000)
 * L4: 6000 XP (Gap 3000)
 */

export const calculateTotalXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return 500 * level * (level - 1);
};

export const calculateLevelFromXp = (xp: number): number => {
    // Inverse of TotalXP = 500L^2 - 500L
    // 500L^2 - 500L - TotalXP = 0
    // L^2 - L - (TotalXP/500) = 0
    // Quadratic formula: L = (1 + sqrt(1 - 4(1)(-TotalXP/500))) / 2
    // L = (1 + sqrt(1 + 4 * (TotalXP/500))) / 2
    // L = (1 + sqrt(1 + TotalXP/125)) / 2

    if (xp < 0) return 1;
    const level = (1 + Math.sqrt(1 + xp / 125)) / 2;
    return Math.floor(level);
};

export const getXpForNextLevel = (currentLevel: number): number => {
    // Gap = 1000 * L
    return 1000 * currentLevel;
};

export const getProgressToNextLevel = (currentXp: number, currentLevel: number) => {
    const startXp = calculateTotalXpForLevel(currentLevel);
    const nextLevelXp = calculateTotalXpForLevel(currentLevel + 1);
    const needed = nextLevelXp - startXp;
    const current = currentXp - startXp;

    return {
        current,
        needed,
        percentage: Math.min(1, Math.max(0, current / needed))
    };
}
