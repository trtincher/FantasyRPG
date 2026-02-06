import { ClassData } from './classes';

export const MAX_LEVEL = 10;
export const XP_PER_LEVEL_MULTIPLIER = 25;

export function xpForNextLevel(level: number): number {
  if (level >= MAX_LEVEL) return Infinity;
  return (level + 1) * XP_PER_LEVEL_MULTIPLIER;
}

export function statsAtLevel(classData: ClassData, level: number): {
  hp: number; attack: number; defense: number;
} {
  const levelsGained = level - 1;
  return {
    hp: classData.baseHp + classData.growthHp * levelsGained,
    attack: classData.baseAttack + classData.growthAttack * levelsGained,
    defense: classData.baseDefense + classData.growthDefense * levelsGained,
  };
}

export function processXpGain(
  currentLevel: number,
  currentXp: number,
  xpGained: number
): { newLevel: number; newXp: number; levelsGained: number } {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let levelsGained = 0;

  while (level < MAX_LEVEL) {
    const needed = xpForNextLevel(level);
    if (xp >= needed) {
      xp -= needed;
      level++;
      levelsGained++;
    } else {
      break;
    }
  }

  if (level >= MAX_LEVEL) {
    xp = 0;
  }

  return { newLevel: level, newXp: xp, levelsGained };
}
