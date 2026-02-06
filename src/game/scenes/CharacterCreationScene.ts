import { Scene } from 'phaser';
import { CLASSES, CLASS_KEYS } from '../data/classes';

export class CharacterCreationScene extends Scene {
  private step: 'name' | 'class' = 'name';
  private playerName = '';
  private selectedIndex = 0;
  private uiElements: Phaser.GameObjects.Text[] = [];
  private classNameTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('CharacterCreationScene');
  }

  create(): void {
    this.step = 'name';
    this.playerName = '';
    this.selectedIndex = 0;
    this.uiElements = [];
    this.classNameTexts = [];

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.showNameStep();

    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (this.step === 'name') {
        this.handleNameInput(event);
      } else {
        this.handleClassInput(event);
      }
    });
  }

  private showNameStep(): void {
    this.destroyUI();

    const promptText = this.add.text(160, 50, 'Enter your name:', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const nameDisplayText = this.add.text(160, 90, this.playerName + '_', {
      fontSize: '16px',
      color: '#ffff00',
    }).setOrigin(0.5);

    const hintText = this.add.text(160, 140, 'A-Z only, 1-8 characters', {
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    const enterHint = this.add.text(160, 200, 'Enter: Confirm', {
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    const escHint = this.add.text(160, 215, 'Esc: Back', {
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    this.uiElements = [promptText, nameDisplayText, hintText, enterHint, escHint];
  }

  private showClassStep(): void {
    this.destroyUI();
    this.classNameTexts = [];

    const titleText = this.add.text(160, 20, 'Choose your class:', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.uiElements = [titleText];

    let y = 60;
    for (let i = 0; i < CLASS_KEYS.length; i++) {
      const classData = CLASSES[CLASS_KEYS[i]];

      const nameText = this.add.text(160, y, classData.name, {
        fontSize: '12px',
        color: '#ffffff',
      }).setOrigin(0.5);

      const statText = this.add.text(
        160,
        y + 15,
        `HP:${classData.baseHp} ATK:${classData.baseAttack} DEF:${classData.baseDefense}`,
        {
          fontSize: '8px',
          color: '#aaaaaa',
        }
      ).setOrigin(0.5);

      this.classNameTexts.push(nameText);
      this.uiElements.push(nameText, statText);
      y += 40;
    }

    const enterHint = this.add.text(160, 200, 'Enter: Confirm', {
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    const escHint = this.add.text(160, 215, 'Esc: Back to name', {
      fontSize: '8px',
      color: '#888888',
    }).setOrigin(0.5);

    this.uiElements.push(enterHint, escHint);

    this.updateClassHighlights();
  }

  private updateClassHighlights(): void {
    for (let i = 0; i < this.classNameTexts.length; i++) {
      const classData = CLASSES[CLASS_KEYS[i]];
      if (i === this.selectedIndex) {
        this.classNameTexts[i].setText('> ' + classData.name);
        this.classNameTexts[i].setColor('#ffff00');
      } else {
        this.classNameTexts[i].setText(classData.name);
        this.classNameTexts[i].setColor('#ffffff');
      }
    }
  }

  private handleNameInput(event: KeyboardEvent): void {
    if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      if (this.playerName.length < 8) {
        this.playerName += event.key.toUpperCase();
        this.updateNameDisplay();
      }
    } else if (event.key === 'Backspace') {
      this.playerName = this.playerName.slice(0, -1);
      this.updateNameDisplay();
    } else if (event.key === 'Enter') {
      if (this.playerName.length >= 1) {
        this.playerName =
          this.playerName.charAt(0).toUpperCase() +
          this.playerName.slice(1).toLowerCase();
        this.step = 'class';
        this.showClassStep();
      }
    } else if (event.key === 'Escape') {
      this.scene.start('TitleScene');
    }
  }

  private handleClassInput(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      this.selectedIndex =
        (this.selectedIndex - 1 + CLASS_KEYS.length) % CLASS_KEYS.length;
      this.updateClassHighlights();
    } else if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % CLASS_KEYS.length;
      this.updateClassHighlights();
    } else if (event.key === 'Enter') {
      this.game.registry.set('playerName', this.playerName);
      this.game.registry.set('playerClass', CLASS_KEYS[this.selectedIndex]);
      this.game.registry.set('playerLevel', 1);
      this.game.registry.set('playerXp', 0);
      this.scene.start('WorldScene');
    } else if (event.key === 'Escape') {
      this.step = 'name';
      this.showNameStep();
    }
  }

  private updateNameDisplay(): void {
    const nameDisplayText = this.uiElements[1];
    if (nameDisplayText) {
      nameDisplayText.setText(this.playerName + '_');
    }
  }

  private destroyUI(): void {
    for (const element of this.uiElements) {
      element.destroy();
    }
    this.uiElements = [];
    this.classNameTexts = [];
  }
}
