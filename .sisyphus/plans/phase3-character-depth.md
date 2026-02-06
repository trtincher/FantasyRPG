# Phase 3: Character Depth — Work Plan

## TL;DR

> **Quick Summary**: Add title screen, character creation (name input + class selection), 3 character classes with unique stat distributions, XP gain from battle victories, and a level-up system with stat growth. Integrates into existing Boot→World→Battle flow by inserting TitleScene and CharacterCreationScene, then threading character data through the entire scene lifecycle via Phaser's game registry.
> 
> **Deliverables**:
> - TitleScene with "New Game" keyboard-navigable option
> - CharacterCreationScene with name input + class selection UI
> - 3 classes (Warrior/Mage/Rogue) with distinct stat distributions
> - XP tracking: enemies award XP on defeat, player accumulates
> - Level-up system with stat growth tables per class
> - Player name displayed in BattleScene, Level/XP shown in battle UI
> 
> **Estimated Effort**: Medium-Large (~4-6 hours)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Task 1 → Task 3 → Task 5 → Task 7 → Task 8

---

## Context

### Original Request
Phase 3 of FantasyRPG — implement character depth. Player starts at a title screen, creates a character (name + class choice), plays the game with those stats, earns XP from battles, and levels up with stat growth.

### Interview Summary
**Key Discussions**:
- Title screen: "New Game" only (no Continue/Load — that's Phase 5)
- Name input: Keyboard event listeners (Phaser has no native text input)
- 3 classes: Warrior (tank), Mage (glass cannon), Rogue (balanced)
- XP awarded on battle victory, level-up triggers stat increases
- Stats already flow into BattleSystem as generic `{hp, maxHp, attack, defense}` — no BattleSystem changes needed
- Keyboard-only navigation throughout (arrow keys, Enter, Escape)

**Research Findings**:
- `Player.ts` constructor is `(scene, x, y)` — needs config object for name/class/stats
- `BattleScene` init data already accepts generic player stats — no BattleSystem.ts changes required
- `BattleScene.ts:82` hardcodes `'Player'` label — replace with character name
- `BattleScene.ts:234` defeat sends to `'Boot'` — needs to route through TitleScene after Phase 3
- WorldScene wake data is inline typed — easy to extend with `xpGained`
- Phaser's `this.game.registry` provides game-wide state persistence across scene transitions
- Canvas is 320×240 native pixels (640×480 at zoom 2) — all UI must fit
- `enemies.test.ts` dynamically validates all enemies — will catch missing `xpReward` field
- Existing `BattleSystem.test.ts` uses `DEFAULT_PLAYER = { hp: 20, ... }` directly — decoupled from Player entity, won't break

### Metis Review
**Identified Gaps** (addressed):
- **Scene data persistence**: Must use `this.game.registry` for character state (name, class, level, xp, stats) — scene init data is lost on restart
- **Defeat flow change**: `Boot.ts` now routes to TitleScene, so defeat→Boot→TitleScene. Must clear registry on new game start.
- **Name length cap**: Canvas is 320px wide, BattleScene label area is ~150px. Cap name at 8 characters.
- **XP formula needed**: Must define concrete numbers for XP per enemy, XP per level, stat growth per class per level
- **Multi-level jumps**: If one battle gives enough XP for multiple levels, each level's growth must apply individually
- **HP on level-up**: maxHp increases AND current HP increases by the same delta (classic RPG convention)
- **`PLAYER_DEFAULT_*` constants**: Keep in Constants.ts as fallback defaults — used by test fixtures and Mage class happens to match HP default
- **`enemies.test.ts` update**: Adding `xpReward` to `EnemyData` requires updating the test to validate `xpReward > 0`
- **BattleSystem.ts unchanged**: Constructor already takes generic `playerStats` object — no modifications needed
- **GridPhysics.ts unchanged**: No changes needed
- **Single sprite for all classes**: All 3 classes use existing `player.png` — no new sprite assets

---

## Work Objectives

### Core Objective
Implement character identity and progression: players choose a name and class that determines starting stats, earn XP from battles, and grow stronger through leveling — creating meaningful choices and visible progression.

### Concrete Deliverables
1. `src/game/data/classes.ts` — Class definitions (Warrior/Mage/Rogue) with stat tables
2. `src/game/data/xp.ts` — XP thresholds and level-up logic (pure functions)
3. `src/game/scenes/TitleScene.ts` — Title screen with "New Game"
4. `src/game/scenes/CharacterCreationScene.ts` — Name input + class selection
5. `src/game/entities/Player.ts` — Extended with name, className, level, xp, dynamic stats
6. `src/game/data/enemies.ts` — Extended with `xpReward` field
7. `src/game/scenes/Boot.ts` — Routes to TitleScene instead of WorldScene
8. `src/game/scenes/WorldScene.ts` — Reads config from registry, handles XP/level-up on battle return
9. `src/game/scenes/BattleScene.ts` — Shows player name, includes xpGained in victory data
10. `src/game/main.ts` — TitleScene and CharacterCreationScene added to scene array
11. Tests: class data, XP/level-up logic, enemy xpReward validation

### Definition of Done
- [ ] Title screen appears on game launch with "New Game" option
- [ ] Player can enter a character name (1-8 characters, letters only)
- [ ] Player can choose from 3 classes (Warrior/Mage/Rogue) with visible stat previews
- [ ] Chosen class determines starting HP/attack/defense values
- [ ] Player name appears in BattleScene (replaces "Player" label)
- [ ] Defeating an enemy awards XP (shown in victory message)
- [ ] Accumulating enough XP triggers level up with stat increases
- [ ] Level/XP display visible in BattleScene UI
- [ ] Defeat routes player back to title screen (fresh start)
- [ ] All existing tests pass + new tests for classes, XP, level-up
- [ ] `npm run build` succeeds with zero errors

### Must Have
- TitleScene with keyboard-navigable "New Game" option
- Character name input via keyboard events (no mouse, no HTML input)
- 3 distinct classes with different stat distributions
- XP tracking and accumulation across multiple battles
- Level-up system with per-class stat growth
- Player name displayed in battle UI
- Game registry for persistent character state across scenes
- Unit tests for class data, XP thresholds, level-up logic

### Must NOT Have (Guardrails)
- ❌ "Continue Game" or "Load Game" on title screen (Phase 5)
- ❌ Class-specific abilities or special attacks (stats only)
- ❌ Separate sprite assets per class (all use `player.png`)
- ❌ Full character sheet/stats screen (text HUD only)
- ❌ Party system (single player character)
- ❌ Animated class previews or lore text in creation screen
- ❌ XP bar graphic (text display only: "Lv.3 XP: 45/100")
- ❌ Name input cursor blinking animation or selection highlight
- ❌ Sound effects for menu navigation (Phase 5)
- ❌ Mouse interaction anywhere
- ❌ Modifications to BattleSystem.ts (stats already flow through generic interface)
- ❌ Modifications to GridPhysics.ts (no changes needed)
- ❌ `classes.json` file — use TypeScript module matching `enemies.ts` pattern
- ❌ Grayed-out "Continue" placeholder on title screen

---

## Locked Constants

### Class Stats (Level 1)

| Class | HP | Attack | Defense | Description |
|-------|-----|--------|---------|-------------|
| Warrior | 30 | 12 | 8 | High HP, high defense tank |
| Mage | 20 | 15 | 4 | High damage glass cannon |
| Rogue | 25 | 10 | 6 | Balanced all-rounder |

### Level-Up Stat Growth (per level)

| Class | +HP | +Attack | +Defense |
|-------|-----|---------|----------|
| Warrior | 8 | 2 | 3 |
| Mage | 4 | 4 | 1 |
| Rogue | 6 | 3 | 2 |

### XP System

| Constant | Value | Rationale |
|----------|-------|-----------|
| Slime XP Reward | 15 | ~2 battles to reach level 2 |
| XP to Level 2 | 25 | Quick first level-up for satisfaction |
| XP Formula | `level * 25` | Level N requires `N * 25` total XP from previous level |
| Max Level | 10 | Enough for meaningful progression in V1 dungeon |
| HP on Level-Up | Current HP increases by +HP growth amount | Classic RPG — don't punish leveling mid-dungeon |

### XP Threshold Table (derived from formula: cumulative)

| Level | XP Required (from prev) | Cumulative XP |
|-------|------------------------|---------------|
| 1 | 0 | 0 |
| 2 | 25 | 25 |
| 3 | 50 | 75 |
| 4 | 75 | 150 |
| 5 | 100 | 250 |
| 6 | 125 | 375 |
| 7 | 150 | 525 |
| 8 | 175 | 700 |
| 9 | 200 | 900 |
| 10 | 225 | 1125 |

### Name Input Rules

| Rule | Value |
|------|-------|
| Min length | 1 character |
| Max length | 8 characters |
| Allowed characters | Letters only (A-Z, a-z) |
| Backspace | Deletes last character |
| Enter | Confirms (if ≥1 char) |
| Escape | Goes back to title screen |
| Display | Uppercase first letter, rest as typed |

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES — Vitest with 3 test files
- **Automated tests**: YES (Tests-after) — unit tests for pure data/logic, Playwright for UI
- **Framework**: Vitest (existing)
- **Agent-Executed QA**: YES — Playwright for scene rendering and flow verification

### Test Coverage Plan

| Module | Test Type | What to Test |
|--------|-----------|--------------|
| `src/game/data/classes.ts` | Unit (Vitest) | 3 classes defined, correct stats, growth tables valid |
| `src/game/data/xp.ts` | Unit (Vitest) | XP thresholds, level calculation, multi-level jumps, max level cap |
| `src/game/data/enemies.ts` | Unit (Vitest) | Existing tests + xpReward validation |
| TitleScene | Playwright | Renders, "New Game" navigable, Enter starts creation |
| CharacterCreationScene | Playwright | Name input works, class selection works, flows to WorldScene |
| Full flow | Playwright | Title → Create → World → Battle → Victory with XP → Level up |

### Agent-Executed QA Approach
- **Build verification**: `npm run build` succeeds (strict TS)
- **Test verification**: `npm run test` — all tests pass (old + new)
- **Visual verification**: Playwright screenshots of TitleScene, CharacterCreation, battle with player name
- **Interaction verification**: Playwright keyboard events for name input and class selection
- **Regression verification**: Existing battle flow still works with new class stats

### Evidence Collection
All evidence stored in: `.sisyphus/evidence/phase3-*`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - No Dependencies):
├── Task 1: Create class data definitions + XP/level-up system (pure data, no Phaser)
└── Task 2: Extend EnemyData with xpReward + update enemy tests

Wave 2 (After Wave 1):
├── Task 3: Extend Player entity with name/class/level/xp + dynamic stats
└── Task 4: Create TitleScene

Wave 3 (After Wave 2):
├── Task 5: Create CharacterCreationScene (depends on class data + Player changes)
└── Task 6: Modify BattleScene for player name + XP display

Wave 4 (After Wave 3):
└── Task 7: Wire WorldScene for registry-based Player creation + XP/level-up on wake

Wave 5 (After Wave 4):
└── Task 8: Wire scene flow (Boot→Title→Creation→World) + full integration QA
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 3, 5, 6, 7 | 2 |
| 2 | None | 6, 7 | 1 |
| 3 | 1 | 5, 7 | 4 |
| 4 | None | 5, 8 | 3 |
| 5 | 1, 3, 4 | 8 | 6 |
| 6 | 1, 2 | 8 | 5 |
| 7 | 1, 2, 3 | 8 | None |
| 8 | 4, 5, 6, 7 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Estimated Time |
|------|-------|----------------|
| 1 | 1, 2 | 15-20 min (parallel) |
| 2 | 3, 4 | 20-30 min (parallel) |
| 3 | 5, 6 | 30-40 min (parallel) |
| 4 | 7 | 20-30 min |
| 5 | 8 | 30-45 min (integration + QA) |

---

## TODOs

### Task 1: Create Class Data Definitions and XP/Level-Up System

**What to do**:
1. Create `src/game/data/classes.ts`:
   ```typescript
   export interface ClassData {
     key: string;           // 'warrior' | 'mage' | 'rogue'
     name: string;          // Display name
     description: string;   // One-line description for selection screen
     baseHp: number;
     baseAttack: number;
     baseDefense: number;
     growthHp: number;      // HP gained per level
     growthAttack: number;  // Attack gained per level
     growthDefense: number; // Defense gained per level
   }

   export const CLASSES: Record<string, ClassData> = {
     warrior: {
       key: 'warrior',
       name: 'Warrior',
       description: 'High HP and defense',
       baseHp: 30, baseAttack: 12, baseDefense: 8,
       growthHp: 8, growthAttack: 2, growthDefense: 3,
     },
     mage: {
       key: 'mage',
       name: 'Mage',
       description: 'High attack power',
       baseHp: 20, baseAttack: 15, baseDefense: 4,
       growthHp: 4, growthAttack: 4, growthDefense: 1,
     },
     rogue: {
       key: 'rogue',
       name: 'Rogue',
       description: 'Balanced stats',
       baseHp: 25, baseAttack: 10, baseDefense: 6,
       growthHp: 6, growthAttack: 3, growthDefense: 2,
     },
   };

   export const CLASS_KEYS = Object.keys(CLASSES); // ['warrior', 'mage', 'rogue']
   ```

2. Create `src/game/data/xp.ts`:
   ```typescript
   import { ClassData } from './classes';

   export const MAX_LEVEL = 10;
   export const XP_PER_LEVEL_MULTIPLIER = 25; // XP needed = level * 25

   /** XP needed to go from (level) to (level+1) */
   export function xpForNextLevel(level: number): number {
     if (level >= MAX_LEVEL) return Infinity;
     return (level + 1) * XP_PER_LEVEL_MULTIPLIER;
   }

   /** Total cumulative XP needed to reach a given level */
   export function totalXpForLevel(level: number): number {
     let total = 0;
     for (let i = 1; i < level; i++) {
       total += (i + 1) * XP_PER_LEVEL_MULTIPLIER;
     }
     return total;
   }

   /** Calculate stats at a given level for a class */
   export function statsAtLevel(classData: ClassData, level: number): {
     hp: number; attack: number; defense: number;
   } {
     const levelsGained = level - 1;
     return {
       hp: classData.baseHp + classData.growthHp * levelsGained,
       attack: classData.baseAttack + classData.growthAttack * levelsGained,
       defense: classData.baseDefense + classData.growthDefense * levelsGained,
     };
   }

   /** Process XP gain — returns new level and leftover XP.
    *  Handles multi-level jumps. */
   export function processXpGain(
     currentLevel: number,
     currentXp: number,
     xpGained: number
   ): { newLevel: number; newXp: number; levelsGained: number } {
     let level = currentLevel;
     let xp = currentXp + xpGained;
     let levelsGained = 0;

     while (level < MAX_LEVEL) {
       const needed = xpForNextLevel(level);
       if (xp >= needed) {
         xp -= needed;
         level++;
         levelsGained++;
       } else {
         break;
       }
     }

     // Cap XP at 0 if max level reached
     if (level >= MAX_LEVEL) {
       xp = 0;
     }

     return { newLevel: level, newXp: xp, levelsGained };
   }
   ```

3. Create `src/game/data/__tests__/classes.test.ts`:
   - Test: 3 classes defined
   - Test: Each class has positive base stats
   - Test: Each class has positive growth stats
   - Test: Keys match record keys
   - Test: All required fields present

4. Create `src/game/data/__tests__/xp.test.ts`:
   - Test: `xpForNextLevel(1)` returns 50 (level 2 costs `2 * 25 = 50`)
   - Test: `xpForNextLevel(MAX_LEVEL)` returns Infinity
   - Test: `statsAtLevel(warrior, 1)` returns base stats
   - Test: `statsAtLevel(warrior, 2)` returns base + growth
   - Test: `processXpGain(1, 0, 50)` → level 2, xp 0
   - Test: `processXpGain(1, 0, 200)` → handles multi-level jump correctly
   - Test: `processXpGain(MAX_LEVEL, 0, 100)` → stays at max, xp 0

**Must NOT do**:
- Do NOT import Phaser in any data module (pure TypeScript)
- Do NOT use JSON files — TypeScript modules only
- Do NOT add class-specific abilities, spells, or special moves
- Do NOT add stat randomization (deterministic growth)
- Do NOT add more than 3 classes

**Recommended Agent Profile**:
- **Category**: `quick` — Pure data definitions + pure functions + unit tests
  - Reason: No Phaser dependency, no UI, straightforward data module creation
- **Skills**: []
  - Reason: Simple TypeScript, no specialized skills needed

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: Not UI, pure data
- `playwright`: Not browser testing, unit tests only

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 2)
- **Blocks**: Tasks 3, 5, 6, 7
- **Blocked By**: None

**References**:

**Pattern References**:
- `src/game/data/enemies.ts:1-19` — Enemy data module pattern (interface + const record). Follow identical structure for classes.
- `src/game/data/__tests__/enemies.test.ts:1-29` — Enemy test pattern (iterate entries, validate fields). Follow identical pattern for class tests.

**API/Type References**:
- `src/game/utils/Constants.ts:20-22` — `PLAYER_DEFAULT_HP=20`, `PLAYER_DEFAULT_ATTACK=8`, `PLAYER_DEFAULT_DEFENSE=4` — Mage class matches these defaults

**WHY Each Reference Matters**:
- `enemies.ts` defines the exact code style, export pattern, and interface convention this project uses for data modules
- `enemies.test.ts` shows the testing convention — iterate `Object.entries`, validate each field per entry
- Constants.ts defaults show what the current "baseline" is — useful context but classes.ts replaces them

**Acceptance Criteria**:

- [ ] `src/game/data/classes.ts` exports `ClassData` interface and `CLASSES` record with 3 entries
- [ ] `src/game/data/xp.ts` exports `xpForNextLevel`, `totalXpForLevel`, `statsAtLevel`, `processXpGain`
- [ ] Warrior: baseHp=30, baseAttack=12, baseDefense=8, growthHp=8, growthAttack=2, growthDefense=3
- [ ] Mage: baseHp=20, baseAttack=15, baseDefense=4, growthHp=4, growthAttack=4, growthDefense=1
- [ ] Rogue: baseHp=25, baseAttack=10, baseDefense=6, growthHp=6, growthAttack=3, growthDefense=2
- [ ] `xpForNextLevel(1)` returns 50, `xpForNextLevel(10)` returns Infinity
- [ ] `processXpGain` handles multi-level jumps correctly
- [ ] `processXpGain` caps at MAX_LEVEL=10
- [ ] All new tests pass: `npm run test`
- [ ] All existing tests still pass: `npm run test`
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: Class data module exports correctly
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. npm run test -- --reporter=verbose 2>&1
    2. Assert: "classes" test suite passes
    3. Assert: "xp" test suite passes
    4. Assert: 0 failures
  Expected Result: All class and XP tests pass
  Evidence: Test output captured

Scenario: Build succeeds with new data modules
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. Assert: No "error TS" in output
  Expected Result: Clean build
  Evidence: Build output captured

Scenario: Existing tests unaffected
  Tool: Bash
  Preconditions: Task 1 complete
  Steps:
    1. npm run test 2>&1
    2. Assert: "BattleSystem" tests pass
    3. Assert: "enemy data" tests pass
    4. Assert: "assets" tests pass
  Expected Result: All pre-existing tests still pass
  Evidence: Test output captured
```

**Commit**: YES
- Message: `feat(character): add class definitions (Warrior/Mage/Rogue) and XP/level-up system`
- Files: `src/game/data/classes.ts`, `src/game/data/xp.ts`, `src/game/data/__tests__/classes.test.ts`, `src/game/data/__tests__/xp.test.ts`
- Pre-commit: `npm run test && npm run build`

---

### Task 2: Extend EnemyData with XP Reward and Update Tests

**What to do**:
1. Modify `src/game/data/enemies.ts`:
   - Add `xpReward: number` to `EnemyData` interface
   - Add `xpReward: 15` to slime entry
   ```typescript
   export interface EnemyData {
     key: string;
     name: string;
     hp: number;
     attack: number;
     defense: number;
     spriteKey: string;
     xpReward: number;  // NEW
   }

   export const ENEMIES: Record<string, EnemyData> = {
     slime: {
       key: 'slime',
       name: 'Slime',
       hp: 12,
       attack: 5,
       defense: 2,
       spriteKey: 'slime',
       xpReward: 15,  // NEW
     },
   };
   ```

2. Update `src/game/data/__tests__/enemies.test.ts`:
   - Add test: `xpReward` is a positive number for all enemies
   ```typescript
   it('has positive xpReward', () => {
     expect(enemy.xpReward).toBeGreaterThan(0);
   });
   ```

**Must NOT do**:
- Do NOT change existing enemy stat values (hp, attack, defense unchanged)
- Do NOT add more enemies (Phase 4 concern)
- Do NOT add loot tables or gold rewards

**Recommended Agent Profile**:
- **Category**: `quick` — Small modification to existing data file + test update
  - Reason: Adding one field to an interface and one value to an object
- **Skills**: []
  - Reason: Trivial TypeScript change

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Task 1)
- **Blocks**: Tasks 6, 7
- **Blocked By**: None

**References**:

**Pattern References**:
- `src/game/data/enemies.ts:1-19` — Exact file to modify — add `xpReward` field to interface and record
- `src/game/data/__tests__/enemies.test.ts:13-16` — Existing test pattern for numeric stat validation — add `xpReward` test in same pattern

**WHY Each Reference Matters**:
- enemies.ts is the exact file being modified — executor must understand its current structure
- enemies.test.ts shows the existing test convention — new test must follow the same `describe/it` pattern

**Acceptance Criteria**:

- [ ] `EnemyData` interface has `xpReward: number` field
- [ ] `ENEMIES.slime.xpReward` equals 15
- [ ] `enemies.test.ts` validates `xpReward > 0` for all enemies
- [ ] All existing enemy tests still pass
- [ ] `npm run test` — 0 failures
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: Enemy data includes xpReward
  Tool: Bash
  Preconditions: Task 2 complete
  Steps:
    1. npm run test -- --reporter=verbose 2>&1
    2. Assert: "enemy data" test suite passes
    3. Assert: "has positive xpReward" test passes for slime
  Expected Result: xpReward validated for all enemies
  Evidence: Test output captured

Scenario: Build succeeds
  Tool: Bash
  Preconditions: Task 2 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
  Expected Result: Clean build
  Evidence: Build output captured
```

**Commit**: YES
- Message: `feat(enemies): add xpReward field to EnemyData (Slime: 15 XP)`
- Files: `src/game/data/enemies.ts`, `src/game/data/__tests__/enemies.test.ts`
- Pre-commit: `npm run test && npm run build`

---

### Task 3: Extend Player Entity with Name, Class, Level, XP, and Dynamic Stats

**What to do**:
1. Modify `src/game/entities/Player.ts`:
   - Add a `PlayerConfig` interface:
     ```typescript
     export interface PlayerConfig {
       name: string;
       classKey: string;  // 'warrior' | 'mage' | 'rogue'
     }
     ```
   - Add new properties:
     ```typescript
     public name: string;
     public classKey: string;
     public level: number = 1;
     public xp: number = 0;
     ```
   - Change constructor to accept optional config:
     ```typescript
     constructor(scene: Scene, x: number, y: number, config?: PlayerConfig) {
       super(scene, x, y, 'player', 0);
       scene.add.existing(this);

       if (config) {
         this.name = config.name;
         this.classKey = config.classKey;
         const classData = CLASSES[config.classKey];
         const stats = statsAtLevel(classData, this.level);
         this.hp = stats.hp;
         this.maxHp = stats.hp;
         this.attack = stats.attack;
         this.defense = stats.defense;
       } else {
         // Fallback for backward compatibility
         this.name = 'Player';
         this.classKey = 'warrior';
         this.hp = PLAYER_DEFAULT_HP;
         this.maxHp = PLAYER_DEFAULT_HP;
         this.attack = PLAYER_DEFAULT_ATTACK;
         this.defense = PLAYER_DEFAULT_DEFENSE;
       }

       this.createAnimations();
     }
     ```
   - Add level-up method:
     ```typescript
     applyLevelUp(newLevel: number): void {
       const classData = CLASSES[this.classKey];
       const oldStats = statsAtLevel(classData, this.level);
       const newStats = statsAtLevel(classData, newLevel);

       // Increase current HP by the delta (don't full heal)
       const hpGain = newStats.hp - oldStats.hp;
       this.hp += hpGain;

       this.maxHp = newStats.hp;
       this.attack = newStats.attack;
       this.defense = newStats.defense;
       this.level = newLevel;
     }
     ```
   - Import `CLASSES` from `../data/classes` and `statsAtLevel` from `../data/xp`

**Must NOT do**:
- Do NOT remove the backward-compatible `config?` optional parameter — existing code that creates `new Player(scene, x, y)` without config must still work
- Do NOT remove `PLAYER_DEFAULT_*` imports — they serve as fallback defaults
- Do NOT change `createAnimations()`, `playWalkAnimation()`, `stopAnimation()`, `takeDamage()`, `isAlive()`, `resetStats()`
- Do NOT add MP, speed, luck, or any stats beyond HP/attack/defense
- Do NOT create separate sprite logic per class

**Recommended Agent Profile**:
- **Category**: `unspecified-low` — Extending existing entity with new properties and import wiring
  - Reason: Moderate complexity — new config pattern, but straightforward property additions
- **Skills**: []
  - Reason: Standard TypeScript class modification

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Task 4)
- **Blocks**: Tasks 5, 7
- **Blocked By**: Task 1

**References**:

**Pattern References**:
- `src/game/entities/Player.ts:1-97` — **FULL FILE** — this is the file being modified. Executor must read and understand entire structure before modifying.
- `src/game/entities/Player.ts:4-8` — Current stat initialization using `PLAYER_DEFAULT_*` constants — this is what changes
- `src/game/entities/Player.ts:10-14` — Current constructor `(scene, x, y)` — add optional `config` parameter
- `src/game/entities/Player.ts:86-96` — Existing `takeDamage`, `isAlive`, `resetStats` methods — do NOT modify these

**API/Type References**:
- `src/game/data/classes.ts:ClassData` — Created in Task 1 — provides base stats and growth data
- `src/game/data/xp.ts:statsAtLevel` — Created in Task 1 — calculates stats at any level
- `src/game/utils/Constants.ts:20-22` — `PLAYER_DEFAULT_*` constants — keep as fallback

**WHY Each Reference Matters**:
- Full Player.ts read is essential — executor must see the complete class structure before modifying the constructor
- `ClassData` and `statsAtLevel` are the data dependencies created in Task 1
- Constants fallback ensures backward compatibility for any code path that doesn't provide config

**Acceptance Criteria**:

- [ ] `Player` constructor accepts optional `PlayerConfig` parameter
- [ ] `new Player(scene, x, y)` still works (backward compatible) with default stats
- [ ] `new Player(scene, x, y, { name: 'Hero', classKey: 'warrior' })` creates player with Warrior stats (HP=30, ATK=12, DEF=8)
- [ ] `new Player(scene, x, y, { name: 'Wiz', classKey: 'mage' })` creates player with Mage stats (HP=20, ATK=15, DEF=4)
- [ ] Player has `name`, `classKey`, `level`, `xp` public properties
- [ ] `applyLevelUp(2)` on Warrior increases maxHp by 8, attack by 2, defense by 3, and current HP by 8
- [ ] Existing `takeDamage`, `isAlive`, `resetStats` unchanged
- [ ] All existing tests still pass (BattleSystem tests don't use Player entity directly)
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: Player backward compatibility
  Tool: Bash
  Preconditions: Task 3 complete
  Steps:
    1. npm run test 2>&1
    2. Assert: All BattleSystem tests pass (they use DEFAULT_PLAYER object, not Player entity)
    3. Assert: 0 failures
    4. npm run build
    5. Assert: Exit code 0
  Expected Result: No existing tests broken
  Evidence: Test + build output captured

Scenario: Player with class config has correct stats
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:5173. Note: Boot still goes to WorldScene at this point — test via console.
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 10s)
    3. Execute in console:
       const scene = window.__PHASER_GAME__.scene.getScene('WorldScene');
       const p = scene.getPlayer();
       JSON.stringify({ name: p.name, classKey: p.classKey, level: p.level, xp: p.xp, hp: p.hp, attack: p.attack, defense: p.defense });
    4. Assert: Returns JSON with name='Player' (default), level=1, xp=0
  Expected Result: Player entity has new properties with defaults
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(player): add name, class, level, XP properties with dynamic stat initialization`
- Files: `src/game/entities/Player.ts`
- Pre-commit: `npm run test && npm run build`

---

### Task 4: Create TitleScene

**What to do**:
1. Create `src/game/scenes/TitleScene.ts`:
   - Scene key: `'TitleScene'`
   - **Layout** (320×240 canvas):
     ```
     ┌──────────────────────────────┐
     │                              │
     │                              │
     │        FANTASY RPG           │  (centered, ~y:60)
     │                              │
     │                              │
     │       > New Game             │  (centered, ~y:140)
     │                              │
     │                              │
     │   Press Enter to start       │  (centered, ~y:200, smaller text)
     │                              │
     └──────────────────────────────┘
     ```
   - **Title text**: "FANTASY RPG" — large-ish (`fontSize: '20px'`), white, centered horizontally
   - **Menu option**: "> New Game" — standard size (`fontSize: '14px'`), white, centered
   - **Instruction**: "Press Enter to start" — small (`fontSize: '10px'`), gray, centered. Subtle blinking via alpha tween.
   - **Input**:
     - Enter or Space: Start character creation → `this.scene.start('CharacterCreationScene')`
   - **Background**: Solid dark color (`0x1a1a2e` — same as game config backgroundColor)
   - **On create**: Clear any leftover registry data from previous game (fresh start):
     ```typescript
     this.game.registry.remove('playerName');
     this.game.registry.remove('playerClass');
     this.game.registry.remove('playerLevel');
     this.game.registry.remove('playerXp');
     ```

**Must NOT do**:
- Do NOT add "Continue Game" or "Load Game" option
- Do NOT add elaborate animations, particle effects, or transition effects
- Do NOT add background music (Phase 5)
- Do NOT add mouse interaction
- Do NOT add logo image (text title only)
- Do NOT add multiple menu options — "New Game" only

**Recommended Agent Profile**:
- **Category**: `visual-engineering` — UI scene with text layout and keyboard input
  - Reason: Simple scene but requires careful text positioning on small canvas
- **Skills**: [`frontend-ui-ux`]
  - `frontend-ui-ux`: Text centering, visual hierarchy, subtle animation

**Skills Evaluated but Omitted**:
- `playwright`: Testing happens in Task 8

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Task 3)
- **Blocks**: Tasks 5, 8
- **Blocked By**: None (no data dependencies — just a UI scene)

**References**:

**Pattern References**:
- `src/game/scenes/Boot.ts:1-26` — Scene class structure (constructor with `super('key')`, lifecycle methods)
- `src/game/scenes/BattleScene.ts:39-46` — Scene constructor + init pattern
- `src/game/scenes/BattleScene.ts:106-109` — Keyboard event listener setup pattern (`this.input.keyboard.on('keydown-ENTER', ...)`)

**API/Type References**:
- `src/game/utils/Constants.ts:3-5` — `CANVAS_WIDTH=320`, `CANVAS_HEIGHT=240` — needed for text centering calculations

**External References**:
- Phaser Text: `this.add.text(x, y, text, { fontSize, color }).setOrigin(0.5)` for centered text

**WHY Each Reference Matters**:
- Boot.ts shows the minimal scene pattern to follow
- BattleScene keyboard setup is the exact pattern to reuse
- Canvas dimensions are critical for positioning text elements

**Acceptance Criteria**:

- [ ] `src/game/scenes/TitleScene.ts` exports TitleScene class with key `'TitleScene'`
- [ ] Title "FANTASY RPG" displayed and centered
- [ ] "New Game" menu option visible and centered
- [ ] "Press Enter to start" instruction visible
- [ ] Enter key transitions to CharacterCreationScene
- [ ] Registry is cleared on TitleScene creation (fresh game state)
- [ ] Keyboard-only interaction (no mouse)
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: TitleScene builds and renders
  Tool: Bash
  Preconditions: Task 4 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. Assert: No "error TS" in output
  Expected Result: TitleScene compiles without errors
  Evidence: Build output captured
```

**Commit**: YES
- Message: `feat(scenes): add TitleScene with "New Game" keyboard navigation`
- Files: `src/game/scenes/TitleScene.ts`
- Pre-commit: `npm run build`

---

### Task 5: Create CharacterCreationScene

**What to do**:
1. Create `src/game/scenes/CharacterCreationScene.ts`:
   - Scene key: `'CharacterCreationScene'`
   - **Two-step flow**: Step 1 = Name Input, Step 2 = Class Selection
   - **Step 1 — Name Input Layout** (320×240):
     ```
     ┌──────────────────────────────┐
     │                              │
     │     Enter your name:         │  (y:50)
     │                              │
     │     > HERO_                  │  (y:90, shows typed characters + underscore cursor)
     │                              │
     │  A-Z only, 1-8 characters   │  (y:140, gray hint text)
     │                              │
     │  Enter: Confirm              │  (y:200)
     │  Esc: Back                   │  (y:215)
     └──────────────────────────────┘
     ```
   - **Name input implementation**:
     - Listen for `keydown` events on `this.input.keyboard`
     - Letters A-Z (case insensitive) → append to name string (if < 8 chars)
     - Backspace → remove last character
     - Enter → if name length ≥ 1, proceed to Step 2
     - Escape → return to TitleScene
     - Display: Show current name with underscore cursor: `"HERO_"` → `"HERO"` + `"_"` (blinking optional)
     - Uppercase the first letter of name on confirm, rest as typed

   - **Step 2 — Class Selection Layout**:
     ```
     ┌──────────────────────────────┐
     │  Choose your class:          │  (y:20)
     │                              │
     │  > Warrior                   │  (y:60, highlighted with >)
     │    HP:30 ATK:12 DEF:8       │  (y:75, stat preview)
     │                              │
     │    Mage                      │  (y:100)
     │    HP:20 ATK:15 DEF:4       │  (y:115)
     │                              │
     │    Rogue                     │  (y:140)
     │    HP:25 ATK:10 DEF:6       │  (y:155)
     │                              │
     │  Enter: Confirm              │  (y:200)
     │  Esc: Back to name           │  (y:215)
     └──────────────────────────────┘
     ```
   - **Class selection implementation**:
     - Arrow Up/Down: Move `>` cursor between 3 classes
     - Enter: Confirm selection → store to registry → start WorldScene
     - Escape: Go back to Step 1 (name input)
     - Show stat preview for each class (from `CLASSES` data)

   - **On confirm (Enter on class selection)**:
     ```typescript
     this.game.registry.set('playerName', name);
     this.game.registry.set('playerClass', selectedClassKey);
     this.game.registry.set('playerLevel', 1);
     this.game.registry.set('playerXp', 0);
     this.scene.start('WorldScene');
     ```

**Must NOT do**:
- Do NOT add animated class previews or character art
- Do NOT add lore text or class descriptions beyond one line
- Do NOT add stat comparison highlights
- Do NOT use HTML input elements — pure Phaser text + keyboard events
- Do NOT add mouse interaction
- Do NOT add name validation beyond length and A-Z characters
- Do NOT add a "confirm your choices" summary step

**Recommended Agent Profile**:
- **Category**: `visual-engineering` — Complex UI scene with two-step flow, keyboard input, and stat display
  - Reason: Most UI-heavy task — keyboard name input (unusual for games), multi-step flow, stat previews
- **Skills**: [`frontend-ui-ux`]
  - `frontend-ui-ux`: Form-like input patterns, selection UI, text layout on small canvas

**Skills Evaluated but Omitted**:
- `playwright`: Testing in Task 8

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 6)
- **Blocks**: Task 8
- **Blocked By**: Tasks 1, 3, 4

**References**:

**Pattern References**:
- `src/game/scenes/BattleScene.ts:106-109` — Keyboard listener pattern (`this.input.keyboard.on('keydown-ENTER', ...)`)
- `src/game/scenes/BattleScene.ts:48-104` — Scene create() with multiple text/graphic objects — follow same layout approach
- `src/game/scenes/TitleScene.ts` (from Task 4) — Scene navigation pattern with `this.scene.start()`

**API/Type References**:
- `src/game/data/classes.ts:CLASSES` — Class data to display in selection (from Task 1)
- `src/game/data/classes.ts:CLASS_KEYS` — Array of class keys for iteration
- `src/game/utils/Constants.ts:3-4` — `CANVAS_WIDTH=320`, `CANVAS_HEIGHT=240` for layout

**External References**:
- Phaser keyboard events: `this.input.keyboard.on('keydown', (event: KeyboardEvent) => ...)` for character-by-character input
- Phaser text: `text.setText(newValue)` to update display as user types

**WHY Each Reference Matters**:
- BattleScene keyboard pattern is the exact approach to reuse for key event listeners
- BattleScene create() shows how to lay out multiple text objects on the 320×240 canvas
- CLASSES data is what drives the stat preview display
- Canvas dimensions are critical — name input and class list must fit

**Acceptance Criteria**:

- [ ] `CharacterCreationScene.ts` exports scene with key `'CharacterCreationScene'`
- [ ] Step 1: "Enter your name" prompt visible
- [ ] Step 1: Typing letters A-Z appends characters to name display
- [ ] Step 1: Backspace removes last character
- [ ] Step 1: Name capped at 8 characters (typing beyond 8 does nothing)
- [ ] Step 1: Enter with empty name does nothing (requires ≥1 char)
- [ ] Step 1: Escape returns to TitleScene
- [ ] Step 2: 3 classes displayed with stat previews (HP/ATK/DEF)
- [ ] Step 2: Arrow Up/Down moves cursor between classes
- [ ] Step 2: Current selection highlighted with `>`
- [ ] Step 2: Enter confirms → stores to registry → starts WorldScene
- [ ] Step 2: Escape returns to Step 1 (name preserved)
- [ ] Registry contains `playerName`, `playerClass`, `playerLevel`, `playerXp` after confirm
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: CharacterCreationScene compiles and has correct structure
  Tool: Bash
  Preconditions: Task 5 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. Assert: No "error TS" in output
  Expected Result: Scene compiles
  Evidence: Build output captured

Scenario: Name input accepts letters and respects max length
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, full scene flow wired (may need to test via console if flow not yet wired)
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 10s)
    3. Execute in console:
       window.__PHASER_GAME__.scene.start('CharacterCreationScene');
    4. Wait for: 500ms
    5. Press keys: H, E, R, O
    6. Wait for: 200ms
    7. Screenshot: .sisyphus/evidence/phase3-name-input.png
    8. Press keys: A, B, C, D, E (5 more — should cap at 8 total = "HEROABCD", E ignored)
    9. Press: Enter
    10. Wait for: 500ms
    11. Screenshot: .sisyphus/evidence/phase3-class-selection.png
  Expected Result: Name input shows typed characters, caps at 8, advances to class selection
  Evidence: .sisyphus/evidence/phase3-name-input.png, .sisyphus/evidence/phase3-class-selection.png

Scenario: Class selection navigates and stores to registry
  Tool: Playwright (playwright skill)
  Preconditions: On class selection step (from previous scenario)
  Steps:
    1. Press: ArrowDown (should move to Mage)
    2. Press: ArrowDown (should move to Rogue)
    3. Press: ArrowUp (should move back to Mage)
    4. Press: Enter (confirm Mage selection)
    5. Wait for: 1s
    6. Execute in console:
       const reg = window.__PHASER_GAME__.registry;
       JSON.stringify({
         name: reg.get('playerName'),
         class: reg.get('playerClass'),
         level: reg.get('playerLevel'),
         xp: reg.get('playerXp')
       });
    7. Assert: Returns {"name":"Heroabcd","class":"mage","level":1,"xp":0}
  Expected Result: Registry populated with character data, WorldScene started
  Evidence: Console output captured
```

**Commit**: YES
- Message: `feat(scenes): add CharacterCreationScene with name input and class selection`
- Files: `src/game/scenes/CharacterCreationScene.ts`
- Pre-commit: `npm run build`

---

### Task 6: Modify BattleScene for Player Name Display and XP Award

**What to do**:
1. Modify `src/game/scenes/BattleScene.ts`:
   - Extend `BattleInitData` interface:
     ```typescript
     interface BattleInitData {
       playerName: string;      // NEW
       playerLevel: number;     // NEW
       playerHp: number;
       playerMaxHp: number;
       playerAttack: number;
       playerDefense: number;
       enemyKey: string;
       encounterId: string;
     }
     ```
   - Replace hardcoded "Player" label (line 82):
     ```typescript
     // BEFORE:
     this.playerLabel = this.add.text(10, 170, 'Player', { ... });
     // AFTER:
     this.playerLabel = this.add.text(10, 170, `${this.initData.playerName} Lv.${this.initData.playerLevel}`, { ... });
     ```
   - Add XP display to victory message:
     ```typescript
     // In onBattleEnd('victory') handler:
     case BattleState.VICTORY:
       const xpGained = ENEMIES[this.initData.enemyKey].xpReward;
       this.messageText.setText(`Victory! +${xpGained} XP`);
       this.menuText.setText('');
       break;
     ```
   - Include `xpGained` in wake data sent to WorldScene:
     ```typescript
     // In victory delayed callback:
     this.scene.wake('WorldScene', {
       playerHp: this.battleSystem.getPlayerHp(),
       encounterId: this.initData.encounterId,
       result: 'victory',
       xpGained: ENEMIES[this.initData.enemyKey].xpReward,  // NEW
     });
     ```
   - Update defeat handler to go to TitleScene (instead of Boot):
     ```typescript
     // In defeat delayed callback:
     this.scene.start('TitleScene');  // Was: this.scene.start('Boot');
     ```

**Must NOT do**:
- Do NOT modify BattleSystem.ts — it works with generic stats, no changes needed
- Do NOT add XP bar or level-up logic to BattleScene (WorldScene handles that on wake)
- Do NOT add level-up animation or fanfare
- Do NOT change damage calculation formula
- Do NOT change HP bar rendering logic
- Do NOT change battle state machine flow

**Recommended Agent Profile**:
- **Category**: `unspecified-low` — Surgical modifications to existing scene
  - Reason: Small, targeted changes to BattleScene — extend init data, change two text strings, add one field to wake data
- **Skills**: []
  - Reason: Simple text and data flow changes

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Task 5)
- **Blocks**: Task 8
- **Blocked By**: Tasks 1, 2

**References**:

**Pattern References**:
- `src/game/scenes/BattleScene.ts:11-18` — `BattleInitData` interface — extend with `playerName` and `playerLevel`
- `src/game/scenes/BattleScene.ts:82-85` — Player label creation — replace `'Player'` with `playerName`
- `src/game/scenes/BattleScene.ts:169-172` — Victory state handler — add XP message
- `src/game/scenes/BattleScene.ts:222-231` — Victory onBattleEnd handler — add `xpGained` to wake data
- `src/game/scenes/BattleScene.ts:232-236` — Defeat handler — change `'Boot'` to `'TitleScene'`

**API/Type References**:
- `src/game/data/enemies.ts:ENEMIES` — Already imported (line 3) — access `ENEMIES[key].xpReward`

**WHY Each Reference Matters**:
- Each line reference is an exact modification point — executor must make surgical changes at these locations
- ENEMIES import already exists — just access the new `xpReward` field

**Acceptance Criteria**:

- [ ] `BattleInitData` has `playerName` and `playerLevel` fields
- [ ] Player label shows character name + level (e.g., "Hero Lv.1") instead of "Player"
- [ ] Victory message shows XP gained (e.g., "Victory! +15 XP")
- [ ] Wake data includes `xpGained: number`
- [ ] Defeat routes to `'TitleScene'` instead of `'Boot'`
- [ ] Battle flow (INTRO→PLAYER_TURN→ENEMY_TURN→CHECK_END→VICTORY/DEFEAT) unchanged
- [ ] HP bars still work correctly
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: BattleScene builds with extended interface
  Tool: Bash
  Preconditions: Task 6 complete
  Steps:
    1. npm run build
    2. Assert: Exit code 0
    3. npm run test
    4. Assert: All tests pass (BattleSystem tests unaffected)
  Expected Result: Clean build and tests
  Evidence: Build + test output captured

Scenario: Player name and XP visible in battle
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 10s)
    3. Execute in console:
       window.__PHASER_GAME__.scene.start('BattleScene', {
         playerName: 'TestHero',
         playerLevel: 3,
         playerHp: 30, playerMaxHp: 30, playerAttack: 12, playerDefense: 8,
         enemyKey: 'slime', encounterId: 'test-1'
       });
    4. Wait for: 2s (INTRO completes)
    5. Screenshot: .sisyphus/evidence/phase3-battle-name.png
    6. Press: Enter (Attack)
    7. Wait for: 1s
    8. Press: Enter (Attack again — should kill slime)
    9. Wait for: 2s (Victory message)
    10. Screenshot: .sisyphus/evidence/phase3-battle-victory-xp.png
  Expected Result: Player label shows "TestHero Lv.3", victory shows "+15 XP"
  Evidence: .sisyphus/evidence/phase3-battle-name.png, .sisyphus/evidence/phase3-battle-victory-xp.png
```

**Commit**: YES
- Message: `feat(battle): display player name/level in battle UI and award XP on victory`
- Files: `src/game/scenes/BattleScene.ts`
- Pre-commit: `npm run test && npm run build`

---

### Task 7: Wire WorldScene for Registry-Based Player Creation and XP/Level-Up on Wake

**What to do**:
1. Modify `src/game/scenes/WorldScene.ts`:
   - **Read character config from registry in `create()`**:
     ```typescript
     // Replace: this.player = new Player(this, spawnX, spawnY);
     // With:
     const playerName = this.game.registry.get('playerName') || 'Player';
     const playerClass = this.game.registry.get('playerClass') || 'warrior';
     const playerLevel = this.game.registry.get('playerLevel') || 1;
     const playerXp = this.game.registry.get('playerXp') || 0;

     this.player = new Player(this, spawnX, spawnY, {
       name: playerName,
       classKey: playerClass,
     });
     this.player.level = playerLevel;
     this.player.xp = playerXp;

     // If level > 1, apply level stats
     if (playerLevel > 1) {
       this.player.applyLevelUp(playerLevel);
     }
     ```

   - **Pass player name and level to BattleScene**:
     ```typescript
     // In encounter launch:
     this.scene.launch('BattleScene', {
       playerName: player.name,     // NEW
       playerLevel: player.level,   // NEW
       playerHp: player.hp,
       playerMaxHp: player.maxHp,
       playerAttack: player.attack,
       playerDefense: player.defense,
       enemyKey: encounter.enemyKey,
       encounterId: encounter.id,
     });
     ```

   - **Handle XP and level-up on wake from battle**:
     ```typescript
     // Extend wake handler type:
     this.events.on('wake', (_sys: Phaser.Scenes.Systems, data?: {
       playerHp?: number;
       encounterId?: string;
       result?: string;
       xpGained?: number;  // NEW
     }) => {
       if (data?.playerHp !== undefined) {
         this.player.hp = data.playerHp;
       }

       // Handle XP gain and level up
       if (data?.result === 'victory' && data?.xpGained) {
         const result = processXpGain(this.player.level, this.player.xp, data.xpGained);
         this.player.xp = result.newXp;

         if (result.levelsGained > 0) {
           this.player.applyLevelUp(result.newLevel);
           // TODO (Phase 4+): Show level-up notification on screen
         }

         // Persist to registry
         this.game.registry.set('playerLevel', this.player.level);
         this.game.registry.set('playerXp', this.player.xp);
       }

       // Existing encounter removal logic...
       if (data?.result === 'victory' && data?.encounterId) {
         // ... existing code unchanged
       }
     });
     ```

   - Import `processXpGain` from `'../data/xp'`
   - Import `PlayerConfig` from `'../entities/Player'` (if needed for type)

**Must NOT do**:
- Do NOT modify GridPhysics.ts — no changes needed
- Do NOT modify encounter spawn logic — ENCOUNTER_SPAWNS array stays the same
- Do NOT add level-up animation or popup (just update stats silently for now)
- Do NOT add a HUD overlay to WorldScene (keep it clean — stats visible in BattleScene)
- Do NOT remove existing encounter handling logic (defeat tracking, sprite removal)

**Recommended Agent Profile**:
- **Category**: `unspecified-high` — Integration task with registry wiring, data flow, and level-up logic
  - Reason: Multiple surgical modifications to WorldScene with careful data flow — registry reads, battle launch data extension, wake handler XP processing
- **Skills**: []
  - Reason: TypeScript integration work, no specialized domain skills needed

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 4 (solo)
- **Blocks**: Task 8
- **Blocked By**: Tasks 1, 2, 3

**References**:

**Pattern References**:
- `src/game/scenes/WorldScene.ts:40-103` — **FULL create() method** — executor must understand the entire initialization flow before modifying
- `src/game/scenes/WorldScene.ts:76` — `this.player = new Player(this, spawnX, spawnY)` — this is the exact line to modify for config-based creation
- `src/game/scenes/WorldScene.ts:91-101` — Encounter launch logic — extend data object with `playerName` and `playerLevel`
- `src/game/scenes/WorldScene.ts:106-119` — Wake event handler — extend with XP/level-up processing

**API/Type References**:
- `src/game/entities/Player.ts:PlayerConfig` — Interface created in Task 3 — used for Player construction
- `src/game/data/xp.ts:processXpGain` — Function created in Task 1 — handles XP accumulation and multi-level jumps
- `src/game/entities/Player.ts:applyLevelUp` — Method created in Task 3 — applies stat growth

**WHY Each Reference Matters**:
- WorldScene.ts create() is the COMPLETE initialization sequence — every line matters for understanding insertion points
- Line 76 is the exact Player creation to replace
- Lines 91-101 are the exact battle launch data to extend
- Lines 106-119 are the exact wake handler to extend with XP logic

**Acceptance Criteria**:

- [ ] WorldScene reads `playerName`, `playerClass`, `playerLevel`, `playerXp` from registry
- [ ] Player created with class-based stats matching registry data
- [ ] BattleScene receives `playerName` and `playerLevel` in init data
- [ ] On battle victory wake, XP is processed via `processXpGain`
- [ ] If level-up occurs, `applyLevelUp` is called on Player
- [ ] Updated level and XP persisted to registry
- [ ] Existing encounter removal on victory still works
- [ ] Player position preserved through battle (sleep/wake still works)
- [ ] `npm run test` — all tests pass
- [ ] `npm run build` succeeds

**Agent-Executed QA Scenarios**:

```
Scenario: WorldScene creates player from registry
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 10s)
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'TestHero');
       game.registry.set('playerClass', 'warrior');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 0);
       game.scene.start('WorldScene');
    4. Wait for: 2s
    5. Execute in console:
       const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       JSON.stringify({ name: p.name, classKey: p.classKey, hp: p.hp, attack: p.attack, defense: p.defense, level: p.level });
    6. Assert: name="TestHero", classKey="warrior", hp=30, attack=12, defense=8, level=1
  Expected Result: Warrior stats applied from registry
  Evidence: Console output captured

Scenario: XP gain and level-up on battle return
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, player in WorldScene
  Steps:
    1. Navigate to: http://localhost:5173
    2. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'TestHero');
       game.registry.set('playerClass', 'warrior');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 0);
       game.scene.start('WorldScene');
    3. Wait for: 2s
    4. Execute in console:
       // Simulate battle return with XP
       const ws = window.__PHASER_GAME__.scene.getScene('WorldScene');
       ws.events.emit('wake', ws.sys, { playerHp: 25, encounterId: 'slime-1', result: 'victory', xpGained: 15 });
    5. Wait for: 500ms
    6. Execute in console:
       const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       JSON.stringify({ level: p.level, xp: p.xp, registryLevel: window.__PHASER_GAME__.registry.get('playerLevel'), registryXp: window.__PHASER_GAME__.registry.get('playerXp') });
    7. Assert: level=1, xp=15 (not enough for level 2 yet — need 50 XP)
  Expected Result: XP accumulated, stored in registry
  Evidence: Console output captured

Scenario: Build and tests pass
  Tool: Bash
  Preconditions: Task 7 complete
  Steps:
    1. npm run test 2>&1
    2. Assert: All tests pass
    3. npm run build
    4. Assert: Exit code 0
  Expected Result: Clean build and tests
  Evidence: Output captured
```

**Commit**: YES
- Message: `feat(world): wire registry-based player creation and XP/level-up on battle return`
- Files: `src/game/scenes/WorldScene.ts`
- Pre-commit: `npm run test && npm run build`

---

### Task 8: Wire Scene Flow, Update main.ts, and Full Integration QA

**What to do**:
1. Update `src/game/main.ts`:
   - Import TitleScene and CharacterCreationScene
   - Add to scene array (after Boot, before WorldScene):
     ```typescript
     import { TitleScene } from './scenes/TitleScene';
     import { CharacterCreationScene } from './scenes/CharacterCreationScene';

     scene: [
       Boot,
       TitleScene,               // NEW
       CharacterCreationScene,   // NEW
       WorldScene,
       BattleScene,
     ]
     ```

2. Update `src/game/scenes/Boot.ts`:
   - Change `create()` to start TitleScene instead of WorldScene:
     ```typescript
     create(): void {
       this.scene.start('TitleScene');  // Was: this.scene.start('WorldScene');
     }
     ```

3. Run **FULL integration QA** — all 5 success criteria + regression tests:
   - SC1: Enter character name → see it in game (BattleScene player label)
   - SC2: Choose from 3 classes → selection menu works
   - SC3: Different classes have different starting stats → compare Warrior vs Mage HP
   - SC4: Defeating enemy grants XP → XP counter increases
   - SC5: Gaining enough XP triggers level up → level increases, stats grow

**Must NOT do**:
- Do NOT change Boot.ts preload() — asset loading stays the same
- Do NOT reorder scene array (Boot must be first)
- Do NOT modify any existing scene beyond Boot.ts line 24
- Do NOT add any new features — this is WIRING + QA only

**Recommended Agent Profile**:
- **Category**: `unspecified-high` — Integration wiring + comprehensive QA
  - Reason: Small code changes but extensive Playwright verification of the complete flow
- **Skills**: [`playwright`]
  - `playwright`: Full E2E verification of title→creation→world→battle→XP→levelup flow

**Skills Evaluated but Omitted**:
- `frontend-ui-ux`: No UI creation, just wiring
- `git-master`: No advanced git operations

**Parallelization**:
- **Can Run In Parallel**: NO
- **Parallel Group**: Wave 5 (final — solo)
- **Blocks**: None (final task)
- **Blocked By**: Tasks 4, 5, 6, 7

**References**:

**Pattern References**:
- `src/game/main.ts:1-27` — **FULL FILE** — scene array at lines 16-20, imports at lines 1-5
- `src/game/scenes/Boot.ts:23-25` — `create()` method — change `'WorldScene'` to `'TitleScene'`

**WHY Each Reference Matters**:
- main.ts is the scene registration file — new scenes must be added here
- Boot.ts create() is the single line that determines initial scene routing

**Acceptance Criteria**:

- [ ] `main.ts` imports and registers TitleScene and CharacterCreationScene
- [ ] `Boot.ts` create() starts `'TitleScene'`
- [ ] **SC1**: Game launches → Title screen → "New Game" → name input → type name → confirm → class select → confirm → WorldScene → trigger battle → BattleScene shows player name
- [ ] **SC2**: Class selection shows 3 classes (Warrior/Mage/Rogue) with stat previews, arrow navigation works
- [ ] **SC3**: Warrior starts with HP=30, ATK=12, DEF=8. Mage starts with HP=20, ATK=15, DEF=4
- [ ] **SC4**: Defeating Slime → victory message shows "+15 XP" → return to world → player.xp increased
- [ ] **SC5**: After sufficient XP → level increases → stats grow according to class growth table
- [ ] **Regression**: Walk movement still works, battle flow still works, encounter removal on victory still works
- [ ] All tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`

**Agent-Executed QA Scenarios**:

```
Scenario: Full flow — Title → Creation → World
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running on localhost:5173
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: canvas visible (timeout: 10s)
    3. Wait for: 3s (Boot assets load → TitleScene appears)
    4. Screenshot: .sisyphus/evidence/phase3-title-screen.png
    5. Assert: TitleScene is active:
       window.__PHASER_GAME__.scene.isActive('TitleScene')
    6. Press: Enter (New Game)
    7. Wait for: 1s
    8. Screenshot: .sisyphus/evidence/phase3-name-input.png
    9. Assert: CharacterCreationScene is active
    10. Press keys: H, E, R, O
    11. Wait for: 500ms
    12. Press: Enter (confirm name)
    13. Wait for: 500ms
    14. Screenshot: .sisyphus/evidence/phase3-class-select.png
    15. Press: Enter (select Warrior — default first option)
    16. Wait for: 2s
    17. Assert: WorldScene is active:
        window.__PHASER_GAME__.scene.isActive('WorldScene')
    18. Screenshot: .sisyphus/evidence/phase3-world-with-character.png
  Expected Result: Complete flow from title through creation to world
  Evidence: .sisyphus/evidence/phase3-title-screen.png through phase3-world-with-character.png

Scenario: SC3 — Different classes have different stats
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3s
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'Test');
       game.registry.set('playerClass', 'warrior');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 0);
       game.scene.start('WorldScene');
    4. Wait for: 2s
    5. Execute in console:
       const p1 = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       window.__warriorStats = { hp: p1.hp, attack: p1.attack, defense: p1.defense };
    6. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerClass', 'mage');
       game.scene.start('WorldScene');
    7. Wait for: 2s
    8. Execute in console:
       const p2 = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       window.__mageStats = { hp: p2.hp, attack: p2.attack, defense: p2.defense };
       JSON.stringify({ warrior: window.__warriorStats, mage: window.__mageStats });
    9. Assert: Warrior HP=30 > Mage HP=20
    10. Assert: Mage attack=15 > Warrior attack=12
  Expected Result: Classes have distinct stat distributions
  Evidence: Console output captured

Scenario: SC4 — XP gained after battle victory
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, player in WorldScene as Warrior
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3s
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'Hero');
       game.registry.set('playerClass', 'warrior');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 0);
       game.scene.start('WorldScene');
    4. Wait for: 2s
    5. Navigate player to encounter zone using arrow keys (Right×6, Down×8 — from spawn 2,2 to ~8,10)
    6. Wait for: 5s (allow movement completion)
    7. Assert: BattleScene is active (encounter triggered)
    8. Wait for: 2s (INTRO completes)
    9. Screenshot: .sisyphus/evidence/phase3-battle-player-name.png
    10. Press: Enter (Attack — Warrior with ATK 12 should kill Slime HP 12 in 1-2 hits)
    11. Wait for: 2s
    12. Press: Enter (Attack again if needed)
    13. Wait for: 3s (victory + XP message)
    14. Screenshot: .sisyphus/evidence/phase3-victory-xp.png
    15. Wait for: 3s (return to WorldScene)
    16. Execute in console:
        const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
        JSON.stringify({ xp: p.xp, level: p.level, registryXp: window.__PHASER_GAME__.registry.get('playerXp') });
    17. Assert: xp=15, level=1
  Expected Result: XP gained after victory, stored on player and in registry
  Evidence: .sisyphus/evidence/phase3-battle-player-name.png, .sisyphus/evidence/phase3-victory-xp.png

Scenario: SC5 — Level up after sufficient XP
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3s
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'Hero');
       game.registry.set('playerClass', 'warrior');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 40);  // 40 XP — needs 50 for level 2
       game.scene.start('WorldScene');
    4. Wait for: 2s
    5. Execute in console:
       // Simulate battle victory with 15 XP (40+15=55 >= 50 for level 2)
       const ws = window.__PHASER_GAME__.scene.getScene('WorldScene');
       ws.events.emit('wake', ws.sys, { playerHp: 25, encounterId: 'slime-1', result: 'victory', xpGained: 15 });
    6. Wait for: 1s
    7. Execute in console:
       const p = window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer();
       JSON.stringify({
         level: p.level,
         xp: p.xp,
         hp: p.hp,
         maxHp: p.maxHp,
         attack: p.attack,
         defense: p.defense
       });
    8. Assert: level=2 (leveled up!)
    9. Assert: maxHp=38 (30 base + 8 growth), attack=14 (12+2), defense=11 (8+3)
    10. Assert: xp=5 (55-50=5 leftover)
  Expected Result: Level increased, stats grew according to Warrior growth table
  Evidence: Console output captured

Scenario: Regression — Movement still works
  Tool: Playwright (playwright skill)
  Preconditions: Dev server running, in WorldScene
  Steps:
    1. Navigate to: http://localhost:5173
    2. Wait for: 3s
    3. Execute in console:
       const game = window.__PHASER_GAME__;
       game.registry.set('playerName', 'Hero');
       game.registry.set('playerClass', 'rogue');
       game.registry.set('playerLevel', 1);
       game.registry.set('playerXp', 0);
       game.scene.start('WorldScene');
    4. Wait for: 2s
    5. Execute in console:
       window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    6. Record: startX
    7. Press: ArrowRight
    8. Wait for: 300ms
    9. Execute in console:
       window.__PHASER_GAME__.scene.getScene('WorldScene').getPlayer().x
    10. Assert: x increased by ~16 (one tile)
    11. Screenshot: .sisyphus/evidence/phase3-regression-movement.png
  Expected Result: Grid movement still functions correctly
  Evidence: .sisyphus/evidence/phase3-regression-movement.png

Scenario: All tests pass
  Tool: Bash
  Preconditions: Task 8 complete
  Steps:
    1. npm run test -- --reporter=verbose 2>&1
    2. Assert: All test suites pass
    3. Assert: 0 failures
    4. npm run build
    5. Assert: Exit code 0
  Expected Result: Zero test failures, clean build
  Evidence: Test + build output captured
```

**Commit**: YES
- Message: `feat(flow): wire Boot→TitleScene→CharacterCreation→WorldScene scene flow`
- Files: `src/game/main.ts`, `src/game/scenes/Boot.ts`
- Pre-commit: `npm run test && npm run build`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `feat(character): add class definitions and XP/level-up system` | classes.ts, xp.ts, tests | `npm run test` |
| 2 | `feat(enemies): add xpReward field to EnemyData` | enemies.ts, enemies.test.ts | `npm run test` |
| 3 | `feat(player): add name, class, level, XP with dynamic stats` | Player.ts | `npm run test && npm run build` |
| 4 | `feat(scenes): add TitleScene with New Game` | TitleScene.ts | `npm run build` |
| 5 | `feat(scenes): add CharacterCreationScene` | CharacterCreationScene.ts | `npm run build` |
| 6 | `feat(battle): display player name/level and award XP` | BattleScene.ts | `npm run test && npm run build` |
| 7 | `feat(world): wire registry-based player and XP/level-up` | WorldScene.ts | `npm run test && npm run build` |
| 8 | `feat(flow): wire complete scene flow Boot→Title→Creation→World` | main.ts, Boot.ts | `npm run test && npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run test    # Expected: All tests pass (existing + new)
npm run build   # Expected: Exit code 0, no TypeScript errors
```

### Final Checklist
- [ ] Title screen appears on game launch
- [ ] "New Game" navigable with Enter key
- [ ] Name input accepts A-Z, max 8 chars, backspace works
- [ ] 3 classes visible with stat previews
- [ ] Arrow keys navigate class selection
- [ ] Warrior starts with HP=30, ATK=12, DEF=8
- [ ] Mage starts with HP=20, ATK=15, DEF=4
- [ ] Rogue starts with HP=25, ATK=10, DEF=6
- [ ] Player name shows in BattleScene
- [ ] Defeating Slime awards 15 XP
- [ ] Level-up occurs at correct XP thresholds
- [ ] Stats grow per class growth table on level-up
- [ ] Defeat → Title screen (not Boot)
- [ ] Movement still works (regression)
- [ ] All existing tests pass
- [ ] All new tests pass
- [ ] Build succeeds
