export interface DialogueLine {
  speaker: string;
  text: string;
}

export const DIALOGUES: Record<string, DialogueLine[]> = {
  'old-man': [
    { speaker: 'Old Man', text: 'Welcome, brave adventurer.' },
    { speaker: 'Old Man', text: 'The Dark Knight lurks in the depths of this dungeon.' },
    { speaker: 'Old Man', text: 'Defeat the monsters along the way to grow stronger.' },
    { speaker: 'Old Man', text: 'Be careful, and may fortune favor you.' },
  ],
  'guard': [
    { speaker: 'Guard', text: 'You have come far, traveler.' },
    { speaker: 'Guard', text: 'The boss room lies ahead. Prepare yourself.' },
    { speaker: 'Guard', text: 'Only the strong survive what awaits beyond.' },
  ],
  'ghost': [
    { speaker: 'Ghost', text: 'Turn back if you value your life...' },
    { speaker: 'Ghost', text: 'The Dark Knight has never been defeated.' },
    { speaker: 'Ghost', text: 'I was not strong enough. Perhaps you are.' },
  ],
  'entrance-trigger': [
    { speaker: '', text: 'You enter the ancient dungeon. A chill runs down your spine.' },
    { speaker: '', text: 'Strange sounds echo from the depths below.' },
  ],
  'midpoint-trigger': [
    { speaker: '', text: 'The air grows heavier. Something powerful waits below.' },
    { speaker: '', text: 'You press onward.' },
  ],
  'boss-door-trigger': [
    { speaker: '', text: 'A massive door blocks the path ahead.' },
    { speaker: '', text: 'You can feel dark energy pulsing from beyond it.' },
  ],
};
