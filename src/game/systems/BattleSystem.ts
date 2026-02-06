import { BattleState, MIN_DAMAGE } from '../utils/Constants';
import { EnemyData } from '../data/enemies';

export interface BattleCallbacks {
  onStateChange: (state: BattleState) => void;
  onDamageDealt: (target: 'player' | 'enemy', damage: number, remainingHp: number) => void;
  onBattleEnd: (result: 'victory' | 'defeat') => void;
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

  constructor(
    playerStats: { hp: number; maxHp: number; attack: number; defense: number },
    enemyData: EnemyData,
    callbacks: BattleCallbacks
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
  }

  start(): void {
    this.state = BattleState.INTRO;
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

    const damage = this.calculateDamage(this.enemyAtk, this.playerDef);
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
      this.state = BattleState.PLAYER_TURN;
      this.callbacks.onStateChange(this.state);
    }
  }

  private calculateDamage(atk: number, def: number): number {
    const baseDamage = atk - def / 2 + Math.floor(Math.random() * 3) + 1;
    return Math.max(MIN_DAMAGE, Math.floor(baseDamage));
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
