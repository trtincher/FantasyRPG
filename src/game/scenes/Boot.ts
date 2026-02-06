import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    // Tilemap
    this.load.tilemapTiledJSON('test-map', 'assets/maps/test-map.json');
    this.load.image('tiles', 'assets/maps/tiles.png');

    // Player spritesheet
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Enemy sprites
    this.load.image('slime', 'assets/sprites/slime.png');
  }

  create(): void {
    this.scene.start('TitleScene');
  }
}
