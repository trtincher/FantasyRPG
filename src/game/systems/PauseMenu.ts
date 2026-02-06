import { Scene } from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE } from '../utils/Constants';
import { Inventory, deserializeInventory, serializeInventory, removeItem } from '../utils/inventory';
import { ITEMS } from '../data/items';
import { createSaveData, saveGame } from './SaveSystem';

export class PauseMenu {
  private scene: Scene;
  private isActive = false;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private selectedIndex = 0;
  private menuOptions: string[] = [];
  private menuTexts: Phaser.GameObjects.Text[] = [];
  private subMenuActive = false;
  private subMenuIndex = 0;
  private subMenuTexts: Phaser.GameObjects.Text[] = [];
  private subMenuItems: string[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  show(): void {
    if (this.isActive) return;
    this.isActive = true;
    this.selectedIndex = 0;
    this.subMenuActive = false;
    this.render();
  }

  hide(): void {
    this.isActive = false;
    this.destroyElements();
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  handleInput(event: KeyboardEvent): void {
    if (!this.isActive) return;

    if (this.subMenuActive) {
      this.handleSubMenuInput(event);
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
        this.updateHighlights();
        break;
      case 'ArrowDown':
        this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
        this.updateHighlights();
        break;
      case 'Enter':
      case ' ':
        this.confirmSelection();
        break;
      case 'Escape':
        this.hide();
        break;
    }
  }

  private confirmSelection(): void {
    const selected = this.menuOptions[this.selectedIndex];
    if (selected === 'Use Item') {
      this.openItemSubMenu();
    } else if (selected === 'Save Game') {
      this.performSave();
    } else if (selected === 'Close') {
      this.hide();
    }
  }

  private openItemSubMenu(): void {
    const inventory = this.getInventory();
    this.subMenuItems = Object.keys(inventory).filter((key) => {
      const item = ITEMS[key];
      return item && item.type === 'consumable' && inventory[key] > 0;
    });

    if (this.subMenuItems.length === 0) {
      this.showMessage('No items!');
      return;
    }

    this.subMenuActive = true;
    this.subMenuIndex = 0;
    this.renderSubMenu();
  }

  private handleSubMenuInput(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.subMenuIndex = (this.subMenuIndex - 1 + this.subMenuItems.length) % this.subMenuItems.length;
        this.updateSubMenuHighlights();
        break;
      case 'ArrowDown':
        this.subMenuIndex = (this.subMenuIndex + 1) % this.subMenuItems.length;
        this.updateSubMenuHighlights();
        break;
      case 'Enter':
      case ' ':
        this.useItemFromMenu();
        break;
      case 'Escape':
        this.subMenuActive = false;
        this.destroySubMenu();
        break;
    }
  }

  private useItemFromMenu(): void {
    const itemKey = this.subMenuItems[this.subMenuIndex];
    const item = ITEMS[itemKey];
    if (!item || item.type !== 'consumable') return;

    const inventory = this.getInventory();
    const newInventory = removeItem(inventory, itemKey);
    if (!newInventory) return;

    this.scene.game.registry.set('playerInventory', serializeInventory(newInventory));

    const player = (this.scene as any).getPlayer?.();
    if (player && item.healAmount) {
      player.hp = Math.min(player.maxHp, player.hp + item.healAmount);
    }

    this.subMenuActive = false;
    this.destroySubMenu();
    this.destroyElements();
    this.render();
    this.showMessage(`Used ${item.name}!`);
  }

  private performSave(): void {
    const reg = this.scene.game.registry;
    const player = (this.scene as any).getPlayer?.();
    const playerTileX = player ? Math.floor(player.x / TILE_SIZE) : 0;
    const playerTileY = player ? Math.floor(player.y / TILE_SIZE) : 0;

    const defeatedRaw = reg.get('defeatedEncounters');
    const triggeredRaw = reg.get('triggeredStoryEvents');
    const collectedRaw = reg.get('collectedPickups');

    const data = createSaveData({
      playerName: reg.get('playerName') || 'Player',
      playerClass: reg.get('playerClass') || 'warrior',
      playerLevel: reg.get('playerLevel') || 1,
      playerXp: reg.get('playerXp') || 0,
      playerInventory: reg.get('playerInventory') || '{}',
      playerTileX,
      playerTileY,
      defeatedEncounters: defeatedRaw ? JSON.parse(defeatedRaw) : [],
      triggeredStoryEvents: triggeredRaw ? JSON.parse(triggeredRaw) : [],
      collectedPickups: collectedRaw ? JSON.parse(collectedRaw) : [],
    });

    const success = saveGame(data);
    this.showMessage(success ? 'Game saved!' : 'Save failed!');
  }

  private showMessage(msg: string): void {
    const cam = this.scene.cameras.main;
    const msgText = this.scene.add.text(
      cam.scrollX + CANVAS_WIDTH / 2,
      cam.scrollY + CANVAS_HEIGHT - 20,
      msg,
      { fontSize: '10px', color: '#00ff00' }
    ).setOrigin(0.5).setDepth(2001);
    this.elements.push(msgText);

    this.scene.time.delayedCall(1500, () => {
      msgText.destroy();
    });
  }

  private render(): void {
    this.destroyElements();
    const cam = this.scene.cameras.main;
    const boxX = cam.scrollX + 20;
    const boxY = cam.scrollY + 10;
    const boxW = CANVAS_WIDTH - 40;
    const boxH = CANVAS_HEIGHT - 20;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.9);
    bg.fillRect(boxX, boxY, boxW, boxH);
    bg.setDepth(2000);
    this.elements.push(bg);

    const reg = this.scene.game.registry;
    const playerName = reg.get('playerName') || 'Player';
    const playerClass = reg.get('playerClass') || 'warrior';
    const playerLevel = reg.get('playerLevel') || 1;
    const player = (this.scene as any).getPlayer?.();
    const hp = player ? player.hp : 0;
    const maxHp = player ? player.maxHp : 0;
    const atk = player ? player.attack : 0;
    const def = player ? player.defense : 0;

    const statsText = this.scene.add.text(boxX + 10, boxY + 8, [
      `${playerName} - ${playerClass}`,
      `Level: ${playerLevel}`,
      `HP: ${hp}/${maxHp}  ATK: ${atk}  DEF: ${def}`,
    ].join('\n'), { fontSize: '10px', color: '#ffffff', lineSpacing: 4 });
    statsText.setDepth(2001);
    this.elements.push(statsText);

    const inventory = this.getInventory();
    const itemKeys = Object.keys(inventory);
    let invStr = 'Inventory:';
    if (itemKeys.length === 0) {
      invStr += ' (empty)';
    } else {
      for (const key of itemKeys) {
        const item = ITEMS[key];
        invStr += `\n  ${item ? item.name : key} x${inventory[key]}`;
      }
    }
    const invText = this.scene.add.text(boxX + 10, boxY + 60, invStr, {
      fontSize: '9px',
      color: '#cccccc',
      lineSpacing: 3,
    });
    invText.setDepth(2001);
    this.elements.push(invText);

    this.menuOptions = [];
    const hasConsumables = itemKeys.some((k) => ITEMS[k]?.type === 'consumable' && inventory[k] > 0);
    if (hasConsumables) this.menuOptions.push('Use Item');
    this.menuOptions.push('Save Game', 'Close');

    this.menuTexts = [];
    let y = boxY + 130;
    for (const option of this.menuOptions) {
      const txt = this.scene.add.text(boxX + 10, y, option, {
        fontSize: '11px',
        color: '#ffffff',
      });
      txt.setDepth(2001);
      this.menuTexts.push(txt);
      this.elements.push(txt);
      y += 18;
    }

    if (this.selectedIndex >= this.menuOptions.length) {
      this.selectedIndex = 0;
    }
    this.updateHighlights();

    const hint = this.scene.add.text(boxX + 10, boxY + boxH - 16, 'Esc: Close', {
      fontSize: '8px',
      color: '#666666',
    });
    hint.setDepth(2001);
    this.elements.push(hint);
  }

  private renderSubMenu(): void {
    this.destroySubMenu();
    const cam = this.scene.cameras.main;
    const boxX = cam.scrollX + 140;
    const boxY = cam.scrollY + 80;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.95);
    bg.fillRect(boxX, boxY, 120, this.subMenuItems.length * 18 + 16);
    bg.setDepth(2002);
    this.subMenuTexts = [bg as any];

    let y = boxY + 8;
    for (const key of this.subMenuItems) {
      const item = ITEMS[key];
      const inventory = this.getInventory();
      const txt = this.scene.add.text(boxX + 8, y, `${item.name} x${inventory[key]}`, {
        fontSize: '10px',
        color: '#ffffff',
      });
      txt.setDepth(2003);
      this.subMenuTexts.push(txt);
      y += 18;
    }

    this.updateSubMenuHighlights();
  }

  private updateHighlights(): void {
    for (let i = 0; i < this.menuTexts.length; i++) {
      if (i === this.selectedIndex) {
        this.menuTexts[i].setText('> ' + this.menuOptions[i]);
        this.menuTexts[i].setColor('#ffff00');
      } else {
        this.menuTexts[i].setText(this.menuOptions[i]);
        this.menuTexts[i].setColor('#ffffff');
      }
    }
  }

  private updateSubMenuHighlights(): void {
    for (let i = 1; i < this.subMenuTexts.length; i++) {
      const txt = this.subMenuTexts[i] as Phaser.GameObjects.Text;
      const key = this.subMenuItems[i - 1];
      const item = ITEMS[key];
      const inventory = this.getInventory();
      if (i - 1 === this.subMenuIndex) {
        txt.setText(`> ${item.name} x${inventory[key]}`);
        txt.setColor('#ffff00');
      } else {
        txt.setText(`${item.name} x${inventory[key]}`);
        txt.setColor('#ffffff');
      }
    }
  }

  private getInventory(): Inventory {
    const raw = this.scene.game.registry.get('playerInventory') || '{}';
    return deserializeInventory(raw);
  }

  private destroyElements(): void {
    for (const el of this.elements) {
      el.destroy();
    }
    this.elements = [];
    this.menuTexts = [];
    this.destroySubMenu();
  }

  private destroySubMenu(): void {
    for (const el of this.subMenuTexts) {
      el.destroy();
    }
    this.subMenuTexts = [];
  }
}
