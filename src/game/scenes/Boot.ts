import { Scene } from 'phaser';

export class Boot extends Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    this.load.tilemapTiledJSON('dungeon', 'assets/maps/dungeon.json');
    this.load.image('tiles', 'assets/maps/tiles.png');

    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image('slime', 'assets/sprites/slime.png');
    this.load.image('rat', 'assets/sprites/rat.png');
    this.load.image('bat', 'assets/sprites/bat.png');
    this.load.image('skeleton', 'assets/sprites/skeleton.png');
    this.load.image('dark-knight', 'assets/sprites/dark-knight.png');
    this.load.image('npc', 'assets/sprites/npc.png');
    this.load.image('potion', 'assets/sprites/potion.png');
  }

  create(): void {
    this.scene.start('TitleScene');
  }
}
