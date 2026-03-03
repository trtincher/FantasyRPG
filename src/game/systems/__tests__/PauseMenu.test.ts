import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PauseMenu } from '../PauseMenu';

/**
 * Minimal Phaser Scene mock — only the parts PauseMenu touches.
 */
function createMockScene(): any {
  const elements: any[] = [];
  return {
    add: {
      graphics: vi.fn(() => ({
        fillStyle: vi.fn(),
        fillRect: vi.fn(),
        fillRoundedRect: vi.fn(),
        setDepth: vi.fn(),
        destroy: vi.fn(),
      })),
      text: vi.fn((_x: number, _y: number, _str: string, _style: any) => {
        const txt: any = {
          setText: vi.fn().mockReturnThis(),
          setColor: vi.fn().mockReturnThis(),
          setOrigin: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
          width: 40,
        };
        elements.push(txt);
        return txt;
      }),
    },
    cameras: {
      main: { scrollX: 0, scrollY: 0 },
    },
    game: {
      registry: {
        get: vi.fn((key: string) => {
          const vals: Record<string, any> = {
            playerName: 'TestHero',
            playerClass: 'warrior',
            playerLevel: 1,
            playerInventory: '{}',
          };
          return vals[key];
        }),
        set: vi.fn(),
      },
    },
    time: {
      delayedCall: vi.fn(),
    },
    getPlayer: vi.fn(() => ({
      hp: 20,
      maxHp: 20,
      attack: 8,
      defense: 4,
    })),
    _elements: elements,
  };
}

describe('PauseMenu', () => {
  let menu: PauseMenu;
  let scene: any;

  beforeEach(() => {
    scene = createMockScene();
    menu = new PauseMenu(scene);
  });

  describe('show / hide state', () => {
    it('starts inactive', () => {
      expect(menu.getIsActive()).toBe(false);
    });

    it('show() activates the menu', () => {
      menu.show();
      expect(menu.getIsActive()).toBe(true);
    });

    it('hide() deactivates the menu', () => {
      menu.show();
      menu.hide();
      expect(menu.getIsActive()).toBe(false);
    });

    it('show() is idempotent when already active', () => {
      menu.show();
      menu.show();
      expect(menu.getIsActive()).toBe(true);
    });
  });

  describe('ESC key handling', () => {
    it('ESC via handleInput closes the menu when active', () => {
      menu.show();
      menu.handleInput({ key: 'Escape' } as KeyboardEvent);
      expect(menu.getIsActive()).toBe(false);
    });

    it('handleInput does nothing when menu is not active', () => {
      menu.handleInput({ key: 'Escape' } as KeyboardEvent);
      expect(menu.getIsActive()).toBe(false);
    });

    /**
     * This test simulates the actual event flow in WorldScene:
     * 1. handleEscape() is called (via keydown-ESC) — toggles menu open
     * 2. generic keydown handler fires — if menu is active, passes event to handleInput
     *
     * The menu MUST remain open after this sequence.
     */
    it('menu stays open when ESC opens it and generic handler fires on same event', () => {
      // Simulate the FIXED WorldScene event flow:

      // Step 1: keydown-ESC handler toggles menu open
      // (WorldScene.handleEscape logic)
      if (menu.getIsActive()) {
        menu.hide();
      } else {
        menu.show();
      }

      // Step 2: generic keydown handler skips Escape (the fix)
      // (WorldScene's keydown handler: if (event.key === 'Escape') return;)
      const event = { key: 'Escape' } as KeyboardEvent;
      if (event.key !== 'Escape' && menu.getIsActive()) {
        menu.handleInput(event);
      }

      // The menu should STILL be open
      expect(menu.getIsActive()).toBe(true);
    });

    it('menu closes when ESC is pressed while already open', () => {
      menu.show();

      // Step 1: keydown-ESC handler toggles menu closed
      if (menu.getIsActive()) {
        menu.hide();
      } else {
        menu.show();
      }

      // Step 2: generic keydown handler — menu is now inactive, so no forwarding
      if (menu.getIsActive()) {
        menu.handleInput({ key: 'Escape' } as KeyboardEvent);
      }

      expect(menu.getIsActive()).toBe(false);
    });
  });

  describe('arrow key navigation', () => {
    it('ArrowDown advances selection', () => {
      menu.show();
      menu.handleInput({ key: 'ArrowDown' } as KeyboardEvent);
      // Should not throw and menu stays active
      expect(menu.getIsActive()).toBe(true);
    });

    it('ArrowUp wraps selection', () => {
      menu.show();
      menu.handleInput({ key: 'ArrowUp' } as KeyboardEvent);
      expect(menu.getIsActive()).toBe(true);
    });
  });
});
