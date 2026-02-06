import { Scene } from 'phaser';
import { TILE_SIZE, PLAYER_SPAWN_X, PLAYER_SPAWN_Y } from '../utils/Constants';
import { Player } from '../entities/Player';
import { GridPhysics } from '../systems/GridPhysics';

export class WorldScene extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private gridPhysics!: GridPhysics;

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.map = this.make.tilemap({ key: 'test-map' });
    const tileset = this.map.addTilesetImage('tiles', 'tiles');

    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    // Create layers (order matters for rendering)
    this.map.createLayer('ground', tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('walls', tileset, 0, 0)!;

    // Set collision on wall tiles using the 'collides' property from Tiled
    this.wallsLayer.setCollisionByProperty({ collides: true });

    // Create player sprite at spawn position (convert tile coords to pixel coords)
    const spawnX = PLAYER_SPAWN_X * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = PLAYER_SPAWN_Y * TILE_SIZE + TILE_SIZE / 2;
    this.player = new Player(this, spawnX, spawnY);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.gridPhysics = new GridPhysics(this.player, this.wallsLayer, this);

    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setDeadzone(0, 0);
  }

  update(_time: number, _delta: number): void {
    if (this.cursors) {
      this.gridPhysics.update(this.cursors);
    }
  }

  // Public accessors for GridPhysics and testing
  getPlayer(): Player {
    return this.player;
  }

  getWallsLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.wallsLayer;
  }

  getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
    return this.cursors;
  }

  getMap(): Phaser.Tilemaps.Tilemap {
    return this.map;
  }
}
