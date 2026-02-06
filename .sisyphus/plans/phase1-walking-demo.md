# Phase 1: Walking Demo - Work Plan

## TL;DR

> **Quick Summary**: Scaffold a Phaser 3 + TypeScript + Vite project, create a test tilemap in Tiled, implement grid-locked Pokemon-style movement with collision detection and camera following.
> 
> **Deliverables**:
> - Working Phaser project with dev server
> - 20x20 tile test map with walls
> - Player sprite with 4-direction grid movement
> - Collision with walls/obstacles
> - Camera following player
> 
> **Estimated Effort**: Medium (~3-4 hours)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 3 → Task 5 → Task 6 → Task 7

---

## Context

### Original Request
Phase 1 of FantasyRPG - create a walking demo with Pokemon-style grid movement on a tilemap.

### Interview Summary
**Key Discussions**:
- Tech stack confirmed: Phaser 3 + TypeScript + Vite
- Grid movement pattern: Block input during movement, use `isMoving` flag
- Tile size: 16px (classic Pokemon feel)
- Map size: 20x20 tiles (small but room for camera movement)

**Research Findings**:
- Use official Phaser template: `npm create @phaserjs/game@latest`
- Tilemap collision: Set `collides: true` property in Tiled's **Tileset Editor** (not layer)
- Camera: Must use `pixelArt: true`, `roundPixels: true`, integer zoom
- Grid physics: Custom class with blocking pattern, NOT arcade physics

### Metis Review
**Identified Gaps** (addressed):
- Specific tile size and map dimensions locked: 16px tiles, 20x20 map
- Camera configuration trio documented: `pixelArt`, `roundPixels`, integer zoom
- Test map specification added: spawn at (2,2), wall at (5,5), open path for testing
- Tiled setup requirements explicit: properties in tileset editor, not layer

---

## Work Objectives

### Core Objective
Create a playable walking demo where a player sprite can move on a tile-based map using Pokemon-style grid movement (one tile at a time, smooth animation, no diagonal movement).

### Concrete Deliverables
1. `src/main.ts` - Phaser game entry point
2. `src/config.ts` - Game configuration with pixel-perfect settings
3. `src/scenes/BootScene.ts` - Asset loading scene
4. `src/scenes/WorldScene.ts` - Main gameplay scene
5. `src/entities/Player.ts` - Player sprite with animations
6. `src/systems/GridPhysics.ts` - Grid-based movement controller
7. `src/utils/Constants.ts` - Game constants (tile size, speeds)
8. `public/assets/maps/test-map.json` - Tiled tilemap export
9. `public/assets/maps/test-map.tsx` - Tileset with collision properties
10. `public/assets/sprites/player.png` - Placeholder player spritesheet

### Definition of Done
- [ ] `npm run dev` opens game window without console errors
- [ ] Player sprite visible at spawn position (2, 2)
- [ ] Arrow keys move player one tile per press with smooth animation
- [ ] Player cannot walk through tiles marked with `collides: true`
- [ ] Camera follows player, stays within map bounds
- [ ] Movement is grid-locked (no stopping mid-tile)

### Must Have
- Grid-locked movement (player snaps to tile grid)
- Input blocking during movement (no queuing moves)
- Collision detection with wall tiles
- Camera bounds matching map size
- Pixel-perfect rendering (no blurriness)

### Must NOT Have (Guardrails)
- ❌ Diagonal movement (Pokemon doesn't have it in early games)
- ❌ Arcade physics body on player (grid physics only)
- ❌ Move queuing/buffering (keep it simple)
- ❌ Animated tiles (Phase 1 scope)
- ❌ Multiple maps/rooms (single test map only)
- ❌ NPC or enemy entities (Phase 2+)
- ❌ Sound effects or music (Phase 5)
- ❌ UI overlays (Phase 2+)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: NO (game projects typically test via E2E)
- **Framework**: None for unit tests
- **Agent-Executed QA**: YES - Playwright for visual/interaction verification

### Agent-Executed QA Approach
Every task includes QA scenarios that the executing agent runs directly:
- **Build verification**: `npm run dev` starts without errors
- **Visual verification**: Playwright screenshots + DOM assertions
- **Interaction verification**: Playwright sends keyboard input, observes state changes
- **Console monitoring**: Check for errors during gameplay

### Evidence Collection
All verification evidence stored in: `.sisyphus/evidence/phase1-*`

---

## Locked Constants (From Metis Review)

| Constant | Value | Rationale |
|----------|-------|-----------|
| `TILE_SIZE` | 16 | Classic Pokemon feel |
| `MOVE_DURATION` | 200ms | 5 tiles/sec, smooth animation |
| `CANVAS_WIDTH` | 320 | 20 tiles visible horizontally |
| `CANVAS_HEIGHT` | 240 | 15 tiles visible vertically |
| `ZOOM` | 2 | Integer required for pixel-perfect |
| `MAP_WIDTH` | 20 | Tiles wide |
| `MAP_HEIGHT` | 20 | Tiles tall |
| `PLAYER_SPAWN_X` | 2 | Tile coordinate |
| `PLAYER_SPAWN_Y` | 2 | Tile coordinate |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - No Dependencies):
├── Task 1: Scaffold Phaser project
└── Task 2: Create tilemap and tileset in Tiled

Wave 2 (After Wave 1):
├── Task 3: Configure Phaser (config.ts, constants)
├── Task 4: Create placeholder player sprite
└── Task 5: Implement BootScene (asset loading)

Wave 3 (After Wave 2):
├── Task 6: Implement WorldScene (map rendering, player spawn)
└── Task 7: Implement Player entity with animations

Wave 4 (After Wave 3):
└── Task 8: Implement GridPhysics (movement + collision)

Wave 5 (After Wave 4):
└── Task 9: Wire camera following + final integration

Critical Path: Task 1 → Task 3 → Task 5 → Task 6 → Task 8 → Task 9
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 4, 5 | 2 |
| 2 | None | 5, 6 | 1 |
| 3 | 1 | 5, 6, 7, 8, 9 | 4 |
| 4 | 1 | 7 | 3 |
| 5 | 1, 2, 3 | 6, 7 | None |
| 6 | 2, 3, 5 | 7, 8, 9 | None |
| 7 | 4, 6 | 8 | None |
| 8 | 3, 6, 7 | 9 | None |
| 9 | 6, 8 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Estimated Time |
|------|-------|----------------|
| 1 | 1, 2 | 20-30 min (parallel) |
| 2 | 3, 4, 5 | 20-30 min (parallel) |
| 3 | 6, 7 | 25-35 min (parallel) |
| 4 | 8 | 30-45 min |
| 5 | 9 | 15-20 min |

---

## TODOs

### Task 1: Scaffold Phaser Project with Vite + TypeScript

**What to do**:
1. Run `npm create @phaserjs/game@latest fantasyrpg-temp` (use temp name, then move files)
2. Select Vite + TypeScript template
3. Move all files from temp to project root (preserve existing .planning/, docs/, .opencode/)
4. Update `tsconfig.json`: set `strictPropertyInitialization: false`
5. Run `npm install` to verify dependencies
6. Run `npm run dev` to verify dev server starts

**Must NOT do**:
- Do NOT delete existing `.planning/`, `docs/`, `.opencode/` directories
- Do NOT use React, Vue, or other framework templates
- Do NOT modify package name (keep as-is from template)

**Recommended Agent Profile**:
- **Category**: `quick` - Single scaffolding command, minimal logic
  - Reason: Template scaffolding is a straightforward task with clear steps
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Understands TypeScript project configuration

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: No UI design needed, just scaffolding
- `git-master`: No git operations in this task

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 2)
- **Blocks**: Tasks 3, 4, 5
- **Blocked By**: None

**References**:
- External: https://github.com/phaserjs/template-vite-ts - Official Phaser Vite template
- Existing: `.planning/ROADMAP.md:lines 257-261` - Next steps showing template command
- Existing: `.planning/TECH_STACK.md` - Confirmed tech stack decisions

**Acceptance Criteria**:

- [ ] `package.json` exists with Phaser 3.x as dependency
- [ ] `tsconfig.json` has `strictPropertyInitialization: false`
- [ ] `npm run dev` starts server on localhost (port 5173 or 8080)
- [ ] Browser shows Phaser logo/demo scene (template default)
- [ ] No console errors in browser DevTools

**Agent-Executed QA Scenarios**:

```
Scenario: Project scaffolds and dev server starts
  Tool: Bash
  Preconditions: Node.js 18+ installed
  Steps:
    1. cd /Users/travistincher/Desktop/Projects/FantasyRPG
    2. ls package.json → Assert file exists
    3. grep "phaser" package.json → Assert "phaser" appears in dependencies
    4. grep "strictPropertyInitialization" tsconfig.json → Assert "false" in output
    5. npm run dev & (background)
    6. sleep 5
    7. curl -s http://localhost:5173 OR curl -s http://localhost:8080 → Assert HTTP 200
    8. kill background process
  Expected Result: Dev server responds with HTML
  Evidence: Console output captured

Scenario: Existing project files preserved
  Tool: Bash
  Preconditions: Project scaffolded
  Steps:
    1. ls -la .planning/ → Assert directory exists
    2. ls -la docs/ → Assert directory exists
    3. ls .planning/ROADMAP.md → Assert file exists
  Expected Result: Planning docs still present
  Evidence: Directory listing captured
```

**Commit**: YES
- Message: `feat(scaffold): initialize Phaser project with Vite + TypeScript`
- Files: `package.json`, `tsconfig.json`, `vite.config.ts`, `src/`, `index.html`
- Pre-commit: `npm run dev` starts without error

---

### Task 2: Create Test Tilemap and Tileset in Tiled

**What to do**:
1. Create directory: `public/assets/maps/`
2. Create tileset image: 4x4 tiles (16px each = 64x64 image) with floor and wall tiles
   - Tile 0: Floor (walkable)
   - Tile 1: Wall (solid, different color)
3. Create Tiled tileset (.tsx): Import image, set tile size 16x16
4. In Tileset Editor: Select wall tile, add Custom Property `collides` (boolean) = `true`
5. Create tilemap (.tmx): 20x20 tiles, two layers:
   - `ground` layer: Fill with floor tiles
   - `walls` layer: Place wall tiles around perimeter + wall at tile (5,5)
6. Export tilemap as JSON: `test-map.json`
7. Ensure tileset image is at: `public/assets/maps/tiles.png`

**Must NOT do**:
- Do NOT embed tileset in JSON (keep separate)
- Do NOT use terrain editor (just place tiles manually)
- Do NOT add animated tiles
- Do NOT create multiple layers beyond ground/walls

**Recommended Agent Profile**:
- **Category**: `quick` - Simple asset creation, no complex logic
  - Reason: Creating placeholder tileset and map is straightforward
- **Skills**: []
  - Reason: Tiled operations are file-based, no specialized code skills needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not creating UI, just map data
- `typescript-programmer`: Not writing TypeScript

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 1)
- **Blocks**: Tasks 5, 6
- **Blocked By**: None

**References**:
- External: https://doc.mapeditor.org/en/stable/manual/introduction/ - Tiled documentation
- Research: User's research findings on tilemap workflow
- Metis: Test map specification - spawn (2,2), wall at (5,5), perimeter walls

**Test Map Specification**:
```
Size: 20x20 tiles (16px each = 320x320 pixels)
Layers:
  - ground (below player): All floor tiles
  - walls (same level): Perimeter + obstacle at (5,5)

Visual layout (X = wall, . = floor):
XXXXXXXXXXXXXXXXXXXX
X..................X
X..................X
X..................X
X..................X
X....X.............X
X..................X
...
XXXXXXXXXXXXXXXXXXXX

Player spawn: (2, 2) - Marked in Object Layer as point
Wall test tile: (5, 5) - For collision testing
Open path: (2,2) to (10,2) - For movement testing
```

**Acceptance Criteria**:

- [ ] `public/assets/maps/tiles.png` exists (tileset image)
- [ ] `public/assets/maps/test-map.json` exists (tilemap data)
- [ ] JSON contains two layers: "ground" and "walls"
- [ ] Tileset has `collides` property on wall tiles

**Agent-Executed QA Scenarios**:

```
Scenario: Tilemap files exist with correct structure
  Tool: Bash
  Preconditions: Tiled export completed
  Steps:
    1. ls public/assets/maps/tiles.png → Assert file exists
    2. ls public/assets/maps/test-map.json → Assert file exists
    3. cat public/assets/maps/test-map.json | grep -c "layers" → Assert count > 0
    4. cat public/assets/maps/test-map.json | grep "ground" → Assert layer name found
    5. cat public/assets/maps/test-map.json | grep "walls" → Assert layer name found
  Expected Result: Both files exist, JSON has expected layers
  Evidence: File contents captured

Scenario: Tileset has collision property
  Tool: Bash
  Preconditions: Tilemap exported
  Steps:
    1. cat public/assets/maps/test-map.json | grep "collides" → Assert property exists
  Expected Result: collides property found in tileset definition
  Evidence: JSON excerpt captured
```

**Commit**: YES
- Message: `feat(assets): add test tilemap and tileset`
- Files: `public/assets/maps/*`
- Pre-commit: Files exist and are valid JSON

---

### Task 3: Configure Phaser with Pixel-Perfect Settings

**What to do**:
1. Create `src/utils/Constants.ts`:
```typescript
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
```

2. Create/update `src/config.ts`:
```typescript
import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, ZOOM } from './utils/Constants';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  pixelArt: true,        // CRITICAL: Disable texture smoothing
  roundPixels: true,     // CRITICAL: Round pixel positions
  zoom: ZOOM,            // CRITICAL: Integer zoom only
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scene: [BootScene, WorldScene],
};
```

3. Update `src/main.ts` to use config:
```typescript
import Phaser from 'phaser';
import { config } from './config';

const game = new Phaser.Game(config);

// Expose for Playwright testing
(window as any).game = game;
```

**Must NOT do**:
- Do NOT use non-integer zoom values (1.5, 2.5 break pixel-perfect)
- Do NOT omit `pixelArt: true`
- Do NOT omit `roundPixels: true`

**Recommended Agent Profile**:
- **Category**: `quick` - Configuration files with clear specifications
  - Reason: Values are locked, just needs correct TypeScript syntax
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Proper typing for Phaser config

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: No UI design, just config

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Tasks 4, 5)
- **Blocks**: Tasks 5, 6, 7, 8, 9
- **Blocked By**: Task 1

**References**:
- Metis: Locked constants table with exact values
- External: https://docs.phaser.io/phaser/concepts/config - Phaser config docs
- Research: Camera configuration trio from user research

**Acceptance Criteria**:

- [ ] `src/utils/Constants.ts` exports all locked constants
- [ ] `src/config.ts` has `pixelArt: true`, `roundPixels: true`, `zoom: 2`
- [ ] `src/main.ts` creates Phaser.Game with config
- [ ] `window.game` exposed for testing
- [ ] TypeScript compiles without errors

**Agent-Executed QA Scenarios**:

```
Scenario: Constants file exports correct values
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. grep "TILE_SIZE = 16" src/utils/Constants.ts → Assert found
    2. grep "MOVE_DURATION = 200" src/utils/Constants.ts → Assert found
    3. grep "ZOOM = 2" src/utils/Constants.ts → Assert found
    4. grep "Direction" src/utils/Constants.ts → Assert enum exists
  Expected Result: All constants have correct values
  Evidence: File content captured

Scenario: Config has pixel-perfect settings
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. grep "pixelArt: true" src/config.ts → Assert found
    2. grep "roundPixels: true" src/config.ts → Assert found
    3. grep "zoom: ZOOM" src/config.ts OR grep "zoom: 2" src/config.ts → Assert found
  Expected Result: All three pixel-perfect settings present
  Evidence: Config file captured
```

**Commit**: NO (groups with Task 5)

---

### Task 4: Create Placeholder Player Spritesheet

**What to do**:
1. Create directory: `public/assets/sprites/`
2. Create simple placeholder spritesheet `player.png`:
   - 4 rows (directions: down, left, right, up)
   - 4 columns (animation frames)
   - Frame size: 16x16 pixels
   - Total image: 64x64 pixels
3. Use simple colored rectangle with direction indicator (arrow or different shades)
4. Or download from OpenGameArt if simpler (link provided in references)

**Spritesheet Layout**:
```
| Frame 0 | Frame 1 | Frame 2 | Frame 3 |  ← Row 0: Walk Down
| Frame 0 | Frame 1 | Frame 2 | Frame 3 |  ← Row 1: Walk Left
| Frame 0 | Frame 1 | Frame 2 | Frame 3 |  ← Row 2: Walk Right
| Frame 0 | Frame 1 | Frame 2 | Frame 3 |  ← Row 3: Walk Up
```

**Must NOT do**:
- Do NOT use sprites larger than 16x16
- Do NOT create more than 4 frames per direction
- Do NOT use transparency unless simple (RGBA PNG)

**Recommended Agent Profile**:
- **Category**: `quick` - Simple asset creation
  - Reason: Can be done with ImageMagick or simple drawing
- **Skills**: []
  - Reason: Asset creation, not code

**Skills Evaluated but Omitted**:
- All code skills: Not applicable to image creation

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Tasks 3, 5)
- **Blocks**: Task 7
- **Blocked By**: Task 1

**References**:
- External: https://opengameart.org/content/simple-rpg-characters - Free placeholder sprites
- External: https://itch.io/game-assets/free/tag-rpg - More free assets
- Metis: Frame size must be 16x16 to match TILE_SIZE

**Acceptance Criteria**:

- [ ] `public/assets/sprites/player.png` exists
- [ ] Image dimensions are 64x64 pixels (4x4 frames at 16x16 each)
- [ ] Image is valid PNG

**Agent-Executed QA Scenarios**:

```
Scenario: Player sprite exists with correct dimensions
  Tool: Bash
  Preconditions: Task 4 complete
  Steps:
    1. ls public/assets/sprites/player.png → Assert file exists
    2. file public/assets/sprites/player.png → Assert "PNG image" in output
    3. identify public/assets/sprites/player.png → Assert "64x64" in output (if ImageMagick installed)
       OR: Use node script to check dimensions
  Expected Result: PNG file with 64x64 dimensions
  Evidence: File info captured
```

**Commit**: NO (groups with Task 5)

---

### Task 5: Implement BootScene (Asset Loading)

**What to do**:
1. Create `src/scenes/BootScene.ts`:
```typescript
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Tilemap
    this.load.tilemapTiledJSON('test-map', 'assets/maps/test-map.json');
    this.load.image('tiles', 'assets/maps/tiles.png');

    // Player
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Loading progress (optional but nice)
    this.load.on('complete', () => {
      this.scene.start('WorldScene');
    });
  }

  create(): void {
    // Transition to WorldScene happens in load complete callback
  }
}
```

**Must NOT do**:
- Do NOT load assets in WorldScene (all loading in BootScene)
- Do NOT use relative paths starting with `./` (use `assets/...`)
- Do NOT forget `frameWidth` and `frameHeight` for spritesheet

**Recommended Agent Profile**:
- **Category**: `unspecified-low` - Standard Phaser scene implementation
  - Reason: Follows documented Phaser patterns, moderate effort
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Proper Phaser typing and imports

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not a UI component

**Parallelization**:
- **Can Run In Parallel**: NO (needs Tasks 2, 3, 4 outputs)
- **Parallel Group**: Wave 2 (sequential after dependencies)
- **Blocks**: Tasks 6, 7
- **Blocked By**: Tasks 1, 2, 3

**References**:
- Research: Tilemap loading pattern from user research
- External: https://docs.phaser.io/phaser/concepts/scenes/scene-lifecycle - Scene lifecycle
- Existing: `src/config.ts` - Scene registration

**Acceptance Criteria**:

- [ ] `src/scenes/BootScene.ts` exports BootScene class
- [ ] Loads tilemap JSON with key 'test-map'
- [ ] Loads tileset image with key 'tiles'
- [ ] Loads player spritesheet with key 'player'
- [ ] Transitions to WorldScene after load complete
- [ ] No console errors during asset loading

**Agent-Executed QA Scenarios**:

```
Scenario: BootScene loads all assets without errors
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, all assets in place
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3 seconds (allow asset loading)
    3. Execute in console: window.game.scene.isActive('WorldScene')
    4. Assert: Returns true (WorldScene is now active)
    5. Execute in console: window.game.textures.exists('player')
    6. Assert: Returns true
    7. Execute in console: window.game.textures.exists('tiles')
    8. Assert: Returns true
    9. Check console: No errors containing "Failed to load"
    10. Screenshot: .sisyphus/evidence/phase1-bootscene-loaded.png
  Expected Result: All assets loaded, WorldScene active
  Evidence: .sisyphus/evidence/phase1-bootscene-loaded.png
```

**Commit**: YES
- Message: `feat(scenes): add BootScene for asset loading and game config`
- Files: `src/scenes/BootScene.ts`, `src/config.ts`, `src/utils/Constants.ts`, `src/main.ts`
- Pre-commit: `npm run build` succeeds

---

### Task 6: Implement WorldScene (Map Rendering + Player Spawn)

**What to do**:
1. Create `src/scenes/WorldScene.ts`:
```typescript
import Phaser from 'phaser';
import { TILE_SIZE, PLAYER_SPAWN_X, PLAYER_SPAWN_Y } from '../utils/Constants';

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'WorldScene' });
  }

  create(): void {
    // Create tilemap
    const map = this.make.tilemap({ key: 'test-map' });
    const tileset = map.addTilesetImage('tiles', 'tiles'); // First arg must match Tiled tileset name

    // Create layers
    const groundLayer = map.createLayer('ground', tileset!, 0, 0);
    this.wallsLayer = map.createLayer('walls', tileset!, 0, 0)!;

    // Set collision on walls layer
    this.wallsLayer.setCollisionByProperty({ collides: true });

    // Create player at spawn position (pixel coordinates)
    const spawnX = PLAYER_SPAWN_X * TILE_SIZE + TILE_SIZE / 2;
    const spawnY = PLAYER_SPAWN_Y * TILE_SIZE + TILE_SIZE / 2;
    this.player = this.add.sprite(spawnX, spawnY, 'player', 0);

    // Setup keyboard input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Camera follows player (will be enhanced in Task 9)
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time: number, delta: number): void {
    // Movement will be handled by GridPhysics in Task 8
  }

  // Expose for GridPhysics
  getPlayer(): Phaser.GameObjects.Sprite {
    return this.player;
  }

  getWallsLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.wallsLayer;
  }

  getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
    return this.cursors;
  }
}
```

**Must NOT do**:
- Do NOT add physics body to player (GridPhysics handles movement)
- Do NOT implement movement here (Task 8)
- Do NOT hardcode tileset name (must match Tiled export)

**Recommended Agent Profile**:
- **Category**: `unspecified-low` - Standard scene setup with tilemap
  - Reason: Well-documented Phaser patterns, moderate complexity
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Phaser types and nullable handling

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, game scene logic

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 7)
- **Blocks**: Tasks 7, 8, 9
- **Blocked By**: Tasks 2, 3, 5

**References**:
- Research: Tilemap creation pattern from user research
- Research: `addTilesetImage` name must match Tiled export
- Metis: Spawn coordinates PLAYER_SPAWN_X, PLAYER_SPAWN_Y

**Acceptance Criteria**:

- [ ] `src/scenes/WorldScene.ts` exports WorldScene class
- [ ] Tilemap renders with ground and walls visible
- [ ] Player sprite visible at spawn position (tile 2,2)
- [ ] Walls layer has collision property set
- [ ] Camera is following player
- [ ] No console errors

**Agent-Executed QA Scenarios**:

```
Scenario: Tilemap renders and player visible
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Execute in console: window.game.scene.getScene('WorldScene').getPlayer()
    4. Assert: Returns object (player exists)
    5. Execute in console: window.game.scene.getScene('WorldScene').getPlayer().x
    6. Assert: Value approximately equals 40 (2 * 16 + 8)
    7. Screenshot: .sisyphus/evidence/phase1-worldscene-initial.png
  Expected Result: Player sprite visible on tilemap at spawn
  Evidence: .sisyphus/evidence/phase1-worldscene-initial.png

Scenario: Walls layer has collision enabled
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console: 
       const scene = window.game.scene.getScene('WorldScene');
       const wallsLayer = scene.getWallsLayer();
       const wallTile = wallsLayer.getTileAt(5, 5);
       wallTile && wallTile.properties && wallTile.properties.collides;
    4. Assert: Returns true
  Expected Result: Wall tile at (5,5) has collides property
  Evidence: Console output captured
```

**Commit**: NO (groups with Task 7)

---

### Task 7: Implement Player Entity with Animations

**What to do**:
1. Create `src/entities/Player.ts`:
```typescript
import Phaser from 'phaser';
import { Direction } from '../utils/Constants';

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);
    scene.add.existing(this);

    this.createAnimations();
  }

  private createAnimations(): void {
    // Walk down (row 0)
    this.scene.anims.create({
      key: 'walk-down',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    // Walk left (row 1)
    this.scene.anims.create({
      key: 'walk-left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    // Walk right (row 2)
    this.scene.anims.create({
      key: 'walk-right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    // Walk up (row 3)
    this.scene.anims.create({
      key: 'walk-up',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Idle frames (first frame of each direction)
    this.scene.anims.create({
      key: 'idle-down',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 1,
    });
    this.scene.anims.create({
      key: 'idle-left',
      frames: [{ key: 'player', frame: 4 }],
      frameRate: 1,
    });
    this.scene.anims.create({
      key: 'idle-right',
      frames: [{ key: 'player', frame: 8 }],
      frameRate: 1,
    });
    this.scene.anims.create({
      key: 'idle-up',
      frames: [{ key: 'player', frame: 12 }],
      frameRate: 1,
    });
  }

  playWalkAnimation(direction: Direction): void {
    if (direction === Direction.NONE) return;
    this.anims.play(`walk-${direction}`, true);
  }

  stopAnimation(direction: Direction): void {
    if (direction === Direction.NONE) return;
    this.anims.play(`idle-${direction}`, true);
  }
}
```

2. Update `WorldScene.ts` to use Player class instead of plain sprite

**Must NOT do**:
- Do NOT add physics body (GridPhysics handles movement)
- Do NOT add movement logic (that's Task 8)
- Do NOT create animations in WorldScene (encapsulate in Player)

**Recommended Agent Profile**:
- **Category**: `unspecified-low` - Entity class with animation logic
  - Reason: Standard Phaser patterns, moderate complexity
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Class inheritance, Phaser types

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Game entity, not UI

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 6)
- **Blocks**: Task 8
- **Blocked By**: Tasks 4, 6

**References**:
- Research: Player spritesheet layout (4 rows x 4 columns)
- Existing: `src/utils/Constants.ts` - Direction enum

**Acceptance Criteria**:

- [ ] `src/entities/Player.ts` exports Player class extending Phaser.GameObjects.Sprite
- [ ] 8 animations created: walk-{direction} and idle-{direction}
- [ ] `playWalkAnimation` and `stopAnimation` methods work
- [ ] WorldScene uses Player class instead of raw sprite
- [ ] Animations play without errors

**Agent-Executed QA Scenarios**:

```
Scenario: Player animations exist and can be played
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console:
       const scene = window.game.scene.getScene('WorldScene');
       const anims = scene.anims;
       ['walk-up', 'walk-down', 'walk-left', 'walk-right'].every(key => anims.exists(key));
    4. Assert: Returns true (all walk animations exist)
    5. Execute in console:
       ['idle-up', 'idle-down', 'idle-left', 'idle-right'].every(key => anims.exists(key));
    6. Assert: Returns true (all idle animations exist)
  Expected Result: All 8 animations registered
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(world): implement WorldScene with tilemap and Player entity`
- Files: `src/scenes/WorldScene.ts`, `src/entities/Player.ts`
- Pre-commit: `npm run build` succeeds

---

### Task 8: Implement GridPhysics (Movement + Collision)

**What to do**:
1. Create `src/systems/GridPhysics.ts`:
```typescript
import Phaser from 'phaser';
import { Direction, TILE_SIZE, MOVE_DURATION } from '../utils/Constants';
import { Player } from '../entities/Player';

export class GridPhysics {
  private isMoving = false;
  private movementDirection = Direction.NONE;
  private lastDirection = Direction.DOWN;

  constructor(
    private player: Player,
    private wallsLayer: Phaser.Tilemaps.TilemapLayer,
    private scene: Phaser.Scene
  ) {}

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (this.isMoving) return; // Block input during movement

    // Check for new input
    if (cursors.up.isDown) {
      this.movePlayer(Direction.UP);
    } else if (cursors.down.isDown) {
      this.movePlayer(Direction.DOWN);
    } else if (cursors.left.isDown) {
      this.movePlayer(Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.movePlayer(Direction.RIGHT);
    }
  }

  private movePlayer(direction: Direction): void {
    if (this.isBlocked(direction)) {
      this.player.stopAnimation(direction);
      this.lastDirection = direction;
      return;
    }

    this.isMoving = true;
    this.movementDirection = direction;
    this.lastDirection = direction;

    const { x: targetX, y: targetY } = this.getTargetPosition(direction);

    this.player.playWalkAnimation(direction);

    this.scene.tweens.add({
      targets: this.player,
      x: targetX,
      y: targetY,
      duration: MOVE_DURATION,
      ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.movementDirection = Direction.NONE;
        this.player.stopAnimation(direction);
      },
    });
  }

  private getTargetPosition(direction: Direction): { x: number; y: number } {
    const currentX = this.player.x;
    const currentY = this.player.y;

    switch (direction) {
      case Direction.UP:
        return { x: currentX, y: currentY - TILE_SIZE };
      case Direction.DOWN:
        return { x: currentX, y: currentY + TILE_SIZE };
      case Direction.LEFT:
        return { x: currentX - TILE_SIZE, y: currentY };
      case Direction.RIGHT:
        return { x: currentX + TILE_SIZE, y: currentY };
      default:
        return { x: currentX, y: currentY };
    }
  }

  private isBlocked(direction: Direction): boolean {
    const { x: targetX, y: targetY } = this.getTargetPosition(direction);

    // Convert pixel to tile coordinates
    const tileX = Math.floor(targetX / TILE_SIZE);
    const tileY = Math.floor(targetY / TILE_SIZE);

    // Check if tile exists and has collision
    const tile = this.wallsLayer.getTileAt(tileX, tileY);
    return tile !== null && tile.properties?.collides === true;
  }

  getIsMoving(): boolean {
    return this.isMoving;
  }

  getLastDirection(): Direction {
    return this.lastDirection;
  }
}
```

2. Update `WorldScene.ts` to instantiate and use GridPhysics in update()

**Must NOT do**:
- Do NOT use Arcade Physics (pure tween-based movement)
- Do NOT allow diagonal movement
- Do NOT queue or buffer inputs

**Recommended Agent Profile**:
- **Category**: `ultrabrain` - Complex state machine with collision detection
  - Reason: Core game logic requiring precise timing and collision handling
- **Skills**: [`typescript-programmer`]
  - `typescript-programmer`: Complex class interaction, game loop logic

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, game system

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 4 (solo)
- **Blocks**: Task 9
- **Blocked By**: Tasks 3, 6, 7

**References**:
- Research: GridPhysics pattern from user research (critical `isMoving` pattern)
- Metis: MOVE_DURATION = 200ms, TILE_SIZE = 16
- Research: "Block new movement while moving" requirement

**Acceptance Criteria**:

- [ ] `src/systems/GridPhysics.ts` exports GridPhysics class
- [ ] Movement blocked during animation (`isMoving` flag)
- [ ] `isBlocked` correctly checks tile collision property
- [ ] Player moves exactly one tile per key press
- [ ] Movement is smooth tween, not instant teleport
- [ ] Player cannot walk through walls

**Agent-Executed QA Scenarios**:

```
Scenario: Arrow key moves player one tile right
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, player at spawn (2,2)
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Execute in console: 
       const scene = window.game.scene.getScene('WorldScene');
       const startX = scene.getPlayer().x;
       console.log('Start X:', startX);
    4. Press: ArrowRight key
    5. Wait for: 300ms (allow movement to complete)
    6. Execute in console:
       const scene = window.game.scene.getScene('WorldScene');
       const endX = scene.getPlayer().x;
       console.log('End X:', endX);
       endX - 40; // startX was approximately 40, should be 56 (40 + 16)
    7. Assert: Movement delta is approximately 16 (one tile)
    8. Screenshot: .sisyphus/evidence/phase1-move-right.png
  Expected Result: Player moved exactly one tile right
  Evidence: .sisyphus/evidence/phase1-move-right.png

Scenario: Player cannot walk through wall at (5,5)
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, player can reach near wall
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Move player to tile (4, 5) by pressing: Right x2, Down x3
    4. Wait for: each move (300ms between keys)
    5. Execute in console:
       const scene = window.game.scene.getScene('WorldScene');
       const beforeX = scene.getPlayer().x;
    6. Press: ArrowRight key (attempt to walk into wall at 5,5)
    7. Wait for: 300ms
    8. Execute in console:
       const scene = window.game.scene.getScene('WorldScene');
       const afterX = scene.getPlayer().x;
       beforeX === afterX; // Should not have moved
    9. Assert: Returns true (position unchanged)
    10. Screenshot: .sisyphus/evidence/phase1-wall-collision.png
  Expected Result: Player blocked by wall, did not move
  Evidence: .sisyphus/evidence/phase1-wall-collision.png

Scenario: Movement is blocked during animation (no queuing)
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Press and hold: ArrowRight for 500ms (should trigger only 2-3 moves)
    4. Release key
    5. Wait for: 500ms (let all movement complete)
    6. Execute in console:
       const scene = window.game.scene.getScene('WorldScene');
       scene.getPlayer().x;
    7. Assert: X position is less than 120 (not more than 5 tiles moved)
  Expected Result: Limited movement, no rapid queuing
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(physics): implement GridPhysics with collision detection`
- Files: `src/systems/GridPhysics.ts`, `src/scenes/WorldScene.ts` (update)
- Pre-commit: `npm run build` succeeds

---

### Task 9: Wire Camera Following + Final Integration

**What to do**:
1. Ensure camera setup in WorldScene is complete:
```typescript
// In WorldScene.create(), after player creation:
this.cameras.main.startFollow(this.player, true, 1, 1);
this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
this.cameras.main.setDeadzone(0, 0); // No deadzone, immediate follow
```

2. Run full integration test:
   - Verify all 5 success criteria work together
   - Walk around entire map perimeter
   - Test collision at multiple wall tiles
   - Verify camera stays within bounds

3. Clean up any console warnings/errors

4. Update README.md with run instructions (optional, nice-to-have)

**Must NOT do**:
- Do NOT add smooth camera lerp (keep instant follow for Pokemon feel)
- Do NOT add camera shake or effects

**Recommended Agent Profile**:
- **Category**: `quick` - Integration and verification
  - Reason: Wiring existing components, running tests
- **Skills**: [`typescript-programmer`, `playwright`]
  - `typescript-programmer`: Any code adjustments
  - `playwright`: Running verification scenarios

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI work

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 5 (final)
- **Blocks**: None (final task)
- **Blocked By**: Tasks 6, 8

**References**:
- Research: Camera setup pattern from user research
- Metis: Camera bounds must match map dimensions

**Acceptance Criteria**:

- [ ] Camera follows player smoothly
- [ ] Camera stays within map bounds
- [ ] All 5 success criteria pass (see below)
- [ ] No console errors during gameplay
- [ ] Can walk around entire map without issues

**Agent-Executed QA Scenarios**:

```
Scenario: Full integration - all success criteria
  Tool: Playwright (playwright skill)
  Preconditions: All previous tasks complete
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Check console: No errors present → Assert true (Criterion 1)
    4. Screenshot: .sisyphus/evidence/phase1-initial-state.png
    5. Assert: Player sprite visible in screenshot (Criterion 2)
    6. Press: ArrowUp, wait 300ms
    7. Press: ArrowDown, wait 300ms
    8. Press: ArrowLeft, wait 300ms
    9. Press: ArrowRight, wait 300ms
    10. Assert: Player moved and returned to near-spawn (Criterion 3)
    11. Walk player toward wall: ArrowRight x5
    12. Execute console: window.game.scene.getScene('WorldScene').getPlayer().x
    13. Assert: X < 120 (blocked by perimeter or internal wall) (Criterion 4)
    14. Walk player to map edge: ArrowDown x15
    15. Execute console: 
        const cam = window.game.cameras.main;
        cam.scrollX >= 0 && cam.scrollY >= 0;
    16. Assert: Camera bounds respected (Criterion 5)
    17. Screenshot: .sisyphus/evidence/phase1-final-integration.png
  Expected Result: All 5 success criteria verified
  Evidence: .sisyphus/evidence/phase1-final-integration.png

Scenario: Camera follows player during movement
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute console:
       const cam = window.game.cameras.main;
       const initialScroll = { x: cam.scrollX, y: cam.scrollY };
    4. Move player: ArrowDown x10 (move toward bottom of map)
    5. Wait for: 3 seconds
    6. Execute console:
       const cam = window.game.cameras.main;
       const newScroll = { x: cam.scrollX, y: cam.scrollY };
       newScroll.y > 0; // Camera should have scrolled down
    7. Assert: Returns true (camera followed player)
  Expected Result: Camera scroll position changed with player movement
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(camera): wire camera following and complete Phase 1 integration`
- Files: `src/scenes/WorldScene.ts` (if any updates)
- Pre-commit: Full integration test passes

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(scaffold): initialize Phaser project with Vite + TypeScript` | package.json, tsconfig.json, vite.config.ts, src/, index.html | npm run dev |
| 2 | `feat(assets): add test tilemap and tileset` | public/assets/maps/* | Files exist, valid JSON |
| 5 | `feat(scenes): add BootScene for asset loading and game config` | src/scenes/BootScene.ts, src/config.ts, src/utils/Constants.ts, src/main.ts | npm run build |
| 7 | `feat(world): implement WorldScene with tilemap and Player entity` | src/scenes/WorldScene.ts, src/entities/Player.ts | npm run build |
| 8 | `feat(physics): implement GridPhysics with collision detection` | src/systems/GridPhysics.ts, src/scenes/WorldScene.ts | Manual movement test |
| 9 | `feat(camera): wire camera following and complete Phase 1 integration` | src/scenes/WorldScene.ts | Full integration test |

---

## Success Criteria

### Final Verification Commands
```bash
# Start dev server
npm run dev

# Build check (no TypeScript errors)
npm run build
```

### Final Checklist
- [ ] Game window opens without errors (`npm run dev`)
- [ ] Player sprite visible on tilemap at tile (2, 2)
- [ ] Arrow keys move player in 4 directions (one tile at a time, smooth animation)
- [ ] Player cannot walk through walls (test at perimeter and tile 5,5)
- [ ] Camera follows player movement
- [ ] Camera stays within map bounds
- [ ] No console errors during gameplay
- [ ] Movement is grid-locked (no stopping mid-tile)

---

## TODO List (ADD THESE)

> CALLER: Add these TODOs using TodoWrite/TaskCreate and execute by wave.

### Wave 1 (Start Immediately - No Dependencies)

- [ ] **1. Scaffold Phaser Project**
  - What: Run `npm create @phaserjs/game@latest`, configure tsconfig, preserve existing files
  - Depends: None
  - Blocks: 3, 4, 5
  - Category: `quick`
  - Skills: [`typescript-programmer`]
  - QA: `npm run dev` starts server, package.json has phaser dependency

- [ ] **2. Create Test Tilemap and Tileset**
  - What: Create 20x20 tilemap in Tiled with ground/walls layers, set collides property
  - Depends: None
  - Blocks: 5, 6
  - Category: `quick`
  - Skills: []
  - QA: `public/assets/maps/test-map.json` exists with correct layers

### Wave 2 (After Wave 1 Completes)

- [ ] **3. Configure Phaser with Pixel-Perfect Settings**
  - What: Create Constants.ts, config.ts with pixelArt/roundPixels/zoom settings
  - Depends: 1
  - Blocks: 5, 6, 7, 8, 9
  - Category: `quick`
  - Skills: [`typescript-programmer`]
  - QA: grep for `pixelArt: true` in config.ts

- [ ] **4. Create Placeholder Player Spritesheet**
  - What: Create 64x64 PNG with 4x4 frames (16x16 each) for player animations
  - Depends: 1
  - Blocks: 7
  - Category: `quick`
  - Skills: []
  - QA: `public/assets/sprites/player.png` exists, 64x64 dimensions

- [ ] **5. Implement BootScene**
  - What: Create BootScene.ts that loads tilemap, tileset, and player spritesheet
  - Depends: 1, 2, 3
  - Blocks: 6, 7
  - Category: `unspecified-low`
  - Skills: [`typescript-programmer`]
  - QA: Playwright - WorldScene becomes active after load

### Wave 3 (After Wave 2 Completes)

- [ ] **6. Implement WorldScene**
  - What: Create WorldScene.ts with tilemap rendering and player spawn
  - Depends: 2, 3, 5
  - Blocks: 7, 8, 9
  - Category: `unspecified-low`
  - Skills: [`typescript-programmer`]
  - QA: Playwright - player sprite visible at spawn position

- [ ] **7. Implement Player Entity**
  - What: Create Player.ts with 8 animations (walk/idle for 4 directions)
  - Depends: 4, 6
  - Blocks: 8
  - Category: `unspecified-low`
  - Skills: [`typescript-programmer`]
  - QA: Playwright - all 8 animations exist in scene.anims

### Wave 4 (After Wave 3 Completes)

- [ ] **8. Implement GridPhysics**
  - What: Create GridPhysics.ts with isMoving blocking, collision detection
  - Depends: 3, 6, 7
  - Blocks: 9
  - Category: `ultrabrain`
  - Skills: [`typescript-programmer`]
  - QA: Playwright - arrow key moves player one tile, wall blocks movement

### Wave 5 (After Wave 4 Completes)

- [ ] **9. Camera Following + Final Integration**
  - What: Wire camera following with bounds, run full integration test
  - Depends: 6, 8
  - Blocks: None
  - Category: `quick`
  - Skills: [`typescript-programmer`, `playwright`]
  - QA: Playwright - all 5 success criteria pass

## Execution Instructions

1. **Wave 1**: Fire these tasks IN PARALLEL (no dependencies)
   ```
   delegate_task(category="quick", load_skills=["typescript-programmer"], run_in_background=false, prompt="Task 1: Scaffold Phaser project...")
   delegate_task(category="quick", load_skills=[], run_in_background=false, prompt="Task 2: Create tilemap...")
   ```

2. **Wave 2**: After Wave 1 completes, fire next wave (3, 4, 5 in parallel)
   ```
   delegate_task(category="quick", load_skills=["typescript-programmer"], prompt="Task 3: Configure Phaser...")
   delegate_task(category="quick", load_skills=[], prompt="Task 4: Create player sprite...")
   delegate_task(category="unspecified-low", load_skills=["typescript-programmer"], prompt="Task 5: Implement BootScene...")
   ```

3. **Wave 3**: After Wave 2, fire Tasks 6 and 7 in parallel

4. **Wave 4**: After Wave 3, fire Task 8 (solo, complex)

5. **Wave 5**: After Wave 4, fire Task 9 (final integration)

6. **Final QA**: Verify all tasks pass their QA criteria
