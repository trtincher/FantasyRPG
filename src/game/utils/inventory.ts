export type Inventory = Record<string, number>;

export function addItem(inventory: Inventory, itemKey: string, quantity: number = 1): Inventory {
  const newInventory = { ...inventory };
  newInventory[itemKey] = (newInventory[itemKey] || 0) + quantity;
  return newInventory;
}

export function removeItem(inventory: Inventory, itemKey: string, quantity: number = 1): Inventory | null {
  const current = inventory[itemKey] || 0;
  if (current < quantity) return null;

  const newInventory = { ...inventory };
  const remaining = current - quantity;
  if (remaining <= 0) {
    delete newInventory[itemKey];
  } else {
    newInventory[itemKey] = remaining;
  }
  return newInventory;
}

export function getItemCount(inventory: Inventory, itemKey: string): number {
  return inventory[itemKey] || 0;
}

export function hasItem(inventory: Inventory, itemKey: string): boolean {
  return (inventory[itemKey] || 0) > 0;
}

export function serializeInventory(inventory: Inventory): string {
  return JSON.stringify(inventory);
}

export function deserializeInventory(json: string): Inventory {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function createStartingInventory(): Inventory {
  return { potion: 3 };
}
