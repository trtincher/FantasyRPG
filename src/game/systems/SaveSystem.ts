import { SAVE_KEY } from '../utils/Constants';

export interface SaveData {
  version: number;
  playerName: string;
  playerClass: string;
  playerLevel: number;
  playerXp: number;
  playerInventory: string;
  playerTileX: number;
  playerTileY: number;
  defeatedEncounters: string[];
  triggeredStoryEvents: string[];
  collectedPickups: string[];
}

export function createSaveData(data: Omit<SaveData, 'version'>): SaveData {
  return { version: 1, ...data };
}

export function saveGame(data: SaveData): boolean {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed.version || !parsed.playerName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSaveData(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function deleteSaveData(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
  }
}
