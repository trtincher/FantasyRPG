export interface ClassData {
  key: string;
  name: string;
  description: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  growthHp: number;
  growthAttack: number;
  growthDefense: number;
}

export const CLASSES: Record<string, ClassData> = {
  warrior: {
    key: 'warrior',
    name: 'Warrior',
    description: 'High HP and defense',
    baseHp: 30, baseAttack: 12, baseDefense: 8,
    growthHp: 8, growthAttack: 2, growthDefense: 3,
  },
  mage: {
    key: 'mage',
    name: 'Mage',
    description: 'High attack power',
    baseHp: 20, baseAttack: 15, baseDefense: 4,
    growthHp: 4, growthAttack: 4, growthDefense: 1,
  },
  rogue: {
    key: 'rogue',
    name: 'Rogue',
    description: 'Balanced stats',
    baseHp: 25, baseAttack: 10, baseDefense: 6,
    growthHp: 6, growthAttack: 3, growthDefense: 2,
  },
};

export const CLASS_KEYS = Object.keys(CLASSES);
