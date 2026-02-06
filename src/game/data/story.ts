export interface StoryTrigger {
  id: string;
  dialogueKey: string;
  tileX: number;
  tileY: number;
}

export const STORY_TRIGGERS: StoryTrigger[] = [
  { id: 'entrance-trigger', dialogueKey: 'entrance-trigger', tileX: 7, tileY: 9 },
  { id: 'midpoint-trigger', dialogueKey: 'midpoint-trigger', tileX: 7, tileY: 15 },
  { id: 'boss-door-trigger', dialogueKey: 'boss-door-trigger', tileX: 25, tileY: 29 },
];
