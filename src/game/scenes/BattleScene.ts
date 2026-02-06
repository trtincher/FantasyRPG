import { Scene } from 'phaser';
import { BattleSystem, BattleCallbacks } from '../systems/BattleSystem';
import { ENEMIES } from '../data/enemies';
import {
  BattleState,
  BATTLE_BG_COLOR,
  HP_BAR_WIDTH,
  HP_BAR_HEIGHT,
} from '../utils/Constants';

interface BattleInitData {
  playerHp: number;
  playerMaxHp: number;
  playerAttack: number;
  playerDefense: number;
  enemyKey: string;
  encounterId: string;
  playerName: string;
  playerLevel: number;
}

export class BattleScene extends Scene {
  private battleSystem!: BattleSystem;
  private currentState: BattleState = BattleState.INTRO;

  private initData!: BattleInitData;

  private enemyNameText!: Phaser.GameObjects.Text;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private enemySprite!: Phaser.GameObjects.Image;
  private messageText!: Phaser.GameObjects.Text;
  private playerLabel!: Phaser.GameObjects.Text;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private menuText!: Phaser.GameObjects.Text;

  private readonly enemyBarX = 160;
  private readonly enemyBarY = 10;
  private readonly playerBarX = 160;
  private readonly playerBarY = 172;

  constructor() {
    super('BattleScene');
  }

  init(data: BattleInitData): void {
    this.initData = data;
    this.currentState = BattleState.INTRO;
  }

  create(): void {
    const { playerHp, playerMaxHp, playerAttack, playerDefense, enemyKey } =
      this.initData;
    const enemyData = ENEMIES[enemyKey];

    this.cameras.main.setBackgroundColor(BATTLE_BG_COLOR);

    this.enemyNameText = this.add.text(10, 8, enemyData.name, {
      fontSize: '12px',
      color: '#ffffff',
    });

    this.add
      .graphics()
      .fillStyle(0x333333, 1)
      .fillRect(this.enemyBarX, this.enemyBarY, HP_BAR_WIDTH, HP_BAR_HEIGHT);

    this.enemyHpBar = this.add.graphics();
    this.drawHpBar(
      this.enemyHpBar,
      this.enemyBarX,
      this.enemyBarY,
      0xff3333,
      1
    );

    this.enemySprite = this.add.image(160, 70, enemyData.spriteKey);

    this.messageText = this.add.text(10, 130, '', {
      fontSize: '11px',
      color: '#ffffff',
      wordWrap: { width: 300 },
    });

    this.playerLabel = this.add.text(10, 170, `${this.initData.playerName} Lv.${this.initData.playerLevel}`, {
      fontSize: '12px',
      color: '#ffffff',
    });

    this.add
      .graphics()
      .fillStyle(0x333333, 1)
      .fillRect(this.playerBarX, this.playerBarY, HP_BAR_WIDTH, HP_BAR_HEIGHT);

    this.playerHpBar = this.add.graphics();
    this.drawHpBar(
      this.playerHpBar,
      this.playerBarX,
      this.playerBarY,
      0x33ff33,
      playerHp / playerMaxHp
    );

    this.menuText = this.add.text(20, 210, '', {
      fontSize: '12px',
      color: '#ffffff',
    });

    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ENTER', this.handleConfirm, this);
      this.input.keyboard.on('keydown-SPACE', this.handleConfirm, this);
    }

    const callbacks: BattleCallbacks = {
      onStateChange: (state: BattleState) => this.onStateChange(state),
      onDamageDealt: (
        target: 'player' | 'enemy',
        damage: number,
        remainingHp: number
      ) => this.onDamageDealt(target, damage, remainingHp),
      onBattleEnd: (result: 'victory' | 'defeat') =>
        this.onBattleEnd(result),
    };

    this.battleSystem = new BattleSystem(
      {
        hp: playerHp,
        maxHp: playerMaxHp,
        attack: playerAttack,
        defense: playerDefense,
      },
      enemyData,
      callbacks
    );

    this.battleSystem.start();
  }

  // ── State machine ─────────────────────────────────────

  private onStateChange(state: BattleState): void {
    this.currentState = state;

    switch (state) {
      case BattleState.INTRO:
        this.messageText.setText(
          `A wild ${this.battleSystem.getEnemyName()} appears!`
        );
        this.menuText.setText('');
        this.time.delayedCall(1500, () => {
          this.battleSystem.beginPlayerTurn();
        });
        break;

      case BattleState.PLAYER_TURN:
        this.showPlayerTurn();
        break;

      case BattleState.ENEMY_TURN:
        this.menuText.setText('');
        this.time.delayedCall(500, () => {
          this.battleSystem.enemyTurn();
        });
        break;

      case BattleState.CHECK_END:
        this.time.delayedCall(500, () => {
          this.battleSystem.checkEnd();
        });
        break;

      case BattleState.VICTORY:
        const xpGained = ENEMIES[this.initData.enemyKey].xpReward;
        this.messageText.setText(`Victory! +${xpGained} XP`);
        this.menuText.setText('');
        break;

      case BattleState.DEFEAT:
        this.messageText.setText('Defeat...');
        this.menuText.setText('');
        break;
    }
  }

  private showPlayerTurn(): void {
    this.messageText.setText('What will you do?');
    this.menuText.setText('> Attack');
  }

  // ── Damage callback ───────────────────────────────────

  private onDamageDealt(
    target: 'player' | 'enemy',
    damage: number,
    remainingHp: number
  ): void {
    if (target === 'enemy') {
      const ratio = remainingHp / this.battleSystem.getEnemyMaxHp();
      this.drawHpBar(
        this.enemyHpBar,
        this.enemyBarX,
        this.enemyBarY,
        0xff3333,
        ratio
      );
      this.messageText.setText(
        `You deal ${damage} damage to ${this.battleSystem.getEnemyName()}!`
      );
    } else {
      const ratio = remainingHp / this.battleSystem.getPlayerMaxHp();
      this.drawHpBar(
        this.playerHpBar,
        this.playerBarX,
        this.playerBarY,
        0x33ff33,
        ratio
      );
      this.messageText.setText(
        `${this.battleSystem.getEnemyName()} deals ${damage} damage to you!`
      );
    }
  }

  // ── Battle end callback ───────────────────────────────

  private onBattleEnd(result: 'victory' | 'defeat'): void {
    if (result === 'victory') {
      this.time.delayedCall(2000, () => {
        this.scene.wake('WorldScene', {
          playerHp: this.battleSystem.getPlayerHp(),
          encounterId: this.initData.encounterId,
          result: 'victory',
          xpGained: ENEMIES[this.initData.enemyKey].xpReward,
        });
        this.scene.stop('BattleScene');
      });
    } else {
      this.time.delayedCall(2000, () => {
        this.scene.start('TitleScene');
      });
    }
  }

  // ── Input ─────────────────────────────────────────────

  private handleConfirm(): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;
    this.currentState = BattleState.ENEMY_TURN;
    this.battleSystem.playerAttack();
  }

  // ── HP bar drawing ────────────────────────────────────

  private drawHpBar(
    bar: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    color: number,
    ratio: number
  ): void {
    bar.clear();
    bar.fillStyle(color, 1);
    bar.fillRect(x, y, HP_BAR_WIDTH * Math.max(0, ratio), HP_BAR_HEIGHT);
  }
}
