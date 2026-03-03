import { Scene } from 'phaser';
import { CANVAS_WIDTH } from '../utils/Constants';

const HUD_PADDING = 4;
const HP_BAR_W = 48;
const HP_BAR_H = 5;
const HUD_DEPTH = 1000;

export class WorldHUD {
  private scene: Scene;
  private container!: Phaser.GameObjects.Container;
  private hpBarBg!: Phaser.GameObjects.Graphics;
  private hpBarFill!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private hpText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(HUD_DEPTH);
    this.container.setScrollFactor(0);

    // Semi-transparent background panel
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.6);
    bg.fillRoundedRect(HUD_PADDING, HUD_PADDING, 80, 28, 3);
    this.container.add(bg);

    // Player name + level
    this.nameText = this.scene.add.text(HUD_PADDING + 4, HUD_PADDING + 2, '', {
      fontSize: '8px',
      color: '#ffffff',
    });
    this.container.add(this.nameText);

    // HP bar background
    this.hpBarBg = this.scene.add.graphics();
    this.hpBarBg.fillStyle(0x333333, 1);
    this.hpBarBg.fillRect(HUD_PADDING + 4, HUD_PADDING + 14, HP_BAR_W, HP_BAR_H);
    this.container.add(this.hpBarBg);

    // HP bar fill (drawn dynamically)
    this.hpBarFill = this.scene.add.graphics();
    this.container.add(this.hpBarFill);

    // HP text (right of bar)
    this.hpText = this.scene.add.text(HUD_PADDING + HP_BAR_W + 8, HUD_PADDING + 12, '', {
      fontSize: '7px',
      color: '#cccccc',
    });
    this.container.add(this.hpText);

    // ESC hint — bottom-right corner
    this.hintText = this.scene.add.text(0, 0, 'ESC: Menu', {
      fontSize: '7px',
      color: '#888888',
    });
    this.hintText.setPosition(CANVAS_WIDTH - this.hintText.width - HUD_PADDING, HUD_PADDING);
    this.container.add(this.hintText);
  }

  update(name: string, level: number, hp: number, maxHp: number): void {
    this.nameText.setText(`Lv.${level} ${name}`);
    this.hpText.setText(`${hp}/${maxHp}`);

    // Redraw HP bar fill
    this.hpBarFill.clear();
    const ratio = maxHp > 0 ? hp / maxHp : 0;
    const fillW = Math.round(HP_BAR_W * ratio);
    const color = ratio > 0.5 ? 0x00cc44 : ratio > 0.25 ? 0xcccc00 : 0xcc2222;
    this.hpBarFill.fillStyle(color, 1);
    this.hpBarFill.fillRect(HUD_PADDING + 4, HUD_PADDING + 14, fillW, HP_BAR_H);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
