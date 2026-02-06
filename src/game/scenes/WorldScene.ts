import { Scene } from 'phaser';
import { Direction, TILE_SIZE, PLAYER_SPAWN_X, PLAYER_SPAWN_Y } from '../utils/Constants';
import { Player } from '../entities/Player';
import { GridPhysics } from '../systems/GridPhysics';
import { DialogueSystem } from '../systems/DialogueSystem';
import { processXpGain } from '../data/xp';
import { ENEMIES } from '../data/enemies';
import { NPC_SPAWNS, NPCData } from '../entities/NPC';
import { STORY_TRIGGERS } from '../data/story';

interface EncounterSpawn {
  id: string;
  enemyKey: string;
  tileX: number;
  tileY: number;
}

const ENCOUNTER_SPAWNS: EncounterSpawn[] = [
  { id: 'rat-1', enemyKey: 'rat', tileX: 4, tileY: 7 },
  { id: 'rat-2', enemyKey: 'rat', tileX: 10, tileY: 5 },
  { id: 'rat-3', enemyKey: 'rat', tileX: 28, tileY: 5 },
  { id: 'slime-1', enemyKey: 'slime', tileX: 32, tileY: 8 },
  { id: 'rat-4', enemyKey: 'rat', tileX: 34, tileY: 10 },
  { id: 'bat-1', enemyKey: 'bat', tileX: 4, tileY: 19 },
  { id: 'bat-2', enemyKey: 'bat', tileX: 9, tileY: 22 },
  { id: 'slime-2', enemyKey: 'slime', tileX: 6, tileY: 21 },
  { id: 'skeleton-1', enemyKey: 'skeleton', tileX: 28, tileY: 19 },
  { id: 'skeleton-2', enemyKey: 'skeleton', tileX: 33, tileY: 22 },
  { id: 'bat-3', enemyKey: 'bat', tileX: 30, tileY: 20 },
  { id: 'skeleton-3', enemyKey: 'skeleton', tileX: 20, tileY: 27 },
  { id: 'boss-1', enemyKey: 'darkKnight', tileX: 25, tileY: 34 },
];

interface EncounterEntity {
  id: string;
  enemyKey: string;
  tileX: number;
  tileY: number;
  sprite: Phaser.GameObjects.Image;
}

interface NPCEntity {
  data: NPCData;
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
  private npcs: NPCEntity[] = [];
  private dialogueSystem!: DialogueSystem;
  private triggeredStoryEvents: Set<string> = new Set();

  constructor() {
    super('WorldScene');
  }

  create(): void {
    this.map = this.make.tilemap({ key: 'dungeon' });
    const tileset = this.map.addTilesetImage('tiles', 'tiles');

    if (!tileset) {
      return;
    }

    this.map.createLayer('ground', tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('walls', tileset, 0, 0)!;
    this.wallsLayer.setCollisionByProperty({ collides: true });

    this.dialogueSystem = new DialogueSystem(this);

    this.encounters = [];
    for (const spawn of ENCOUNTER_SPAWNS) {
      if (this.defeatedEncounters.has(spawn.id)) continue;

      const pixelX = spawn.tileX * TILE_SIZE + TILE_SIZE / 2;
      const pixelY = spawn.tileY * TILE_SIZE + TILE_SIZE / 2;
      const sprite = this.add.image(pixelX, pixelY, ENEMIES[spawn.enemyKey].spriteKey);

      this.encounters.push({
        id: spawn.id,
        enemyKey: spawn.enemyKey,
        tileX: spawn.tileX,
        tileY: spawn.tileY,
        sprite,
      });
    }

    this.npcs = [];
    for (const npcData of NPC_SPAWNS) {
      const pixelX = npcData.tileX * TILE_SIZE + TILE_SIZE / 2;
      const pixelY = npcData.tileY * TILE_SIZE + TILE_SIZE / 2;
      const sprite = this.add.image(pixelX, pixelY, 'npc');
      this.npcs.push({ data: npcData, sprite });
    }

    const spawnX = PLAYER_SPAWN_X * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = PLAYER_SPAWN_Y * TILE_SIZE + TILE_SIZE / 2;

    const playerName = this.game.registry.get('playerName') || 'Player';
    const playerClass = this.game.registry.get('playerClass') || 'warrior';
    const playerLevel = this.game.registry.get('playerLevel') || 1;
    const playerXp = this.game.registry.get('playerXp') || 0;

    this.player = new Player(this, spawnX, spawnY, {
      name: playerName,
      classKey: playerClass,
    });
    this.player.level = playerLevel;
    this.player.xp = playerXp;

    if (playerLevel > 1) {
      this.player.applyLevelUp(playerLevel);
    }

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-ENTER', this.handleInteraction, this);
      this.input.keyboard.on('keydown-SPACE', this.handleInteraction, this);
    }

    this.gridPhysics = new GridPhysics(this.player, this.wallsLayer, this);

    this.gridPhysics.setOnMoveComplete((tileX: number, tileY: number) => {
      if (this.scene.isActive('BattleScene')) return;
      if (this.dialogueSystem.getIsActive()) return;

      const encounter = this.encounters.find(
        (e) => e.tileX === tileX && e.tileY === tileY
      );

      if (encounter) {
        const player = this.getPlayer();
        const enemyData = ENEMIES[encounter.enemyKey];
        this.scene.sleep('WorldScene');
        this.scene.launch('BattleScene', {
          playerName: player.name,
          playerLevel: player.level,
          playerHp: player.hp,
          playerMaxHp: player.maxHp,
          playerAttack: player.attack,
          playerDefense: player.defense,
          enemyKey: encounter.enemyKey,
          encounterId: encounter.id,
          isBoss: enemyData.isBoss || false,
        });
        return;
      }

      const trigger = STORY_TRIGGERS.find(
        (t) => t.tileX === tileX && t.tileY === tileY
      );

      if (trigger && !this.triggeredStoryEvents.has(trigger.id)) {
        this.triggeredStoryEvents.add(trigger.id);
        this.dialogueSystem.show(trigger.dialogueKey);
      }
    });

    this.events.on('wake', (_sys: Phaser.Scenes.Systems, data?: { playerHp?: number; encounterId?: string; result?: string; xpGained?: number }) => {
      if (data?.playerHp !== undefined) {
        this.player.hp = data.playerHp;
      }

      if (data?.result === 'victory' && data?.xpGained) {
        const result = processXpGain(this.player.level, this.player.xp, data.xpGained);
        this.player.xp = result.newXp;

        if (result.levelsGained > 0) {
          this.player.applyLevelUp(result.newLevel);
        }

        this.game.registry.set('playerLevel', this.player.level);
        this.game.registry.set('playerXp', this.player.xp);
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
    if (this.dialogueSystem.getIsActive()) return;
    if (this.cursors) {
      this.gridPhysics.update(this.cursors);
    }
  }

  private handleInteraction(): void {
    if (this.dialogueSystem.getIsActive()) {
      this.dialogueSystem.advance();
      return;
    }

    const facingDir = this.gridPhysics.getLastDirection();
    const playerTileX = Math.floor(this.player.x / TILE_SIZE);
    const playerTileY = Math.floor(this.player.y / TILE_SIZE);

    let facingTileX = playerTileX;
    let facingTileY = playerTileY;

    switch (facingDir) {
      case Direction.UP:
        facingTileY -= 1;
        break;
      case Direction.DOWN:
        facingTileY += 1;
        break;
      case Direction.LEFT:
        facingTileX -= 1;
        break;
      case Direction.RIGHT:
        facingTileX += 1;
        break;
    }

    const npc = this.npcs.find(
      (n) => n.data.tileX === facingTileX && n.data.tileY === facingTileY
    );

    if (npc) {
      this.dialogueSystem.show(npc.data.dialogueKey);
    }
  }

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
