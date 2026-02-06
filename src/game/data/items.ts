export interface ItemData {
  key: string;
  name: string;
  description: string;
  type: 'consumable' | 'key';
  healAmount?: number;
}

export const ITEMS: Record<string, ItemData> = {
  potion: {
    key: 'potion',
    name: 'Potion',
    description: 'Restores 15 HP',
    type: 'consumable',
    healAmount: 15,
  },
  hiPotion: {
    key: 'hiPotion',
    name: 'Hi-Potion',
    description: 'Restores 40 HP',
    type: 'consumable',
    healAmount: 40,
  },
};
