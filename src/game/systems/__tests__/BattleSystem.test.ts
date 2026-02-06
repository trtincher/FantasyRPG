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
        { key: 'tank', name: 'Tank', hp: 100, attack: 1, defense: 999, spriteKey: 'slime', xpReward: 0 },
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
        { key: 'boss', name: 'Boss', hp: 999, attack: 999, defense: 0, spriteKey: 'slime', xpReward: 0 },
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
        { key: 'tank', name: 'Tank', hp: 999, attack: 1, defense: 999, spriteKey: 'slime', xpReward: 0 },
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

  describe('playerDefend', () => {
    it('transitions to ENEMY_TURN', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.playerDefend();
      expect(battle.getState()).toBe(BattleState.ENEMY_TURN);
      expect(callbacks.onStateChange).toHaveBeenCalledWith(BattleState.ENEMY_TURN);
    });

    it('halves enemy damage when defending', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const cb = makeCallbacks();
      const b = new BattleSystem(
        { hp: 100, maxHp: 100, attack: 1, defense: 0 },
        { key: 'e', name: 'E', hp: 999, attack: 10, defense: 999, spriteKey: 'e', xpReward: 0 },
        cb
      );
      b.start();
      b.beginPlayerTurn();
      b.playerDefend();

      b.enemyTurn();
      const defendedHp = b.getPlayerHp();

      vi.spyOn(Math, 'random').mockReturnValue(0);
      const cb2 = makeCallbacks();
      const b2 = new BattleSystem(
        { hp: 100, maxHp: 100, attack: 1, defense: 0 },
        { key: 'e', name: 'E', hp: 999, attack: 10, defense: 999, spriteKey: 'e', xpReward: 0 },
        cb2
      );
      b2.start();
      b2.beginPlayerTurn();
      b2.playerAttack();
      b2.enemyTurn();
      const normalHp = b2.getPlayerHp();

      expect(defendedHp).toBeGreaterThan(normalHp);
      vi.restoreAllMocks();
    });

    it('resets isDefending after enemy turn', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const cb = makeCallbacks();
      const b = new BattleSystem(
        { hp: 999, maxHp: 999, attack: 1, defense: 0 },
        { key: 'e', name: 'E', hp: 999, attack: 10, defense: 999, spriteKey: 'e', xpReward: 0 },
        cb
      );
      b.start();
      b.beginPlayerTurn();
      b.playerDefend();
      b.enemyTurn();
      b.checkEnd();

      b.playerAttack();
      b.enemyTurn();
      const hpAfterSecondHit = b.getPlayerHp();

      const cb2 = makeCallbacks();
      const b2 = new BattleSystem(
        { hp: 999, maxHp: 999, attack: 1, defense: 0 },
        { key: 'e', name: 'E', hp: 999, attack: 10, defense: 999, spriteKey: 'e', xpReward: 0 },
        cb2
      );
      b2.start();
      b2.beginPlayerTurn();
      b2.playerDefend();
      b2.enemyTurn();
      const hpAfterDefendedHit = b2.getPlayerHp();

      expect(hpAfterSecondHit).toBeLessThan(hpAfterDefendedHit);
      vi.restoreAllMocks();
    });

    it('is ignored when not PLAYER_TURN', () => {
      battle.start();
      battle.playerDefend();
      expect(battle.getState()).toBe(BattleState.INTRO);
    });
  });

  describe('playerUseItem', () => {
    it('heals player HP', () => {
      const cb = makeCallbacks();
      const b = new BattleSystem(
        { hp: 10, maxHp: 20, attack: 8, defense: 4 },
        ENEMIES.slime,
        cb
      );
      b.start();
      b.beginPlayerTurn();
      b.playerUseItem(5);
      expect(b.getPlayerHp()).toBe(15);
    });

    it('caps HP at maxHp', () => {
      const cb = makeCallbacks();
      const b = new BattleSystem(
        { hp: 18, maxHp: 20, attack: 8, defense: 4 },
        ENEMIES.slime,
        cb
      );
      b.start();
      b.beginPlayerTurn();
      b.playerUseItem(10);
      expect(b.getPlayerHp()).toBe(20);
    });

    it('transitions to ENEMY_TURN', () => {
      battle.start();
      battle.beginPlayerTurn();
      battle.playerUseItem(5);
      expect(battle.getState()).toBe(BattleState.ENEMY_TURN);
    });

    it('fires onHeal callback with correct values', () => {
      const onHeal = vi.fn();
      const cb: BattleCallbacks = { ...makeCallbacks(), onHeal };
      const b = new BattleSystem(
        { hp: 10, maxHp: 20, attack: 8, defense: 4 },
        ENEMIES.slime,
        cb
      );
      b.start();
      b.beginPlayerTurn();
      b.playerUseItem(5);
      expect(onHeal).toHaveBeenCalledWith(5, 15);
    });

    it('is ignored when not PLAYER_TURN', () => {
      battle.start();
      battle.playerUseItem(5);
      expect(battle.getState()).toBe(BattleState.INTRO);
    });
  });

  describe('playerFlee', () => {
    it('success transitions to FLED', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      battle.start();
      battle.beginPlayerTurn();
      const result = battle.playerFlee();
      expect(result).toBe('success');
      expect(battle.getState()).toBe(BattleState.FLED);
      vi.restoreAllMocks();
    });

    it('failure transitions to ENEMY_TURN', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      battle.start();
      battle.beginPlayerTurn();
      const result = battle.playerFlee();
      expect(result).toBe('failed');
      expect(battle.getState()).toBe(BattleState.ENEMY_TURN);
      vi.restoreAllMocks();
    });

    it('is blocked for boss encounters', () => {
      const cb = makeCallbacks();
      const onFleeAttempt = vi.fn();
      cb.onFleeAttempt = onFleeAttempt;
      const boss = new BattleSystem(
        DEFAULT_PLAYER,
        ENEMIES.slime,
        cb,
        true
      );
      boss.start();
      boss.beginPlayerTurn();
      const result = boss.playerFlee();
      expect(result).toBe('blocked');
      expect(boss.getState()).toBe(BattleState.PLAYER_TURN);
      expect(onFleeAttempt).toHaveBeenCalledWith(false);
    });

    it('calls onBattleEnd with fled on success', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);
      battle.start();
      battle.beginPlayerTurn();
      battle.playerFlee();
      expect(callbacks.onBattleEnd).toHaveBeenCalledWith('fled');
      vi.restoreAllMocks();
    });

    it('is ignored when not PLAYER_TURN', () => {
      battle.start();
      const result = battle.playerFlee();
      expect(result).toBe('failed');
      expect(battle.getState()).toBe(BattleState.INTRO);
    });
  });
});
