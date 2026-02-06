export interface EnemyData {
  key: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  spriteKey: string;
  xpReward: number;
  isBoss?: boolean;
}

export const ENEMIES: Record<string, EnemyData> = {
  slime: {
    key: 'slime',
    name: 'Slime',
    hp: 12,
    attack: 5,
    defense: 2,
    spriteKey: 'slime',
    xpReward: 15,
  },
  rat: {
    key: 'rat',
    name: 'Rat',
    hp: 8,
    attack: 6,
    defense: 1,
    spriteKey: 'rat',
    xpReward: 10,
  },
  bat: {
    key: 'bat',
    name: 'Bat',
    hp: 10,
    attack: 7,
    defense: 3,
    spriteKey: 'bat',
    xpReward: 18,
  },
  skeleton: {
    key: 'skeleton',
    name: 'Skeleton',
    hp: 20,
    attack: 9,
    defense: 5,
    spriteKey: 'skeleton',
    xpReward: 30,
  },
  darkKnight: {
    key: 'darkKnight',
    name: 'Dark Knight',
    hp: 50,
    attack: 14,
    defense: 8,
    spriteKey: 'dark-knight',
    xpReward: 100,
    isBoss: true,
  },
};
