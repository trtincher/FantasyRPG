import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSaveData,
  saveGame,
  loadGame,
  hasSaveData,
  deleteSaveData,
  SaveData,
} from '../SaveSystem';

const mockStorage: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
  get length() { return Object.keys(mockStorage).length; },
  key: (_i: number) => null as string | null,
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

function makeSampleSave(): Omit<SaveData, 'version'> {
  return {
    playerName: 'Hero',
    playerClass: 'warrior',
    playerLevel: 3,
    playerXp: 25,
    playerInventory: '{"potion":2}',
    playerTileX: 10,
    playerTileY: 15,
    defeatedEncounters: ['rat-1', 'slime-1'],
    triggeredStoryEvents: ['entrance-trigger'],
    collectedPickups: ['pickup-1'],
  };
}

describe('SaveSystem', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('createSaveData', () => {
    it('adds version field', () => {
      const data = createSaveData(makeSampleSave());
      expect(data.version).toBe(1);
    });

    it('preserves all fields', () => {
      const input = makeSampleSave();
      const data = createSaveData(input);
      expect(data.playerName).toBe('Hero');
      expect(data.playerClass).toBe('warrior');
      expect(data.playerLevel).toBe(3);
      expect(data.playerXp).toBe(25);
      expect(data.defeatedEncounters).toEqual(['rat-1', 'slime-1']);
    });
  });

  describe('saveGame / loadGame round-trip', () => {
    it('saves and loads data correctly', () => {
      const data = createSaveData(makeSampleSave());
      const saved = saveGame(data);
      expect(saved).toBe(true);

      const loaded = loadGame();
      expect(loaded).not.toBeNull();
      expect(loaded!.playerName).toBe('Hero');
      expect(loaded!.playerLevel).toBe(3);
      expect(loaded!.defeatedEncounters).toEqual(['rat-1', 'slime-1']);
      expect(loaded!.version).toBe(1);
    });
  });

  describe('loadGame', () => {
    it('returns null when no save exists', () => {
      expect(loadGame()).toBeNull();
    });

    it('returns null for invalid JSON', () => {
      mockStorage['fantasyrpg-save'] = 'not-json';
      expect(loadGame()).toBeNull();
    });

    it('returns null for missing required fields', () => {
      mockStorage['fantasyrpg-save'] = JSON.stringify({ foo: 'bar' });
      expect(loadGame()).toBeNull();
    });
  });

  describe('hasSaveData', () => {
    it('returns false when no save exists', () => {
      expect(hasSaveData()).toBe(false);
    });

    it('returns true when save exists', () => {
      saveGame(createSaveData(makeSampleSave()));
      expect(hasSaveData()).toBe(true);
    });
  });

  describe('deleteSaveData', () => {
    it('removes saved data', () => {
      saveGame(createSaveData(makeSampleSave()));
      expect(hasSaveData()).toBe(true);
      deleteSaveData();
      expect(hasSaveData()).toBe(false);
    });
  });
});
