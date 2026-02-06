# Phase 5: Systems & Polish

## TL;DR

> **Quick Summary**: Add inventory (potions), expand battle actions to Attack/Defend/Item/Flee with arrow-key menu, add a pause menu overlay in WorldScene, and implement save/load via localStorage. Audio is explicitly deferred.
>
> **Deliverables**:
> - Item data file with Potion and Hi-Potion definitions
> - Inventory helper utilities (add/remove/serialize/deserialize)
> - Expanded BattleSystem with playerDefend(), playerUseItem(), playerFlee() methods
> - BattleScene 4-option arrow-key menu with Item sub-menu
> - PauseMenu system for WorldScene (stats, inventory, save, use item, close)
> - SaveSystem (pure logic, localStorage JSON with schema versioning)
> - TitleScene "Continue" option with arrow-key selection
> - Potion pickup sprites on the world map
> - Potion placeholder asset (16x16 PNG)
> - Updated tests covering all new systems (~30+ new tests)
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 5 → Task 8 → Task 10

---

## Context

### Original Request
Create Phase 5: Systems & Polish for a Phaser 3 + TypeScript RPG. Adds inventory, expanded battle actions, pause menu, and save/load. Audio is deferred.

### Interview Summary
**Key Decisions**:
- Audio: SKIP entirely — no music, no sound effects
- Inventory: `Record<string, number>` stored as JSON string in registry. Potion (heals 15 HP) and Hi-Potion (heals 40 HP). Player starts with 3 Potions. Potions also found as pickup sprites on the map.
- Battle actions: Attack, Defend (halves incoming damage for one turn), Item (sub-menu), Flee (50% chance, enemy gets free turn on failure)
- Save/Load: Single localStorage slot. Manual save from pause menu only. Continue option on TitleScene.
- Pause menu: Escape key overlay showing stats, inventory, Save Game, Use Item, Close.

### Metis Review
**Identified Gaps (addressed)**:
- **BattleScene handleConfirm() state duplication (line 252)**: Manually sets `this.currentState = BattleState.ENEMY_TURN` before calling `playerAttack()` which also sets state via callback. Must remove manual set before adding new actions — callbacks must be single source of truth.
- **TitleScene registry-clearing**: `create()` unconditionally clears registry. Must move clearing to "New Game" handler only, not `create()`, so "Continue" can load save data into registry after create runs.
- **VictoryScene registry-clearing**: Must also clear new registry keys (playerInventory, playerTileX, playerTileY, defeatedEncounters, triggeredStoryEvents, collectedPickups).
- **Defend flag clearing**: `isDefending` must clear when state transitions to PLAYER_TURN inside `checkEnd()`, not persist across turns.
- **Flee from boss**: Block flee for boss encounters. BattleSystem accepts `isBoss` flag; `playerFlee()` returns 'blocked' and does not consume turn.
- **Flee wake data**: WorldScene wake handler must handle `result: 'fled'` — update playerHp but do NOT destroy encounter sprite or add to defeatedEncounters.
- **WorldScene spawn from save**: `create()` must read `playerTileX`/`playerTileY` from registry for saved spawn position, falling back to defaults.
- **Potion pickup tracking**: Need `collectedPickups: Set<string>` in WorldScene, serialized in save data.
- **Registry pollution**: "New Game" must clear ALL registry keys including new ones. Introduce `REGISTRY_KEYS` array in Constants.ts.
- **Save data versioning**: Include `version: 1` field for future migration support.
- **Potion pickup sprite**: Need `potion.png` asset added to Boot.ts preload.
- **Item sub-menu empty state**: "Item" option always visible; sub-menu shows "No items!" if inventory empty.
- **Potion at full HP**: Allow usage (no-op on HP, still consumes potion). Simpler, player's choice.
- **BattleCallbacks expansion**: Add `onHeal` and `onFleeFailed` and `onFleeBlocked` callbacks.

---

## Work Objectives

### Core Objective
Add inventory, expanded battle actions, pause menu, and save/load to complete the core gameplay loop, giving players tactical depth and persistence.

### Concrete Deliverables
- `src/game/data/items.ts` — ItemData interface and ITEMS record (Potion, Hi-Potion)
- `src/game/utils/inventory.ts` — Pure inventory helper functions
- `src/game/systems/BattleSystem.ts` — Expanded with defend, use item, flee methods
- `src/game/scenes/BattleScene.ts` — 4-option arrow-key menu, item sub-menu, updated state handling
- `src/game/systems/PauseMenu.ts` — Pause menu overlay system for WorldScene
- `src/game/systems/SaveSystem.ts` — Pure localStorage save/load with schema validation
- `src/game/scenes/TitleScene.ts` — "Continue" option with arrow-key selection
- `src/game/scenes/WorldScene.ts` — Pause menu integration, potion pickups, save-aware spawn, flee handling
- `src/game/scenes/CharacterCreationScene.ts` — Set initial inventory (3 Potions)
- `src/game/utils/Constants.ts` — New BattleStates (FLED), REGISTRY_KEYS array, SAVE_KEY constant
- `src/game/scenes/Boot.ts` — Load potion.png asset
- `src/game/scenes/VictoryScene.ts` — Clear expanded registry keys
- `public/assets/sprites/potion.png` — 16x16 placeholder potion pickup sprite
- New test files: `items.test.ts`, `inventory.test.ts`, `SaveSystem.test.ts`
- Updated test file: `BattleSystem.test.ts`

### Definition of Done
- [ ] `npx vitest run` — all tests pass (existing 110 + ~30 new = ~140 total, 0 failures)
- [ ] `npm run build` — exits with code 0
- [ ] Player starts with 3 Potions in inventory
- [ ] Battle menu shows Attack / Defend / Item / Flee with arrow key selection
- [ ] Defend halves next enemy attack damage
- [ ] Item sub-menu shows potions, using one heals and consumes it
- [ ] Flee has 50% chance; success returns to world, failure gives enemy free turn
- [ ] Cannot flee from boss
- [ ] Escape opens pause menu in WorldScene showing stats, inventory, and options
- [ ] Save Game in pause menu writes to localStorage
- [ ] TitleScene shows "Continue" when save exists
- [ ] Continue loads saved state including position, inventory, defeated encounters
- [ ] Potion pickups on map add to inventory when walked over
- [ ] All existing gameplay flows still work (battle, XP, leveling, dialogue, story triggers)

### Must Have
- Items data with Potion (heals 15) and Hi-Potion (heals 40)
- 4 battle actions with arrow-key selection
- Defend mechanic (halves damage, one turn)
- Item sub-menu in battle
- Flee mechanic (50% success, boss blocked)
- Pause menu overlay (Escape key) with stats, inventory, save, use item, close
- Save/load to localStorage with version field
- "Continue" on TitleScene when save exists
- 3 starting potions
- 3-5 potion pickups on map
- Potion pickup tracking (don't respawn on load)

### Must NOT Have (Guardrails)
- NO audio (music, sound effects) — deferred
- NO item shop or item drops from enemies
- NO equipment system, item categories, or rarities
- NO multiple save slots (single slot only)
- NO auto-save (manual save from pause menu only)
- NO cloud save or IndexedDB
- NO enemy AI changes (enemies always just attack)
- NO new enemy battle states (no enemy defend/item/flee)
- NO settings screen or key rebinding in pause menu
- NO save file export/import
- NO item animations or special effects
- NO changes to damage formula in calculateDamage()
- NO comments in source code (team convention)
- NO mouse input (keyboard only)
- NO Phaser imports in pure-logic system files (BattleSystem, SaveSystem, inventory utils)
- NO reuse/extension of DialogueSystem for pause menu (separate system, reuse only camera-relative positioning technique)
- NO modifications to GridPhysics.ts

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> Every criterion is verified by running a command or using a tool.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: YES (tests-after for pure logic systems; TDD where noted)
- **Framework**: vitest

### Agent-Executed QA Scenarios

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| Data files (items) | Bash (npx vitest run) | Run test suite, assert pass |
| Pure logic (inventory, SaveSystem, BattleSystem) | Bash (npx vitest run) | Unit tests verify all paths |
| Scene UI (BattleScene menu, PauseMenu) | Playwright | Navigate game, interact, verify UI |
| Integration (save/load flow) | Playwright | Full game flow verification |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation Data + Assets):
├── Task 1: Item data file + potion sprite asset
├── Task 2: Inventory helpers (pure utility)
└── Task 3: Constants expansion (BattleState.FLED, REGISTRY_KEYS, SAVE_KEY)

Wave 2 (After Wave 1 — Core Systems, parallel):
├── Task 4: BattleSystem expansion (defend, item, flee)
├── Task 5: SaveSystem (pure logic, localStorage)
└── Task 6: Registry cleanup refactor (TitleScene, VictoryScene, CharCreation)

Wave 3 (After Wave 2 — Scene UI, parallel):
├── Task 7: BattleScene 4-option menu + item sub-menu
├── Task 8: PauseMenu system for WorldScene
└── Task 9: TitleScene "Continue" option

Wave 4 (After Wave 3 — Final Integration):
└── Task 10: WorldScene full integration (pickups, save-aware spawn, flee handling, pause wiring)

Critical Path: Task 1 → Task 2 → Task 4 → Task 7 → Task 10
Parallel Speedup: ~40% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 4, 7, 8, 10 | 2, 3 |
| 2 | None | 4, 5, 7, 8, 10 | 1, 3 |
| 3 | None | 4, 5, 6, 7, 8, 9, 10 | 1, 2 |
| 4 | 1, 2, 3 | 7 | 5, 6 |
| 5 | 2, 3 | 8, 9, 10 | 4, 6 |
| 6 | 3 | 9, 10 | 4, 5 |
| 7 | 1, 2, 4 | 10 | 8, 9 |
| 8 | 1, 2, 5 | 10 | 7, 9 |
| 9 | 5, 6 | 10 | 7, 8 |
| 10 | 1, 2, 3, 5, 6, 7, 8, 9 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | quick (small data/utility files) |
| 2 | 4, 5, 6 | unspecified-high (BattleSystem expansion), quick (SaveSystem, registry cleanup) |
| 3 | 7, 8, 9 | unspecified-high (BattleScene menu), unspecified-high (PauseMenu), quick (TitleScene) |
| 4 | 10 | deep (complex multi-system integration) |

---

## TODOs

- [ ] 1. Create Item Data File + Potion Pickup Sprite

  **What to do**:
  - **Create `src/game/data/items.ts`**:
    - Export `ItemData` interface: `{ key: string; name: string; description: string; type: 'consumable' | 'key'; healAmount?: number }`
    - Export `ITEMS: Record<string, ItemData>` with two entries:
      - `potion`: `{ key: 'potion', name: 'Potion', description: 'Restores 15 HP', type: 'consumable', healAmount: 15 }`
      - `hiPotion`: `{ key: 'hiPotion', name: 'Hi-Potion', description: 'Restores 40 HP', type: 'consumable', healAmount: 40 }`
  - **Create `src/game/data/__tests__/items.test.ts`**:
    - Test ITEMS record exports correctly
    - Test each item has all required fields (key, name, description, type)
    - Test consumable items have `healAmount > 0`
    - Test item keys match their key property
    - Test all items have non-empty name and description
  - **Create `public/assets/sprites/potion.png`**:
    - 16x16 PNG placeholder sprite (green colored, e.g., #00CC44 body for a health potion look)
    - Simple solid-color rectangle with minimal detail, matching existing sprite art style

  **Must NOT do**:
  - NO item categories, rarities, stackLimit, sellPrice, weight, or equipment fields
  - NO more than 2 items (Potion and Hi-Potion)
  - NO animated sprites for the potion

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple data file + asset creation, no complex logic
  - **Skills**: [`dev`]
    - `dev`: TypeScript data file creation, PNG generation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 7, 8, 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/game/data/enemies.ts:1-10` — Data file pattern: TypeScript interface + exported `Record<string, T>`. Follow exactly for items.ts.
  - `src/game/data/classes.ts:1-11` — Another data interface example showing how interfaces are structured in this project.
  - `public/assets/sprites/slime.png` — Reference for sprite art style (16x16 solid-color placeholder).

  **Test References**:
  - `src/game/data/__tests__/enemies.test.ts` — Data test pattern: iterate entries, validate fields. Follow for items.test.ts.

  **Acceptance Criteria**:

  - [ ] `src/game/data/items.ts` exists with `ItemData` interface and `ITEMS` record
  - [ ] ITEMS has exactly 2 entries: `potion` and `hiPotion`
  - [ ] `potion.healAmount === 15` and `hiPotion.healAmount === 40`
  - [ ] Both items have `type: 'consumable'`
  - [ ] `public/assets/sprites/potion.png` exists and is a valid 16x16 PNG
  - [ ] `npx vitest run src/game/data/__tests__/items.test.ts` → PASS
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Item data is valid and tests pass
    Tool: Bash
    Preconditions: items.ts and items.test.ts created
    Steps:
      1. Run: npx vitest run src/game/data/__tests__/items.test.ts
      2. Assert: exit code 0
      3. Assert: all tests pass
    Expected Result: All item data validated
    Failure Indicators: Missing fields, wrong healAmount values

  Scenario: Potion sprite exists and is valid PNG
    Tool: Bash
    Preconditions: potion.png created
    Steps:
      1. Run: file public/assets/sprites/potion.png
      2. Assert: output contains "PNG image data, 16 x 16"
    Expected Result: Valid 16x16 PNG
    Failure Indicators: File not found or wrong dimensions
  ```

  **Commit**: YES
  - Message: `feat(items): add item data file with Potion and Hi-Potion definitions`
  - Files: `src/game/data/items.ts`, `src/game/data/__tests__/items.test.ts`, `public/assets/sprites/potion.png`
  - Pre-commit: `npx vitest run`

---

- [ ] 2. Create Inventory Helper Utilities

  **What to do**:
  - **Create `src/game/utils/inventory.ts`**:
    - Pure functions, NO Phaser imports. This is a utility module.
    - `type Inventory = Record<string, number>`
    - `addItem(inventory: Inventory, itemKey: string, quantity?: number): Inventory` — returns new inventory with item added/incremented. Default quantity = 1.
    - `removeItem(inventory: Inventory, itemKey: string, quantity?: number): Inventory | null` — returns new inventory with item decremented. Removes key when count reaches 0. Returns null if item not in inventory or insufficient quantity. Default quantity = 1.
    - `getItemCount(inventory: Inventory, itemKey: string): number` — returns count or 0 if not present.
    - `hasItem(inventory: Inventory, itemKey: string): boolean` — returns true if count > 0.
    - `serializeInventory(inventory: Inventory): string` — `JSON.stringify(inventory)`
    - `deserializeInventory(json: string): Inventory` — `JSON.parse(json)` with try/catch, returns `{}` on invalid JSON.
    - `createStartingInventory(): Inventory` — returns `{ potion: 3 }` (starting inventory for new game).
  - **Create `src/game/utils/__tests__/inventory.test.ts`**:
    - Test addItem: adds new item with count 1
    - Test addItem: increments existing item count
    - Test addItem: adds specified quantity
    - Test removeItem: decrements count
    - Test removeItem: removes key when count reaches 0
    - Test removeItem: returns null for non-existent item
    - Test removeItem: returns null for insufficient quantity
    - Test getItemCount: returns count for existing item
    - Test getItemCount: returns 0 for non-existent item
    - Test hasItem: true for existing, false for non-existent
    - Test serializeInventory: Record → JSON string round-trip
    - Test deserializeInventory: JSON string → Record
    - Test deserializeInventory: invalid JSON → empty Record (no throw)
    - Test deserializeInventory: empty string → empty Record (no throw)
    - Test createStartingInventory: returns `{ potion: 3 }`

  **Must NOT do**:
  - NO Phaser imports
  - NO class-based design (pure functions)
  - NO mutation of input objects (return new objects)
  - NO item validation against ITEMS data (that's the caller's job)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure utility functions with comprehensive tests, no complex logic
  - **Skills**: [`dev`]
    - `dev`: TypeScript utility module creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5, 7, 8, 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/game/data/xp.ts:1-47` — Pure logic utility pattern: exported functions, no Phaser imports, uses only TypeScript primitives. Follow for inventory.ts.
  - `src/game/data/xp.ts:22-47` — `processXpGain()` is a pure function taking primitives and returning a result object. Follow this pattern for inventory helpers.

  **Test References**:
  - `src/game/data/__tests__/xp.test.ts` — Test pattern for pure utility functions with vitest.

  **Acceptance Criteria**:

  - [ ] `src/game/utils/inventory.ts` exists with all 7 functions
  - [ ] No Phaser imports in the file
  - [ ] All functions are pure (no mutation of inputs)
  - [ ] `npx vitest run src/game/utils/__tests__/inventory.test.ts` → PASS (15+ tests)
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Inventory helpers pass all unit tests
    Tool: Bash
    Preconditions: inventory.ts and inventory.test.ts created
    Steps:
      1. Run: npx vitest run src/game/utils/__tests__/inventory.test.ts
      2. Assert: exit code 0
      3. Assert: 15+ tests pass
    Expected Result: All inventory utility functions verified
    Failure Indicators: Any test failure, especially edge cases (empty inventory, invalid JSON)

  Scenario: No Phaser imports in utility
    Tool: Bash
    Preconditions: inventory.ts created
    Steps:
      1. Run: grep -c "phaser" src/game/utils/inventory.ts || echo "0"
      2. Assert: output is "0"
    Expected Result: Zero Phaser imports
    Failure Indicators: Any Phaser import found
  ```

  **Commit**: YES
  - Message: `feat(inventory): add pure inventory helper utilities with full test coverage`
  - Files: `src/game/utils/inventory.ts`, `src/game/utils/__tests__/inventory.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 3. Expand Constants (BattleState.FLED, REGISTRY_KEYS, SAVE_KEY)

  **What to do**:
  - **Update `src/game/utils/Constants.ts`**:
    - Add `FLED = 'fled'` to `BattleState` enum (after DEFEAT)
    - Add exported constant: `export const SAVE_KEY = 'fantasyrpg-save';`
    - Add exported constant array:
      ```
      export const REGISTRY_KEYS = [
        'playerName', 'playerClass', 'playerLevel', 'playerXp',
        'playerInventory', 'playerTileX', 'playerTileY',
        'defeatedEncounters', 'triggeredStoryEvents', 'collectedPickups',
      ] as const;
      ```
    - Add battle menu constant: `export const FLEE_SUCCESS_CHANCE = 0.5;`

  **Must NOT do**:
  - Do NOT change existing enum values or constants
  - Do NOT remove any existing constants
  - Do NOT change TILE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, ZOOM

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, adding constants only
  - **Skills**: [`dev`]
    - `dev`: TypeScript constant definitions

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 4, 5, 6, 7, 8, 9, 10
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/game/utils/Constants.ts:28-35` — Existing BattleState enum. Add FLED after DEFEAT.
  - `src/game/utils/Constants.ts:1-9` — Existing constant exports. Follow pattern.

  **Test References**:
  - `src/game/systems/__tests__/BattleSystem.test.ts:3` — Imports BattleState from Constants. Adding FLED must not break existing enum usage.

  **Acceptance Criteria**:

  - [ ] `BattleState.FLED` exists in Constants.ts with value `'fled'`
  - [ ] `SAVE_KEY` constant exported with value `'fantasyrpg-save'`
  - [ ] `REGISTRY_KEYS` array exported with all 10 registry key names
  - [ ] `FLEE_SUCCESS_CHANCE` constant exported with value `0.5`
  - [ ] All existing BattleState values unchanged
  - [ ] `npx vitest run` → ALL tests pass (no regressions)

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Constants expansion doesn't break existing tests
    Tool: Bash
    Preconditions: Constants.ts updated
    Steps:
      1. Run: npx vitest run
      2. Assert: exit code 0
      3. Assert: all 110 existing tests still pass
    Expected Result: Zero regressions
    Failure Indicators: Any test failure from enum changes
  ```

  **Commit**: YES
  - Message: `feat(constants): add FLED battle state, registry keys, save key, and flee chance constants`
  - Files: `src/game/utils/Constants.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 4. Expand BattleSystem with Defend, Use Item, and Flee

  **What to do**:
  - **Update `src/game/systems/BattleSystem.ts`**:
    - Add private fields:
      - `private isDefending = false`
      - `private isBoss: boolean`
    - Update constructor to accept `isBoss?: boolean` from EnemyData (default false): `this.isBoss = enemyData.isBoss || false`
    - **Expand BattleCallbacks interface**:
      - Add `onHeal: (healAmount: number, newHp: number) => void`
      - Add `onFleeAttempt: (success: boolean) => void`
    - **Add `playerDefend()` method**:
      - Guard: `if (this.state !== BattleState.PLAYER_TURN) return`
      - Set `this.isDefending = true`
      - Transition state to `ENEMY_TURN`
      - Fire `onStateChange(BattleState.ENEMY_TURN)`
    - **Modify `enemyTurn()` method**:
      - When calculating damage, if `this.isDefending`, halve the effective damage: `const finalDamage = this.isDefending ? Math.max(MIN_DAMAGE, Math.floor(rawDamage / 2)) : rawDamage`
      - Use raw `calculateDamage()` result, then apply halving
    - **Modify `checkEnd()` method**:
      - When transitioning back to `PLAYER_TURN` (line 87-88), add: `this.isDefending = false`
      - This ensures defend clears at start of next player turn
    - **Add `playerUseItem(healAmount: number)` method**:
      - Guard: `if (this.state !== BattleState.PLAYER_TURN) return`
      - Heal player: `this.playerHp = Math.min(this.playerHp + healAmount, this.playerMaxHp)`
      - Fire `onHeal(healAmount, this.playerHp)`
      - Transition state to `ENEMY_TURN` (using item costs a turn)
      - Fire `onStateChange(BattleState.ENEMY_TURN)`
    - **Add `playerFlee()` method**:
      - Guard: `if (this.state !== BattleState.PLAYER_TURN) return`
      - If `this.isBoss`: fire `onFleeAttempt(false)` callback, do NOT change state (turn not consumed), return
      - Roll: `const success = Math.random() < FLEE_SUCCESS_CHANCE`
      - If success: transition to `BattleState.FLED`, fire `onStateChange(BattleState.FLED)`, fire `onBattleEnd('fled')`
      - If failure: fire `onFleeAttempt(false)`, transition to `ENEMY_TURN` (enemy gets free turn)
    - **Add getter**: `getIsDefending(): boolean`
  - **Update `src/game/systems/__tests__/BattleSystem.test.ts`**:
    - Update `makeCallbacks()` to include `onHeal: vi.fn()` and `onFleeAttempt: vi.fn()`
    - Add `describe('playerDefend')` block:
      - Sets isDefending to true
      - Transitions to ENEMY_TURN
      - Next enemy damage is halved (mock Math.random for determinism)
      - isDefending resets to false when state returns to PLAYER_TURN
      - Calling playerDefend when not PLAYER_TURN does nothing
    - Add `describe('playerUseItem')` block:
      - Heals player by healAmount
      - Caps healing at playerMaxHp (test overhealing)
      - Fires onHeal callback
      - Transitions to ENEMY_TURN (costs a turn)
      - Using item at full HP still works (0 effective heal)
      - Calling when not PLAYER_TURN does nothing
    - Add `describe('playerFlee')` block:
      - Mock Math.random to 0.3 (< 0.5): flee succeeds → FLED state → onBattleEnd('fled')
      - Mock Math.random to 0.7 (≥ 0.5): flee fails → ENEMY_TURN → enemy attacks
      - Boss encounter: flee always fails without consuming turn, fires onFleeAttempt(false)
      - Calling when not PLAYER_TURN does nothing
    - Add `describe('defend then use item')` (edge case):
      - Player defends turn 1 → enemy attacks (halved) → turn 2 player uses item → enemy attacks (full damage). Verify isDefending doesn't persist.

  **Must NOT do**:
  - Do NOT change `calculateDamage()` formula
  - Do NOT add Phaser imports
  - Do NOT change existing playerAttack() behavior
  - Do NOT add enemy AI changes (enemy always attacks)
  - Do NOT manage inventory in BattleSystem (caller passes healAmount, system just heals)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Core game logic expansion with state machine modifications, needs careful edge case handling and comprehensive tests
  - **Skills**: [`dev`]
    - `dev`: TypeScript state machine logic, vitest testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **Pattern References**:
  - `src/game/systems/BattleSystem.ts:51-62` — `playerAttack()` method pattern: guard state → perform action → fire callback → transition state. Follow exactly for new methods.
  - `src/game/systems/BattleSystem.ts:64-73` — `enemyTurn()` damage calculation. Modify to check `isDefending` before applying damage.
  - `src/game/systems/BattleSystem.ts:75-90` — `checkEnd()` state transitions. Add `isDefending = false` when transitioning back to PLAYER_TURN (line 87).
  - `src/game/systems/BattleSystem.ts:92-95` — `calculateDamage()` private method. Do NOT modify — use its result and apply defend halving externally.

  **API/Type References**:
  - `src/game/systems/BattleSystem.ts:4-8` — `BattleCallbacks` interface. Expand with onHeal and onFleeAttempt.
  - `src/game/utils/Constants.ts:28-35` — `BattleState` enum with new FLED value (from Task 3).
  - `src/game/utils/Constants.ts` — `FLEE_SUCCESS_CHANCE` constant (from Task 3).
  - `src/game/data/enemies.ts:9` — `isBoss?: boolean` on EnemyData. BattleSystem reads this.

  **Test References**:
  - `src/game/systems/__tests__/BattleSystem.test.ts:1-183` — Full existing test file. All existing tests must continue passing. New tests follow same patterns (makeCallbacks, DEFAULT_PLAYER, vi.fn()).
  - `src/game/systems/__tests__/BattleSystem.test.ts:91-104` — Math.random mocking pattern for deterministic damage tests. Use same pattern for flee chance.

  **Acceptance Criteria**:

  - [ ] `playerDefend()` sets isDefending and transitions to ENEMY_TURN
  - [ ] Enemy damage halved during defend (Math.max(MIN_DAMAGE, floor(raw/2)))
  - [ ] isDefending clears when state returns to PLAYER_TURN via checkEnd()
  - [ ] `playerUseItem(healAmount)` heals player, caps at maxHp, transitions to ENEMY_TURN
  - [ ] `playerFlee()` with success transitions to FLED, fires onBattleEnd('fled')
  - [ ] `playerFlee()` with failure transitions to ENEMY_TURN (enemy free turn)
  - [ ] `playerFlee()` against boss does nothing (turn not consumed), fires onFleeAttempt(false)
  - [ ] No Phaser imports in BattleSystem.ts
  - [ ] All existing BattleSystem tests still pass
  - [ ] `npx vitest run src/game/systems/__tests__/BattleSystem.test.ts` → PASS (existing + 15+ new tests)
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: BattleSystem expansion tests pass
    Tool: Bash
    Preconditions: BattleSystem.ts updated, BattleSystem.test.ts updated
    Steps:
      1. Run: npx vitest run src/game/systems/__tests__/BattleSystem.test.ts
      2. Assert: exit code 0
      3. Assert: output shows 25+ tests passed (original ~12 + new ~15)
    Expected Result: All battle system tests pass including new actions
    Failure Indicators: Any test failure, especially existing tests breaking

  Scenario: BattleSystem has no Phaser imports
    Tool: Bash
    Preconditions: BattleSystem.ts updated
    Steps:
      1. Run: grep -ci "phaser" src/game/systems/BattleSystem.ts
      2. Assert: output is "0"
    Expected Result: Zero Phaser imports
    Failure Indicators: Any Phaser reference found

  Scenario: Defend clears across turns
    Tool: Bash
    Preconditions: Tests include defend-then-item edge case
    Steps:
      1. Run: npx vitest run src/game/systems/__tests__/BattleSystem.test.ts -t "defend"
      2. Assert: exit code 0
    Expected Result: Defend clearing tests pass
    Failure Indicators: isDefending persisting across turns
  ```

  **Commit**: YES
  - Message: `feat(battle): expand BattleSystem with defend, use item, and flee actions`
  - Files: `src/game/systems/BattleSystem.ts`, `src/game/systems/__tests__/BattleSystem.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 5. Create SaveSystem (Pure Logic, localStorage)

  **What to do**:
  - **Create `src/game/systems/SaveSystem.ts`**:
    - Pure logic, NO Phaser imports. Uses global `localStorage` (available in browser).
    - Export `SaveData` interface:
      ```
      {
        version: number;
        playerName: string;
        playerClass: string;
        playerLevel: number;
        playerXp: number;
        playerInventory: Record<string, number>;
        playerTileX: number;
        playerTileY: number;
        defeatedEncounters: string[];
        triggeredStoryEvents: string[];
        collectedPickups: string[];
      }
      ```
    - Export functions:
      - `save(data: SaveData): void` — `localStorage.setItem(SAVE_KEY, JSON.stringify(data))`. Auto-sets `version: 1`.
      - `load(): SaveData | null` — `JSON.parse(localStorage.getItem(SAVE_KEY))` with try/catch. Returns null on missing, invalid JSON, missing required fields, or wrong version. Validates all required fields exist and are correct types.
      - `hasSave(): boolean` — checks if SAVE_KEY exists in localStorage AND the data is valid (calls load() internally, returns `load() !== null`).
      - `deleteSave(): void` — `localStorage.removeItem(SAVE_KEY)`. No-throw if key doesn't exist.
    - Import `SAVE_KEY` from Constants
  - **Create `src/game/systems/__tests__/SaveSystem.test.ts`**:
    - Mock localStorage (vitest can mock globals)
    - Test save writes JSON to correct key
    - Test load returns parsed object matching saved data
    - Test load returns null when no save exists
    - Test load returns null on corrupted/invalid JSON
    - Test load returns null on missing required fields
    - Test load returns null on wrong version
    - Test hasSave returns true/false correctly
    - Test deleteSave removes key
    - Test deleteSave on non-existent key doesn't throw
    - Test round-trip: save → load → compare all fields
    - Test inventory round-trips as Record<string, number>
    - Test arrays round-trip correctly (defeatedEncounters, triggeredStoryEvents, collectedPickups)

  **Must NOT do**:
  - NO Phaser imports
  - NO multiple save slots
  - NO cloud save, IndexedDB
  - NO auto-save logic (SaveSystem is just read/write)
  - NO save file export/import
  - NO encryption or compression

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Well-defined pure logic module with clear interface, straightforward tests
  - **Skills**: [`dev`]
    - `dev`: TypeScript module with localStorage, vitest mocking

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Tasks 8, 9, 10
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `src/game/data/xp.ts:1-47` — Pure logic module pattern: exported interfaces and functions, no Phaser imports.
  - `src/game/systems/BattleSystem.ts:4-8` — Interface definition pattern for SaveData.

  **API/Type References**:
  - `src/game/utils/Constants.ts` — `SAVE_KEY` constant (from Task 3).
  - `src/game/utils/inventory.ts` — `Inventory` type alias (from Task 2) — SaveData uses `Record<string, number>` directly.

  **Test References**:
  - `src/game/systems/__tests__/BattleSystem.test.ts:1-14` — Test file setup pattern with vitest describe/it/expect/vi.
  - `src/game/data/__tests__/xp.test.ts` — Pure function test patterns.

  **Acceptance Criteria**:

  - [ ] `src/game/systems/SaveSystem.ts` exists with save, load, hasSave, deleteSave functions
  - [ ] SaveData interface has all 11 fields including `version: number`
  - [ ] No Phaser imports
  - [ ] load() returns null on corrupted JSON (no throw)
  - [ ] load() validates required fields and version
  - [ ] Round-trip test passes (save → load → deep equal)
  - [ ] `npx vitest run src/game/systems/__tests__/SaveSystem.test.ts` → PASS (12+ tests)
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: SaveSystem unit tests pass
    Tool: Bash
    Preconditions: SaveSystem.ts and SaveSystem.test.ts created
    Steps:
      1. Run: npx vitest run src/game/systems/__tests__/SaveSystem.test.ts
      2. Assert: exit code 0
      3. Assert: 12+ tests pass
    Expected Result: All save/load operations verified
    Failure Indicators: JSON parse errors, missing field validation, round-trip failures

  Scenario: No Phaser imports in SaveSystem
    Tool: Bash
    Preconditions: SaveSystem.ts created
    Steps:
      1. Run: grep -ci "phaser" src/game/systems/SaveSystem.ts
      2. Assert: output is "0"
    Expected Result: Zero Phaser imports
    Failure Indicators: Any Phaser reference found
  ```

  **Commit**: YES
  - Message: `feat(save): add SaveSystem with localStorage persistence and schema validation`
  - Files: `src/game/systems/SaveSystem.ts`, `src/game/systems/__tests__/SaveSystem.test.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 6. Refactor Registry Cleanup (TitleScene, VictoryScene, CharacterCreationScene)

  **What to do**:
  - **Create utility function in Constants.ts** (or use REGISTRY_KEYS directly):
    - `REGISTRY_KEYS` array already added in Task 3. Scenes iterate this array to clear all keys.
  - **Update `src/game/scenes/TitleScene.ts`**:
    - **CRITICAL**: Move registry clearing OUT of `create()` and INTO the "New Game" handler only.
    - `create()` should NOT clear registry (it currently does on lines 9-12). Remove those 4 lines.
    - The "New Game" handler (which will be refactored in Task 9 for arrow-key selection) must clear all keys using `REGISTRY_KEYS.forEach(key => this.game.registry.remove(key))` before starting CharacterCreationScene.
    - For now (before Task 9), restructure `create()` to bind "New Game" as a function that clears registry then starts CharacterCreationScene.
  - **Update `src/game/scenes/VictoryScene.ts`**:
    - Replace the 4 hardcoded `registry.remove()` calls (lines 9-12) with: `REGISTRY_KEYS.forEach(key => this.game.registry.remove(key))`
    - This ensures new keys (playerInventory, playerTileX, etc.) are also cleared on game completion.
  - **Update `src/game/scenes/CharacterCreationScene.ts`**:
    - In the class selection handler (handleClassInput, Enter branch, lines 159-164):
      - After setting playerName, playerClass, playerLevel, playerXp:
      - Add: `this.game.registry.set('playerInventory', JSON.stringify({ potion: 3 }))` — starting inventory
      - This gives new players 3 Potions on game start
    - Import `serializeInventory` and `createStartingInventory` from inventory utils (Task 2) for cleanliness: `this.game.registry.set('playerInventory', serializeInventory(createStartingInventory()))`

  **Must NOT do**:
  - Do NOT change the visual layout of TitleScene or VictoryScene
  - Do NOT add "Continue" option yet (that's Task 9)
  - Do NOT break existing game flow

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small targeted edits across 3 files, straightforward refactor
  - **Skills**: [`dev`]
    - `dev`: TypeScript scene modifications

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Tasks 9, 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `src/game/scenes/TitleScene.ts:9-12` — Current registry clearing in create(). MOVE to New Game handler.
  - `src/game/scenes/TitleScene.ts:39-41` — Current `startGame` function that transitions to CharacterCreationScene. This is where registry clearing should go.
  - `src/game/scenes/VictoryScene.ts:9-12` — Current registry clearing. Replace with REGISTRY_KEYS iteration.
  - `src/game/scenes/CharacterCreationScene.ts:159-164` — Where registry keys are set for new game. Add inventory here.

  **API/Type References**:
  - `src/game/utils/Constants.ts` — `REGISTRY_KEYS` array (from Task 3).
  - `src/game/utils/inventory.ts` — `serializeInventory()`, `createStartingInventory()` (from Task 2).

  **Acceptance Criteria**:

  - [ ] TitleScene.create() does NOT clear registry keys
  - [ ] "New Game" handler clears ALL keys using REGISTRY_KEYS before scene transition
  - [ ] VictoryScene clears ALL keys using REGISTRY_KEYS (not hardcoded 4)
  - [ ] CharacterCreationScene sets `playerInventory` registry key with `{ potion: 3 }` serialized
  - [ ] Existing game flow works: Title → CharCreation → WorldScene (no stale data)
  - [ ] `npx vitest run` → ALL tests pass
  - [ ] `npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: New Game flow still works after registry refactor
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Navigate to http://localhost:8080
      2. Press Enter to start new game
      3. Type "HERO", press Enter
      4. Press Enter (select Warrior)
      5. Wait 1000ms for WorldScene
      6. Assert: canvas is rendering (game loaded, not black screen)
      7. Screenshot: .sisyphus/evidence/task-6-new-game-flow.png
    Expected Result: Game starts normally after registry refactor
    Evidence: .sisyphus/evidence/task-6-new-game-flow.png

  Scenario: Build succeeds after refactor
    Tool: Bash
    Preconditions: All 3 files updated
    Steps:
      1. Run: npx vitest run
      2. Assert: exit code 0
      3. Run: npm run build
      4. Assert: exit code 0
    Expected Result: No regressions
    Failure Indicators: Build or test failures
  ```

  **Commit**: YES
  - Message: `refactor(registry): centralize registry cleanup and add starting inventory`
  - Files: `src/game/scenes/TitleScene.ts`, `src/game/scenes/VictoryScene.ts`, `src/game/scenes/CharacterCreationScene.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 7. Expand BattleScene with 4-Option Menu + Item Sub-Menu

  **What to do**:
  - **Update `src/game/scenes/BattleScene.ts`**:
    - **Fix handleConfirm() state duplication bug**: Remove line 252 (`this.currentState = BattleState.ENEMY_TURN`). Let the BattleSystem callback be the single source of truth for state changes. This is a PREREQUISITE before adding new actions.
    - **Add private fields**:
      - `private menuIndex = 0` — current menu selection (0=Attack, 1=Defend, 2=Item, 3=Flee)
      - `private menuOptions = ['Attack', 'Defend', 'Item', 'Flee']`
      - `private isItemSubMenu = false` — whether item sub-menu is showing
      - `private itemMenuIndex = 0` — current item selection
      - `private itemMenuEntries: { key: string; name: string; count: number }[] = []` — populated from registry inventory
    - **Add arrow key listeners** in `create()`:
      - `keydown-UP`: if PLAYER_TURN, move selection up (wrap around). If in item sub-menu, move item selection up.
      - `keydown-DOWN`: if PLAYER_TURN, move selection down (wrap around). If in item sub-menu, move item selection down.
      - `keydown-ESC`: if in item sub-menu, close it and return to main battle menu
    - **Rewrite `showPlayerTurn()` method**:
      - Clear message text
      - Set `this.messageText.setText('What will you do?')`
      - Render menu with `>` prefix on selected option:
        ```
        > Attack          Attack
          Defend    or  > Defend
          Item            Item
          Flee            Flee
        ```
      - Selected option in yellow (#ffff00), others in white
    - **Rewrite `handleConfirm()` method**:
      - If in item sub-menu:
        - Get selected item from `itemMenuEntries[itemMenuIndex]`
        - Get healAmount from `ITEMS[item.key].healAmount`
        - Update inventory in registry (remove 1 of selected item)
        - Call `this.battleSystem.playerUseItem(healAmount)`
        - Close item sub-menu
        - Return
      - If NOT in item sub-menu, based on `menuIndex`:
        - 0 (Attack): `this.battleSystem.playerAttack()`
        - 1 (Defend): `this.battleSystem.playerDefend()`
        - 2 (Item): Open item sub-menu (populate from registry inventory, show consumable items with counts). If no consumable items, show "No items!" message briefly then return to menu.
        - 3 (Flee): `this.battleSystem.playerFlee()`
    - **Add item sub-menu rendering**:
      - Shows list of consumable items with quantities: `> Potion x3`, `Hi-Potion x1`
      - Arrow keys navigate, Enter uses, Escape goes back to main menu
      - Positioned below the main menu area or replaces it
    - **Update BattleCallbacks setup** in `create()`:
      - Add `onHeal: (healAmount, newHp) => this.onHeal(healAmount, newHp)`
      - Add `onFleeAttempt: (success) => this.onFleeAttempt(success)`
    - **Add callback handlers**:
      - `onHeal(healAmount, newHp)`: Update message text "Used Potion! HP restored.", update player HP bar
      - `onFleeAttempt(success)`:
        - If success: message "Got away safely!" (then BattleSystem transitions to FLED → onBattleEnd handles exit)
        - If fail and not boss: message "Couldn't escape!" (then enemy turn follows)
        - If fail and boss: message "Can't escape from boss!"
    - **Update `onStateChange()` for FLED state**:
      - Case `BattleState.FLED`: clear menu text (let onBattleEnd handle exit)
    - **Update `onBattleEnd()` for 'fled' result**:
      - `result === 'fled'`: wake WorldScene with `{ playerHp, encounterId, result: 'fled', xpGained: 0 }`, stop BattleScene. Use delay like victory (2000ms after message).
    - **Pass inventory to BattleScene**: Update BattleInitData interface to NOT need inventory (BattleScene reads from `this.game.registry.get('playerInventory')` directly when opening item sub-menu). Registry is global.
    - **Reset menu state** in `init()`: `this.menuIndex = 0; this.isItemSubMenu = false; this.itemMenuIndex = 0;`

  **Must NOT do**:
  - Do NOT change BattleSystem.ts (only BattleScene.ts)
  - Do NOT add mouse click handling
  - Do NOT add item animations or effects
  - Do NOT add enemy AI changes
  - Do NOT use external UI library

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex UI state management with main menu, sub-menu, multiple input handlers, callback wiring. Needs careful attention to state transitions and edge cases.
  - **Skills**: [`dev`]
    - `dev`: Phaser scene UI, keyboard input handling, state management

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2, 4

  **References**:

  **Pattern References**:
  - `src/game/scenes/BattleScene.ts:185-188` — Current `showPlayerTurn()` — replace with multi-option menu.
  - `src/game/scenes/BattleScene.ts:250-254` — Current `handleConfirm()` with state duplication bug on line 252. FIX FIRST then expand.
  - `src/game/scenes/BattleScene.ts:109-112` — Keyboard listener setup. Add UP/DOWN/ESC here.
  - `src/game/scenes/BattleScene.ts:114-133` — BattleCallbacks setup. Add onHeal, onFleeAttempt.
  - `src/game/scenes/BattleScene.ts:141-183` — `onStateChange()` handler. Add FLED case.
  - `src/game/scenes/BattleScene.ts:226-246` — `onBattleEnd()` handler. Add 'fled' case.
  - `src/game/scenes/CharacterCreationScene.ts:116-127` — Arrow-key highlight update pattern (selected item in yellow with `>` prefix). Reuse for battle menu.
  - `src/game/scenes/CharacterCreationScene.ts:151-157` — Arrow Up/Down with modular wrap-around. Reuse pattern.

  **API/Type References**:
  - `src/game/systems/BattleSystem.ts` — Updated API with playerDefend(), playerUseItem(healAmount), playerFlee(), expanded BattleCallbacks (from Task 4).
  - `src/game/data/items.ts` — ITEMS record to look up healAmount by item key (from Task 1).
  - `src/game/utils/inventory.ts` — removeItem(), deserializeInventory(), serializeInventory() (from Task 2).
  - `src/game/utils/Constants.ts` — BattleState.FLED (from Task 3).

  **Acceptance Criteria**:

  - [ ] handleConfirm() no longer manually sets `this.currentState` (bug fix)
  - [ ] Battle menu shows 4 options: Attack, Defend, Item, Flee
  - [ ] Arrow Up/Down cycles selection with visual indicator (`>` prefix, yellow color)
  - [ ] Enter on Attack calls playerAttack()
  - [ ] Enter on Defend calls playerDefend(), message shows "You brace for impact!"
  - [ ] Enter on Item opens sub-menu with consumable items from inventory
  - [ ] Enter on Item with empty inventory shows "No items!" then returns to menu
  - [ ] Item sub-menu shows items with quantities, arrow keys navigate, Enter uses, Escape backs out
  - [ ] Using item updates registry inventory and heals player (HP bar updates)
  - [ ] Enter on Flee attempts flee — success exits battle, failure shows message then enemy turn
  - [ ] Boss battle: Flee shows "Can't escape from boss!" without consuming turn
  - [ ] FLED state handled in onStateChange
  - [ ] 'fled' result handled in onBattleEnd (wakes WorldScene with result: 'fled')
  - [ ] Menu resets to index 0 on each new PLAYER_TURN
  - [ ] `npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Battle menu shows 4 options with arrow key navigation
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Navigate to http://localhost:8080
      2. Press Enter, type "HERO", press Enter, press Enter (Warrior)
      3. Wait 1000ms for WorldScene
      4. Navigate to nearest enemy encounter (arrow keys to encounter tile)
      5. Wait for BattleScene to load (1500ms intro delay)
      6. Wait for "What will you do?" message
      7. Screenshot: .sisyphus/evidence/task-7-battle-menu-4options.png
      8. Assert: menu shows Attack, Defend, Item, Flee
      9. Press ArrowDown (select Defend)
      10. Screenshot: .sisyphus/evidence/task-7-battle-menu-defend-selected.png
      11. Assert: Defend option has ">" prefix
    Expected Result: 4-option menu with arrow key navigation
    Evidence: .sisyphus/evidence/task-7-battle-menu-4options.png, task-7-battle-menu-defend-selected.png

  Scenario: Defend action halves enemy damage
    Tool: Playwright (playwright skill)
    Preconditions: In battle, PLAYER_TURN
    Steps:
      1. Press ArrowDown to select Defend
      2. Press Enter to confirm
      3. Wait for enemy attack message
      4. Screenshot: .sisyphus/evidence/task-7-defend-action.png
      5. Assert: message shows "You brace for impact!" followed by enemy attack
    Expected Result: Defend action processes correctly
    Evidence: .sisyphus/evidence/task-7-defend-action.png

  Scenario: Item sub-menu opens and uses potion
    Tool: Playwright (playwright skill)
    Preconditions: In battle, player has potions, HP not full
    Steps:
      1. Press ArrowDown twice to select Item
      2. Press Enter to open item sub-menu
      3. Screenshot: .sisyphus/evidence/task-7-item-submenu.png
      4. Assert: sub-menu shows "Potion x3"
      5. Press Enter to use Potion
      6. Wait for heal message
      7. Screenshot: .sisyphus/evidence/task-7-potion-used.png
      8. Assert: message shows "Used Potion! HP restored."
      9. Assert: player HP bar increased
    Expected Result: Potion used, HP restored, inventory decremented
    Evidence: .sisyphus/evidence/task-7-item-submenu.png, task-7-potion-used.png

  Scenario: Flee from normal enemy
    Tool: Playwright (playwright skill)
    Preconditions: In battle with non-boss enemy, PLAYER_TURN
    Steps:
      1. Press ArrowDown 3 times to select Flee
      2. Press Enter
      3. Wait 1000ms for result
      4. Screenshot: .sisyphus/evidence/task-7-flee-attempt.png
      5. Assert: either "Got away safely!" (success) or "Couldn't escape!" (failure)
    Expected Result: Flee attempt processes (success or failure)
    Evidence: .sisyphus/evidence/task-7-flee-attempt.png
  ```

  **Commit**: YES
  - Message: `feat(battle-ui): add 4-option battle menu with defend, item, and flee actions`
  - Files: `src/game/scenes/BattleScene.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 8. Create PauseMenu System for WorldScene

  **What to do**:
  - **Create `src/game/systems/PauseMenu.ts`**:
    - Class that creates a pause menu overlay within WorldScene
    - Constructor takes `scene: Scene` parameter
    - **Properties**:
      - `private isOpen = false`
      - `private menuIndex = 0`
      - `private menuOptions = ['Stats', 'Inventory', 'Use Item', 'Save Game', 'Close']`
      - `private background?: Phaser.GameObjects.Graphics`
      - `private menuTexts: Phaser.GameObjects.Text[] = []`
      - `private contentText?: Phaser.GameObjects.Text`
    - **Methods**:
      - `open()`: Creates overlay covering most of viewport (camera-relative positioning using `scene.cameras.main.scrollX/scrollY`). Renders semi-transparent black background (`fillStyle(0x000000, 0.85)`). Shows menu options list on left side. Shows stats content on right side by default. Sets `isOpen = true`. Sets depth to 2000 (above DialogueSystem's 1000).
      - `close()`: Destroys all overlay game objects, sets `isOpen = false`.
      - `moveUp()`: Decrement `menuIndex` with wrap-around, update highlights.
      - `moveDown()`: Increment `menuIndex` with wrap-around, update highlights.
      - `select(player: Player, registry: Phaser.Data.DataManager)`: Execute selected option:
        - 0 (Stats): Show stats panel — player.name, class, level, xp, hp/maxHp, attack, defense
        - 1 (Inventory): Show inventory panel — list items with quantities from registry
        - 2 (Use Item): If potions > 0: heal player (`player.hp = Math.min(player.hp + healAmount, player.maxHp)`), decrement inventory in registry, show "Used Potion! HP restored." If no potions: show "No items to use!"
        - 3 (Save Game): Call SaveSystem.save() with current game state, show "Saved!" confirmation
        - 4 (Close): Call `this.close()`
      - `getIsOpen(): boolean`: Returns `isOpen`
    - **Positioning**: Camera-relative. Background covers ~280x200 of the 320x240 viewport, centered. Menu options listed vertically on left. Content panel on right.
    - **Visual style**: Same text style as rest of game (12px white, selected in yellow with `>` prefix). Content panel shows multiline text.

  **Must NOT do**:
  - Do NOT reuse or extend DialogueSystem (separate system)
  - Do NOT add settings, quit-to-title, key rebinding
  - Do NOT add sub-pages or navigation within content panels
  - Do NOT add item selection within Use Item (auto-uses first potion, or opens simple selector similar to battle item sub-menu but simpler)
  - Do NOT use external UI library

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex overlay system with multiple panels, menu navigation, and game state interaction. Camera-relative positioning adds complexity.
  - **Skills**: [`dev`]
    - `dev`: Phaser overlay system, keyboard navigation, game state management

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2, 5

  **References**:

  **Pattern References**:
  - `src/game/systems/DialogueSystem.ts:63-99` — Camera-relative overlay positioning pattern. Use `scene.cameras.main.scrollX/scrollY` for positioning. Follow the Graphics + Text layering with `setDepth()`.
  - `src/game/systems/DialogueSystem.ts:14-16` — Constructor pattern: takes `scene: Scene`.
  - `src/game/systems/DialogueSystem.ts:40-57` — `hide()` cleanup pattern: destroy all game objects, reset state.
  - `src/game/scenes/CharacterCreationScene.ts:116-127` — Arrow-key highlight pattern with `>` prefix and yellow color for selected option.

  **API/Type References**:
  - `src/game/entities/Player.ts:11-19` — Player properties to display in stats: hp, maxHp, attack, defense, name, classKey, level, xp.
  - `src/game/systems/SaveSystem.ts` — `save(data)` function (from Task 5). PauseMenu calls this for "Save Game" option.
  - `src/game/utils/inventory.ts` — `deserializeInventory()`, `removeItem()`, `serializeInventory()` (from Task 2).
  - `src/game/data/items.ts` — `ITEMS` record to look up item names and healAmounts (from Task 1).
  - `src/game/utils/Constants.ts` — `CANVAS_WIDTH`, `CANVAS_HEIGHT` for overlay sizing.

  **Acceptance Criteria**:

  - [ ] `src/game/systems/PauseMenu.ts` exists with open, close, moveUp, moveDown, select, getIsOpen methods
  - [ ] Overlay uses camera-relative positioning (doesn't drift with world scrolling)
  - [ ] Menu shows 5 options: Stats, Inventory, Use Item, Save Game, Close
  - [ ] Arrow keys navigate options with `>` prefix and yellow highlight
  - [ ] Stats option shows player name, class, level, xp, hp/maxHp, attack, defense
  - [ ] Inventory option shows item names and quantities
  - [ ] Use Item heals player, decrements inventory, shows confirmation
  - [ ] Use Item with no items shows "No items to use!"
  - [ ] Save Game calls SaveSystem.save() and shows "Saved!"
  - [ ] Close closes the overlay
  - [ ] Depth set to 2000 (above DialogueSystem's 1000)
  - [ ] `npm run build` → exit code 0

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Pause menu opens and shows stats
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, in WorldScene
    Steps:
      1. Start new game (Enter → "HERO" → Enter → Enter)
      2. Wait 1000ms for WorldScene
      3. Press Escape
      4. Wait 500ms
      5. Screenshot: .sisyphus/evidence/task-8-pause-menu-open.png
      6. Assert: overlay visible with Stats, Inventory, Use Item, Save Game, Close options
      7. Assert: Stats panel shows player name, class, level, HP, ATK, DEF
    Expected Result: Pause menu overlay appears with correct stats
    Evidence: .sisyphus/evidence/task-8-pause-menu-open.png

  Scenario: Save game from pause menu
    Tool: Playwright (playwright skill)
    Preconditions: Pause menu open
    Steps:
      1. Press ArrowDown 3 times to select "Save Game"
      2. Press Enter
      3. Wait 500ms
      4. Screenshot: .sisyphus/evidence/task-8-save-game.png
      5. Assert: "Saved!" text visible
    Expected Result: Game saved to localStorage
    Evidence: .sisyphus/evidence/task-8-save-game.png

  Scenario: Use potion from pause menu
    Tool: Playwright (playwright skill)
    Preconditions: Pause menu open, player has potions, HP not full (take damage in a battle first)
    Steps:
      1. Take some damage in battle first (start battle, get hit, win/flee)
      2. Open pause menu (Escape)
      3. Press ArrowDown twice to select "Use Item"
      4. Press Enter
      5. Wait 500ms
      6. Screenshot: .sisyphus/evidence/task-8-use-potion.png
      7. Assert: "Used Potion! HP restored." text visible
    Expected Result: Potion consumed, HP restored
    Evidence: .sisyphus/evidence/task-8-use-potion.png

  Scenario: Pause menu closes and movement resumes
    Tool: Playwright (playwright skill)
    Preconditions: Pause menu open
    Steps:
      1. Press Escape to close
      2. Wait 300ms
      3. Press ArrowRight
      4. Wait 300ms
      5. Screenshot: .sisyphus/evidence/task-8-menu-closed-movement.png
      6. Assert: player moved (not stuck)
    Expected Result: Menu closed, movement works
    Evidence: .sisyphus/evidence/task-8-menu-closed-movement.png
  ```

  **Commit**: YES
  - Message: `feat(pause): add pause menu overlay with stats, inventory, save, and use item`
  - Files: `src/game/systems/PauseMenu.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 9. Add "Continue" Option to TitleScene

  **What to do**:
  - **Update `src/game/scenes/TitleScene.ts`**:
    - On `create()`:
      - Check `SaveSystem.hasSave()` to determine if "Continue" should be shown
      - If save exists: show two options "New Game" and "Continue"
      - If no save: show only "New Game"
    - **Menu rendering** (follow CharacterCreationScene class selection pattern):
      - Track `private selectedIndex = 0`
      - Track `private options: string[]` (populated based on whether save exists)
      - Display options vertically with current selection highlighted (yellow with `>` prefix)
    - **Add arrow key listeners**:
      - `keydown-UP`: `selectedIndex = (selectedIndex - 1 + options.length) % options.length`, update highlights
      - `keydown-DOWN`: `selectedIndex = (selectedIndex + 1) % options.length`, update highlights
    - **Update Enter/Space handler**:
      - If selected option is "New Game": clear all registry keys via `REGISTRY_KEYS.forEach(key => this.game.registry.remove(key))` → `this.scene.start('CharacterCreationScene')`
      - If selected option is "Continue": call `SaveSystem.load()` → set all registry keys from save data:
        - `registry.set('playerName', saveData.playerName)`
        - `registry.set('playerClass', saveData.playerClass)`
        - `registry.set('playerLevel', saveData.playerLevel)`
        - `registry.set('playerXp', saveData.playerXp)`
        - `registry.set('playerInventory', JSON.stringify(saveData.playerInventory))`
        - `registry.set('playerTileX', saveData.playerTileX)`
        - `registry.set('playerTileY', saveData.playerTileY)`
        - `registry.set('defeatedEncounters', JSON.stringify(saveData.defeatedEncounters))`
        - `registry.set('triggeredStoryEvents', JSON.stringify(saveData.triggeredStoryEvents))`
        - `registry.set('collectedPickups', JSON.stringify(saveData.collectedPickups))`
        - → `this.scene.start('WorldScene')` (skip CharacterCreationScene entirely)
    - **Remove old Enter/Space handlers** that unconditionally start CharacterCreationScene
    - **Keep blinking "Press Enter" text** and visual styling
    - **Menu layout**:
      - "FANTASY RPG" title stays at y=60
      - "New Game" at y=120 (or y=130 if continue exists)
      - "Continue" at y=145 (if save exists)
      - "Press Enter" hint stays at y=200

  **Must NOT do**:
  - Do NOT add multiple save slots
  - Do NOT add save slot selection screen
  - Do NOT change the visual style (keep dark background, white text, etc.)
  - Do NOT add "Delete Save" option

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Well-defined UI addition following existing CharacterCreationScene arrow-key pattern
  - **Skills**: [`dev`]
    - `dev`: Phaser scene modification, keyboard input

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 5, 6

  **References**:

  **Pattern References**:
  - `src/game/scenes/TitleScene.ts:1-49` — CURRENT TitleScene to modify. Replace simple Enter handler with menu system.
  - `src/game/scenes/CharacterCreationScene.ts:66-114` — Class selection menu with arrow-key navigation, `>` prefix highlight, `selectedIndex`. Reuse this exact pattern for New Game / Continue.
  - `src/game/scenes/CharacterCreationScene.ts:116-127` — `updateClassHighlights()` — selected item gets `>` prefix + yellow color. Reuse pattern.
  - `src/game/scenes/CharacterCreationScene.ts:151-157` — ArrowUp/Down with modular wrap-around. Reuse pattern.
  - `src/game/scenes/TitleScene.ts:31-37` — Blinking text tween. Keep as-is.

  **API/Type References**:
  - `src/game/systems/SaveSystem.ts` — `hasSave()`, `load()` functions (from Task 5).
  - `src/game/utils/Constants.ts` — `REGISTRY_KEYS` for clearing (from Task 3).

  **Acceptance Criteria**:

  - [ ] When no save exists: only "New Game" shown, no "Continue"
  - [ ] When save exists: both "New Game" and "Continue" shown
  - [ ] Arrow Up/Down toggles selection with `>` prefix and yellow highlight
  - [ ] Enter on "New Game": clears all registry keys, starts CharacterCreationScene
  - [ ] Enter on "Continue": loads save data into registry, starts WorldScene directly (skips CharCreation)
  - [ ] "Continue" does NOT go through CharacterCreationScene
  - [ ] TitleScene.create() does NOT clear registry (moved to New Game handler in Task 6)
  - [ ] Blinking "Press Enter" text still works
  - [ ] `npm run build` → exit code 0
  - [ ] `npx vitest run` → ALL tests pass

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: TitleScene shows only New Game when no save exists
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, no save in localStorage
    Steps:
      1. Navigate to http://localhost:8080
      2. Execute JS: localStorage.removeItem('fantasyrpg-save')
      3. Reload page
      4. Wait 1000ms
      5. Screenshot: .sisyphus/evidence/task-9-title-no-save.png
      6. Assert: "New Game" visible, "Continue" NOT visible
    Expected Result: Only New Game option shown
    Evidence: .sisyphus/evidence/task-9-title-no-save.png

  Scenario: TitleScene shows Continue when save exists
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:8080
      2. Execute JS: localStorage.setItem('fantasyrpg-save', JSON.stringify({version:1, playerName:"TEST", playerClass:"warrior", playerLevel:3, playerXp:25, playerInventory:{potion:2}, playerTileX:10, playerTileY:12, defeatedEncounters:["rat-1"], triggeredStoryEvents:["entrance-trigger"], collectedPickups:[]}))
      3. Reload page
      4. Wait 1000ms
      5. Screenshot: .sisyphus/evidence/task-9-title-with-save.png
      6. Assert: both "New Game" and "Continue" visible
      7. Press ArrowDown (select Continue)
      8. Screenshot: .sisyphus/evidence/task-9-continue-selected.png
      9. Assert: "Continue" has ">" prefix and yellow color
    Expected Result: Both options visible, arrow navigation works
    Evidence: .sisyphus/evidence/task-9-title-with-save.png, task-9-continue-selected.png

  Scenario: Continue loads save and starts WorldScene at saved position
    Tool: Playwright (playwright skill)
    Preconditions: Save data in localStorage (from previous scenario)
    Steps:
      1. From TitleScene with save, press ArrowDown to select Continue
      2. Press Enter
      3. Wait 1000ms for WorldScene
      4. Screenshot: .sisyphus/evidence/task-9-continue-loaded.png
      5. Assert: game loaded (canvas rendering, not black)
      6. Assert: player spawned at saved position (not default spawn)
    Expected Result: Save data loaded, WorldScene starts at correct position
    Evidence: .sisyphus/evidence/task-9-continue-loaded.png
  ```

  **Commit**: YES
  - Message: `feat(title): add Continue option to TitleScene for loading saved games`
  - Files: `src/game/scenes/TitleScene.ts`
  - Pre-commit: `npx vitest run`

---

- [ ] 10. WorldScene Full Integration (Pickups, Save-Aware Spawn, Flee Handling, Pause Wiring)

  **What to do**:
  - **Update `src/game/scenes/Boot.ts`**:
    - Add: `this.load.image('potion', 'assets/sprites/potion.png')`
  - **Update `src/game/scenes/WorldScene.ts`** — This is the most complex integration task. Multiple subsystems wired together:

  **A. Pause Menu Integration:**
    - Import PauseMenu from systems
    - Add property: `private pauseMenu!: PauseMenu`
    - In `create()`: `this.pauseMenu = new PauseMenu(this)`
    - Add Escape key listener in `create()`:
      ```
      this.input.keyboard.on('keydown-ESC', this.handleEscape, this)
      ```
    - Add `handleEscape()` method:
      - If `this.dialogueSystem.getIsActive()` → return (don't open during dialogue)
      - If `this.pauseMenu.getIsOpen()` → `this.pauseMenu.close()`
      - Else → `this.pauseMenu.open()`
    - Add arrow key + Enter handling for pause menu:
      - In `update()`: if `this.pauseMenu.getIsOpen()` → return (block movement)
      - The PauseMenu handles its own key bindings internally, OR WorldScene delegates up/down/enter to it
    - In `handleInteraction()`: add guard: `if (this.pauseMenu.getIsOpen()) return` (block NPC interaction during pause)

  **B. Save-Aware Spawn Position:**
    - In `create()`, replace hardcoded spawn (lines 102-103):
      ```
      const savedTileX = this.game.registry.get('playerTileX');
      const savedTileY = this.game.registry.get('playerTileY');
      const spawnTileX = savedTileX !== undefined ? savedTileX : PLAYER_SPAWN_X;
      const spawnTileY = savedTileY !== undefined ? savedTileY : PLAYER_SPAWN_Y;
      const spawnX = spawnTileX * TILE_SIZE + TILE_SIZE / 2;
      const spawnY = spawnTileY * TILE_SIZE + TILE_SIZE / 2;
      ```

  **C. Restore Defeated Encounters + Story Events from Registry:**
    - In `create()`, BEFORE encounter sprite creation:
      ```
      const savedDefeated = this.game.registry.get('defeatedEncounters');
      if (savedDefeated) {
        const arr: string[] = JSON.parse(savedDefeated);
        arr.forEach(id => this.defeatedEncounters.add(id));
      }
      const savedStory = this.game.registry.get('triggeredStoryEvents');
      if (savedStory) {
        const arr: string[] = JSON.parse(savedStory);
        arr.forEach(id => this.triggeredStoryEvents.add(id));
      }
      ```
    - This ensures loaded saves skip defeated encounters and triggered story events

  **D. Potion Pickup Sprites:**
    - Add pickup spawn data (similar to ENCOUNTER_SPAWNS):
      ```
      const POTION_SPAWNS = [
        { id: 'potion-1', itemKey: 'potion', tileX: 12, tileY: 8 },
        { id: 'potion-2', itemKey: 'potion', tileX: 6, tileY: 20 },
        { id: 'potion-3', itemKey: 'hiPotion', tileX: 30, tileY: 21 },
        { id: 'potion-4', itemKey: 'potion', tileX: 22, tileY: 26 },
        { id: 'potion-5', itemKey: 'potion', tileX: 18, tileY: 30 },
      ];
      ```
    - Add property: `private collectedPickups: Set<string> = new Set()`
    - Add property: `private pickups: { id: string; itemKey: string; tileX: number; tileY: number; sprite: Phaser.GameObjects.Image }[] = []`
    - In `create()`:
      - Restore collectedPickups from registry (same as defeatedEncounters)
      - Create pickup sprites for uncollected items (filter by collectedPickups Set)
    - In `onMoveComplete` callback (after encounter check, after story trigger check):
      - Check if player stepped on a potion pickup tile
      - If found: add item to inventory via `addItem(deserializeInventory(registry), itemKey)` → `serializeInventory()` → registry set
      - Add pickup ID to `collectedPickups` Set
      - Destroy the pickup sprite
      - Show brief message using DialogueSystem or inline text: "Found a Potion!" / "Found a Hi-Potion!"

  **E. Flee Handling in Wake Handler:**
    - In the `events.on('wake', ...)` handler (lines 165-190):
      - Add handling for `result === 'fled'`:
        - Update `player.hp` from wake data (player may have taken damage before fleeing)
        - Do NOT destroy encounter sprite
        - Do NOT add to `defeatedEncounters`
        - Do NOT process XP
        - The enemy remains on the map and can be re-encountered

  **F. Save Data Collection for PauseMenu:**
    - PauseMenu's "Save Game" option needs access to current game state. Provide a method or pass data:
      - Player stats: from `this.player`
      - Inventory: from registry
      - Tile position: `Math.floor(this.player.x / TILE_SIZE)`, `Math.floor(this.player.y / TILE_SIZE)`
      - Defeated encounters: from `this.defeatedEncounters` Set → `Array.from()`
      - Triggered story events: from `this.triggeredStoryEvents` Set → `Array.from()`
      - Collected pickups: from `this.collectedPickups` Set → `Array.from()`
    - This data is assembled in WorldScene and passed to SaveSystem.save()

  **G. Pause Menu Arrow/Enter Key Delegation:**
    - Either: PauseMenu registers its own keyboard listeners (cleaner separation)
    - Or: WorldScene checks `pauseMenu.getIsOpen()` in update and delegates arrow/enter events
    - Recommendation: PauseMenu registers its own listeners, with guards checking `isOpen`. Remove/add listeners on open/close.

  **Must NOT do**:
  - Do NOT modify GridPhysics.ts
  - Do NOT modify BattleSystem.ts
  - Do NOT add auto-save
  - Do NOT add pickup chest animations
  - Do NOT randomize pickup locations

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex multi-system integration across WorldScene touching pause menu, pickups, save/load, flee handling, and registry restoration. Requires understanding all prior tasks.
  - **Skills**: [`dev`, `playwright`]
    - `dev`: Complex multi-system TypeScript integration
    - `playwright`: End-to-end gameplay verification across all features

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (sequential, final task)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 1, 2, 3, 5, 6, 7, 8, 9

  **References**:

  **Pattern References**:
  - `src/game/scenes/WorldScene.ts:63-195` — Full WorldScene create() method. Multiple insertion points for new code.
  - `src/game/scenes/WorldScene.ts:102-103` — Hardcoded spawn position. Replace with registry-aware spawn.
  - `src/game/scenes/WorldScene.ts:77-92` — Encounter sprite creation with defeatedEncounters filter. Follow for pickup sprites.
  - `src/game/scenes/WorldScene.ts:129-163` — onMoveComplete callback with encounter and story trigger checks. Add pickup check after story triggers.
  - `src/game/scenes/WorldScene.ts:165-189` — Wake handler for battle results. Add 'fled' case.
  - `src/game/scenes/WorldScene.ts:197-202` — update() method with dialogue blocking. Add pause menu blocking.
  - `src/game/scenes/WorldScene.ts:204-238` — handleInteraction() with dialogue advance and NPC check. Add pause menu guard.

  **API/Type References**:
  - `src/game/systems/PauseMenu.ts` — PauseMenu class with open, close, getIsOpen, moveUp, moveDown, select (from Task 8).
  - `src/game/systems/SaveSystem.ts` — save(data) function and SaveData interface (from Task 5).
  - `src/game/utils/inventory.ts` — addItem, deserializeInventory, serializeInventory (from Task 2).
  - `src/game/data/items.ts` — ITEMS record for item lookup (from Task 1).
  - `src/game/utils/Constants.ts` — TILE_SIZE, PLAYER_SPAWN_X, PLAYER_SPAWN_Y, REGISTRY_KEYS (existing + Task 3).

  **Acceptance Criteria**:

  - [ ] Escape opens/closes pause menu overlay in WorldScene
  - [ ] Movement blocked while pause menu is open
  - [ ] NPC interaction blocked while pause menu is open
  - [ ] Escape does NOT open pause during dialogue
  - [ ] Save Game from pause menu writes to localStorage with complete game state
  - [ ] Player spawns at saved tile position when loading (not default spawn)
  - [ ] Defeated encounters not shown on loaded game
  - [ ] Triggered story events not replayed on loaded game
  - [ ] Potion pickup sprites appear on map at defined positions
  - [ ] Stepping on pickup adds item to inventory, removes sprite, shows message
  - [ ] Collected pickups don't respawn on load
  - [ ] Flee result in wake handler: updates HP, does NOT destroy encounter
  - [ ] Re-entering a fled encounter starts battle again (enemy still there)
  - [ ] Boot.ts loads 'potion' sprite
  - [ ] `npx vitest run` → ALL tests pass (0 failures)
  - [ ] `npm run build` → exit code 0
  - [ ] Full end-to-end game flow works

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Full save/load round trip
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running on localhost:8080
    Steps:
      1. Start new game (Enter → "HERO" → Enter → Enter for Warrior)
      2. Wait 1000ms
      3. Walk into first enemy encounter (arrow keys to encounter tile)
      4. Win battle (spam Enter through Attack)
      5. Wait for WorldScene to resume
      6. Move to a different position (ArrowRight x5, ArrowDown x3)
      7. Press Escape to open pause menu
      8. Screenshot: .sisyphus/evidence/task-10-pause-open.png
      9. Navigate to "Save Game" (ArrowDown x3)
      10. Press Enter (save)
      11. Wait 500ms
      12. Press Escape to close
      13. Navigate to http://localhost:8080 (reload)
      14. Wait 1000ms
      15. Assert: "Continue" option visible on TitleScene
      16. Press ArrowDown to select Continue, press Enter
      17. Wait 1000ms
      18. Screenshot: .sisyphus/evidence/task-10-loaded-game.png
      19. Assert: player NOT at default spawn (spawned at saved position)
      20. Assert: defeated enemy no longer visible on map
    Expected Result: Complete save/load cycle preserves game state
    Evidence: .sisyphus/evidence/task-10-pause-open.png, task-10-loaded-game.png

  Scenario: Potion pickup on world map
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, in WorldScene
    Steps:
      1. Start new game
      2. Navigate to potion pickup location (arrow keys to POTION_SPAWNS[0] tile)
      3. Step onto pickup tile
      4. Wait 500ms
      5. Screenshot: .sisyphus/evidence/task-10-potion-pickup.png
      6. Assert: message shows "Found a Potion!" (or similar)
      7. Walk off and back to same tile
      8. Assert: no second pickup (sprite destroyed)
    Expected Result: Potion collected once, added to inventory
    Evidence: .sisyphus/evidence/task-10-potion-pickup.png

  Scenario: Flee from battle and re-encounter
    Tool: Playwright (playwright skill)
    Preconditions: In WorldScene, encounter nearby
    Steps:
      1. Walk into enemy encounter
      2. Wait for battle to load
      3. Press ArrowDown 3 times to select Flee
      4. Press Enter
      5. If flee failed, repeat (enemy attacks, new PLAYER_TURN, try flee again)
      6. On successful flee, wait for WorldScene
      7. Screenshot: .sisyphus/evidence/task-10-fled-enemy-still-there.png
      8. Assert: enemy sprite still visible on map at same position
      9. Walk into same enemy tile again
      10. Assert: battle starts again
    Expected Result: Fled enemy remains on map and can be re-encountered
    Evidence: .sisyphus/evidence/task-10-fled-enemy-still-there.png

  Scenario: Pause menu blocks movement and interaction
    Tool: Playwright (playwright skill)
    Preconditions: In WorldScene
    Steps:
      1. Press Escape to open pause
      2. Screenshot position: .sisyphus/evidence/task-10-pause-block-before.png
      3. Press ArrowRight, ArrowDown (300ms each)
      4. Screenshot position: .sisyphus/evidence/task-10-pause-block-during.png
      5. Assert: player position unchanged (pause blocks movement)
      6. Press Escape to close
      7. Press ArrowRight (300ms)
      8. Assert: player moves (movement resumed)
    Expected Result: Movement blocked during pause, resumes after
    Evidence: .sisyphus/evidence/task-10-pause-block-before.png, task-10-pause-block-during.png

  Scenario: Save data includes all state
    Tool: Playwright (playwright skill)
    Preconditions: After save game action
    Steps:
      1. Execute JS: JSON.parse(localStorage.getItem('fantasyrpg-save'))
      2. Assert: result has version === 1
      3. Assert: result has playerName (string)
      4. Assert: result has playerClass (string)
      5. Assert: result has playerLevel (number)
      6. Assert: result has playerXp (number)
      7. Assert: result has playerInventory (object)
      8. Assert: result has playerTileX (number)
      9. Assert: result has playerTileY (number)
      10. Assert: result has defeatedEncounters (array)
      11. Assert: result has triggeredStoryEvents (array)
      12. Assert: result has collectedPickups (array)
    Expected Result: All 11 save data fields present with correct types
    Failure Indicators: Missing fields, wrong types
  ```

  **Commit**: YES
  - Message: `feat(integration): wire pause menu, pickups, save-aware spawn, and flee handling into WorldScene`
  - Files: `src/game/scenes/WorldScene.ts`, `src/game/scenes/Boot.ts`
  - Pre-commit: `npx vitest run`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat(items): add item data file with Potion and Hi-Potion definitions` | items.ts, items.test.ts, potion.png | `npx vitest run` |
| 2 | `feat(inventory): add pure inventory helper utilities with full test coverage` | inventory.ts, inventory.test.ts | `npx vitest run` |
| 3 | `feat(constants): add FLED battle state, registry keys, save key, and flee chance constants` | Constants.ts | `npx vitest run` |
| 4 | `feat(battle): expand BattleSystem with defend, use item, and flee actions` | BattleSystem.ts, BattleSystem.test.ts | `npx vitest run` |
| 5 | `feat(save): add SaveSystem with localStorage persistence and schema validation` | SaveSystem.ts, SaveSystem.test.ts | `npx vitest run` |
| 6 | `refactor(registry): centralize registry cleanup and add starting inventory` | TitleScene.ts, VictoryScene.ts, CharacterCreationScene.ts | `npx vitest run` |
| 7 | `feat(battle-ui): add 4-option battle menu with defend, item, and flee actions` | BattleScene.ts | `npx vitest run` |
| 8 | `feat(pause): add pause menu overlay with stats, inventory, save, and use item` | PauseMenu.ts | `npx vitest run` |
| 9 | `feat(title): add Continue option to TitleScene for loading saved games` | TitleScene.ts | `npx vitest run` |
| 10 | `feat(integration): wire pause menu, pickups, save-aware spawn, and flee handling into WorldScene` | WorldScene.ts, Boot.ts | `npx vitest run` |

---

## Success Criteria

### Verification Commands
```bash
npx vitest run                    # Expected: ALL tests pass (140+), exit code 0
npm run build                     # Expected: exit code 0
npx tsc --noEmit                  # Expected: exit code 0
```

### Final Checklist
- [ ] All "Must Have" requirements present
- [ ] All "Must NOT Have" guardrails respected
- [ ] All 6 requirements fulfilled (R-006, R-007, R-011, R-017, R-018, R-021)
- [ ] No audio code (R-019, R-020 deferred)
- [ ] All existing 110 tests still pass (zero regressions)
- [ ] New tests cover all pure-logic modules
- [ ] Full game playable: create character → explore → battle (4 actions) → find potions → pause → save → load → continue → defeat boss → victory
