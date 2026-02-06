import { Scene } from 'phaser';
import { Direction, TILE_SIZE, MOVE_DURATION } from '../utils/Constants';
import { Player } from '../entities/Player';

export class GridPhysics {
  private isMoving = false;
  private lastDirection = Direction.DOWN;

  constructor(
    private player: Player,
    private wallsLayer: Phaser.Tilemaps.TilemapLayer,
    private scene: Scene
  ) {}

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (this.isMoving) return;

    if (cursors.up.isDown) {
      this.movePlayer(Direction.UP);
    } else if (cursors.down.isDown) {
      this.movePlayer(Direction.DOWN);
    } else if (cursors.left.isDown) {
      this.movePlayer(Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.movePlayer(Direction.RIGHT);
    }
  }

  private movePlayer(direction: Direction): void {
    this.lastDirection = direction;

    if (this.isBlocked(direction)) {
      this.player.stopAnimation(direction);
      return;
    }

    this.isMoving = true;

    const { x: targetX, y: targetY } = this.getTargetPosition(direction);
    this.player.playWalkAnimation(direction);

    this.scene.tweens.add({
      targets: this.player,
      x: targetX,
      y: targetY,
      duration: MOVE_DURATION,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.player.stopAnimation(direction);
      },
    });
  }

  private getTargetPosition(direction: Direction): { x: number; y: number } {
    const currentX = this.player.x;
    const currentY = this.player.y;

    switch (direction) {
      case Direction.UP: return { x: currentX, y: currentY - TILE_SIZE };
      case Direction.DOWN: return { x: currentX, y: currentY + TILE_SIZE };
      case Direction.LEFT: return { x: currentX - TILE_SIZE, y: currentY };
      case Direction.RIGHT: return { x: currentX + TILE_SIZE, y: currentY };
      default: return { x: currentX, y: currentY };
    }
  }

  private isBlocked(direction: Direction): boolean {
    const { x: targetX, y: targetY } = this.getTargetPosition(direction);
    const tileX = Math.floor(targetX / TILE_SIZE);
    const tileY = Math.floor(targetY / TILE_SIZE);
    const tile = this.wallsLayer.getTileAt(tileX, tileY);
    return tile !== null;
  }

  getIsMoving(): boolean {
    return this.isMoving;
  }

  getLastDirection(): Direction {
    return this.lastDirection;
  }
}
