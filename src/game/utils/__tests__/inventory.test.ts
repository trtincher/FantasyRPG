import { describe, it, expect } from 'vitest';
import {
  addItem,
  removeItem,
  getItemCount,
  hasItem,
  serializeInventory,
  deserializeInventory,
  createStartingInventory,
} from '../inventory';

describe('inventory helpers', () => {
  describe('addItem', () => {
    it('adds new item with count 1', () => {
      const inv = addItem({}, 'potion');
      expect(inv).toEqual({ potion: 1 });
    });

    it('increments existing item count', () => {
      const inv = addItem({ potion: 2 }, 'potion');
      expect(inv).toEqual({ potion: 3 });
    });

    it('adds specified quantity', () => {
      const inv = addItem({}, 'potion', 5);
      expect(inv).toEqual({ potion: 5 });
    });

    it('does not mutate original inventory', () => {
      const original = { potion: 1 };
      addItem(original, 'potion');
      expect(original).toEqual({ potion: 1 });
    });
  });

  describe('removeItem', () => {
    it('decrements count', () => {
      const inv = removeItem({ potion: 3 }, 'potion');
      expect(inv).toEqual({ potion: 2 });
    });

    it('removes key when count reaches 0', () => {
      const inv = removeItem({ potion: 1 }, 'potion');
      expect(inv).toEqual({});
    });

    it('returns null for non-existent item', () => {
      const inv = removeItem({}, 'potion');
      expect(inv).toBeNull();
    });

    it('returns null for insufficient quantity', () => {
      const inv = removeItem({ potion: 1 }, 'potion', 5);
      expect(inv).toBeNull();
    });

    it('does not mutate original inventory', () => {
      const original = { potion: 3 };
      removeItem(original, 'potion');
      expect(original).toEqual({ potion: 3 });
    });
  });

  describe('getItemCount', () => {
    it('returns count for existing item', () => {
      expect(getItemCount({ potion: 5 }, 'potion')).toBe(5);
    });

    it('returns 0 for non-existent item', () => {
      expect(getItemCount({}, 'potion')).toBe(0);
    });
  });

  describe('hasItem', () => {
    it('returns true for existing item', () => {
      expect(hasItem({ potion: 1 }, 'potion')).toBe(true);
    });

    it('returns false for non-existent item', () => {
      expect(hasItem({}, 'potion')).toBe(false);
    });
  });

  describe('serialization', () => {
    it('round-trips inventory through serialize/deserialize', () => {
      const inv = { potion: 3, hiPotion: 1 };
      const json = serializeInventory(inv);
      const restored = deserializeInventory(json);
      expect(restored).toEqual(inv);
    });

    it('deserialize returns empty object for invalid JSON', () => {
      expect(deserializeInventory('not json')).toEqual({});
    });

    it('deserialize returns empty object for empty string', () => {
      expect(deserializeInventory('')).toEqual({});
    });
  });

  describe('createStartingInventory', () => {
    it('returns inventory with 3 potions', () => {
      expect(createStartingInventory()).toEqual({ potion: 3 });
    });
  });
});
