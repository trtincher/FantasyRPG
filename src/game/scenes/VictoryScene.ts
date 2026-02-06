import { Scene } from 'phaser';
import { REGISTRY_KEYS } from '../utils/Constants';

export class VictoryScene extends Scene {
  constructor() {
    super('VictoryScene');
  }

  create(): void {
    for (const key of REGISTRY_KEYS) {
      this.game.registry.remove(key);
    }

    this.cameras.main.setBackgroundColor(0x1a2e1a);

    this.add.text(160, 50, 'VICTORY!', {
      fontSize: '20px',
      color: '#ffd700',
    }).setOrigin(0.5);

    this.add.text(160, 100, 'You defeated the Dark Knight!', {
      fontSize: '12px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(160, 130, 'The dungeon is saved.', {
      fontSize: '12px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const pressEnterText = this.add.text(160, 200, 'Press Enter to continue', {
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

    const returnToTitle = (): void => {
      this.scene.start('TitleScene');
    };

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', returnToTitle, this);
      this.input.keyboard.on('keydown-SPACE', returnToTitle, this);
    }
  }
}
