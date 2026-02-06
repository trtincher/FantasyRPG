import { describe, it, expect } from 'vitest';
import { ITEMS } from '../items';

describe('item data', () => {
  const entries = Object.entries(ITEMS);

  it('has at least 2 items defined', () => {
    expect(entries.length).toBeGreaterThanOrEqual(2);
  });

  entries.forEach(([key, item]) => {
    describe(key, () => {
      it('key matches record key', () => {
        expect(item.key).toBe(key);
      });

      it('has non-empty name and description', () => {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(0);
      });

      it('has a valid type', () => {
        expect(['consumable', 'key']).toContain(item.type);
      });

      if (item.type === 'consumable') {
        it('has positive healAmount', () => {
          expect(item.healAmount).toBeDefined();
          expect(item.healAmount!).toBeGreaterThan(0);
        });
      }
    });
  });

  it('has Potion with healAmount 15', () => {
    expect(ITEMS.potion.healAmount).toBe(15);
  });

  it('has Hi-Potion with healAmount 40', () => {
    expect(ITEMS.hiPotion.healAmount).toBe(40);
  });
});
