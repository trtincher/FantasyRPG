# FantasyRPG - Product Requirements Document

**Version:** 1.0  
**Status:** Discovery Complete  
**Date:** Feb 5, 2026

---

## 1. Problem Statement

### Core Problem
Developer wants to learn how RPG games are built at a structural level—understanding game loops, state management, turn-based combat systems, and tile-based movement—through building a working, playable game.

### Why Now
Personal learning initiative. No external deadline or business pressure.

### Success Criteria
A playable ~15-minute dungeon crawl experience that demonstrates core RPG mechanics:
- Player can create a character and make meaningful choices
- Turn-based combat feels like a tabletop RPG encounter
- Progression (leveling, inventory) provides player agency
- Game can be saved and resumed

---

## 2. Users

| User | Description | Priority |
|------|-------------|----------|
| Developer (self) | Primary player and learner | Primary |
| Friends | Potential playtesters | Secondary |

**Note:** This is a learning project. Public distribution is not a goal.

---

## 3. Reference Model

**Pokemon Red/Blue (1996)** serves as the complexity ceiling:
- Tile-based grid movement
- Turn-based combat with menus
- Simple inventory system
- Linear story progression
- 2D pixel art graphics
- 8-bit style audio

Nothing in V1 should exceed this complexity level.

---

## 4. Requirements

### 4.1 Must-Have (V1)

| ID | Category | Requirement |
|----|----------|-------------|
| R-001 | Character | Player can name their character |
| R-002 | Character | Player can choose a class/starter that affects playstyle |
| R-003 | Character | Character has attributes (HP, attack, defense, etc.) |
| R-004 | Progression | XP system with leveling |
| R-005 | Progression | Stats increase on level up |
| R-006 | Inventory | Simple inventory system (potions, key items) |
| R-007 | Inventory | Items can be used in and out of combat |
| R-008 | Combat | Turn-based battle system |
| R-009 | Combat | Multiple enemy types with different behaviors |
| R-010 | Combat | Boss encounter at dungeon end |
| R-011 | Combat | Basic actions: Attack, Defend, Use Item, Flee |
| R-012 | World | Tile-based movement on grid map |
| R-013 | World | One dungeon/overworld map (~15 min of content) |
| R-014 | World | Points of interest (encounters, story beats) |
| R-015 | Story | NPC dialogue system |
| R-016 | Story | Story beats throughout dungeon |
| R-017 | Persistence | Save game to disk |
| R-018 | Persistence | Load game from disk |
| R-019 | Audio | Background music |
| R-020 | Audio | Sound effects for actions |
| R-021 | UI | Menu-driven interface |
| R-022 | UI | Battle UI showing HP, options, enemy info |

### 4.2 Out of Scope (V1)

| Category | Excluded | Reason |
|----------|----------|--------|
| Multiplayer | Any networked play | Complexity; single-player focus |
| Platform | Mobile builds | Mac-only for V1 |
| Platform | Browser deployment | Not required |
| World | Procedural generation | Fixed dungeon is sufficient |
| World | Open world / multiple areas | Scope control |
| Systems | Crafting | Beyond Pokemon R/B scope |
| Systems | Complex skill trees | Keep progression simple |
| Systems | Real-time combat | Turn-based only |
| Polish | Custom art assets | Placeholders are fine |
| Polish | Custom music | Placeholders are fine |

---

## 5. Technical Constraints

### 5.1 Developer Background
- **Strong:** TypeScript, React, JavaScript, CSS, Node, Rails, PostgreSQL
- **New:** Game development (first project)

### 5.2 Platform Requirements
- **Target:** macOS only
- **Distribution:** Local execution (no packaging required)

### 5.3 Stack Direction
TypeScript-based solution preferred to leverage existing skills. Specific framework to be determined in architecture phase.

Candidates:
- **Phaser.js** — Mature 2D game framework, large community
- **Excalibur.js** — TypeScript-first, simpler API
- **Godot** — Industry standard for indie 2D, but requires learning GDScript

### 5.4 Assets
- **Art:** Free placeholder pixel art (OpenGameArt, itch.io, etc.)
- **Audio:** Free placeholder sounds/music

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep | High | High | Strict V1 boundary enforcement; defer all "nice to have" ideas |
| Learning curve on game loops | Medium | Medium | Document concepts as learned; start with tutorials |
| Battle system complexity | Medium | Medium | Start with simplest possible implementation; iterate |
| Tile movement implementation | Medium | Low | Well-documented pattern; many tutorials available |
| Motivation loss | Low | High | Keep scope small; celebrate incremental progress |

---

## 7. Learning Goals

Concepts to understand through this project:

1. **Game Loop** — How games handle continuous updates (update/render cycle)
2. **Game State Management** — Scenes, transitions, persistent data
3. **Tile-Based Movement** — Grid systems, collision detection, sprite positioning
4. **Turn-Based Combat Architecture** — State machines, action queues, damage calculation
5. **Entity/Component Patterns** — How to structure characters, enemies, items
6. **Asset Loading** — Sprites, tilemaps, audio in a game context

---

## 8. Open Questions

*To be resolved in architecture phase:*

1. Which TypeScript game framework? (Phaser vs Excalibur vs other)
2. How to structure the combat state machine?
3. Tilemap format and editor to use?
4. Save file format (JSON? SQLite?)

---

## 9. Satisfaction Checklist

- [x] Problem defined
- [x] Users identified  
- [x] Success metrics measurable
- [x] Urgency understood
- [x] Must-haves listed (22 requirements)
- [x] Nice-to-haves separated (none for V1—strict scope)
- [x] Out of scope explicit
- [x] Timeline known (no deadline)
- [x] Technical constraints captured
- [x] Dependencies identified

---

## Next Phase

**Station 2: Architecture**
- Finalize tech stack selection
- Create phased roadmap
- Define observable success criteria per phase

Trigger: `/factory:architect`
