import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BattleSystem, BattleCallbacks } from '../BattleSystem';
import { BattleState } from '../../utils/Constants';
import { ENEMIES } from '../../data/enemies';

const DEFAULT_PLAYER = { hp: 20, maxHp: 20, attack: 8, defense: 4 };

function makeCallbacks(): BattleCallbacks {
  return {
    onStateChange: vi.fn(),
    onDamageDealt: vi.fn(),
    onBattleEnd: vi.fn(),
  };
}

describe('BattleSystem', () => {
  let callbacks: BattleCallbacks;
  let battle: BattleSystem;

  beforeEach(() => {
    callbacks = makeCallbacks();
    battle = new BattleSystem(DEFAULT_PLAYER, ENEMIES.slime, callbacks);
  });

  describe('initialization', () => {
    it('starts in INTRO state', () => {
      battle.start();
      expect(battle.getState()).toBe(BattleState.INTRO);
      expect(callbacks.onStateChange).toHaveBeenCalledWith(BattleState.INTRO);
    });

    it('exposes enemy name and HP', () => {
      expect(battle.getEnemyName()).toBe('Slime');
      expect(battle.getEnemyHp()).toBe(12);
      expect(battle.getEnemyMaxHp()).toBe(12);
    });

    it('exposes player HP', () => {
      expect(battle.getPlayerHp()).toBe(20);
      expect(battle.getPlayerMaxHp()).toBe(20);
    });
  });

  describe('state transitions', () => {
    it('transitions from INTRO to PLAYER_TURN via beginPlayerTurn', () => {
      battle.start();
      battle.beginPlayerTurn();
      expect(battle.getState()).toBe(BattleState.PLAYER_TURN);
      expect(callbacks.onStateChange).toHaveBeenCalledWith(
        BattleState.PLAYER_TURN
      );
    });

    it('ignores beginPlayerTurn when not in INTRO', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.beginPlayerTurn();
      expect(battle.getState()).toBe(BattleState.PLAYER_TURN);
    });

    it('ignores playerAttack when not in PLAYER_TURN', () => {
      battle.start();
      const damage = battle.playerAttack();
      expect(damage).toBe(0);
      expect(callbacks.onDamageDealt).not.toHaveBeenCalled();
    });

    it('transitions PLAYER_TURN → ENEMY_TURN on playerAttack', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.playerAttack();
      expect(battle.getState()).toBe(BattleState.ENEMY_TURN);
    });

    it('transitions ENEMY_TURN → CHECK_END on enemyTurn', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.playerAttack();
      battle.enemyTurn();
      expect(battle.getState()).toBe(BattleState.CHECK_END);
    });

    it('ignores enemyTurn when not in ENEMY_TURN', () => {
      battle.start();
      battle.enemyTurn();
      expect(callbacks.onDamageDealt).not.toHaveBeenCalled();
    });
  });

  describe('damage calculation', () => {
    it('always deals at least 1 damage', () => {
      const tankCallbacks = makeCallbacks();
      const tank = new BattleSystem(
        { hp: 20, maxHp: 20, attack: 1, defense: 0 },
        { key: 'tank', name: 'Tank', hp: 100, attack: 1, defense: 999, spriteKey: 'slime' },
        tankCallbacks
      );
      vi.spyOn(Math, 'random').mockReturnValue(0);
      tank.start();
      tank.beginPlayerTurn();
      const damage = tank.playerAttack();
      expect(damage).toBeGreaterThanOrEqual(1);
      vi.restoreAllMocks();
    });

    it('deals damage to enemy on playerAttack', () => {
      battle.start();
      battle.beginPlayerTurn();
      const initialHp = battle.getEnemyHp();
      battle.playerAttack();
      expect(battle.getEnemyHp()).toBeLessThan(initialHp);
      expect(callbacks.onDamageDealt).toHaveBeenCalledWith(
        'enemy',
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('deals damage to player on enemyTurn', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.playerAttack();
      const hpBefore = battle.getPlayerHp();
      battle.enemyTurn();
      expect(battle.getPlayerHp()).toBeLessThan(hpBefore);
      expect(callbacks.onDamageDealt).toHaveBeenCalledWith(
        'player',
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('battle end conditions', () => {
    it('declares victory when enemy HP reaches 0', () => {
      const strongCallbacks = makeCallbacks();
      const strong = new BattleSystem(
        { hp: 20, maxHp: 20, attack: 999, defense: 999 },
        ENEMIES.slime,
        strongCallbacks
      );
      strong.start();
      strong.beginPlayerTurn();
      strong.playerAttack();
      strong.enemyTurn();
      strong.checkEnd();
      expect(strong.getState()).toBe(BattleState.VICTORY);
      expect(strongCallbacks.onBattleEnd).toHaveBeenCalledWith('victory');
    });

    it('declares defeat when player HP reaches 0', () => {
      const weakCallbacks = makeCallbacks();
      const weak = new BattleSystem(
        { hp: 1, maxHp: 1, attack: 1, defense: 0 },
        { key: 'boss', name: 'Boss', hp: 999, attack: 999, defense: 0, spriteKey: 'slime' },
        weakCallbacks
      );
      weak.start();
      weak.beginPlayerTurn();
      weak.playerAttack();
      weak.enemyTurn();
      weak.checkEnd();
      expect(weak.getState()).toBe(BattleState.DEFEAT);
      expect(weakCallbacks.onBattleEnd).toHaveBeenCalledWith('defeat');
    });

    it('returns to PLAYER_TURN when both alive', () => {
      const durableCallbacks = makeCallbacks();
      const durable = new BattleSystem(
        { hp: 999, maxHp: 999, attack: 1, defense: 999 },
        { key: 'tank', name: 'Tank', hp: 999, attack: 1, defense: 999, spriteKey: 'slime' },
        durableCallbacks
      );
      durable.start();
      durable.beginPlayerTurn();
      durable.playerAttack();
      durable.enemyTurn();
      durable.checkEnd();
      expect(durable.getState()).toBe(BattleState.PLAYER_TURN);
    });
  });
});
