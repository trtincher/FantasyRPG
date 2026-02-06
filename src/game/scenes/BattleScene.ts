import { Scene } from 'phaser';
import { BattleSystem, BattleCallbacks } from '../systems/BattleSystem';
import { ENEMIES } from '../data/enemies';
import { ITEMS } from '../data/items';
import { deserializeInventory, removeItem, serializeInventory } from '../utils/inventory';
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
  isBoss: boolean;
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

  private menuIndex = 0;
  private menuOptions = ['Attack', 'Defend', 'Item', 'Flee'];
  private isItemSubMenu = false;
  private itemMenuIndex = 0;
  private itemMenuEntries: { key: string; name: string; count: number }[] = [];

  constructor() {
    super('BattleScene');
  }

  init(data: BattleInitData): void {
    this.initData = data;
    this.currentState = BattleState.INTRO;
    this.menuIndex = 0;
    this.isItemSubMenu = false;
    this.itemMenuIndex = 0;
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
      this.input.keyboard.on('keydown-UP', this.handleMenuUp, this);
      this.input.keyboard.on('keydown-DOWN', this.handleMenuDown, this);
      this.input.keyboard.on('keydown-ESC', this.handleMenuEscape, this);
    }

    const callbacks: BattleCallbacks = {
      onStateChange: (state: BattleState) => this.onStateChange(state),
      onDamageDealt: (
        target: 'player' | 'enemy',
        damage: number,
        remainingHp: number
      ) => this.onDamageDealt(target, damage, remainingHp),
      onBattleEnd: (result: 'victory' | 'defeat' | 'fled') =>
        this.onBattleEnd(result),
      onHeal: (amount: number, newHp: number) => this.onHeal(amount, newHp),
      onFleeAttempt: (success: boolean) => this.onFleeAttempt(success),
    };

    this.battleSystem = new BattleSystem(
      {
        hp: playerHp,
        maxHp: playerMaxHp,
        attack: playerAttack,
        defense: playerDefense,
      },
      enemyData,
      callbacks,
      this.initData.isBoss
    );

    this.battleSystem.start();
  }

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

      case BattleState.FLED:
        this.menuText.setText('');
        this.messageText.setText('Got away safely!');
        break;
    }
  }

  private showPlayerTurn(): void {
    this.menuIndex = 0;
    this.isItemSubMenu = false;
    this.renderMenu();
    this.messageText.setText('What will you do?');
  }

  private renderMenu(): void {
    const lines = this.menuOptions.map((opt, i) => {
      return i === this.menuIndex ? `> ${opt}` : `  ${opt}`;
    });
    this.menuText.setText(lines.join('\n'));
  }

  private renderItemSubMenu(): void {
    if (this.itemMenuEntries.length === 0) {
      this.menuText.setText('  No items!');
      return;
    }
    const lines = this.itemMenuEntries.map((entry, i) => {
      const prefix = i === this.itemMenuIndex ? '> ' : '  ';
      return `${prefix}${entry.name} x${entry.count}`;
    });
    this.menuText.setText(lines.join('\n'));
  }

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

  private onBattleEnd(result: 'victory' | 'defeat' | 'fled'): void {
    if (result === 'fled') {
      this.time.delayedCall(1500, () => {
        this.scene.wake('WorldScene', {
          playerHp: this.battleSystem.getPlayerHp(),
          encounterId: this.initData.encounterId,
          result: 'fled',
          xpGained: 0,
        });
        this.scene.stop('BattleScene');
      });
      return;
    }

    if (result === 'victory') {
      this.time.delayedCall(2000, () => {
        if (this.initData.isBoss) {
          this.scene.start('VictoryScene');
        } else {
          this.scene.wake('WorldScene', {
            playerHp: this.battleSystem.getPlayerHp(),
            encounterId: this.initData.encounterId,
            result: 'victory',
            xpGained: ENEMIES[this.initData.enemyKey].xpReward,
          });
          this.scene.stop('BattleScene');
        }
      });
    } else {
      this.time.delayedCall(2000, () => {
        this.scene.start('TitleScene');
      });
    }
  }

  private onHeal(amount: number, newHp: number): void {
    const ratio = newHp / this.battleSystem.getPlayerMaxHp();
    this.drawHpBar(this.playerHpBar, this.playerBarX, this.playerBarY, 0x33ff33, ratio);
    this.messageText.setText(`Used item! Restored ${amount} HP.`);
  }

  private onFleeAttempt(success: boolean): void {
    if (!success && this.initData.isBoss) {
      this.messageText.setText("Can't escape from boss!");
      this.time.delayedCall(1000, () => {
        if (this.currentState === BattleState.PLAYER_TURN) {
          this.showPlayerTurn();
        }
      });
    } else if (!success) {
      this.messageText.setText("Couldn't escape!");
    }
  }

  private handleConfirm(): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;

    if (this.isItemSubMenu) {
      if (this.itemMenuEntries.length === 0) {
        this.isItemSubMenu = false;
        this.menuIndex = 2;
        this.renderMenu();
        this.messageText.setText('What will you do?');
        return;
      }
      const entry = this.itemMenuEntries[this.itemMenuIndex];
      const itemData = ITEMS[entry.key];
      const invJson = this.game.registry.get('playerInventory') || '{}';
      const inv = deserializeInventory(invJson);
      const newInv = removeItem(inv, entry.key);
      if (newInv) {
        this.game.registry.set('playerInventory', serializeInventory(newInv));
      }
      this.isItemSubMenu = false;
      this.battleSystem.playerUseItem(itemData.healAmount || 0);
      return;
    }

    switch (this.menuIndex) {
      case 0:
        this.battleSystem.playerAttack();
        break;
      case 1:
        this.battleSystem.playerDefend();
        this.messageText.setText('You brace for impact!');
        break;
      case 2: {
        const invJson = this.game.registry.get('playerInventory') || '{}';
        const inv = deserializeInventory(invJson);
        this.itemMenuEntries = Object.entries(inv)
          .filter(([key]) => ITEMS[key] && ITEMS[key].type === 'consumable')
          .map(([key, count]) => ({ key, name: ITEMS[key].name, count }));
        this.isItemSubMenu = true;
        this.itemMenuIndex = 0;
        if (this.itemMenuEntries.length === 0) {
          this.messageText.setText('No items!');
          this.time.delayedCall(1000, () => {
            if (this.currentState === BattleState.PLAYER_TURN) {
              this.isItemSubMenu = false;
              this.menuIndex = 2;
              this.renderMenu();
              this.messageText.setText('What will you do?');
            }
          });
        } else {
          this.messageText.setText('Use which item?');
        }
        this.renderItemSubMenu();
        break;
      }
      case 3:
        this.battleSystem.playerFlee();
        break;
    }
  }

  private handleMenuUp(): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;
    if (this.isItemSubMenu) {
      this.itemMenuIndex = (this.itemMenuIndex - 1 + this.itemMenuEntries.length) % this.itemMenuEntries.length;
      this.renderItemSubMenu();
    } else {
      this.menuIndex = (this.menuIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
      this.renderMenu();
    }
  }

  private handleMenuDown(): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;
    if (this.isItemSubMenu) {
      this.itemMenuIndex = (this.itemMenuIndex + 1) % this.itemMenuEntries.length;
      this.renderItemSubMenu();
    } else {
      this.menuIndex = (this.menuIndex + 1) % this.menuOptions.length;
      this.renderMenu();
    }
  }

  private handleMenuEscape(): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;
    if (this.isItemSubMenu) {
      this.isItemSubMenu = false;
      this.menuIndex = 2;
      this.renderMenu();
      this.messageText.setText('What will you do?');
    }
  }

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
