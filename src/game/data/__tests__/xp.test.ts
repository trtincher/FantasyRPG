import { describe, it, expect } from 'vitest';
import { xpForNextLevel, statsAtLevel, processXpGain, MAX_LEVEL } from '../xp';
import { CLASSES } from '../classes';

describe('xp system', () => {
  describe('xpForNextLevel', () => {
    it('returns 50 for level 1', () => {
      expect(xpForNextLevel(1)).toBe(50);
    });

    it('returns Infinity for MAX_LEVEL', () => {
      expect(xpForNextLevel(MAX_LEVEL)).toBe(Infinity);
    });

    it('increases with level', () => {
      expect(xpForNextLevel(2)).toBeGreaterThan(xpForNextLevel(1));
      expect(xpForNextLevel(3)).toBeGreaterThan(xpForNextLevel(2));
    });
  });

  describe('statsAtLevel', () => {
    const warrior = CLASSES.warrior;

    it('returns base stats at level 1', () => {
      const stats = statsAtLevel(warrior, 1);
      expect(stats.hp).toBe(30);
      expect(stats.attack).toBe(12);
      expect(stats.defense).toBe(8);
    });

    it('returns base + growth at level 2', () => {
      const stats = statsAtLevel(warrior, 2);
      expect(stats.hp).toBe(38);
      expect(stats.attack).toBe(14);
      expect(stats.defense).toBe(11);
    });

    it('scales correctly at higher levels', () => {
      const level5 = statsAtLevel(warrior, 5);
      expect(level5.hp).toBe(30 + 8 * 4);
      expect(level5.attack).toBe(12 + 2 * 4);
      expect(level5.defense).toBe(8 + 3 * 4);
    });
  });

  describe('processXpGain', () => {
    it('single level up: level 1 + 50 xp = level 2, 0 xp', () => {
      const result = processXpGain(1, 0, 50);
      expect(result.newLevel).toBe(2);
      expect(result.newXp).toBe(0);
      expect(result.levelsGained).toBe(1);
    });

    it('multi-level jump: level 1 + 200 xp', () => {
      const result = processXpGain(1, 0, 200);
      expect(result.newLevel).toBeGreaterThan(1);
      expect(result.levelsGained).toBeGreaterThan(1);
    });

    it('stays at max level with xp = 0', () => {
      const result = processXpGain(MAX_LEVEL, 0, 100);
      expect(result.newLevel).toBe(MAX_LEVEL);
      expect(result.newXp).toBe(0);
      expect(result.levelsGained).toBe(0);
    });

    it('accumulates xp below next level threshold', () => {
      const result = processXpGain(1, 0, 25);
      expect(result.newLevel).toBe(1);
      expect(result.newXp).toBe(25);
      expect(result.levelsGained).toBe(0);
    });

    it('carries over xp after level up', () => {
      const result = processXpGain(1, 0, 75);
      expect(result.newLevel).toBe(2);
      expect(result.newXp).toBe(25);
      expect(result.levelsGained).toBe(1);
    });
  });
});
