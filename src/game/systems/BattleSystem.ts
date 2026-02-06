import { BattleState, MIN_DAMAGE } from '../utils/Constants';
import { EnemyData } from '../data/enemies';

export interface BattleCallbacks {
  onStateChange: (state: BattleState) => void;
  onDamageDealt: (target: 'player' | 'enemy', damage: number, remainingHp: number) => void;
  onBattleEnd: (result: 'victory' | 'defeat' | 'fled') => void;
  onHeal?: (amount: number, newHp: number) => void;
  onFleeAttempt?: (success: boolean) => void;
}

export class BattleSystem {
  private state: BattleState = BattleState.INTRO;
  private playerHp: number;
  private playerMaxHp: number;
  private playerAtk: number;
  private playerDef: number;
  private enemyHp: number;
  private enemyMaxHp: number;
  private enemyAtk: number;
  private enemyDef: number;
  private enemyName: string;
  private callbacks: BattleCallbacks;
  private isDefending = false;
  private isBoss: boolean;

  constructor(
    playerStats: { hp: number; maxHp: number; attack: number; defense: number },
    enemyData: EnemyData,
    callbacks: BattleCallbacks,
    isBoss: boolean = false
  ) {
    this.playerHp = playerStats.hp;
    this.playerMaxHp = playerStats.maxHp;
    this.playerAtk = playerStats.attack;
    this.playerDef = playerStats.defense;
    this.enemyHp = enemyData.hp;
    this.enemyMaxHp = enemyData.hp;
    this.enemyAtk = enemyData.attack;
    this.enemyDef = enemyData.defense;
    this.enemyName = enemyData.name;
    this.callbacks = callbacks;
    this.isBoss = isBoss;
  }

  start(): void {
    this.state = BattleState.INTRO;
    this.callbacks.onStateChange(this.state);
  }

  beginPlayerTurn(): void {
    if (this.state !== BattleState.INTRO) return;
    this.state = BattleState.PLAYER_TURN;
    this.callbacks.onStateChange(this.state);
  }

  playerAttack(): number {
    if (this.state !== BattleState.PLAYER_TURN) return 0;

    const damage = this.calculateDamage(this.playerAtk, this.enemyDef);
    this.enemyHp = Math.max(0, this.enemyHp - damage);
    this.callbacks.onDamageDealt('enemy', damage, this.enemyHp);

    this.state = BattleState.ENEMY_TURN;
    this.callbacks.onStateChange(this.state);

    return damage;
  }

  enemyTurn(): void {
    if (this.state !== BattleState.ENEMY_TURN) return;

    let damage = this.calculateDamage(this.enemyAtk, this.playerDef);
    if (this.isDefending) {
      damage = Math.max(1, Math.floor(damage / 2));
      this.isDefending = false;
    }
    this.playerHp = Math.max(0, this.playerHp - damage);
    this.callbacks.onDamageDealt('player', damage, this.playerHp);

    this.state = BattleState.CHECK_END;
    this.callbacks.onStateChange(this.state);
  }

  checkEnd(): void {
    if (this.state !== BattleState.CHECK_END) return;

    if (this.enemyHp <= 0) {
      this.state = BattleState.VICTORY;
      this.callbacks.onStateChange(this.state);
      this.callbacks.onBattleEnd('victory');
    } else if (this.playerHp <= 0) {
      this.state = BattleState.DEFEAT;
      this.callbacks.onStateChange(this.state);
      this.callbacks.onBattleEnd('defeat');
    } else {
      this.isDefending = false;
      this.state = BattleState.PLAYER_TURN;
      this.callbacks.onStateChange(this.state);
    }
  }

  private calculateDamage(atk: number, def: number): number {
    const baseDamage = atk - def / 2 + Math.floor(Math.random() * 3) + 1;
    return Math.max(MIN_DAMAGE, Math.floor(baseDamage));
  }

  playerDefend(): void {
    if (this.state !== BattleState.PLAYER_TURN) return;
    this.isDefending = true;
    this.state = BattleState.ENEMY_TURN;
    this.callbacks.onStateChange(this.state);
  }

  playerUseItem(healAmount: number): void {
    if (this.state !== BattleState.PLAYER_TURN) return;
    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + healAmount);
    this.callbacks.onHeal?.(healAmount, this.playerHp);
    this.state = BattleState.ENEMY_TURN;
    this.callbacks.onStateChange(this.state);
  }

  playerFlee(): 'success' | 'failed' | 'blocked' {
    if (this.state !== BattleState.PLAYER_TURN) return 'failed';
    if (this.isBoss) {
      this.callbacks.onFleeAttempt?.(false);
      return 'blocked';
    }
    if (Math.random() < 0.5) {
      this.state = BattleState.FLED;
      this.callbacks.onStateChange(this.state);
      this.callbacks.onBattleEnd('fled');
      return 'success';
    }
    this.callbacks.onFleeAttempt?.(false);
    this.state = BattleState.ENEMY_TURN;
    this.callbacks.onStateChange(this.state);
    return 'failed';
  }

  getState(): BattleState {
    return this.state;
  }

  getPlayerHp(): number {
    return this.playerHp;
  }

  getPlayerMaxHp(): number {
    return this.playerMaxHp;
  }

  getEnemyHp(): number {
    return this.enemyHp;
  }

  getEnemyMaxHp(): number {
    return this.enemyMaxHp;
  }

  getEnemyName(): string {
    return this.enemyName;
  }
}
