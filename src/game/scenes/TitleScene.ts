import { Scene } from 'phaser';
import { REGISTRY_KEYS } from '../utils/Constants';
import { hasSaveData, loadGame } from '../systems/SaveSystem';


export class TitleScene extends Scene {
  private selectedIndex = 0;
  private menuOptions: string[] = [];
  private menuTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('TitleScene');
  }

  create(): void {
    this.selectedIndex = 0;
    this.menuTexts = [];

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.add.text(160, 60, 'FANTASY RPG', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.menuOptions = hasSaveData() ? ['Continue', 'New Game'] : ['New Game'];

    let y = 130;
    for (let i = 0; i < this.menuOptions.length; i++) {
      const text = this.add.text(160, y, this.menuOptions[i], {
        fontSize: '14px',
        color: '#ffffff',
      }).setOrigin(0.5);
      this.menuTexts.push(text);
      y += 25;
    }

    this.updateMenuHighlights();

    const pressEnterText = this.add.text(160, 210, 'Enter: Select', {
      fontSize: '10px',
      color: '#888888',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressEnterText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-UP', this.moveUp, this);
      this.input.keyboard.on('keydown-DOWN', this.moveDown, this);
      this.input.keyboard.on('keydown-ENTER', this.confirmSelection, this);
      this.input.keyboard.on('keydown-SPACE', this.confirmSelection, this);
    }
  }

  private moveUp(): void {
    this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
    this.updateMenuHighlights();
  }

  private moveDown(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
    this.updateMenuHighlights();
  }

  private updateMenuHighlights(): void {
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

  private confirmSelection(): void {
    const selected = this.menuOptions[this.selectedIndex];
    if (selected === 'New Game') {
      this.clearRegistry();
      this.scene.start('CharacterCreationScene');
    } else if (selected === 'Continue') {
      this.loadSavedGame();
    }
  }

  private clearRegistry(): void {
    for (const key of REGISTRY_KEYS) {
      this.game.registry.remove(key);
    }
  }

  private loadSavedGame(): void {
    const saveData = loadGame();
    if (!saveData) return;

    this.game.registry.set('playerName', saveData.playerName);
    this.game.registry.set('playerClass', saveData.playerClass);
    this.game.registry.set('playerLevel', saveData.playerLevel);
    this.game.registry.set('playerXp', saveData.playerXp);
    this.game.registry.set('playerInventory', saveData.playerInventory);
    this.game.registry.set('playerTileX', saveData.playerTileX);
    this.game.registry.set('playerTileY', saveData.playerTileY);
    this.game.registry.set('defeatedEncounters', JSON.stringify(saveData.defeatedEncounters));
    this.game.registry.set('triggeredStoryEvents', JSON.stringify(saveData.triggeredStoryEvents));
    this.game.registry.set('collectedPickups', JSON.stringify(saveData.collectedPickups));

    this.scene.start('WorldScene');
  }
}
