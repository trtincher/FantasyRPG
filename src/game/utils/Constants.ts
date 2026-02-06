export const TILE_SIZE = 16;
export const MOVE_DURATION = 200;
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 240;
export const ZOOM = 2;
export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;
export const PLAYER_SPAWN_X = 2;
export const PLAYER_SPAWN_Y = 2;

export enum Direction {
  NONE = 'none',
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

// Battle constants
export const PLAYER_DEFAULT_HP = 20;
export const PLAYER_DEFAULT_ATTACK = 8;
export const PLAYER_DEFAULT_DEFENSE = 4;
export const MIN_DAMAGE = 1;
export const BATTLE_BG_COLOR = 0x2d1b4e;
export const HP_BAR_WIDTH = 120;
export const HP_BAR_HEIGHT = 10;

export enum BattleState {
  INTRO = 'intro',
  PLAYER_TURN = 'player_turn',
  ENEMY_TURN = 'enemy_turn',
  CHECK_END = 'check_end',
  VICTORY = 'victory',
  DEFEAT = 'defeat',
}
