import { Scene } from 'phaser';
import { TILE_SIZE, PLAYER_SPAWN_X, PLAYER_SPAWN_Y } from '../utils/Constants';
import { Player } from '../entities/Player';
import { GridPhysics } from '../systems/GridPhysics';

interface EncounterSpawn {
  id: string;
  enemyKey: string;
  tileX: number;
  tileY: number;
}

const ENCOUNTER_SPAWNS: EncounterSpawn[] = [
  { id: 'slime-1', enemyKey: 'slime', tileX: 8, tileY: 10 },
  { id: 'slime-2', enemyKey: 'slime', tileX: 10, tileY: 12 },
  { id: 'slime-3', enemyKey: 'slime', tileX: 14, tileY: 6 },
];

interface EncounterEntity {
  id: string;
  enemyKey: string;
  tileX: number;
  tileY: number;
  sprite: Phaser.GameObjects.Image;
}

export class WorldScene extends Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  private gridPhysics!: GridPhysics;
  private encounters: EncounterEntity[] = [];
  private defeatedEncounters: Set<string> = new Set();

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

    this.encounters = [];
    for (const spawn of ENCOUNTER_SPAWNS) {
      if (this.defeatedEncounters.has(spawn.id)) continue;

      const pixelX = spawn.tileX * TILE_SIZE + TILE_SIZE / 2;
      const pixelY = spawn.tileY * TILE_SIZE + TILE_SIZE / 2;
      const sprite = this.add.image(pixelX, pixelY, spawn.enemyKey);

      this.encounters.push({
        id: spawn.id,
        enemyKey: spawn.enemyKey,
        tileX: spawn.tileX,
        tileY: spawn.tileY,
        sprite,
      });
    }

    // Create player sprite at spawn position (convert tile coords to pixel coords)
    const spawnX = PLAYER_SPAWN_X * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = PLAYER_SPAWN_Y * TILE_SIZE + TILE_SIZE / 2;
    this.player = new Player(this, spawnX, spawnY);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.gridPhysics = new GridPhysics(this.player, this.wallsLayer, this);

    this.gridPhysics.setOnMoveComplete((tileX: number, tileY: number) => {
      if (this.scene.isActive('BattleScene')) return;

      const encounter = this.encounters.find(
        (e) => e.tileX === tileX && e.tileY === tileY
      );

      if (encounter) {
        const player = this.getPlayer();
        this.scene.sleep('WorldScene');
        this.scene.launch('BattleScene', {
          playerHp: player.hp,
          playerMaxHp: player.maxHp,
          playerAttack: player.attack,
          playerDefense: player.defense,
          enemyKey: encounter.enemyKey,
          encounterId: encounter.id,
        });
      }
    });

    // Handle return from battle
    this.events.on('wake', (_sys: Phaser.Scenes.Systems, data?: { playerHp?: number; encounterId?: string; result?: string }) => {
      if (data?.playerHp !== undefined) {
        this.player.hp = data.playerHp;
      }

      if (data?.result === 'victory' && data?.encounterId) {
        const idx = this.encounters.findIndex((e) => e.id === data.encounterId);
        if (idx !== -1) {
          this.encounters[idx].sprite.destroy();
          this.encounters.splice(idx, 1);
          this.defeatedEncounters.add(data.encounterId);
        }
      }
    });

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
