# Phase 4: World Expansion

## TL;DR

> **Quick Summary**: Expand the RPG from a 20x20 test map into a full multi-room dungeon (~50x40 tiles) with 3 new enemy types, NPC dialogue, story trigger zones, a boss encounter, and a victory scene. All using existing battle mechanics with stat variety only.
>
> **Deliverables**:
> - Large dungeon tilemap (replaces test-map.json) with 5+ rooms connected by corridors
> - 3 new enemy types (Rat, Bat, Skeleton) with distinct stats and placeholder sprites
> - Boss enemy (Dark Knight) with harder stats and placeholder sprite
> - NPC entity class + DialogueSystem overlay for WorldScene
> - Dialogue data file with NPC conversations
> - Story trigger zones that fire one-time text overlays on walk-over
> - VictoryScene that displays after boss defeat
> - Expanded tileset with visual variety (floor variants, decorative tiles)
> - Updated tests covering all new content
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2 → Tasks 3,4,5 (parallel) → Task 6 → Task 7 → Task 8

---

## Context

### Original Request
Create a detailed execution plan for Phase 4: World Expansion of the Phaser 3 + TypeScript RPG. Expand from a small test map to a full dungeon with multiple enemy types, NPC dialogue, story beats, a boss fight, and a victory screen.

### Interview Summary
**Key Decisions**:
- Map: One large continuous Tiled map (~50x40 tiles), rooms connected by corridors
- Enemies: Stat variety only (3+ types with different HP/ATK/DEF/XP), NO new battle mechanics
- Boss: Same battle system, harder stats, no phase mechanics. `isBoss?: boolean` on `EnemyData`
- Dialogue: Minimal viable — text box overlay in WorldScene, Enter/Space to advance
- Story beats: Triggered by NPC interaction OR walk-over trigger zones (one-time, tracked in Set)
- Victory screen: Simple new scene after boss defeat, Enter/Space returns to TitleScene
- Assets: 16x16 programmatic placeholders (solid-color PNGs like existing player.png and slime.png)
- Old test-map.json is REPLACED by new dungeon map (not kept alongside)
- Boss death = same as regular death (back to TitleScene)
- NPC interaction uses Enter/Space (consistent with battle input)

### Metis Review
**Identified Gaps (addressed)**:
- `BattleSystem.test.ts` has inline `EnemyData` objects missing `xpReward` — `isBoss` MUST be optional to avoid breaking these
- `assets.test.ts` auto-discovers all map JSON files — replacing test-map.json avoids test conflicts
- Map JSON for 50x40 is ~2000 tiles per layer — must be generated programmatically, not hand-written
- No existing NPC/dialogue infrastructure — building from scratch following existing patterns
- Camera bounds already use `map.widthInPixels` so scrolling works out of the box
- `defeatedEncounters` resets on scene restart (class property), which is correct behavior

---

## Work Objectives

### Core Objective
Transform the RPG from a small test room into a full dungeon experience with enemy variety, NPC storytelling, and a boss climax, all built on the existing battle system and grid movement.

### Concrete Deliverables
- `public/assets/maps/dungeon.json` — 50x40 Tiled-format map with 5+ rooms
- `public/assets/maps/tiles.png` — Expanded tileset (6-8 tiles for visual variety)
- `public/assets/sprites/rat.png` — 16x16 enemy sprite
- `public/assets/sprites/bat.png` — 16x16 enemy sprite
- `public/assets/sprites/skeleton.png` — 16x16 enemy sprite
- `public/assets/sprites/dark-knight.png` — 16x16 boss sprite
- `public/assets/sprites/npc.png` — 16x16 NPC sprite
- `src/game/data/enemies.ts` — Expanded with Rat, Bat, Skeleton, Dark Knight
- `src/game/entities/NPC.ts` — NPC entity class
- `src/game/systems/DialogueSystem.ts` — Text overlay system for WorldScene
- `src/game/data/dialogues.ts` — NPC dialogue data
- `src/game/data/story.ts` — Story trigger zone data
- `src/game/scenes/VictoryScene.ts` — Post-boss victory screen
- Modified: `Boot.ts`, `WorldScene.ts`, `Constants.ts`, `main.ts`
- Modified: `BattleScene.ts` (boss→VictoryScene routing)
- New/updated tests for all additions

### Definition of Done
- [ ] `npx vitest run` — all tests pass (0 failures)
- [ ] `npm run build` — exits with code 0
- [ ] Dungeon map has 5+ distinct rooms connected by corridors
- [ ] 4 enemy types appear on the map (Slime, Rat, Bat, Skeleton)
- [ ] Boss (Dark Knight) appears in the final room
- [ ] Can interact with NPCs to see dialogue text overlay
- [ ] Story trigger zones display text when walked over (one-time)
- [ ] Defeating boss transitions to VictoryScene
- [ ] VictoryScene allows return to TitleScene via Enter/Space
- [ ] All existing gameplay flows still work (battle, XP, leveling)

### Must Have
- 3+ new enemy types with stat variety (different HP/ATK/DEF/XP)
- Boss encounter with significantly higher stats
- Navigable multi-room dungeon taking ~15 minutes to explore
- NPC dialogue via text overlay (Enter/Space to advance)
- Story beats at key dungeon locations
- Victory screen after boss defeat
- All tests passing

### Must NOT Have (Guardrails)
- NO new battle mechanics (no magic, items, flee, phases)
- NO changes to damage formula in `BattleSystem.ts`
- NO animated enemy/NPC sprites (static `Image` only, like existing slime)
- NO changes to `TILE_SIZE`, `CANVAS_WIDTH`, `CANVAS_HEIGHT`, or `ZOOM`
- NO external UI library or dialogue framework
- NO save/load/checkpoint system
- NO NPC movement or pathfinding (NPCs are static)
- NO dialogue branching or choices (linear text only)
- NO typewriter text effect or text animation
- NO sound effects or music
- NO inventory system
- NO multiple map files (single continuous map)
- NO dynamic encounter spawning or respawning
- NO comments in source code (team convention)
- NO mouse input (keyboard only)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> Every criterion is verified by running a command or using a tool.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: YES (tests-after — add tests to verify data integrity and assets)
- **Framework**: vitest

### Agent-Executed QA Scenarios

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| Data files (enemies, dialogue, story) | Bash (npx vitest run) | Run test suite, assert pass |
| Asset files (sprites, tileset, map) | Bash (npx vitest run) | Asset tests validate existence + structure |
| Scenes (VictoryScene) | Playwright | Navigate game flow, verify scene loads |
| Systems (DialogueSystem) | Playwright | Interact with NPC, verify overlay |
| Integration (full dungeon flow) | Playwright | Play through dungeon, verify all systems |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation):
├── Task 1: Placeholder sprites (all new PNGs)
└── Task 2: Enemy data expansion + boss flag

Wave 2 (After Wave 1 — Map + Core Systems, parallel):
├── Task 3: Expanded tileset + dungeon map + constants update
├── Task 4: Dialogue system + dialogue data
└── Task 5: VictoryScene

Wave 3 (After Wave 2 — Integration):
├── Task 6: NPC entity + WorldScene NPC integration
└── Task 7: Story trigger zones + WorldScene trigger integration

Wave 4 (After Wave 3 — Final Wiring):
└── Task 8: WorldScene encounter expansion + boss routing + Boot.ts + full integration

Critical Path: Task 1 → Task 3 → Task 8
Parallel Speedup: ~35% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 6, 8 | 2 |
| 2 | None | 8 | 1 |
| 3 | 1 | 6, 7, 8 | 4, 5 |
| 4 | None | 6, 7 | 3, 5 |
| 5 | None | 8 | 3, 4 |
| 6 | 3, 4 | 8 | 7 |
| 7 | 3, 4 | 8 | 6 |
| 8 | 2, 3, 5, 6, 7 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2 | quick (simple data/asset tasks) |
| 2 | 3, 4, 5 | unspecified-high (map gen), quick (dialogue data), quick (VictoryScene) |
| 3 | 6, 7 | unspecified-low (NPC entity), unspecified-low (triggers) |
| 4 | 8 | deep (complex integration of all systems) |

---

## TODOs

- [ ] 1. Create Placeholder Sprite Assets

  **What to do**:
  - Create 16x16 PNG placeholder sprites for each new entity:
    - `public/assets/sprites/rat.png` — brown-ish colored 16x16 (e.g., #8B4513 body)
    - `public/assets/sprites/bat.png` — dark purple 16x16 (e.g., #4B0082 body)
    - `public/assets/sprites/skeleton.png` — white/bone colored 16x16 (e.g., #D3D3D3 body)
    - `public/assets/sprites/dark-knight.png` — dark red/black 16x16 (e.g., #8B0000 body)
    - `public/assets/sprites/npc.png` — blue colored 16x16 (e.g., #4169E1 body)
  - Each sprite should be a simple solid-color rectangle with minimal pixel detail (1-2 features to distinguish), matching the art style of existing `slime.png` and `player.png`
  - Use any programmatic PNG generation method (Node canvas, sharp, or manual pixel creation)

  **Must NOT do**:
  - NO animated spritesheets (single static frame per enemy)
  - NO sprites larger than 16x16
  - NO complex art — these are placeholders

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple asset generation, no complex logic
  - **Skills**: [`dev`]
    - `dev`: File creation and asset generation tooling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 6, 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `public/assets/sprites/slime.png` — Reference for art style and size (16x16 placeholder sprite)
  - `public/assets/sprites/player.png` — Reference for spritesheet dimensions (16x16 per frame)

  **Acceptance Criteria**:

  - [ ] File exists: `public/assets/sprites/rat.png` (16x16 PNG)
  - [ ] File exists: `public/assets/sprites/bat.png` (16x16 PNG)
  - [ ] File exists: `public/assets/sprites/skeleton.png` (16x16 PNG)
  - [ ] File exists: `public/assets/sprites/dark-knight.png` (16x16 PNG)
  - [ ] File exists: `public/assets/sprites/npc.png` (16x16 PNG)
  - [ ] Each file is a valid PNG with dimensions 16x16

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: All sprite files exist and are valid PNGs
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: file public/assets/sprites/rat.png
      2. Assert: output contains "PNG image data, 16 x 16"
      3. Run: file public/assets/sprites/bat.png
      4. Assert: output contains "PNG image data, 16 x 16"
      5. Run: file public/assets/sprites/skeleton.png
      6. Assert: output contains "PNG image data, 16 x 16"
      7. Run: file public/assets/sprites/dark-knight.png
      8. Assert: output contains "PNG image data, 16 x 16"
      9. Run: file public/assets/sprites/npc.png
      10. Assert: output contains "PNG image data, 16 x 16"
    Expected Result: All 5 sprites are valid 16x16 PNGs
    Failure Indicators: "file not found" or dimensions != 16x16
  ```

  **Commit**: YES
  - Message: `feat(assets): add placeholder sprites for new enemies, boss, and NPC`
  - Files: `public/assets/sprites/rat.png`, `bat.png`, `skeleton.png`, `dark-knight.png`, `npc.png`

---

- [ ] 2. Expand Enemy Data + Add Boss Flag

  **What to do**:
  - Add `isBoss?: boolean` optional field to `EnemyData` interface in `src/game/data/enemies.ts`
  - Add 3 new enemy entries to `ENEMIES` record:
    - `rat`: { key: 'rat', name: 'Rat', hp: 8, attack: 6, defense: 1, spriteKey: 'rat', xpReward: 10 }
    - `bat`: { key: 'bat', name: 'Bat', hp: 10, attack: 7, defense: 3, spriteKey: 'bat', xpReward: 18 }
    - `skeleton`: { key: 'skeleton', name: 'Skeleton', hp: 20, attack: 9, defense: 5, spriteKey: 'skeleton', xpReward: 30 }
  - Add boss entry:
    - `darkKnight`: { key: 'darkKnight', name: 'Dark Knight', hp: 50, attack: 14, defense: 8, spriteKey: 'dark-knight', xpReward: 100, isBoss: true }
  - Update `src/game/__tests__/assets.test.ts`:
    - Add sprite existence assertions for rat.png, bat.png, skeleton.png, dark-knight.png, npc.png
  - Verify existing tests still pass (enemies.test.ts auto-iterates all entries)

  **Stat Balance Rationale** (using damage formula: `atk - def/2 + floor(random()*3) + 1, min 1`):
  - Rat (early game): Low HP, dies fast. Warrior Lv1 (ATK 12) vs Rat (DEF 1) = ~12.5 avg damage → 1 hit kill
  - Slime (early game): Existing. Warrior Lv1 vs Slime (DEF 2) = ~12 avg → 1 hit kill
  - Bat (mid game): Moderate. Warrior Lv1 vs Bat (DEF 3) = ~11.5 avg → 1 hit kill but Bat hits harder back
  - Skeleton (late game): Tanky. Warrior Lv1 vs Skeleton (DEF 5) = ~10.5 avg → 2 hits. Warrior Lv3 (ATK 16) vs Skeleton = ~14.5 avg → 2 hits
  - Dark Knight (boss): Very tanky. Warrior Lv5 (ATK 20) vs DK (DEF 8) = ~17 avg → 3 hits. DK (ATK 14) vs Warrior Lv5 (DEF 17) = ~7.5 avg → need ~8 HP per hit, Warrior Lv5 HP = 62, so ~8 rounds survivable

  **Must NOT do**:
  - Do NOT add any fields beyond `isBoss?: boolean` to EnemyData
  - Do NOT change existing Slime data
  - Do NOT modify `BattleSystem.ts` damage formula
  - `isBoss` MUST be optional (to avoid breaking BattleSystem.test.ts inline objects at lines 95 and 155)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small data file changes, straightforward additions
  - **Skills**: [`dev`]
    - `dev`: TypeScript data file editing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/game/data/enemies.ts:1-21` — EnemyData interface and ENEMIES record structure (follow exactly)
  - `src/game/data/classes.ts:1-11` — ClassData interface pattern (shows how interfaces are structured in this project)

  **Test References**:
  - `src/game/data/__tests__/enemies.test.ts:1-34` — Auto-iterates all ENEMIES entries, validates positive stats, matching keys, non-empty names/spriteKeys, positive xpReward. New enemies are automatically tested.
  - `src/game/systems/__tests__/BattleSystem.test.ts:93-96` — Inline EnemyData object WITHOUT xpReward (must not break when isBoss is added — hence optional field)
  - `src/game/systems/__tests__/BattleSystem.test.ts:153-155` — Another inline EnemyData object WITHOUT xpReward

  **API/Type References**:
  - `src/game/systems/BattleSystem.ts:23-27` — BattleSystem constructor accepts EnemyData, uses hp/attack/defense/name only (not xpReward, not isBoss). Confirms isBoss doesn't need BattleSystem changes.

  **Asset References**:
  - `src/game/__tests__/assets.test.ts:101-109` — Sprite existence tests. Need to add assertions for new sprites.

  **Acceptance Criteria**:

  - [ ] `EnemyData` interface has `isBoss?: boolean` field
  - [ ] `ENEMIES` record has 5 entries: slime, rat, bat, skeleton, darkKnight
  - [ ] darkKnight has `isBoss: true`
  - [ ] All other enemies do NOT have `isBoss` set (or have `isBoss: false`)
  - [ ] `npx vitest run src/game/data/__tests__/enemies.test.ts` → PASS
  - [ ] `npx vitest run src/game/systems/__tests__/BattleSystem.test.ts` → PASS
  - [ ] `npx vitest run src/game/__tests__/assets.test.ts` → PASS (after sprite assertions added)
  - [ ] `npx vitest run` → ALL tests pass (0 failures)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: All enemy data is valid and tests pass
    Tool: Bash
    Preconditions: Task 1 sprites exist
    Steps:
      1. Run: npx vitest run src/game/data/__tests__/enemies.test.ts
      2. Assert: output contains "5 passed" (slime + rat + bat + skeleton + darkKnight)
      3. Assert: exit code 0
      4. Run: npx vitest run src/game/systems/__tests__/BattleSystem.test.ts
      5. Assert: exit code 0 (inline EnemyData objects still work)
      6. Run: npx vitest run
      7. Assert: exit code 0
    Expected Result: All tests pass, no regressions
    Failure Indicators: Any test failure, especially BattleSystem tests

  Scenario: Boss enemy has correct flag
    Tool: Bash
    Preconditions: enemies.ts modified
    Steps:
      1. Run: grep -c "isBoss: true" src/game/data/enemies.ts
      2. Assert: output is "1" (only darkKnight)
      3. Run: grep "isBoss?" src/game/data/enemies.ts
      4. Assert: output contains "isBoss?: boolean" (optional field)
    Expected Result: Exactly one boss, field is optional
    Failure Indicators: isBoss not optional, multiple bosses
  ```

  **Commit**: YES
  - Message: `feat(enemies): add rat, bat, skeleton, and dark knight boss with stat variety`
  - Files: `src/game/data/enemies.ts`, `src/game/__tests__/assets.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 3. Create Expanded Tileset + Dungeon Map + Update Constants

  **What to do**:
  - **Expand tileset** (`public/assets/maps/tiles.png`):
    - Expand from 3 tiles (48x16) to 6-8 tiles (96-128x16)
    - Keep existing tile 1 (ground) and tile 2 (wall, with `collides: true`)
    - Add: tile 3 = darker floor variant, tile 4 = decorative floor (cracks/pattern), tile 5 = corridor floor variant, tile 6 = boss room floor variant
    - Generate programmatically (different colored 16x16 squares)
  - **Generate dungeon map** (`public/assets/maps/dungeon.json`):
    - Replace `public/assets/maps/test-map.json` (delete old, create new at `dungeon.json`)
    - Dimensions: 50 tiles wide x 40 tiles tall (800x640 pixels)
    - Layout (rooms connected by corridors):
      ```
      ┌──────────┐     ┌──────────┐
      │ Entrance │─────│  Room 2  │
      │ (spawn)  │     │ (rats)   │
      └────┬─────┘     └────┬─────┘
           │                │
      ┌────┴─────┐     ┌────┴─────┐
      │  Room 3  │─────│  Room 4  │
      │ (bats)   │     │(skeletons)│
      └────┬─────┘     └────┬─────┘
           │                │
           └───────┬────────┘
              ┌────┴─────┐
              │ Boss Room│
              │(dark knt)│
              └──────────┘
      ```
    - Two layers: `ground` (all floor tiles, variety for visual interest) and `walls` (border walls + room walls with corridors cut through)
    - Wall tiles must have `collides: true` property in tileset definition (same as existing)
    - Use tile variety: entrance room uses tile 1, other rooms use tiles 3-4, corridors use tile 5, boss room uses tile 6
    - Write a Node.js script to generate the JSON programmatically — do NOT hand-write 4000+ tile entries
    - Delete the generated script after producing the JSON (it's throwaway)
  - **Update tileset metadata** in the map JSON:
    - `tilecount` updated to match new tile count
    - `imagewidth` updated to match new PNG width
    - `columns` updated
    - Tile properties: tile ID 1 keeps `collides: true`
  - **Update Boot.ts**:
    - Change tilemap key from `'test-map'` to `'dungeon'`
    - Change tilemap path from `'assets/maps/test-map.json'` to `'assets/maps/dungeon.json'`
  - **Update WorldScene.ts**:
    - Change `this.make.tilemap({ key: 'test-map' })` to `this.make.tilemap({ key: 'dungeon' })`
  - **Update Constants.ts**:
    - `MAP_WIDTH = 50` (was 20)
    - `MAP_HEIGHT = 40` (was 20)
    - `PLAYER_SPAWN_X` and `PLAYER_SPAWN_Y` to entrance room position (e.g., 5, 5)
  - **Delete** `public/assets/maps/test-map.json`

  **Must NOT do**:
  - Do NOT change `TILE_SIZE` (stays 16)
  - Do NOT change `CANVAS_WIDTH`, `CANVAS_HEIGHT`, or `ZOOM`
  - Do NOT create multiple map files
  - Do NOT add new layers beyond `ground` and `walls`
  - Do NOT change how collision detection works (`setCollisionByProperty({ collides: true })`)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex programmatic map generation with room layout logic, tileset creation, multi-file coordination
  - **Skills**: [`dev`]
    - `dev`: Node.js scripting, JSON generation, PNG creation, multi-file edits

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: Task 1 (needs tileset sprite to exist for validation)

  **References**:

  **Pattern References**:
  - `public/assets/maps/test-map.json:1-868` — Complete Tiled JSON format with ground+walls layers, tileset metadata, tile properties. NEW map must follow this exact structure.
  - `public/assets/maps/tiles.png` — Current 48x16 (3 tiles) tileset. Must be replaced with wider image containing 6-8 tiles.

  **API/Type References**:
  - `src/game/utils/Constants.ts:1-9` — MAP_WIDTH, MAP_HEIGHT, PLAYER_SPAWN_X, PLAYER_SPAWN_Y that must be updated
  - `src/game/scenes/Boot.ts:10-11` — Tilemap loading: `load.tilemapTiledJSON('test-map', ...)` and `load.image('tiles', ...)` — key and path references
  - `src/game/scenes/WorldScene.ts:42` — `this.make.tilemap({ key: 'test-map' })` — must update to new key

  **Test References**:
  - `src/game/__tests__/assets.test.ts:13-98` — Auto-discovers all .json in maps dir. Tests: valid JSON, required Tiled fields, correct tile counts per layer, tileset image references exist, dimensions match MAP_WIDTH/MAP_HEIGHT constants. NEW map must pass ALL of these automatically.

  **Acceptance Criteria**:

  - [ ] `public/assets/maps/test-map.json` is DELETED
  - [ ] `public/assets/maps/dungeon.json` exists and is valid Tiled JSON
  - [ ] `public/assets/maps/tiles.png` has 6+ tiles (96+ pixels wide, 16 pixels tall)
  - [ ] Map dimensions: width=50, height=40, tilewidth=16, tileheight=16
  - [ ] Map has exactly 2 layers: `ground` and `walls`
  - [ ] Ground layer has 50*40 = 2000 tile entries
  - [ ] Walls layer has 2000 tile entries with border walls and room walls
  - [ ] Tileset references `tiles.png` with correct dimensions
  - [ ] Wall tile still has `collides: true` property
  - [ ] Constants.ts: `MAP_WIDTH = 50`, `MAP_HEIGHT = 40`
  - [ ] Constants.ts: `PLAYER_SPAWN_X` and `PLAYER_SPAWN_Y` set to valid walkable tile in entrance room
  - [ ] Boot.ts loads `'dungeon'` key from `'assets/maps/dungeon.json'`
  - [ ] WorldScene.ts uses `{ key: 'dungeon' }`
  - [ ] `npx vitest run src/game/__tests__/assets.test.ts` → PASS
  - [ ] `npx vitest run` → ALL tests pass
  - [ ] Map has distinct rooms connected by corridors (visually verifiable via Playwright)
  - [ ] Throwaway generation script is deleted after use

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Dungeon map passes all asset tests
    Tool: Bash
    Preconditions: dungeon.json and updated tiles.png exist
    Steps:
      1. Run: ls public/assets/maps/test-map.json
      2. Assert: "No such file" (deleted)
      3. Run: ls public/assets/maps/dungeon.json
      4. Assert: file exists
      5. Run: npx vitest run src/game/__tests__/assets.test.ts
      6. Assert: exit code 0
      7. Assert: output shows "dungeon.json" being tested
    Expected Result: Old map gone, new map passes all validation
    Failure Indicators: test-map.json still exists, or dungeon.json fails validation

  Scenario: Map has correct room structure
    Tool: Bash
    Preconditions: dungeon.json exists
    Steps:
      1. Run: node -e "const m=require('./public/assets/maps/dungeon.json'); console.log('width:', m.width, 'height:', m.height, 'layers:', m.layers.length, 'ground tiles:', m.layers[0].data.length, 'wall tiles:', m.layers[1].data.length)"
      2. Assert: output is "width: 50 height: 40 layers: 2 ground tiles: 2000 wall tiles: 2000"
      3. Run: node -e "const m=require('./public/assets/maps/dungeon.json'); const walls=m.layers[1].data; const wallCount=walls.filter(t=>t>0).length; const openCount=walls.filter(t=>t===0).length; console.log('walls:', wallCount, 'open:', openCount)"
      4. Assert: wall count > 200 (substantial walls) and open count > 500 (substantial open space for rooms)
    Expected Result: Map has correct dimensions with meaningful room structure
    Failure Indicators: Wrong dimensions, all walls, or all open

  Scenario: Player can spawn and move in dungeon
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Navigate to http://localhost:8080
      2. Wait for canvas visible (timeout: 5s)
      3. Press Enter (start game)
      4. Wait 500ms
      5. Type "HERO" for name, press Enter
      6. Press Enter (select Warrior)
      7. Wait 1000ms for WorldScene to load
      8. Assert: canvas is rendering (not black screen)
      9. Press ArrowRight 3 times (300ms between)
      10. Press ArrowDown 3 times (300ms between)
      11. Screenshot: .sisyphus/evidence/task-3-dungeon-spawn.png
    Expected Result: Player spawns in entrance room and can move
    Evidence: .sisyphus/evidence/task-3-dungeon-spawn.png
  ```

  **Commit**: YES
  - Message: `feat(map): replace test map with 50x40 multi-room dungeon`
  - Files: `public/assets/maps/dungeon.json`, `public/assets/maps/tiles.png`, `src/game/utils/Constants.ts`, `src/game/scenes/Boot.ts`, `src/game/scenes/WorldScene.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 4. Create DialogueSystem + Dialogue Data

  **What to do**:
  - **Create `src/game/data/dialogues.ts`**:
    - Export `DialogueLine` interface: `{ speaker: string; text: string }`
    - Export `DIALOGUES: Record<string, DialogueLine[]>` — keyed by NPC/trigger ID
    - Include dialogue entries for:
      - `'old-man'`: 3-4 lines of intro guidance ("Welcome, brave adventurer...", "The Dark Knight lurks in the depths...", "Be careful and grow stronger...")
      - `'guard'`: 2-3 lines of midpoint encouragement ("You've come far...", "The boss room is ahead...")
      - `'ghost'`: 2-3 lines of pre-boss warning ("Turn back if you value your life...", "The Dark Knight has never been defeated...")
    - Also include story trigger dialogue:
      - `'entrance-trigger'`: 1-2 lines ("You enter the ancient dungeon. A chill runs down your spine...")
      - `'midpoint-trigger'`: 1-2 lines ("The air grows heavier. Something powerful waits below...")
      - `'boss-door-trigger'`: 1-2 lines ("A massive door blocks the path. You can feel dark energy beyond it...")
  - **Create `src/game/systems/DialogueSystem.ts`**:
    - Class that creates a text overlay within WorldScene
    - Constructor takes `scene: Scene` parameter
    - `show(dialogueKey: string)` method:
      - Looks up `DIALOGUES[dialogueKey]`
      - Creates semi-transparent black background rectangle (`fillStyle(0x000000, 0.8)`) at bottom of viewport
      - Shows speaker name (if provided) in yellow + text content in white
      - Positions relative to camera viewport (not world coordinates) using `scene.cameras.main.scrollX/scrollY`
      - Sets `this.isActive = true`
    - `advance()` method:
      - Moves to next line in dialogue array
      - If last line, calls `hide()` and sets `this.isActive = false`
    - `hide()` method:
      - Destroys all overlay game objects
    - `getIsActive(): boolean` — returns whether dialogue is showing
    - The overlay must render ON TOP of the game world (use high depth value: `setDepth(1000)`)
    - Position the dialogue box at the bottom of the camera viewport:
      - Background: full width of viewport, ~60px tall, at bottom
      - Text: padded inside the background
  - **Create `src/game/data/__tests__/dialogues.test.ts`**:
    - Test that DIALOGUES has expected keys
    - Test that each dialogue entry has at least 1 line
    - Test that each line has non-empty text
    - Test that each line has a non-empty speaker

  **Must NOT do**:
  - NO typewriter text effect
  - NO text animation
  - NO dialogue choices or branching
  - NO portrait images alongside text
  - NO external UI library
  - NO comments in code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Well-defined data file + straightforward Phaser text overlay
  - **Skills**: [`dev`]
    - `dev`: TypeScript class creation following existing patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: None (DialogueSystem is standalone, no asset dependencies)

  **References**:

  **Pattern References**:
  - `src/game/data/enemies.ts:1-21` — Data file pattern: interface + exported Record. Follow this exact structure for dialogues.ts.
  - `src/game/scenes/BattleScene.ts:77-82` — Text rendering with `this.add.text()`, style objects with fontSize/color/wordWrap. Follow this for dialogue text.
  - `src/game/scenes/BattleScene.ts:62-65` — Graphics object for background rectangle: `this.add.graphics().fillStyle().fillRect()`. Use for dialogue box background.

  **Test References**:
  - `src/game/data/__tests__/enemies.test.ts:1-34` — Data test pattern: iterate entries, validate fields. Follow for dialogues.test.ts.

  **API/Type References**:
  - `src/game/systems/GridPhysics.ts:5-13` — System class pattern: takes scene + dependencies in constructor, exposes public methods + state getters.

  **Acceptance Criteria**:

  - [ ] `src/game/data/dialogues.ts` exists with `DIALOGUES` record containing 6+ keys
  - [ ] `src/game/systems/DialogueSystem.ts` exists with `show()`, `advance()`, `hide()`, `getIsActive()` methods
  - [ ] Each dialogue entry has at least 1 line with non-empty speaker and text
  - [ ] `npx vitest run src/game/data/__tests__/dialogues.test.ts` → PASS
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Dialogue data is complete and valid
    Tool: Bash
    Preconditions: dialogues.ts created
    Steps:
      1. Run: npx vitest run src/game/data/__tests__/dialogues.test.ts
      2. Assert: exit code 0
      3. Assert: all tests pass
    Expected Result: All dialogue entries validated
    Failure Indicators: Missing keys, empty text, test failures

  Scenario: DialogueSystem can be instantiated
    Tool: Bash
    Preconditions: DialogueSystem.ts created
    Steps:
      1. Run: npx tsc --noEmit src/game/systems/DialogueSystem.ts
      2. Assert: exit code 0 (no type errors)
    Expected Result: DialogueSystem compiles without errors
    Failure Indicators: Type errors
  ```

  **Commit**: YES
  - Message: `feat(dialogue): add dialogue system with NPC and story trigger text data`
  - Files: `src/game/data/dialogues.ts`, `src/game/systems/DialogueSystem.ts`, `src/game/data/__tests__/dialogues.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 5. Create VictoryScene

  **What to do**:
  - **Create `src/game/scenes/VictoryScene.ts`**:
    - Simple scene following `TitleScene.ts` pattern exactly
    - Background color: dark green or gold tint (e.g., `0x1a2e1a` or `0x2e2e1a`)
    - Display centered text:
      - "VICTORY!" in large font (~20px, white or gold)
      - "You defeated the Dark Knight!" (~12px, white)
      - "The dungeon is saved." (~12px, white)
    - Blinking "Press Enter to continue" text at bottom (use same tween pattern as TitleScene)
    - On Enter or Space: `this.scene.start('TitleScene')`
    - On create: clear registry (same as TitleScene does) — `this.game.registry.remove(...)` for playerName, playerClass, playerLevel, playerXp
  - **Update `src/game/main.ts`**:
    - Import VictoryScene
    - Add to scene array after BattleScene

  **Must NOT do**:
  - NO credits sequence
  - NO replay button
  - NO stats summary
  - NO animation beyond the blinking text
  - NO sound effects

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple scene, direct copy of TitleScene pattern with different text
  - **Skills**: [`dev`]
    - `dev`: TypeScript scene creation following existing pattern

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/game/scenes/TitleScene.ts:1-49` — EXACT template to follow. Same structure: constructor with super('VictoryScene'), create() with background color, centered text, blinking text, keyboard input, scene transition. Copy this and modify text content.
  - `src/game/scenes/TitleScene.ts:9-13` — Registry clearing pattern on scene create. VictoryScene should do the same.
  - `src/game/scenes/TitleScene.ts:31-37` — Blinking text tween pattern. Reuse exactly.
  - `src/game/scenes/TitleScene.ts:43-46` — Keyboard event binding pattern. Reuse for Enter/Space.

  **API/Type References**:
  - `src/game/main.ts:18-24` — Scene array where VictoryScene must be added

  **Acceptance Criteria**:

  - [ ] `src/game/scenes/VictoryScene.ts` exists
  - [ ] VictoryScene class extends `Scene` with key `'VictoryScene'`
  - [ ] Displays "VICTORY!" text
  - [ ] Has blinking "Press Enter" text
  - [ ] Enter and Space both trigger `scene.start('TitleScene')`
  - [ ] Clears player registry on create (playerName, playerClass, playerLevel, playerXp)
  - [ ] VictoryScene is imported and added to scene array in `main.ts`
  - [ ] `npx vitest run` → ALL tests pass
  - [ ] `npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: VictoryScene is registered and compiles
    Tool: Bash
    Preconditions: VictoryScene.ts created, main.ts updated
    Steps:
      1. Run: grep "VictoryScene" src/game/main.ts
      2. Assert: output contains import AND scene array entry
      3. Run: npx tsc --noEmit
      4. Assert: exit code 0
      5. Run: npm run build
      6. Assert: exit code 0
    Expected Result: VictoryScene registered and builds
    Failure Indicators: Missing import, missing scene entry, build failure
  ```

  **Commit**: YES
  - Message: `feat(scenes): add VictoryScene displayed after boss defeat`
  - Files: `src/game/scenes/VictoryScene.ts`, `src/game/main.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 6. Create NPC Entity + Integrate into WorldScene

  **What to do**:
  - **Create `src/game/entities/NPC.ts`**:
    - Export `NPCData` interface: `{ key: string; name: string; dialogueKey: string; tileX: number; tileY: number }`
    - Export `NPC_SPAWNS: NPCData[]` array with 3 NPCs:
      - `{ key: 'old-man', name: 'Old Man', dialogueKey: 'old-man', tileX: <entrance room>, tileY: <entrance room> }`
      - `{ key: 'guard', name: 'Guard', dialogueKey: 'guard', tileX: <mid dungeon>, tileY: <mid dungeon> }`
      - `{ key: 'ghost', name: 'Ghost', dialogueKey: 'ghost', tileX: <near boss room>, tileY: <near boss room> }`
    - Tile coordinates must match walkable tiles adjacent to corridors in the dungeon map from Task 3
  - **Update `src/game/scenes/WorldScene.ts`** to add NPC support:
    - Import NPC_SPAWNS, DialogueSystem, DIALOGUES
    - Add class properties: `private npcs: { data: NPCData; sprite: Phaser.GameObjects.Image }[]`, `private dialogueSystem!: DialogueSystem`
    - In `create()`:
      - Instantiate DialogueSystem: `this.dialogueSystem = new DialogueSystem(this)`
      - Spawn NPC sprites at their tile positions (same pattern as encounter spawning): `this.add.image(pixelX, pixelY, 'npc')`
    - Add interaction input handler:
      - Listen for Enter/Space keydown
      - When pressed AND `!this.dialogueSystem.getIsActive()`:
        - Get player's facing direction from `gridPhysics.getLastDirection()`
        - Calculate the tile the player is facing (current tile + direction offset)
        - Check if any NPC is at that tile
        - If found: `this.dialogueSystem.show(npc.data.dialogueKey)`
      - When pressed AND `this.dialogueSystem.getIsActive()`:
        - Call `this.dialogueSystem.advance()`
    - Block movement while dialogue is active:
      - In `update()`: skip `this.gridPhysics.update(this.cursors)` when `this.dialogueSystem.getIsActive()`
    - IMPORTANT: Enter/Space must NOT trigger battle confirm while in WorldScene. Currently these keys are only bound in BattleScene, so no conflict.
  - **Update `src/game/scenes/Boot.ts`**:
    - Add: `this.load.image('npc', 'assets/sprites/npc.png')`

  **Must NOT do**:
  - NO NPC movement or pathfinding
  - NO NPC facing direction changes
  - NO NPC animation
  - Do NOT modify GridPhysics.ts (movement blocking happens in WorldScene.update)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Entity creation + WorldScene integration with clear patterns to follow
  - **Skills**: [`dev`]
    - `dev`: TypeScript entity creation and scene integration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Task 8
  - **Blocked By**: Task 3 (needs dungeon map for NPC tile coordinates), Task 4 (needs DialogueSystem)

  **References**:

  **Pattern References**:
  - `src/game/scenes/WorldScene.ts:7-12` — `EncounterSpawn` interface pattern. Follow for NPCData (key, tileX, tileY + name, dialogueKey).
  - `src/game/scenes/WorldScene.ts:14-18` — `ENCOUNTER_SPAWNS` array pattern. Follow for NPC_SPAWNS.
  - `src/game/scenes/WorldScene.ts:57-72` — Encounter sprite spawning in create(). Follow same pattern for NPC sprites.
  - `src/game/scenes/WorldScene.ts:100-121` — `gridPhysics.setOnMoveComplete` callback pattern. Reference for understanding how grid position is tracked.
  - `src/game/systems/GridPhysics.ts:86-92` — `getLastDirection()` public method. Use to determine which tile the player is facing for NPC interaction.

  **API/Type References**:
  - `src/game/systems/DialogueSystem.ts` — (created in Task 4) `show()`, `advance()`, `getIsActive()` methods to call from WorldScene
  - `src/game/utils/Constants.ts:11-17` — Direction enum values for calculating facing tile offset

  **Acceptance Criteria**:

  - [ ] `src/game/entities/NPC.ts` exists with NPCData interface and NPC_SPAWNS array
  - [ ] NPC_SPAWNS has 3 entries with valid tile coordinates in the dungeon map
  - [ ] WorldScene spawns NPC sprites at correct positions
  - [ ] Player can face an NPC and press Enter/Space to open dialogue
  - [ ] Dialogue overlay appears with correct text
  - [ ] Enter/Space advances dialogue to next line
  - [ ] Dialogue closes after last line
  - [ ] Player cannot move while dialogue is open
  - [ ] Player can move again after dialogue closes
  - [ ] Boot.ts loads 'npc' sprite
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: NPC is visible and interactable
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Navigate to http://localhost:8080
      2. Press Enter to start
      3. Type "HERO", press Enter
      4. Press Enter (select Warrior)
      5. Wait 1000ms for WorldScene
      6. Navigate player to Old Man NPC position (arrow keys based on spawn + NPC location)
      7. Face the NPC tile (press direction toward NPC)
      8. Press Enter
      9. Wait 500ms
      10. Screenshot: .sisyphus/evidence/task-6-npc-dialogue-open.png
      11. Assert: dialogue overlay visible (dark background at bottom of screen with text)
      12. Press Enter to advance dialogue
      13. Press Enter again to advance
      14. Press Enter to close (after last line)
      15. Wait 500ms
      16. Screenshot: .sisyphus/evidence/task-6-npc-dialogue-closed.png
      17. Press ArrowRight (verify movement works again)
    Expected Result: NPC dialogue opens, advances, closes, movement resumes
    Evidence: .sisyphus/evidence/task-6-npc-dialogue-open.png, task-6-npc-dialogue-closed.png

  Scenario: Movement blocked during dialogue
    Tool: Playwright (playwright skill)
    Preconditions: Dialogue is open from previous scenario
    Steps:
      1. Open dialogue with NPC (navigate + Enter)
      2. Screenshot player position: .sisyphus/evidence/task-6-movement-before.png
      3. Press ArrowRight, ArrowDown, ArrowLeft, ArrowUp (300ms each)
      4. Screenshot player position: .sisyphus/evidence/task-6-movement-during.png
      5. Assert: player position unchanged (compare screenshots)
    Expected Result: Player does not move while dialogue is active
    Evidence: .sisyphus/evidence/task-6-movement-before.png, task-6-movement-during.png
  ```

  **Commit**: YES
  - Message: `feat(npc): add NPC entities with dialogue interaction in WorldScene`
  - Files: `src/game/entities/NPC.ts`, `src/game/scenes/WorldScene.ts`, `src/game/scenes/Boot.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 7. Add Story Trigger Zones to WorldScene

  **What to do**:
  - **Create `src/game/data/story.ts`**:
    - Export `StoryTrigger` interface: `{ id: string; dialogueKey: string; tileX: number; tileY: number }`
    - Export `STORY_TRIGGERS: StoryTrigger[]` array with 3 trigger zones:
      - `{ id: 'entrance-trigger', dialogueKey: 'entrance-trigger', tileX: <entrance corridor>, tileY: <entrance corridor> }`
      - `{ id: 'midpoint-trigger', dialogueKey: 'midpoint-trigger', tileX: <mid dungeon corridor>, tileY: <mid dungeon corridor> }`
      - `{ id: 'boss-door-trigger', dialogueKey: 'boss-door-trigger', tileX: <before boss room>, tileY: <before boss room> }`
    - Tile coordinates must be on corridor tiles that the player will naturally walk through
  - **Update `src/game/scenes/WorldScene.ts`**:
    - Import STORY_TRIGGERS
    - Add class property: `private triggeredStoryEvents: Set<string> = new Set()`
    - In the `gridPhysics.setOnMoveComplete` callback (after encounter check):
      - Check if any story trigger matches the player's current tile
      - If found AND NOT in `triggeredStoryEvents`:
        - Add to `triggeredStoryEvents`
        - Call `this.dialogueSystem.show(trigger.dialogueKey)`
    - Story triggers should NOT block encounters — check encounters first, then triggers
  - **Create `src/game/data/__tests__/story.test.ts`**:
    - Test that STORY_TRIGGERS has at least 3 entries
    - Test each trigger has non-empty id and dialogueKey
    - Test each trigger has valid tile coordinates (> 0)
    - Test all dialogueKeys exist in DIALOGUES record

  **Must NOT do**:
  - NO physics-based trigger zones (use grid tile matching only)
  - NO repeatable triggers (one-time only, tracked in Set)
  - NO visual indicators on trigger tiles (invisible zones)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Small data file + straightforward integration into existing callback
  - **Skills**: [`dev`]
    - `dev`: TypeScript data + WorldScene integration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 3 (needs dungeon map for trigger coordinates), Task 4 (needs DialogueSystem)

  **References**:

  **Pattern References**:
  - `src/game/scenes/WorldScene.ts:7-18` — EncounterSpawn interface + ENCOUNTER_SPAWNS array pattern. Follow for StoryTrigger + STORY_TRIGGERS.
  - `src/game/scenes/WorldScene.ts:100-121` — `onMoveComplete` callback that checks encounters by tile position. Add story trigger check in the same callback, AFTER encounter check.
  - `src/game/scenes/WorldScene.ts:35` — `defeatedEncounters: Set<string>` pattern. Follow for `triggeredStoryEvents: Set<string>`.

  **API/Type References**:
  - `src/game/systems/DialogueSystem.ts` — `show(dialogueKey)` method to call when trigger fires
  - `src/game/data/dialogues.ts` — Must contain entries for 'entrance-trigger', 'midpoint-trigger', 'boss-door-trigger'

  **Test References**:
  - `src/game/data/__tests__/enemies.test.ts:1-34` — Data test pattern to follow

  **Acceptance Criteria**:

  - [ ] `src/game/data/story.ts` exists with STORY_TRIGGERS array containing 3+ entries
  - [ ] Each trigger has unique id, valid dialogueKey, and tile coordinates
  - [ ] All dialogueKeys in STORY_TRIGGERS correspond to entries in DIALOGUES
  - [ ] Walking over a trigger tile shows dialogue overlay (first time only)
  - [ ] Walking over same trigger tile again does NOT show dialogue
  - [ ] `npx vitest run src/game/data/__tests__/story.test.ts` → PASS
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Story trigger fires on walk-over
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, entrance-trigger placed near spawn
    Steps:
      1. Start new game (Enter → name "HERO" → Enter → Enter for Warrior)
      2. Navigate player toward entrance-trigger tile (specific arrow key sequence based on map layout)
      3. Step onto trigger tile
      4. Wait 500ms
      5. Screenshot: .sisyphus/evidence/task-7-trigger-fired.png
      6. Assert: dialogue overlay visible with entrance story text
      7. Press Enter to dismiss dialogue
      8. Move off and back onto same trigger tile
      9. Wait 500ms
      10. Screenshot: .sisyphus/evidence/task-7-trigger-not-refired.png
      11. Assert: NO dialogue overlay (trigger consumed)
    Expected Result: Trigger fires once, not again
    Evidence: .sisyphus/evidence/task-7-trigger-fired.png, task-7-trigger-not-refired.png

  Scenario: Story triggers data validates against dialogue data
    Tool: Bash
    Preconditions: story.ts and dialogues.ts exist
    Steps:
      1. Run: npx vitest run src/game/data/__tests__/story.test.ts
      2. Assert: exit code 0
      3. Assert: all tests pass including dialogueKey cross-reference
    Expected Result: All trigger dialogue keys exist in DIALOGUES
    Failure Indicators: Missing dialogue keys
  ```

  **Commit**: YES
  - Message: `feat(story): add walk-over story trigger zones with one-time dialogue`
  - Files: `src/game/data/story.ts`, `src/game/scenes/WorldScene.ts`, `src/game/data/__tests__/story.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 8. Full Integration: Encounters, Boss Routing, Boot Loading, Final Wiring

  **What to do**:
  - **Update `src/game/scenes/Boot.ts`** — load ALL new assets:
    - `this.load.image('rat', 'assets/sprites/rat.png')`
    - `this.load.image('bat', 'assets/sprites/bat.png')`
    - `this.load.image('skeleton', 'assets/sprites/skeleton.png')`
    - `this.load.image('dark-knight', 'assets/sprites/dark-knight.png')`
    - (NPC sprite already added in Task 6)
  - **Update `src/game/scenes/WorldScene.ts`** — expand ENCOUNTER_SPAWNS:
    - Replace existing 3 slime encounters with full dungeon encounter layout (~12-15 encounters):
      - Entrance room: 2 Rats
      - Room 2: 2 Rats + 1 Slime
      - Room 3: 2 Bats + 1 Slime
      - Room 4: 2 Skeletons + 1 Bat
      - Corridors: 1-2 mixed enemies
      - Boss room: 1 Dark Knight (the boss)
    - Each encounter gets a unique id (e.g., `'rat-1'`, `'bat-2'`, `'boss-1'`)
    - All tileX/tileY coordinates must be on walkable tiles within the correct rooms of the dungeon map
    - The boss encounter id should be identifiable (e.g., `'boss-1'`)
  - **Update `src/game/scenes/WorldScene.ts`** — boss encounter routing:
    - When launching BattleScene, pass `isBoss` flag:
      ```
      const enemyData = ENEMIES[encounter.enemyKey];
      this.scene.launch('BattleScene', {
        ...existing fields...,
        isBoss: enemyData.isBoss || false,
      });
      ```
  - **Update `BattleInitData` interface in `src/game/scenes/BattleScene.ts`**:
    - Add `isBoss: boolean` to BattleInitData
    - In `onBattleEnd`: if `this.initData.isBoss && result === 'victory'`:
      - Instead of `this.scene.wake('WorldScene', ...)` + `this.scene.stop('BattleScene')`
      - Do: `this.scene.start('VictoryScene')` (this stops BattleScene and starts VictoryScene)
    - Defeat behavior stays the same (→ TitleScene) regardless of boss flag
  - **Final verification**:
    - Run full test suite
    - Build project
    - Playwright end-to-end walkthrough

  **Must NOT do**:
  - Do NOT change BattleSystem.ts (battle logic unchanged)
  - Do NOT change damage formula
  - Do NOT add phase mechanics to boss
  - Do NOT change the wake pattern for non-boss encounters (only boss routes to VictoryScene)
  - Do NOT change defeat behavior (always → TitleScene)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex multi-file integration task requiring understanding of scene lifecycle, encounter placement matching map layout, and boss routing logic
  - **Skills**: [`dev`, `playwright`]
    - `dev`: Multi-file TypeScript integration
    - `playwright`: End-to-end gameplay verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential, final task)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 2, 3, 5, 6, 7

  **References**:

  **Pattern References**:
  - `src/game/scenes/WorldScene.ts:14-18` — ENCOUNTER_SPAWNS array. Replace with expanded array of 12-15 encounters across all dungeon rooms.
  - `src/game/scenes/WorldScene.ts:107-120` — Battle launch code. Add `isBoss` to launch data.
  - `src/game/scenes/BattleScene.ts:11-20` — BattleInitData interface. Add `isBoss: boolean`.
  - `src/game/scenes/BattleScene.ts:225-241` — `onBattleEnd` method. Add boss→VictoryScene routing in the victory branch.
  - `src/game/scenes/Boot.ts:19-20` — Enemy sprite loading. Add new sprite loads.

  **API/Type References**:
  - `src/game/data/enemies.ts` — ENEMIES record with isBoss field on darkKnight (from Task 2)
  - `src/game/scenes/VictoryScene.ts` — Scene key 'VictoryScene' (from Task 5)

  **Test References**:
  - `src/game/systems/__tests__/BattleSystem.test.ts:1-183` — Must still pass after BattleScene changes (BattleSystem itself is unchanged)
  - `src/game/__tests__/assets.test.ts` — Must pass with all new sprites loaded

  **Dungeon Map Reference** (for encounter placement):
  - Use the room layout from Task 3's dungeon.json
  - Entrance room (top-left): player spawn area, Rats
  - Room 2 (top-right): Rats + Slime
  - Room 3 (middle-left): Bats + Slime
  - Room 4 (middle-right): Skeletons + Bat
  - Boss room (bottom-center): Dark Knight only
  - Corridor tiles: occasional mixed enemies

  **Acceptance Criteria**:

  - [ ] Boot.ts loads all 5 new sprite assets (rat, bat, skeleton, dark-knight, npc)
  - [ ] ENCOUNTER_SPAWNS has 12-15 entries spanning all dungeon rooms
  - [ ] At least 1 encounter of each enemy type (slime, rat, bat, skeleton)
  - [ ] Exactly 1 Dark Knight (boss) encounter in boss room
  - [ ] BattleScene receives `isBoss` in init data
  - [ ] Defeating boss → VictoryScene (NOT WorldScene wake)
  - [ ] Defeating non-boss → WorldScene wake (unchanged)
  - [ ] Dying to boss → TitleScene (same as any defeat)
  - [ ] Dying to non-boss → TitleScene (unchanged)
  - [ ] `npx vitest run` → ALL tests pass (0 failures)
  - [ ] `npm run build` → exit code 0
  - [ ] Full gameplay flow works end-to-end

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Regular enemy battle works (non-boss, regression)
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Start new game (Enter → "HERO" → Enter → Enter)
      2. Wait for WorldScene (1000ms)
      3. Navigate to nearest enemy (Rat in entrance room)
      4. Walk into enemy sprite tile
      5. Wait 2000ms for BattleScene to load (INTRO state)
      6. Screenshot: .sisyphus/evidence/task-8-battle-start.png
      7. Assert: battle UI visible with enemy name text
      8. Wait for "What will you do?" text (PLAYER_TURN)
      9. Press Enter (Attack)
      10. Repeat Enter presses until victory or defeat
      11. If victory: wait 2500ms, verify WorldScene resumes (enemy sprite gone)
      12. Screenshot: .sisyphus/evidence/task-8-regular-victory.png
    Expected Result: Regular battle flow works, returns to WorldScene
    Evidence: .sisyphus/evidence/task-8-battle-start.png, task-8-regular-victory.png

  Scenario: Boss defeat leads to VictoryScene
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, player leveled enough to defeat boss
    Steps:
      1. Start new game as Warrior
      2. Fight through several enemies to level up (defeat 5+ enemies)
      3. Navigate to boss room
      4. Walk into Dark Knight sprite
      5. Wait for BattleScene with "Dark Knight" name
      6. Screenshot: .sisyphus/evidence/task-8-boss-battle.png
      7. Repeatedly press Enter to attack until victory
      8. Wait 2500ms after "Victory!" text
      9. Assert: VictoryScene loads (text "VICTORY!" visible)
      10. Screenshot: .sisyphus/evidence/task-8-victory-scene.png
      11. Press Enter
      12. Assert: TitleScene loads (text "FANTASY RPG" visible)
      13. Screenshot: .sisyphus/evidence/task-8-back-to-title.png
    Expected Result: Boss victory → VictoryScene → TitleScene
    Evidence: .sisyphus/evidence/task-8-boss-battle.png, task-8-victory-scene.png, task-8-back-to-title.png

  Scenario: Boss defeat (player dies) goes to TitleScene
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, weak player (level 1)
    Steps:
      1. Start new game as Mage (lowest HP)
      2. Navigate directly to boss room (skip other enemies)
      3. Walk into Dark Knight
      4. Wait for battle
      5. Press Enter repeatedly (will likely die)
      6. Wait for "Defeat..." text
      7. Wait 2500ms
      8. Assert: TitleScene loads (NOT VictoryScene)
      9. Screenshot: .sisyphus/evidence/task-8-boss-defeat.png
    Expected Result: Death to boss → TitleScene (same as any death)
    Evidence: .sisyphus/evidence/task-8-boss-defeat.png

  Scenario: All tests and build pass
    Tool: Bash
    Preconditions: All tasks complete
    Steps:
      1. Run: npx vitest run
      2. Assert: exit code 0
      3. Assert: 0 failures
      4. Run: npm run build
      5. Assert: exit code 0
    Expected Result: Full green test suite and successful build
    Failure Indicators: Any test failure or build error

  Scenario: Multiple enemy types visible on map
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Start new game
      2. Navigate through entrance room
      3. Screenshot: .sisyphus/evidence/task-8-entrance-enemies.png
      4. Navigate to Room 2
      5. Screenshot: .sisyphus/evidence/task-8-room2-enemies.png
      6. Navigate to Room 3
      7. Screenshot: .sisyphus/evidence/task-8-room3-enemies.png
      8. Navigate to Room 4
      9. Screenshot: .sisyphus/evidence/task-8-room4-enemies.png
      10. Navigate to Boss room
      11. Screenshot: .sisyphus/evidence/task-8-boss-room.png
    Expected Result: Different enemy sprites visible in different rooms
    Evidence: .sisyphus/evidence/task-8-*-enemies.png, task-8-boss-room.png
  ```

  **Commit**: YES
  - Message: `feat(world): integrate all encounters, boss routing, and complete dungeon wiring`
  - Files: `src/game/scenes/Boot.ts`, `src/game/scenes/WorldScene.ts`, `src/game/scenes/BattleScene.ts`
  - Pre-commit: `npx vitest run`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `feat(assets): add placeholder sprites for new enemies, boss, and NPC` | sprites/*.png | file command |
| 2 | `feat(enemies): add rat, bat, skeleton, and dark knight boss with stat variety` | enemies.ts, assets.test.ts | npx vitest run |
| 3 | `feat(map): replace test map with 50x40 multi-room dungeon` | dungeon.json, tiles.png, Constants.ts, Boot.ts, WorldScene.ts | npx vitest run |
| 4 | `feat(dialogue): add dialogue system with NPC and story trigger text data` | dialogues.ts, DialogueSystem.ts, dialogues.test.ts | npx vitest run |
| 5 | `feat(scenes): add VictoryScene displayed after boss defeat` | VictoryScene.ts, main.ts | npx vitest run |
| 6 | `feat(npc): add NPC entities with dialogue interaction in WorldScene` | NPC.ts, WorldScene.ts, Boot.ts | npx vitest run |
| 7 | `feat(story): add walk-over story trigger zones with one-time dialogue` | story.ts, WorldScene.ts, story.test.ts | npx vitest run |
| 8 | `feat(world): integrate all encounters, boss routing, and complete dungeon wiring` | Boot.ts, WorldScene.ts, BattleScene.ts | npx vitest run && npm run build |

---

## Success Criteria

### Verification Commands
```bash
npx vitest run           # Expected: all tests pass, 0 failures
npm run build            # Expected: exit code 0, no errors
```

### Final Checklist
- [ ] Dungeon has 5+ rooms connected by corridors (~50x40 tiles)
- [ ] 4 enemy types on map: Slime, Rat, Bat, Skeleton (each with different sprites and stats)
- [ ] Boss (Dark Knight) in final room with significantly higher stats
- [ ] Defeating boss → VictoryScene → TitleScene
- [ ] 3 NPCs interactable via Enter/Space with dialogue overlay
- [ ] 3 story trigger zones fire one-time text on walk-over
- [ ] Player movement blocked during dialogue
- [ ] All existing flows preserved (battle, XP, leveling, defeat → TitleScene)
- [ ] No comments in source code
- [ ] Keyboard-only input throughout
- [ ] All sprites are 16x16 placeholders
- [ ] All tests pass
- [ ] Build succeeds

### Requirements Coverage

| ID | Requirement | Covered By |
|----|-------------|------------|
| R-009 | Multiple enemy types | Task 2 (data), Task 1 (sprites), Task 8 (placement) |
| R-010 | Boss encounter | Task 2 (data), Task 8 (routing + placement) |
| R-013 | Full dungeon map | Task 3 (50x40 multi-room map) |
| R-014 | Points of interest | Task 8 (encounters), Task 6 (NPCs), Task 7 (triggers) |
| R-015 | NPC dialogue system | Task 4 (system), Task 6 (integration) |
| R-016 | Story beats | Task 4 (data), Task 7 (triggers), Task 6 (NPC dialogue) |
