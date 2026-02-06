import { describe, it, expect } from 'vitest';
import { CLASSES, CLASS_KEYS } from '../classes';

describe('class data', () => {
  it('has 3 classes defined', () => {
    expect(Object.keys(CLASSES).length).toBe(3);
  });

  it('CLASS_KEYS has 3 entries', () => {
    expect(CLASS_KEYS.length).toBe(3);
  });

  const entries = Object.entries(CLASSES);

  entries.forEach(([key, classData]) => {
    describe(key, () => {
      it('has positive base stats', () => {
        expect(classData.baseHp).toBeGreaterThan(0);
        expect(classData.baseAttack).toBeGreaterThan(0);
        expect(classData.baseDefense).toBeGreaterThan(0);
      });

      it('has positive growth stats', () => {
        expect(classData.growthHp).toBeGreaterThan(0);
        expect(classData.growthAttack).toBeGreaterThan(0);
        expect(classData.growthDefense).toBeGreaterThan(0);
      });

      it('key matches record key', () => {
        expect(classData.key).toBe(key);
      });
    });
  });
});
