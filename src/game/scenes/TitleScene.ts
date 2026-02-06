import { Scene } from 'phaser';

export class TitleScene extends Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    this.game.registry.remove('playerName');
    this.game.registry.remove('playerClass');
    this.game.registry.remove('playerLevel');
    this.game.registry.remove('playerXp');

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.add.text(160, 60, 'FANTASY RPG', {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(160, 140, '> New Game', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const pressEnterText = this.add.text(160, 200, 'Press Enter to start', {
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

    const startGame = (): void => {
      this.scene.start('CharacterCreationScene');
    };

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', startGame, this);
      this.input.keyboard.on('keydown-SPACE', startGame, this);
    }
  }
}
