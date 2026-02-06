# Phase 2: First Battle - Work Plan

## TL;DR

> **Quick Summary**: Add encounter zones to the world map, implement a turn-based battle scene with state machine, one enemy type (Slime), HP bar UI, and Attack-only combat. Player walks into encounter zone → battle triggers → defeat Slime → return to same world position.
> 
> **Deliverables**:
> - Encounter zone layer on existing tilemap
> - BattleScene with turn-based state machine (INTRO → PLAYER_TURN → ENEMY_TURN → CHECK_END → VICTORY/DEFEAT)
> - Battle UI: HP bars, enemy sprite, "Attack" menu with keyboard navigation
> - Player stats (HP, attack, defense) added to existing Player entity
> - One enemy type (Slime) with data-driven definition
> - Scene sleep/wake transitions preserving world state
> 
> **Estimated Effort**: Medium-Large (~4-6 hours)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Task 1 → Task 4 → Task 6 → Task 7 → Task 8

---

## Context

### Original Request
Phase 2 of FantasyRPG — implement the first battle encounter. Player walks into an encounter zone on the world map, transitions to a battle scene, fights a Slime enemy using Attack-only turn-based combat, and returns to the same world position after victory.

### Interview Summary
**Key Discussions**:
- V1: Attack-only action (Defend/Item/Flee deferred to Phase 5)
- Keyboard-only battle UI (arrow keys + Enter/Space, no mouse)
- Damage formula: `max(1, attacker.attack - defender.defense/2 + random(1,3))`
- Enemy data stored in TypeScript file for extensibility
- Player entity backward compatible (add stats without breaking movement)
- Scene transition pattern: sleep/wake to preserve world state

**Research Findings**:
- GridPhysics tween `onComplete` is the perfect hook for encounter detection
- Player.ts extends GameObjects.Sprite — stats can be added as properties with defaults
- Current tileset has only 2 tiles — needs expansion for encounter zone markers
- `scene.sleep()`/`scene.wake()` preserves scene state including sprite positions
- `tsconfig.json` has strict mode — all types must be explicit, no unused vars/imports

### Metis Review
**Identified Gaps** (addressed):
- Scene transition must use sleep/wake pattern, NOT start/stop (prevents position loss)
- Minimum damage clamped to 1 (prevents 0-damage turns)
- HP display clamped to 0 (prevents negative bar widths)
- Guard against double-battle trigger (check BattleScene not already active)
- Encounter zone must NOT overlap spawn position (2,2)
- Player defeat handling needed (Game Over → restart WorldScene at spawn)
- Concrete stat values locked (Player: 20/8/4, Slime: 12/5/2)
- Use `window.__PHASER_GAME__` for Playwright QA (not `window.game`)
- Use TypeScript for enemy data (not JSON — avoids bundler config issues)

---

## Work Objectives

### Core Objective
Implement the minimum viable battle system: encounter zone detection triggers a turn-based battle scene where the player can Attack a Slime enemy, see HP bars update, and return to their world position after victory.

### Concrete Deliverables
1. `src/game/utils/Constants.ts` — Extended with BattleState enum + battle constants
2. `src/game/data/enemies.ts` — Enemy data definitions (Slime)
3. `public/assets/maps/tiles.png` — Expanded tileset with encounter zone tile
4. `public/assets/maps/test-map.json` — Updated with encounters layer
5. `public/assets/sprites/slime.png` — Placeholder enemy spritesheet
6. `src/game/entities/Player.ts` — Extended with HP, attack, defense stats
7. `src/game/systems/GridPhysics.ts` — Extended with onMoveComplete callback for encounter detection
8. `src/game/scenes/Boot.ts` — Extended to load new assets
9. `src/game/scenes/WorldScene.ts` — Extended with encounter detection + scene sleep/wake
10. `src/game/scenes/BattleScene.ts` — New battle scene with UI and state machine
11. `src/game/systems/BattleSystem.ts` — Turn-based state machine
12. `src/game/main.ts` — BattleScene added to scene array

### Definition of Done
- [ ] Walking into encounter zone triggers BattleScene
- [ ] Battle UI shows player HP bar, enemy HP bar, enemy sprite, "Attack" option
- [ ] Pressing Enter/Space on "Attack" deals damage to enemy (HP bar decreases)
- [ ] Enemy attacks back on its turn (player HP bar decreases)
- [ ] Battle ends when enemy HP = 0 → victory message → return to world
- [ ] Player returns to same world position after battle (NOT spawn)
- [ ] Player can move normally after returning from battle
- [ ] `npm run build` succeeds with zero errors

### Must Have
- Turn-based state machine: INTRO → PLAYER_TURN → ENEMY_TURN → CHECK_END → loop/end
- HP bars using Phaser Graphics (tween width on damage)
- Keyboard-only input (arrow keys for menu, Enter/Space to confirm)
- Minimum damage of 1 per attack
- Player defeat handling (HP = 0 → "Game Over" text → restart at spawn)
- Encounter zone on tilemap that doesn't block movement
- Scene sleep/wake for world state preservation

### Must NOT Have (Guardrails)
- ❌ Multiple enemy types (Slime only — ONE enemy)
- ❌ Defend/Item/Flee menu options (Attack ONLY)
- ❌ XP gain, gold, or item drops after victory (Phase 3)
- ❌ Battle animations (no screen shake, flash, attack sprites)
- ❌ Screen transition effects (no fade, no battle swirl — instant switch)
- ❌ Sound effects or music (Phase 5)
- ❌ Status effects (no poison, sleep, etc.)
- ❌ Critical hits or type advantages
- ❌ Multiple stats beyond HP/attack/defense (no MP, speed, luck)
- ❌ Grayed-out placeholder menu items
- ❌ Mouse interaction in battle
- ❌ Elaborate enemy sprite art (simple placeholder)
- ❌ Multiple encounter zones (ONE zone for V1)
- ❌ Random encounter chance (guaranteed trigger for V1)
- ❌ Encounter zone at or near spawn (2,2)

---

## Locked Constants

| Constant | Value | Rationale |
|----------|-------|-----------|
| Player HP | 20 | Survives 4-5 Slime hits |
| Player Attack | 8 | Kills Slime in 2 hits |
| Player Defense | 4 | Meaningful damage reduction |
| Slime HP | 12 | 2-hit kill for satisfying pace |
| Slime Attack | 5 | Moderate threat |
| Slime Defense | 2 | Low — player deals 8-10 damage |
| Min Damage | 1 | Floor prevents 0-damage turns |
| Encounter Tile Position | (8, 10) | Mid-map, away from spawn |
| Battle BG Color | `#2d1b4e` | Dark purple, distinct from world |

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (same as Phase 1)
- **Automated tests**: NO (Playwright E2E only)
- **Framework**: None for unit tests
- **Agent-Executed QA**: YES — Playwright for all verification

### Agent-Executed QA Approach
- **Build verification**: `npm run build` succeeds (strict TS)
- **Visual verification**: Playwright screenshots + canvas console inspection
- **Interaction verification**: Playwright keyboard events + state assertions
- **Regression verification**: Phase 1 movement still works
- **Game state access**: Via `window.__PHASER_GAME__` (established in Phase 1)

### Evidence Collection
All evidence stored in: `.sisyphus/evidence/phase2-*`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - No Dependencies):
├── Task 1: Extend Constants.ts + create enemies.ts data file
└── Task 2: Create placeholder Slime sprite

Wave 2 (After Wave 1):
├── Task 3: Update tileset + tilemap with encounter zone layer
└── Task 4: Add stats to Player entity + load new assets in Boot.ts

Wave 3 (After Wave 2):
├── Task 5: Add encounter detection hook to GridPhysics
└── Task 6: Implement BattleSystem state machine

Wave 4 (After Wave 3):
└── Task 7: Implement BattleScene with UI + keyboard input

Wave 5 (After Wave 4):
└── Task 8: Wire WorldScene encounter detection + scene transitions + integration QA
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4, 5, 6, 7, 8 | 2 |
| 2 | None | 4, 7 | 1 |
| 3 | None | 5, 8 | 1, 2 |
| 4 | 1, 2 | 7, 8 | 3 |
| 5 | 1, 3 | 8 | 6 |
| 6 | 1 | 7 | 5 |
| 7 | 1, 4, 6 | 8 | None |
| 8 | 3, 4, 5, 7 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Estimated Time |
|------|-------|----------------|
| 1 | 1, 2 | 15-20 min (parallel) |
| 2 | 3, 4 | 20-30 min (parallel) |
| 3 | 5, 6 | 30-40 min (parallel) |
| 4 | 7 | 40-60 min (complex UI + state) |
| 5 | 8 | 30-45 min (wiring + QA) |

---

## TODOs

### Task 1: Extend Constants and Create Enemy Data File

**What to do**:
1. Add to `src/game/utils/Constants.ts`:
   - `BattleState` enum: `INTRO`, `PLAYER_TURN`, `ENEMY_TURN`, `CHECK_END`, `VICTORY`, `DEFEAT`
   - Battle constants: `PLAYER_DEFAULT_HP = 20`, `PLAYER_DEFAULT_ATTACK = 8`, `PLAYER_DEFAULT_DEFENSE = 4`, `MIN_DAMAGE = 1`, `BATTLE_BG_COLOR = 0x2d1b4e`, `HP_BAR_WIDTH = 120`, `HP_BAR_HEIGHT = 10`
2. Create new directory: `src/game/data/`
3. Create `src/game/data/enemies.ts`:
   ```typescript
   export interface EnemyData {
     key: string;        // sprite key for loading
     name: string;       // display name in battle UI
     hp: number;
     attack: number;
     defense: number;
     spriteKey: string;  // texture key in Phaser
   }
   
   export const ENEMIES: Record<string, EnemyData> = {
     slime: {
       key: 'slime',
       name: 'Slime',
       hp: 12,
       attack: 5,
       defense: 2,
       spriteKey: 'slime',
     },
   };
   ```

**Must NOT do**:
- Do NOT create a separate battle-constants.ts — extend existing Constants.ts
- Do NOT use JSON file — use TypeScript (avoids bundler config issues)
- Do NOT add stats beyond HP/attack/defense
- Do NOT add more than one enemy type
- Do NOT add XP, gold, or loot fields to EnemyData

**Recommended Agent Profile**:
- **Category**: `quick` — Small file creation + extending existing constants
  - Reason: Straightforward data definition, no complex logic
- **Skills**: []
  - Reason: Simple TypeScript constants, no specialized skills needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, just data definitions
- `git-master`: No git operations in this task

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 2)
- **Blocks**: Tasks 4, 5, 6, 7, 8
- **Blocked By**: None

**References**:

**Pattern References**:
- `src/game/utils/Constants.ts:11-17` — Existing enum pattern (Direction enum) — follow same style for BattleState
- `src/game/utils/Constants.ts:1-9` — Existing constant exports — follow same `export const` style

**API/Type References**:
- `src/game/entities/Player.ts:4` — Player extends GameObjects.Sprite — stats will reference these constants

**WHY Each Reference Matters**:
- Constants.ts enum pattern ensures BattleState follows the same `string = 'value'` convention as Direction
- The constant export style (no namespace, bare exports) must be maintained for consistency

**Acceptance Criteria**:

- [ ] `src/game/utils/Constants.ts` exports `BattleState` enum with 6 states
- [ ] `src/game/utils/Constants.ts` exports `PLAYER_DEFAULT_HP`, `PLAYER_DEFAULT_ATTACK`, `PLAYER_DEFAULT_DEFENSE`, `MIN_DAMAGE`
- [ ] `src/game/data/enemies.ts` exports `EnemyData` interface and `ENEMIES` record
- [ ] `ENEMIES.slime` has correct values: hp=12, attack=5, defense=2
- [ ] `npm run build` succeeds with zero errors

**Agent-Executed QA Scenarios**:

```
Scenario: Constants file has BattleState enum
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. grep "BattleState" src/game/utils/Constants.ts → Assert found
    2. grep "INTRO" src/game/utils/Constants.ts → Assert found
    3. grep "PLAYER_TURN" src/game/utils/Constants.ts → Assert found
    4. grep "VICTORY" src/game/utils/Constants.ts → Assert found
    5. grep "DEFEAT" src/game/utils/Constants.ts → Assert found
  Expected Result: All BattleState enum values present
  Evidence: File content captured

Scenario: Enemy data file exports correctly
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. ls src/game/data/enemies.ts → Assert file exists
    2. grep "EnemyData" src/game/data/enemies.ts → Assert interface exported
    3. grep "slime" src/game/data/enemies.ts → Assert enemy defined
    4. grep "hp: 12" src/game/data/enemies.ts → Assert correct HP
    5. npm run build → Assert exit code 0
  Expected Result: Enemy data compiles and has correct values
  Evidence: Build output captured

Scenario: Build succeeds with strict TypeScript
  Tool: Bash
  Preconditions: All files created
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. Assert: No "error TS" in output
  Expected Result: Clean build
  Evidence: Build output captured
```

**Commit**: YES
- Message: `feat(battle): add BattleState enum, battle constants, and Slime enemy data`
- Files: `src/game/utils/Constants.ts`, `src/game/data/enemies.ts`
- Pre-commit: `npm run build`

---

### Task 2: Create Placeholder Slime Enemy Sprite

**What to do**:
1. Create `public/assets/sprites/slime.png`:
   - Simple 32x32 pixel placeholder (larger than player for visual distinction)
   - Single frame is fine (no animation for V1)
   - Use a recognizable slime shape — colored blob (green or blue)
   - Can be programmatically generated via canvas/ImageMagick or downloaded
2. Alternative: Use a simple colored rectangle if art generation is too complex

**Sprite Specification**:
```
File: public/assets/sprites/slime.png
Dimensions: 32x32 pixels (single frame)
Format: PNG with transparency
Visual: Simple colored blob/circle — green or blue
```

**Must NOT do**:
- Do NOT create elaborate pixel art
- Do NOT create animation frames (single static frame)
- Do NOT make it larger than 32x32
- Do NOT spend time on art quality — placeholder only

**Recommended Agent Profile**:
- **Category**: `quick` — Simple asset creation
  - Reason: Single placeholder image, can be generated programmatically
- **Skills**: []
  - Reason: Asset creation, not code

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI design, just a placeholder sprite
- All code skills: Not applicable to image creation

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 1)
- **Blocks**: Tasks 4, 7
- **Blocked By**: None

**References**:

**Pattern References**:
- `public/assets/sprites/player.png` — Existing sprite in project (16x16 frames) — slime should be similar quality level

**WHY Each Reference Matters**:
- Player sprite establishes the art quality bar — slime should match (simple placeholder)

**Acceptance Criteria**:

- [ ] `public/assets/sprites/slime.png` exists
- [ ] Image is valid PNG format
- [ ] Image is 32x32 pixels

**Agent-Executed QA Scenarios**:

```
Scenario: Slime sprite exists with correct dimensions
  Tool: Bash
  Preconditions: Task 2 complete
  Steps:
    1. ls public/assets/sprites/slime.png → Assert file exists
    2. file public/assets/sprites/slime.png → Assert "PNG image" in output
    3. Use: python3 -c "from PIL import Image; img=Image.open('public/assets/sprites/slime.png'); print(img.size)" → Assert output is (32, 32)
       OR: sips -g pixelWidth -g pixelHeight public/assets/sprites/slime.png → Assert 32x32
  Expected Result: Valid 32x32 PNG
  Evidence: File info captured
```

**Commit**: NO (groups with Task 4)

---

### Task 3: Update Tileset and Tilemap with Encounter Zone Layer

**What to do**:
1. Expand `public/assets/maps/tiles.png` tileset image:
   - Currently 32x16 (2 tiles: ground GID 1, wall GID 2)
   - Expand to 48x16 (3 tiles) by adding an encounter zone tile
   - New tile (GID 3): Visually identical to ground tile or slightly tinted — encounters should be invisible to player
   - Simplest approach: duplicate the ground tile as tile 3
2. Update `public/assets/maps/test-map.json`:
   - Update tileset `imagewidth` from 32 to 48 and `columns` from 2 to 3 and `tilecount` from 2 to 3
   - Add new layer named `encounters` between ground and walls (or after walls)
   - Encounters layer: All zeros except position (8, 10) through (10, 12) — a 3x3 encounter zone area
   - Set encounters layer `opacity` to 0 (invisible to player)
   - Ensure encounter tiles use GID 3 (the new tile)
   - Add custom property on the encounter tile in tileset: `encounter` (string) = `"slime"`
3. Encounter zone specification:
   ```
   Encounter zone: tiles (8,10), (9,10), (10,10), (8,11), (9,11), (10,11), (8,12), (9,12), (10,12)
   — 3x3 block in middle-south area of map, away from spawn (2,2)
   — Walking onto ANY of these tiles triggers battle with Slime
   ```

**Must NOT do**:
- Do NOT modify existing ground or walls layers
- Do NOT change existing tile GIDs (ground=1, wall=2)
- Do NOT place encounter tiles overlapping with spawn position (2,2)
- Do NOT place encounter tiles overlapping with wall tiles
- Do NOT make encounter zone visible (opacity = 0)

**Recommended Agent Profile**:
- **Category**: `unspecified-low` — JSON editing with careful structure preservation
  - Reason: Requires careful modification of tilemap JSON structure without breaking existing layers
- **Skills**: []
  - Reason: JSON editing, no specialized code skills needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, map data modification
- All code skills: JSON editing only

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Task 4)
- **Blocks**: Tasks 5, 8
- **Blocked By**: None (can start in Wave 1 but safe to do in Wave 2 for clarity)

**References**:

**Pattern References**:
- `public/assets/maps/test-map.json` — Existing tilemap structure with ground + walls layers — follow same layer format
- `public/assets/maps/tiles.png` — Current 32x16 tileset — extend to 48x16

**Documentation References**:
- Tiled JSON format: Layer data array is row-major, 20 tiles per row, 20 rows = 400 values
- GID 0 = empty tile, GID 1 = ground, GID 2 = wall, GID 3 = encounter (new)

**WHY Each Reference Matters**:
- test-map.json structure must be preserved exactly — wrong format breaks Phaser tilemap loading
- tiles.png dimensions affect tileset configuration in JSON — both must be in sync

**Acceptance Criteria**:

- [ ] `public/assets/maps/tiles.png` is 48x16 pixels (3 tiles)
- [ ] `test-map.json` has 3 layers: ground, walls, encounters
- [ ] Encounters layer has opacity 0
- [ ] Encounter tiles at positions (8,10) through (10,12) — 9 tiles total
- [ ] Encounter tiles do NOT overlap with walls or spawn (2,2)
- [ ] Existing ground and walls layers unchanged
- [ ] Tileset `tilecount` updated to 3, `columns` to 3, `imagewidth` to 48

**Agent-Executed QA Scenarios**:

```
Scenario: Tilemap has encounters layer
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. python3 -c "import json; d=json.load(open('public/assets/maps/test-map.json')); print([l['name'] for l in d['layers']])"
    2. Assert: Output contains 'ground', 'walls', 'encounters'
    3. python3 -c "import json; d=json.load(open('public/assets/maps/test-map.json')); enc=[l for l in d['layers'] if l['name']=='encounters'][0]; print(enc.get('opacity', 1))"
    4. Assert: Output is 0 (invisible layer)
  Expected Result: Encounters layer exists and is invisible
  Evidence: Console output captured

Scenario: Encounter tiles at correct positions
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. python3 -c "
       import json
       d=json.load(open('public/assets/maps/test-map.json'))
       enc=[l for l in d['layers'] if l['name']=='encounters'][0]
       data=enc['data']
       # Check tile at (8,10) — index = row*20+col = 10*20+8 = 208
       print('(8,10):', data[208])
       print('(9,10):', data[209])
       print('(10,10):', data[210])
       # Check spawn (2,2) is empty — index = 2*20+2 = 42
       print('spawn(2,2):', data[42])
       "
    2. Assert: (8,10), (9,10), (10,10) have GID 3 (encounter tile)
    3. Assert: spawn(2,2) has GID 0 (empty — no encounter at spawn)
  Expected Result: Encounter tiles at correct positions, spawn clear
  Evidence: Console output captured

Scenario: Tileset image expanded correctly
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. sips -g pixelWidth -g pixelHeight public/assets/maps/tiles.png
    2. Assert: Width is 48, Height is 16
  Expected Result: Tileset has 3 tiles (48x16)
  Evidence: File info captured
```

**Commit**: YES
- Message: `feat(map): add encounter zone layer to tilemap with 3x3 slime zone`
- Files: `public/assets/maps/tiles.png`, `public/assets/maps/test-map.json`
- Pre-commit: Files exist and JSON is valid

---

### Task 4: Add Stats to Player Entity and Load New Assets in Boot

**What to do**:
1. Extend `src/game/entities/Player.ts`:
   - Add stat properties with defaults: `hp`, `maxHp`, `attack`, `defense`
   - Import constants: `PLAYER_DEFAULT_HP`, `PLAYER_DEFAULT_ATTACK`, `PLAYER_DEFAULT_DEFENSE`
   - Initialize in constructor AFTER `super()` — do NOT change constructor signature
   - Add methods: `takeDamage(amount: number): void`, `isAlive(): boolean`, `resetStats(): void`
   - `takeDamage`: Clamp HP to minimum 0 — `this.hp = Math.max(0, this.hp - amount)`
   ```typescript
   // Add AFTER line 8 (scene.add.existing(this))
   public hp: number = PLAYER_DEFAULT_HP;
   public maxHp: number = PLAYER_DEFAULT_HP;
   public attack: number = PLAYER_DEFAULT_ATTACK;
   public defense: number = PLAYER_DEFAULT_DEFENSE;
   
   takeDamage(amount: number): void {
     this.hp = Math.max(0, this.hp - amount);
   }
   
   isAlive(): boolean {
     return this.hp > 0;
   }
   
   resetStats(): void {
     this.hp = this.maxHp;
   }
   ```
2. Extend `src/game/scenes/Boot.ts`:
   - Add slime sprite loading: `this.load.image('slime', 'assets/sprites/slime.png')`
   - Add encounter tileset loading if needed (should work with existing tiles key)
   ```typescript
   // Add in preload() after player spritesheet loading
   this.load.image('slime', 'assets/sprites/slime.png');
   ```

**Must NOT do**:
- Do NOT change Player constructor signature `(scene, x, y)` — backward compatibility
- Do NOT make stats required constructor parameters
- Do NOT add MP, speed, luck, or any stats beyond HP/attack/defense
- Do NOT change existing method signatures (playWalkAnimation, stopAnimation)
- Do NOT modify createAnimations() method
- Do NOT add battle background image loading (will use programmatic drawing)

**Recommended Agent Profile**:
- **Category**: `unspecified-low` — Extending existing classes with new properties
  - Reason: Standard TypeScript class modification, moderate care needed for backward compat
- **Skills**: []
  - Reason: Standard TypeScript, no specialized domain needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, entity data
- `playwright`: No browser testing in this task
- `git-master`: No git operations

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Task 3)
- **Blocks**: Tasks 7, 8
- **Blocked By**: Tasks 1, 2

**References**:

**Pattern References**:
- `src/game/entities/Player.ts:4-9` — Existing constructor pattern — add stats AFTER `scene.add.existing(this)` but BEFORE `createAnimations()`
- `src/game/entities/Player.ts:71-79` — Existing public method pattern — follow same style for `takeDamage`, `isAlive`, `resetStats`
- `src/game/scenes/Boot.ts:8-17` — Asset loading pattern — add slime load after player spritesheet

**API/Type References**:
- `src/game/utils/Constants.ts` — `PLAYER_DEFAULT_HP`, `PLAYER_DEFAULT_ATTACK`, `PLAYER_DEFAULT_DEFENSE` — import these for stat defaults

**WHY Each Reference Matters**:
- Player.ts constructor must maintain exact signature to avoid breaking WorldScene.ts line 36
- Boot.ts loading pattern must match for consistent asset pipeline
- Constants must be imported (not hardcoded) for single source of truth

**Acceptance Criteria**:

- [ ] Player has `hp`, `maxHp`, `attack`, `defense` properties initialized with correct defaults (20, 20, 8, 4)
- [ ] Player constructor signature unchanged: `(scene: Scene, x: number, y: number)`
- [ ] `takeDamage(5)` reduces HP by 5, clamped at 0
- [ ] `isAlive()` returns true when HP > 0, false when HP = 0
- [ ] `resetStats()` restores HP to maxHp
- [ ] Boot.ts loads slime sprite
- [ ] Existing animations still work (no regression)
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: Player stats initialized correctly
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:5173
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Execute in console:
       const scene = window.__PHASER_GAME__.scene.getScene('WorldScene');
       const p = scene.getPlayer();
       JSON.stringify({ hp: p.hp, maxHp: p.maxHp, attack: p.attack, defense: p.defense });
    4. Assert: Returns {"hp":20,"maxHp":20,"attack":8,"defense":4}
  Expected Result: Player has correct default stats
  Evidence: Console output captured

Scenario: Player takeDamage clamps at zero
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console:
       const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       p.takeDamage(100);
       p.hp;
    4. Assert: Returns 0 (not -80)
  Expected Result: HP clamped at 0
  Evidence: Console output captured

Scenario: Movement still works (regression)
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console:
       window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    4. Record: startX value
    5. Press: ArrowRight key
    6. Wait for: 300ms
    7. Execute in console:
       window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    8. Assert: x increased by ~16 (one tile)
  Expected Result: Grid movement still works after stat addition
  Evidence: Console output captured

Scenario: Slime texture loaded
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3 seconds
    3. Execute in console:
       window.__PHASER_GAME__.textures.exists('slime')
    4. Assert: Returns true
  Expected Result: Slime sprite loaded by Boot scene
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(player): add HP/attack/defense stats and load slime asset`
- Files: `src/game/entities/Player.ts`, `src/game/scenes/Boot.ts`, `public/assets/sprites/slime.png`
- Pre-commit: `npm run build`

---

### Task 5: Add Encounter Detection Hook to GridPhysics

**What to do**:
1. Modify `src/game/systems/GridPhysics.ts`:
   - Add an `onMoveComplete` callback property
   - Fire callback AFTER `isMoving = false` and `stopAnimation()` in tween `onComplete`
   - Callback receives the current tile position: `(tileX: number, tileY: number) => void`
   ```typescript
   // Add property
   private onMoveComplete?: (tileX: number, tileY: number) => void;
   
   // Add setter method
   setOnMoveComplete(callback: (tileX: number, tileY: number) => void): void {
     this.onMoveComplete = callback;
   }
   
   // In tween onComplete, AFTER isMoving = false and stopAnimation:
   onComplete: () => {
     this.isMoving = false;
     this.player.stopAnimation(direction);
     // Fire encounter check callback
     if (this.onMoveComplete) {
       const tileX = Math.floor(this.player.x / TILE_SIZE);
       const tileY = Math.floor(this.player.y / TILE_SIZE);
       this.onMoveComplete(tileX, tileY);
     }
   },
   ```

**Must NOT do**:
- Do NOT fire callback BEFORE `isMoving = false` (causes state confusion)
- Do NOT change the `update()` or `isBlocked()` method signatures
- Do NOT add encounter-specific logic here (keep GridPhysics generic)
- Do NOT import BattleScene or WorldScene (maintain separation of concerns)

**Recommended Agent Profile**:
- **Category**: `quick` — Small, precise modification to existing system
  - Reason: Adding 10 lines to an existing 84-line file with clear insertion points
- **Skills**: []
  - Reason: Simple callback pattern, no specialized skills needed

**Skills Evaluated but Omitted**:
- `playwright`: No browser testing — build verification only
- `frontend-ui-ux`: Not UI, game system logic

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 6)
- **Blocks**: Task 8
- **Blocked By**: Tasks 1, 3

**References**:

**Pattern References**:
- `src/game/systems/GridPhysics.ts:42-52` — Existing tween onComplete — this is the exact insertion point for the callback
- `src/game/systems/GridPhysics.ts:68-73` — Existing `isBlocked` tile coordinate conversion — reuse `Math.floor(x / TILE_SIZE)` pattern

**WHY Each Reference Matters**:
- The onComplete handler (lines 48-51) is the precise location where encounter check must fire — AFTER `isMoving = false`
- Tile coordinate conversion in isBlocked uses the same formula needed for the callback

**Acceptance Criteria**:

- [ ] `GridPhysics` has `setOnMoveComplete(callback)` method
- [ ] Callback fires after every completed move with correct (tileX, tileY)
- [ ] Callback fires AFTER `isMoving = false` and `stopAnimation`
- [ ] Callback does NOT fire on blocked moves (player doesn't move)
- [ ] Existing movement behavior unchanged
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: onMoveComplete callback fires with correct position
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Execute in console:
       const scene = window.__PHASER_GAME__.scene.getScene('WorldScene');
       const gp = scene['gridPhysics'];
       let lastPos = null;
       gp.setOnMoveComplete((tx, ty) => { lastPos = {tx, ty}; });
       window.__lastPos = null;
       gp.setOnMoveComplete((tx, ty) => { window.__lastPos = {tx, ty}; });
    4. Press: ArrowRight key
    5. Wait for: 300ms
    6. Execute in console: JSON.stringify(window.__lastPos)
    7. Assert: Returns {"tx":3,"ty":2} (moved right from spawn 2,2 to 3,2)
  Expected Result: Callback fired with correct tile position
  Evidence: Console output captured

Scenario: Callback does not fire on blocked move
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, player at spawn (2,2)
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console:
       const scene = window.__PHASER_GAME__.scene.getScene('WorldScene');
       window.__callCount = 0;
       scene['gridPhysics'].setOnMoveComplete(() => { window.__callCount++; });
    4. Press: ArrowUp key (toward wall — row 0 is wall perimeter)
    5. Wait for: 300ms
    6. Press: ArrowUp key (should be blocked by perimeter wall at row 0)
    7. Wait for: 300ms
    8. Execute in console: window.__callCount
    9. Assert: Value is 1 (only first move succeeded, second was blocked)
  Expected Result: Blocked moves don't trigger callback
  Evidence: Console output captured
```

**Commit**: NO (groups with Task 8)

---

### Task 6: Implement BattleSystem State Machine

**What to do**:
1. Create `src/game/systems/BattleSystem.ts`:
   - State machine managing: INTRO → PLAYER_TURN → ENEMY_TURN → CHECK_END → loop/VICTORY/DEFEAT
   - Constructor receives player stats and enemy data (NOT scene references — pure logic)
   - Methods:
     - `start()`: Transition from INTRO → PLAYER_TURN after delay
     - `playerAttack()`: Calculate damage, apply to enemy, transition to ENEMY_TURN
     - `enemyAttack()`: Calculate damage, apply to player, transition to CHECK_END
     - `checkBattleEnd()`: If enemy HP ≤ 0 → VICTORY. If player HP ≤ 0 → DEFEAT. Else → PLAYER_TURN
   - Damage formula: `Math.max(MIN_DAMAGE, attackerAtk - defenderDef / 2 + Math.floor(Math.random() * 3) + 1)`
   - Emit events via callbacks (NOT Phaser events — keep pure):
     - `onStateChange(state: BattleState): void`
     - `onDamageDealt(target: 'player' | 'enemy', damage: number, remainingHp: number): void`
     - `onBattleEnd(result: 'victory' | 'defeat'): void`
   ```typescript
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
     private playerAttack: number;
     private playerDefense: number;
     private enemyHp: number;
     private enemyMaxHp: number;
     private enemyAttack: number;
     private enemyDefense: number;
     private enemyName: string;
     private callbacks: BattleCallbacks;
   
     constructor(
       playerStats: { hp: number; maxHp: number; attack: number; defense: number },
       enemyData: EnemyData,
       callbacks: BattleCallbacks
     ) { ... }
   
     start(): void { ... }
     playerAttack(): number { ... } // returns damage dealt
     private enemyTurn(): void { ... }
     private checkEnd(): void { ... }
     private calculateDamage(atk: number, def: number): number { ... }
     
     getState(): BattleState { ... }
     getPlayerHp(): number { ... }
     getPlayerMaxHp(): number { ... }
     getEnemyHp(): number { ... }
     getEnemyMaxHp(): number { ... }
     getEnemyName(): string { ... }
   }
   ```

**Must NOT do**:
- Do NOT import Phaser or Scene classes (BattleSystem is pure logic)
- Do NOT add attack animations, delays, or visual concerns (that's BattleScene's job)
- Do NOT add Defend/Item/Flee logic
- Do NOT add status effects or special moves
- Do NOT add XP or loot calculations
- Do NOT add random encounter chance logic

**Recommended Agent Profile**:
- **Category**: `unspecified-high` — Core state machine with careful state transitions and edge cases
  - Reason: State machine correctness is critical — wrong transitions break the entire battle
- **Skills**: []
  - Reason: Pure TypeScript logic, no framework-specific skills needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, pure logic
- `playwright`: No browser testing, unit-testable pure logic

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 5)
- **Blocks**: Task 7
- **Blocked By**: Task 1

**References**:

**Pattern References**:
- `src/game/systems/GridPhysics.ts:1-83` — Existing system class pattern — constructor receives dependencies, exposes getters
- `src/game/utils/Constants.ts:BattleState` — State enum created in Task 1
- `src/game/data/enemies.ts:EnemyData` — Interface for enemy stats created in Task 1

**Documentation References**:
- `.planning/ROADMAP.md:118-121` — Battle state machine specification: `INTRO → PLAYER_TURN → ENEMY_TURN → CHECK_END → (loop or VICTORY/DEFEAT)`

**WHY Each Reference Matters**:
- GridPhysics shows the system class pattern (constructor DI, private state, public getters)
- BattleState enum defines the valid states — must use these exact values
- EnemyData interface defines the stat contract for enemy initialization

**Acceptance Criteria**:

- [ ] `src/game/systems/BattleSystem.ts` exports `BattleSystem` class and `BattleCallbacks` interface
- [ ] State machine starts at INTRO and transitions to PLAYER_TURN on `start()`
- [ ] `playerAttack()` calculates damage correctly, clamps to MIN_DAMAGE, reduces enemy HP
- [ ] Enemy turn auto-triggers after player attack, reduces player HP
- [ ] CHECK_END detects victory (enemy HP ≤ 0) and defeat (player HP ≤ 0)
- [ ] Callbacks fire on every state change, damage dealt, and battle end
- [ ] Damage formula: `Math.max(1, atk - def/2 + Math.floor(Math.random() * 3) + 1)`
- [ ] No Phaser imports (pure logic class)
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: BattleSystem state machine flow
  Tool: Bash
  Preconditions: Task 6 complete
  Steps:
    1. npm run build → Assert exit code 0
    2. grep "import.*Phaser" src/game/systems/BattleSystem.ts → Assert NOT found (no Phaser import)
    3. grep "BattleState.INTRO" src/game/systems/BattleSystem.ts → Assert found
    4. grep "BattleState.VICTORY" src/game/systems/BattleSystem.ts → Assert found
    5. grep "BattleState.DEFEAT" src/game/systems/BattleSystem.ts → Assert found
    6. grep "Math.max" src/game/systems/BattleSystem.ts → Assert found (MIN_DAMAGE clamping)
    7. grep "MIN_DAMAGE" src/game/systems/BattleSystem.ts → Assert found
  Expected Result: BattleSystem has correct structure and damage clamping
  Evidence: Build output + grep results

Scenario: BattleSystem compiles cleanly
  Tool: Bash
  Preconditions: Task 6 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. Assert: No "error TS" in output
    4. Assert: No "unused" warnings for BattleSystem exports
  Expected Result: Clean TypeScript compilation
  Evidence: Build output captured
```

**Commit**: YES
- Message: `feat(battle): implement BattleSystem turn-based state machine`
- Files: `src/game/systems/BattleSystem.ts`
- Pre-commit: `npm run build`

---

### Task 7: Implement BattleScene with UI and Keyboard Input

**What to do**:
1. Create `src/game/scenes/BattleScene.ts`:
   - Scene key: `'BattleScene'`
   - `init(data)` receives: `{ playerHp, playerMaxHp, playerAttack, playerDefense, enemyKey }` from WorldScene
   - Instantiates BattleSystem with player stats + enemy data from ENEMIES record
   - **Background**: Solid dark purple rectangle (`BATTLE_BG_COLOR`)
   - **Enemy display**: Enemy sprite centered in upper area + name text above
   - **HP Bars** (using `this.add.graphics()`):
     - Player HP bar: Bottom-left area. Background (dark gray), foreground (green). Label "Player HP"
     - Enemy HP bar: Top-right area. Background (dark gray), foreground (red). Label with enemy name
     - Tween foreground `scaleX` on damage: `scene.tweens.add({ targets: hpBarFG, scaleX: currentHP/maxHP, duration: 300 })`
   - **Battle menu**: Text at bottom showing "> Attack" (keyboard navigable but V1 has only one option)
     - Highlight current selection with `>` cursor
     - Enter or Space confirms selection
   - **Message text**: Area for battle messages ("A wild Slime appears!", "Player attacks! Dealt X damage!", "Slime attacks! Dealt X damage!", "Victory!", "Defeat!")
   - **State-driven UI updates** via BattleCallbacks:
     - `onStateChange(INTRO)`: Show intro message "A wild {name} appears!", auto-advance after 1.5s
     - `onStateChange(PLAYER_TURN)`: Show menu, enable input
     - `onStateChange(ENEMY_TURN)`: Hide menu, show enemy attack message, auto-advance after 1s
     - `onDamageDealt`: Update HP bar tween + show damage message
     - `onBattleEnd('victory')`: Show "Victory!" message, auto-transition back after 2s
     - `onBattleEnd('defeat')`: Show "Defeat!" message, restart game after 2s
   - **Input handling**:
     - Only active during PLAYER_TURN state
     - Enter/Space: Confirm "Attack" selection → calls `battleSystem.playerAttack()`
     - Input DISABLED during all other states (prevent action spam)
   - **Keyboard setup**: Create NEW keyboard listeners (not shared with WorldScene)

2. **Layout specification**:
   ```
   ┌──────────────────────────────────┐
   │  [Enemy Name]                     │
   │  ████████░░░░ (Enemy HP bar)     │
   │                                   │
   │        [Slime Sprite]            │
   │                                   │
   │──────────────────────────────────│
   │  [Battle Message Text]           │
   │                                   │
   │  [Player Name]                    │
   │  ████████████ (Player HP bar)    │
   │                                   │
   │  > Attack                        │
   └──────────────────────────────────┘
   ```

**Must NOT do**:
- Do NOT add Defend/Item/Flee options (Attack only)
- Do NOT add battle animations (no screen shake, flash, sprites)
- Do NOT add transition effects (instant scene switch)
- Do NOT add sound effects
- Do NOT add grayed-out placeholder menu items
- Do NOT use mouse input
- Do NOT share keyboard listeners with WorldScene
- Do NOT add victory rewards (XP, gold, items)

**Recommended Agent Profile**:
- **Category**: `visual-engineering` — Complex UI layout with Phaser Graphics + Text + state-driven updates
  - Reason: This is the most UI-heavy task — HP bars, text positioning, menu rendering, keyboard input
- **Skills**: [`frontend-ui-ux`]
  - `frontend-ui-ux`: HP bar layout, text positioning, visual hierarchy, menu interaction patterns

**Skills Evaluated but Omitted**:
- `playwright`: Testing in Task 8, not here
- `git-master`: No git operations

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 4 (solo)
- **Blocks**: Task 8
- **Blocked By**: Tasks 1, 4, 6

**References**:

**Pattern References**:
- `src/game/scenes/Boot.ts:1-23` — Scene class structure (constructor with super, preload, create)
- `src/game/scenes/WorldScene.ts:17-47` — Scene create() pattern with initialization
- `src/game/systems/BattleSystem.ts` (from Task 6) — BattleCallbacks interface to implement

**API/Type References**:
- `src/game/data/enemies.ts:EnemyData` — Interface for enemy data
- `src/game/data/enemies.ts:ENEMIES` — Record to look up enemy by key
- `src/game/utils/Constants.ts:BattleState` — Enum for state-driven UI

**External References**:
- Phaser Graphics API: `this.add.graphics()` for HP bar rectangles
- Phaser Text API: `this.add.text(x, y, text, style)` for labels
- Phaser Tweens: `this.tweens.add({ targets, scaleX, duration })` for HP bar animation

**WHY Each Reference Matters**:
- Boot.ts scene structure ensures consistent scene class pattern
- BattleSystem callbacks drive all UI updates — must implement interface correctly
- ENEMIES record provides enemy data for initialization

**Acceptance Criteria**:

- [ ] `src/game/scenes/BattleScene.ts` exports BattleScene class with key `'BattleScene'`
- [ ] `init(data)` accepts player stats + enemy key from WorldScene
- [ ] Background is dark purple solid color
- [ ] Enemy sprite displayed in upper area
- [ ] Player HP bar: green foreground on dark background, labeled
- [ ] Enemy HP bar: red foreground on dark background, labeled with enemy name
- [ ] "Attack" menu option visible during PLAYER_TURN
- [ ] Enter/Space triggers attack action
- [ ] Input disabled during non-PLAYER_TURN states
- [ ] HP bars tween on damage
- [ ] Battle messages display for each state transition
- [ ] Victory message displays when enemy HP = 0
- [ ] Defeat message displays when player HP = 0
- [ ] Scene transitions back to world on victory (after 2s delay)
- [ ] Scene restarts on defeat (game over)
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: BattleScene renders all UI elements
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running. Need to manually trigger BattleScene via console for isolated test.
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.scene.start('BattleScene', {
         playerHp: 20, playerMaxHp: 20, playerAttack: 8, playerDefense: 4,
         enemyKey: 'slime'
       });
    4. Wait for: 2 seconds (allow INTRO to complete)
    5. Screenshot: .sisyphus/evidence/phase2-battlescene-ui.png
    6. Execute in console:
       const bs = window.__PHASER_GAME__.scene.getScene('BattleScene');
       bs !== null && bs.scene.isActive();
    7. Assert: Returns true (BattleScene is active)
  Expected Result: Battle UI visible with HP bars, enemy sprite, Attack option
  Evidence: .sisyphus/evidence/phase2-battlescene-ui.png

Scenario: Attack action reduces enemy HP bar
  Tool: Playwright (playwright skill)
  Preconditions: BattleScene active (from previous scenario or fresh start)
  Steps:
    1. Navigate to: http://localhost:5173
    2. Execute in console:
       window.__PHASER_GAME__.scene.start('BattleScene', {
         playerHp: 20, playerMaxHp: 20, playerAttack: 8, playerDefense: 4,
         enemyKey: 'slime'
       });
    3. Wait for: 2 seconds (INTRO → PLAYER_TURN)
    4. Press: Enter key (select Attack)
    5. Wait for: 1.5 seconds (allow attack + enemy turn)
    6. Execute in console:
       const bs = window.__PHASER_GAME__.scene.getScene('BattleScene');
       const sys = bs['battleSystem'];
       sys.getEnemyHp();
    7. Assert: Enemy HP < 12 (took damage from attack)
    8. Screenshot: .sisyphus/evidence/phase2-after-attack.png
  Expected Result: Enemy HP decreased after player attack
  Evidence: .sisyphus/evidence/phase2-after-attack.png

Scenario: Input blocked during non-PLAYER_TURN states
  Tool: Playwright (playwright skill)
  Preconditions: BattleScene active
  Steps:
    1. Navigate to: http://localhost:5173
    2. Execute in console:
       window.__PHASER_GAME__.scene.start('BattleScene', {
         playerHp: 20, playerMaxHp: 20, playerAttack: 8, playerDefense: 4,
         enemyKey: 'slime'
       });
    3. Wait for: 500ms (still in INTRO state)
    4. Press: Enter key rapidly 5 times
    5. Wait for: 3 seconds
    6. Execute in console:
       window.__PHASER_GAME__.scene.getScene('BattleScene')['battleSystem'].getEnemyHp()
    7. Assert: Enemy HP is 12 or slightly less than 12 (only 0-1 attacks should have registered)
  Expected Result: Key presses during INTRO/ENEMY_TURN ignored
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(battle): implement BattleScene with HP bars, Attack menu, and state-driven UI`
- Files: `src/game/scenes/BattleScene.ts`
- Pre-commit: `npm run build`

---

### Task 8: Wire WorldScene Encounter Detection, Scene Transitions, and Integration QA

**What to do**:
1. Update `src/game/main.ts`:
   - Import BattleScene
   - Add to scene array: `[Boot, WorldScene, BattleScene]`
   ```typescript
   import { BattleScene } from './scenes/BattleScene';
   // ...
   scene: [Boot, WorldScene, BattleScene],
   ```

2. Update `src/game/scenes/WorldScene.ts`:
   - Load encounters layer from tilemap
   - Wire GridPhysics `onMoveComplete` callback to check encounters layer
   - On encounter detected:
     1. Guard: Check BattleScene not already active (`!this.scene.isActive('BattleScene')`)
     2. Sleep WorldScene: `this.scene.sleep('WorldScene')`
     3. Launch BattleScene: `this.scene.launch('BattleScene', { playerHp, playerMaxHp, playerAttack, playerDefense, enemyKey: 'slime' })`
   - Handle return from battle:
     - Listen for BattleScene wake event or use `scene.events.on('wake', ...)`
     - On WorldScene wake: restore player HP from battle result, re-enable input
   - Battle result handling:
     - Victory: WorldScene wakes, player resumes at same position, HP restored to post-battle value (or full HP for V1 simplicity)
     - Defeat: BattleScene handles restart (scene.start('Boot') to restart game)
   ```typescript
   // In create(), after gridPhysics initialization:
   const encountersLayer = this.map.getLayer('encounters');
   
   this.gridPhysics.setOnMoveComplete((tileX: number, tileY: number) => {
     if (this.scene.isActive('BattleScene')) return; // guard
     
     const encounterTile = this.map.getTileAt(tileX, tileY, false, 'encounters');
     if (encounterTile) {
       const player = this.getPlayer();
       this.scene.sleep('WorldScene');
       this.scene.launch('BattleScene', {
         playerHp: player.hp,
         playerMaxHp: player.maxHp,
         playerAttack: player.attack,
         playerDefense: player.defense,
         enemyKey: 'slime',
       });
     }
   });
   
   // Handle return from battle
   this.events.on('wake', (_sys: any, data: any) => {
     if (data?.playerHp !== undefined) {
       this.player.hp = data.playerHp;
     }
     // Player is already at correct position (sleep preserved it)
   });
   ```

3. Update BattleScene to wake WorldScene on victory:
   ```typescript
   // In victory handler (after 2s delay):
   this.scene.wake('WorldScene', { playerHp: this.battleSystem.getPlayerHp() });
   this.scene.stop('BattleScene');
   ```

4. Run FULL integration QA — all 5 success criteria + regression tests

**Must NOT do**:
- Do NOT use `scene.start('WorldScene')` to return (destroys state)
- Do NOT restart WorldScene on victory (use wake)
- Do NOT forget the BattleScene active guard (prevents double-trigger)
- Do NOT hardcode enemy key (use encounter tile property or 'slime' default)
- Do NOT modify GridPhysics beyond what Task 5 already did

**Recommended Agent Profile**:
- **Category**: `unspecified-high` — Complex integration with scene lifecycle management
  - Reason: Wiring multiple systems together (GridPhysics callback → encounter detection → scene sleep/wake → battle data flow → return). Most integration-heavy task.
- **Skills**: [`playwright`]
  - `playwright`: Comprehensive E2E QA for all success criteria and regression tests

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Integration wiring, not UI
- `git-master`: No advanced git operations

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 5 (final — solo)
- **Blocks**: None (final task)
- **Blocked By**: Tasks 3, 4, 5, 7

**References**:

**Pattern References**:
- `src/game/scenes/WorldScene.ts:17-47` — Existing create() method — add encounter detection after gridPhysics initialization (line 42)
- `src/game/scenes/WorldScene.ts:49-53` — Existing update() loop — encounter check is NOT in update, it's in the callback
- `src/game/systems/GridPhysics.ts:onComplete` (modified in Task 5) — The callback that triggers encounter detection
- `src/game/main.ts:15-18` — Scene array where BattleScene must be added
- `src/game/scenes/Boot.ts:20-22` — Scene start pattern (scene.start)

**API/Type References**:
- `src/game/entities/Player.ts` (modified in Task 4) — Player.hp, .maxHp, .attack, .defense properties
- `src/game/data/enemies.ts:ENEMIES` — Enemy lookup by key

**Documentation References**:
- `.planning/ROADMAP.md:89-121` — Phase 2 success criteria
- Phaser scene sleep/wake docs: `scene.sleep()`, `scene.wake()`, `scene.launch()`

**WHY Each Reference Matters**:
- WorldScene.ts create() is the exact location for encounter wiring
- main.ts scene array must include BattleScene for scene.launch to work
- Player stats properties are the data contract for BattleScene init
- GridPhysics callback is the trigger mechanism for encounter detection

**Acceptance Criteria**:

**Build + Static:**
- [ ] `npm run build` succeeds with zero errors
- [ ] BattleScene registered in main.ts scene array
- [ ] Encounters layer accessed in WorldScene
- [ ] onMoveComplete callback wired in WorldScene.create()
- [ ] Scene sleep/wake pattern used (NOT start/stop for WorldScene)

**Success Criterion 1: Walking into encounter zone triggers battle**
- [ ] Walking onto tile (8,10)-(10,12) launches BattleScene

**Success Criterion 2: Battle UI shows player HP, enemy HP, options**
- [ ] Player HP bar visible and labeled
- [ ] Enemy HP bar visible with enemy name
- [ ] "Attack" option visible

**Success Criterion 3: Selecting "Attack" deals damage to enemy**
- [ ] Pressing Enter/Space on Attack reduces enemy HP
- [ ] Enemy HP bar animates shorter

**Success Criterion 4: Enemy attacks on its turn**
- [ ] After player attacks, enemy attacks back
- [ ] Player HP bar decreases

**Success Criterion 5: Battle ends when enemy HP = 0**
- [ ] Victory message appears
- [ ] Player returns to world at same position
- [ ] Player can move normally after return

**Regression:**
- [ ] Grid movement works before encountering battle
- [ ] Camera following works
- [ ] Collision with walls still works

**Agent-Executed QA Scenarios**:

```
Scenario: Full battle flow — encounter to victory to world return (SUCCESS CRITERIA 1-5)
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, all previous tasks complete
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 5s)
    3. Screenshot: .sisyphus/evidence/phase2-world-start.png
    
    --- Walk to encounter zone (from spawn 2,2 to tile ~8,10) ---
    4. Press: ArrowRight x6 (reach tile 8,2)
    5. Wait for: 300ms between each press
    6. Press: ArrowDown x8 (reach tile 8,10 — encounter zone)
    7. Wait for: 300ms between each press
    8. Wait for: 500ms (allow encounter to trigger)
    
    --- Verify battle started (SC1) ---
    9. Execute in console:
       window.__PHASER_GAME__.scene.isActive('BattleScene')
    10. Assert: Returns true (battle triggered)
    11. Screenshot: .sisyphus/evidence/phase2-battle-started.png
    
    --- Verify UI elements (SC2) ---
    12. Wait for: 2 seconds (allow INTRO to finish → PLAYER_TURN)
    13. Screenshot: .sisyphus/evidence/phase2-battle-ui.png
    
    --- Attack enemy (SC3) ---
    14. Press: Enter key (select Attack)
    15. Wait for: 1.5 seconds
    16. Execute in console:
        const bs = window.__PHASER_GAME__.scene.getScene('BattleScene');
        bs['battleSystem'].getEnemyHp()
    17. Assert: Value < 12 (enemy took damage)
    
    --- Verify enemy attacks back (SC4) ---
    18. Execute in console:
        const bs = window.__PHASER_GAME__.scene.getScene('BattleScene');
        bs['battleSystem'].getPlayerHp()
    19. Assert: Value < 20 (player took damage from enemy turn)
    20. Screenshot: .sisyphus/evidence/phase2-after-first-round.png
    
    --- Continue attacking until victory (SC5) ---
    21. Wait for: 1 second (state returns to PLAYER_TURN)
    22. Press: Enter key (Attack again — Slime should die in 2 hits)
    23. Wait for: 3 seconds (allow victory + transition)
    24. Screenshot: .sisyphus/evidence/phase2-victory.png
    
    --- Verify return to world at same position ---
    25. Execute in console:
        const ws = window.__PHASER_GAME__.scene.getScene('WorldScene');
        ws.scene.isActive()
    26. Assert: Returns true (WorldScene is active again)
    27. Execute in console:
        const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
        JSON.stringify({ x: Math.round(p.x), y: Math.round(p.y) })
    28. Assert: Position is approximately (136, 168) — pixel coords for tile (8,10)
        (8 * 16 + 8 = 136, 10 * 16 + 8 = 168)
    29. Screenshot: .sisyphus/evidence/phase2-return-to-world.png
    
    --- Verify movement still works after battle ---
    30. Press: ArrowLeft key
    31. Wait for: 300ms
    32. Execute in console:
        window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    33. Assert: x decreased by ~16 (movement works)
    34. Screenshot: .sisyphus/evidence/phase2-post-battle-movement.png
  Expected Result: Complete battle flow works — encounter, fight, victory, return
  Evidence: 7 screenshots in .sisyphus/evidence/phase2-*

Scenario: Player defeat handling
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.scene.getScene('WorldScene').scene.sleep('WorldScene');
       game.scene.start('BattleScene', {
         playerHp: 3, playerMaxHp: 20, playerAttack: 8, playerDefense: 0,
         enemyKey: 'slime'
       });
    4. Wait for: 2 seconds (INTRO → PLAYER_TURN)
    5. Press: Enter (Attack)
    6. Wait for: 2 seconds (player attacks, enemy attacks — with defense 0 and hp 3, player should die)
    7. Execute in console:
       window.__PHASER_GAME__.scene.isActive('BattleScene')
    8. Screenshot: .sisyphus/evidence/phase2-defeat.png
    9. Wait for: 3 seconds (defeat handler should restart or show game over)
  Expected Result: Defeat message shown, game handles gracefully (no crash)
  Evidence: .sisyphus/evidence/phase2-defeat.png

Scenario: Regression — Phase 1 movement without encounter
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible
    3. Press: ArrowRight x3
    4. Wait for: 300ms between each press
    5. Press: ArrowDown x3
    6. Wait for: 300ms between each press
    7. Execute in console:
       window.__PHASER_GAME__.scene.isActive('BattleScene')
    8. Assert: Returns false (no battle triggered — stayed in non-encounter area)
    9. Execute in console:
       const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       JSON.stringify({ x: Math.round(p.x), y: Math.round(p.y) })
    10. Assert: Position approximately (88, 88) — tile (5,5) area
    11. Press: ArrowRight (toward wall at 5,5)
    12. Wait for: 300ms
    13. Execute in console:
        window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    14. Assert: Position unchanged (wall collision still works)
    15. Screenshot: .sisyphus/evidence/phase2-regression-movement.png
  Expected Result: Normal movement and collision work, no accidental battle triggers
  Evidence: .sisyphus/evidence/phase2-regression-movement.png

Scenario: Double-trigger guard prevents multiple battles
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Walk to encounter zone: ArrowRight x6, ArrowDown x8 (with delays)
    3. Wait for: 500ms
    4. Execute in console:
       window.__PHASER_GAME__.scene.isActive('BattleScene')
    5. Assert: Returns true
    6. Execute in console:
       // Count active BattleScene instances
       window.__PHASER_GAME__.scene.getScenes(true).filter(s => s.scene.key === 'BattleScene').length
    7. Assert: Returns 1 (only one BattleScene active)
  Expected Result: Only one battle instance, no double-trigger
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(battle): wire encounter detection, scene transitions, and complete Phase 2 integration`
- Files: `src/game/main.ts`, `src/game/scenes/WorldScene.ts`, `src/game/scenes/BattleScene.ts` (minor update for wake)
- Pre-commit: `npm run build` + Playwright full integration test

---

## Commit Strategy

| After Task(s) | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(battle): add BattleState enum, battle constants, and Slime enemy data` | Constants.ts, enemies.ts | `npm run build` |
| 3 | `feat(map): add encounter zone layer to tilemap with 3x3 slime zone` | tiles.png, test-map.json | JSON valid, files exist |
| 4 | `feat(player): add HP/attack/defense stats and load slime asset` | Player.ts, Boot.ts, slime.png | `npm run build` + Playwright stats check |
| 6 | `feat(battle): implement BattleSystem turn-based state machine` | BattleSystem.ts | `npm run build` |
| 7 | `feat(battle): implement BattleScene with HP bars, Attack menu, and state-driven UI` | BattleScene.ts | `npm run build` |
| 8 | `feat(battle): wire encounter detection, scene transitions, and complete Phase 2 integration` | main.ts, WorldScene.ts, BattleScene.ts | Full integration test |

---

## Success Criteria

### Final Verification Commands
```bash
# TypeScript build check
npm run build

# Start dev server for Playwright testing
npm run dev
```

### Final Checklist (maps to Phase 2 Success Criteria)
- [ ] **SC1**: Walking into encounter zone (tiles 8,10-10,12) triggers BattleScene
- [ ] **SC2**: Battle UI shows player HP bar, enemy HP bar with name, "Attack" option
- [ ] **SC3**: Pressing Enter on "Attack" deals damage to enemy (HP bar decreases)
- [ ] **SC4**: Enemy attacks on its turn (player HP bar decreases)
- [ ] **SC5**: Battle ends when enemy HP = 0 → victory message → return to world at same position
- [ ] **SC6**: Player can move normally after returning from battle (regression)
- [ ] **SC7**: Player defeat (HP = 0) shows defeat message and handles gracefully
- [ ] **SC8**: `npm run build` succeeds with zero TypeScript errors
- [ ] **SC9**: No console errors during gameplay
- [ ] **SC10**: Phase 1 movement/collision/camera still works (regression)

---

## TODO List (ADD THESE)

> CALLER: Add these TODOs using TodoWrite/TaskCreate and execute by wave.

### Wave 1 (Start Immediately - No Dependencies)

- [ ] **1. Extend Constants + Create Enemy Data**
  - What: Add BattleState enum + battle constants to Constants.ts. Create src/game/data/enemies.ts with Slime definition.
  - Depends: None
  - Blocks: 4, 5, 6, 7, 8
  - Category: `quick`
  - Skills: []
  - QA: `npm run build` + grep for BattleState, ENEMIES.slime

- [ ] **2. Create Placeholder Slime Sprite**
  - What: Create 32x32 PNG placeholder at public/assets/sprites/slime.png
  - Depends: None
  - Blocks: 4, 7
  - Category: `quick`
  - Skills: []
  - QA: File exists, valid PNG, 32x32 dimensions

### Wave 2 (After Wave 1 Completes)

- [ ] **3. Update Tileset + Tilemap with Encounter Zone**
  - What: Expand tiles.png to 48x16 (3 tiles). Add encounters layer to test-map.json with 3x3 zone at tiles (8,10)-(10,12). Set opacity 0.
  - Depends: None (can start Wave 1 but grouped in Wave 2)
  - Blocks: 5, 8
  - Category: `unspecified-low`
  - Skills: []
  - QA: python3 JSON check for encounters layer, tileset dimensions

- [ ] **4. Add Player Stats + Load Slime Asset in Boot**
  - What: Add hp/maxHp/attack/defense to Player.ts with defaults. Add takeDamage/isAlive/resetStats methods. Load slime.png in Boot.ts.
  - Depends: 1, 2
  - Blocks: 7, 8
  - Category: `unspecified-low`
  - Skills: []
  - QA: Playwright — player stats correct, slime texture loaded, movement regression

### Wave 3 (After Wave 2 Completes)

- [ ] **5. Add Encounter Detection Hook to GridPhysics**
  - What: Add onMoveComplete callback to GridPhysics.ts. Fire after isMoving=false with (tileX, tileY).
  - Depends: 1, 3
  - Blocks: 8
  - Category: `quick`
  - Skills: []
  - QA: Playwright — callback fires with correct position after move, does NOT fire on blocked move

- [ ] **6. Implement BattleSystem State Machine**
  - What: Create src/game/systems/BattleSystem.ts. Pure logic class with INTRO→PLAYER_TURN→ENEMY_TURN→CHECK_END→VICTORY/DEFEAT flow. Damage formula with MIN_DAMAGE clamping. Callback-based events.
  - Depends: 1
  - Blocks: 7
  - Category: `unspecified-high`
  - Skills: []
  - QA: `npm run build` + grep for state transitions, no Phaser imports

### Wave 4 (After Wave 3 Completes)

- [ ] **7. Implement BattleScene with UI + Keyboard Input**
  - What: Create src/game/scenes/BattleScene.ts. Dark purple background, enemy sprite, HP bars (Graphics), Attack menu, state-driven messages, keyboard input (Enter/Space). Input blocked during non-PLAYER_TURN states.
  - Depends: 1, 4, 6
  - Blocks: 8
  - Category: `visual-engineering`
  - Skills: [`frontend-ui-ux`]
  - QA: Playwright — BattleScene renders, Attack reduces HP, input blocked during wrong states

### Wave 5 (After Wave 4 Completes)

- [ ] **8. Wire Encounter Detection + Scene Transitions + Integration QA**
  - What: Add BattleScene to main.ts scene array. Wire GridPhysics onMoveComplete in WorldScene to detect encounters layer. Use scene.sleep/wake pattern. Handle battle return (wake WorldScene with player HP). Handle defeat (restart game). Run ALL success criteria + regression tests.
  - Depends: 3, 4, 5, 7
  - Blocks: None (final)
  - Category: `unspecified-high`
  - Skills: [`playwright`]
  - QA: Playwright — full battle flow (encounter → fight → victory → return), defeat handling, regression (movement/collision), double-trigger guard

## Execution Instructions

1. **Wave 1**: Fire these tasks IN PARALLEL (no dependencies)
   ```
   delegate_task(category="quick", load_skills=[], run_in_background=false, prompt="Task 1: Extend Constants.ts with BattleState enum and battle constants. Create src/game/data/enemies.ts with Slime enemy data. [full task details from plan]")
   delegate_task(category="quick", load_skills=[], run_in_background=false, prompt="Task 2: Create placeholder 32x32 slime sprite at public/assets/sprites/slime.png. [full task details from plan]")
   ```

2. **Wave 2**: After Wave 1 completes, fire next wave IN PARALLEL
   ```
   delegate_task(category="unspecified-low", load_skills=[], run_in_background=false, prompt="Task 3: Update tileset and tilemap with encounter zone layer... [full details]")
   delegate_task(category="unspecified-low", load_skills=[], run_in_background=false, prompt="Task 4: Add stats to Player entity and load slime asset in Boot... [full details]")
   ```

3. **Wave 3**: After Wave 2, fire Tasks 5 and 6 IN PARALLEL
   ```
   delegate_task(category="quick", load_skills=[], run_in_background=false, prompt="Task 5: Add encounter detection hook to GridPhysics... [full details]")
   delegate_task(category="unspecified-high", load_skills=[], run_in_background=false, prompt="Task 6: Implement BattleSystem state machine... [full details]")
   ```

4. **Wave 4**: After Wave 3, fire Task 7 (solo — complex UI)
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"], run_in_background=false, prompt="Task 7: Implement BattleScene with UI and keyboard input... [full details]")
   ```

5. **Wave 5**: After Wave 4, fire Task 8 (final integration)
   ```
   delegate_task(category="unspecified-high", load_skills=["playwright"], run_in_background=false, prompt="Task 8: Wire encounter detection, scene transitions, integration QA... [full details]")
   ```

6. **Final QA**: Verify all 10 success criteria pass via Playwright
