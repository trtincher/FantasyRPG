import { Scene, GameObjects } from 'phaser';
import { Direction } from '../utils/Constants';

export class Player extends GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);
    scene.add.existing(this);
    this.createAnimations();
  }

  private createAnimations(): void {
    // Walk animations (4 frames each, rows of spritesheet)
    // Row 0: Down (frames 0-3)
    this.scene.anims.create({
      key: 'walk-down',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    // Row 1: Left (frames 4-7)
    this.scene.anims.create({
      key: 'walk-left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    // Row 2: Right (frames 8-11)
    this.scene.anims.create({
      key: 'walk-right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    // Row 3: Up (frames 12-15)
    this.scene.anims.create({
      key: 'walk-up',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Idle animations (single frame each — first frame of each direction)
    this.scene.anims.create({
      key: 'idle-down',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: 'idle-left',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: 'idle-right',
      frames: [{ key: 'player', frame: 8 }],
      frameRate: 1,
    });

    this.scene.anims.create({
      key: 'idle-up',
      frames: [{ key: 'player', frame: 12 }],
      frameRate: 1,
    });
  }

  playWalkAnimation(direction: Direction): void {
    if (direction === Direction.NONE) return;
    this.anims.play(`walk-${direction}`, true);
  }

  stopAnimation(direction: Direction): void {
    if (direction === Direction.NONE) return;
    this.anims.play(`idle-${direction}`, true);
  }
}
