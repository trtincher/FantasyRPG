# FantasyRPG Requirements Traceability Matrix

**Source:** `docs/01_discovery.md`  
**Last Updated:** Feb 5, 2026

---

## Requirements by Category

### Character System

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-001 | Player can name their character | 3 | Must |
| R-002 | Player can choose a class/starter that affects playstyle | 3 | Must |
| R-003 | Character has attributes (HP, attack, defense, etc.) | 3 | Must |
| R-004 | XP system with leveling | 3 | Must |
| R-005 | Stats increase on level up | 3 | Must |

### Inventory System

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-006 | Simple inventory system (potions, key items) | 5 | Must |
| R-007 | Items can be used in and out of combat | 5 | Must |

### Combat System

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-008 | Turn-based battle system | 2 | Must |
| R-009 | Multiple enemy types with different behaviors | 2, 4 | Must |
| R-010 | Boss encounter at dungeon end | 4 | Must |
| R-011 | Basic actions: Attack, Defend, Use Item, Flee | 2, 5 | Must |
| R-022 | Battle UI showing HP, options, enemy info | 2 | Must |

### World & Movement

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-012 | Tile-based movement on grid map | 1 | Must |
| R-013 | One dungeon/overworld map (~15 min of content) | 1, 4 | Must |
| R-014 | Points of interest (encounters, story beats) | 4 | Must |

### Story & Dialogue

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-015 | NPC dialogue system | 4 | Must |
| R-016 | Story beats throughout dungeon | 4 | Must |

### Persistence

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-017 | Save game to disk | 5 | Must |
| R-018 | Load game from disk | 5 | Must |

### Audio

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-019 | Background music | 5 | Must |
| R-020 | Sound effects for actions | 5 | Must |

### UI

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| R-021 | Menu-driven interface | 5 | Must |
| R-022 | Battle UI showing HP, options, enemy info | 2 | Must |

---

## Phase Coverage Matrix

| Requirement | P1 | P2 | P3 | P4 | P5 |
|-------------|----|----|----|----|-----|
| R-001 | | | X | | |
| R-002 | | | X | | |
| R-003 | | | X | | |
| R-004 | | | X | | |
| R-005 | | | X | | |
| R-006 | | | | | X |
| R-007 | | | | | X |
| R-008 | | X | | | |
| R-009 | | x | | X | |
| R-010 | | | | X | |
| R-011 | | x | | | X |
| R-012 | X | | | | |
| R-013 | x | | | X | |
| R-014 | | | | X | |
| R-015 | | | | X | |
| R-016 | | | | X | |
| R-017 | | | | | X |
| R-018 | | | | | X |
| R-019 | | | | | X |
| R-020 | | | | | X |
| R-021 | | | | | X |
| R-022 | | X | | | |

**Legend:** `X` = Primary implementation, `x` = Partial/foundation

---

## Orphan Check

**Requirements without phase assignment:** None  
**Coverage:** 22/22 (100%)
