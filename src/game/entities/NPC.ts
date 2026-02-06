export interface NPCData {
  key: string;
  name: string;
  dialogueKey: string;
  tileX: number;
  tileY: number;
}

export const NPC_SPAWNS: NPCData[] = [
  { key: 'old-man', name: 'Old Man', dialogueKey: 'old-man', tileX: 8, tileY: 7 },
  { key: 'guard', name: 'Guard', dialogueKey: 'guard', tileX: 8, tileY: 20 },
  { key: 'ghost', name: 'Ghost', dialogueKey: 'ghost', tileX: 25, tileY: 28 },
];
