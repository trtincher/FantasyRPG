import { describe, it, expect } from 'vitest';
import { ENEMIES } from '../enemies';

describe('enemy data', () => {
  const entries = Object.entries(ENEMIES);

  it('has at least one enemy defined', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  entries.forEach(([key, enemy]) => {
    describe(key, () => {
      it('has positive combat stats', () => {
        expect(enemy.hp).toBeGreaterThan(0);
        expect(enemy.attack).toBeGreaterThan(0);
        expect(enemy.defense).toBeGreaterThanOrEqual(0);
      });

      it('key matches record key', () => {
        expect(enemy.key).toBe(key);
      });

       it('has non-empty name and spriteKey', () => {
         expect(enemy.name.length).toBeGreaterThan(0);
         expect(enemy.spriteKey.length).toBeGreaterThan(0);
       });

       it('has positive xpReward', () => {
         expect(enemy.xpReward).toBeGreaterThan(0);
       });
     });
   });
 });
