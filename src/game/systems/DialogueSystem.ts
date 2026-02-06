import { Scene } from 'phaser';
import { DIALOGUES, DialogueLine } from '../data/dialogues';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/Constants';

export class DialogueSystem {
  private scene: Scene;
  private isActive = false;
  private currentLines: DialogueLine[] = [];
  private lineIndex = 0;
  private background?: Phaser.GameObjects.Graphics;
  private speakerText?: Phaser.GameObjects.Text;
  private bodyText?: Phaser.GameObjects.Text;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  show(dialogueKey: string): void {
    const lines = DIALOGUES[dialogueKey];
    if (!lines || lines.length === 0) return;

    this.currentLines = lines;
    this.lineIndex = 0;
    this.isActive = true;
    this.renderCurrentLine();
  }

  advance(): void {
    if (!this.isActive) return;

    this.lineIndex++;
    if (this.lineIndex >= this.currentLines.length) {
      this.hide();
      return;
    }

    this.renderCurrentLine();
  }

  hide(): void {
    this.isActive = false;
    this.currentLines = [];
    this.lineIndex = 0;

    if (this.background) {
      this.background.destroy();
      this.background = undefined;
    }
    if (this.speakerText) {
      this.speakerText.destroy();
      this.speakerText = undefined;
    }
    if (this.bodyText) {
      this.bodyText.destroy();
      this.bodyText = undefined;
    }
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  private renderCurrentLine(): void {
    const line = this.currentLines[this.lineIndex];
    const cam = this.scene.cameras.main;
    const boxHeight = 60;
    const boxX = cam.scrollX;
    const boxY = cam.scrollY + CANVAS_HEIGHT - boxHeight;

    if (this.background) {
      this.background.destroy();
    }
    this.background = this.scene.add.graphics();
    this.background.fillStyle(0x000000, 0.8);
    this.background.fillRect(boxX, boxY, CANVAS_WIDTH, boxHeight);
    this.background.setDepth(1000);

    if (this.speakerText) {
      this.speakerText.destroy();
    }

    if (line.speaker) {
      this.speakerText = this.scene.add.text(boxX + 8, boxY + 4, line.speaker, {
        fontSize: '10px',
        color: '#ffff00',
      });
      this.speakerText.setDepth(1001);
    }

    if (this.bodyText) {
      this.bodyText.destroy();
    }
    this.bodyText = this.scene.add.text(boxX + 8, line.speaker ? boxY + 18 : boxY + 12, line.text, {
      fontSize: '10px',
      color: '#ffffff',
      wordWrap: { width: CANVAS_WIDTH - 16 },
    });
    this.bodyText.setDepth(1001);
  }
}
