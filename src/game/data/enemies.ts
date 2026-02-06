export interface EnemyData {
  key: string;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  spriteKey: string;
  xpReward: number;
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
};
