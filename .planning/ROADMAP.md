# FantasyRPG Development Roadmap

**Version:** 1.0  
**Created:** Feb 5, 2026  
**Methodology:** Vertical slices with observable outcomes

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Phaser 3 | Best tilemap support, Monster Tamer tutorial available |
| **Language** | TypeScript | Leverages existing skills, type safety |
| **Build** | Vite | Fast dev server, official Phaser template |
| **Maps** | Tiled Editor | Industry standard, exports to Phaser JSON |
| **Art** | Free pixel art | OpenGameArt, itch.io placeholders |
| **Audio** | Free assets | Placeholder 8-bit sounds/music |

---

## Architecture Overview

```
src/
├── main.ts                 # Entry point
├── config.ts               # Phaser config
├── scenes/
│   ├── BootScene.ts        # Asset loading
│   ├── TitleScene.ts       # Main menu
│   ├── WorldScene.ts       # Overworld/dungeon
│   ├── BattleScene.ts      # Combat
│   └── MenuScene.ts        # Inventory/party
├── entities/
│   ├── Player.ts           # Player character
│   ├── NPC.ts              # NPCs
│   └── Enemy.ts            # Enemy types
├── systems/
│   ├── BattleSystem.ts     # Combat state machine
│   ├── DialogueSystem.ts   # Text/choices
│   └── SaveSystem.ts       # Persistence
├── data/
│   ├── classes.json        # Character classes
│   ├── enemies.json        # Enemy definitions
│   └── items.json          # Item catalog
└── utils/
    ├── StatCalculator.ts   # Damage/XP formulas
    └── Constants.ts        # Game constants
```

---

## Phase 1: Walking Demo

**Goal:** Character moving on a tile-based map  
**Duration:** ~3-4 hours  
**Requirements:** R-012, R-013 (partial)

### Deliverables
1. Phaser project scaffolded with TypeScript + Vite
2. A small test tilemap (8x8 or 16x16 tiles)
3. Player sprite that moves in 4 directions
4. Camera follows player
5. Collision with walls/obstacles

### Success Criteria (Observable)
| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Game window opens without errors | Launch `npm run dev` |
| 2 | Player sprite visible on tilemap | Visual inspection |
| 3 | Arrow keys move player in 4 directions | Manual test |
| 4 | Player cannot walk through walls | Collision test |
| 5 | Camera follows player movement | Walk to map edge |

### Key Learning Concepts
- Phaser game loop (preload → create → update)
- Scene lifecycle
- Tilemap loading from Tiled JSON
- Sprite movement and animation
- Basic collision detection

### Resources
- [Phaser + Vite Template](https://github.com/phaserjs/template-vite-ts)
- [Tiled Map Editor](https://www.mapeditor.org/)
- [Phaser Tilemap Tutorial](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6)

---

## Phase 2: First Battle

**Goal:** Trigger encounter, defeat one enemy  
**Duration:** ~4-6 hours  
**Requirements:** R-008, R-009 (partial), R-011 (partial), R-022

### Deliverables
1. Battle scene with separate UI
2. Turn-based state machine (player turn → enemy turn → repeat)
3. One enemy type with HP and attack
4. Attack action that deals damage
5. Battle ends when enemy HP reaches 0
6. Return to world after victory

### Success Criteria (Observable)
| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Walking into encounter zone triggers battle | Walk into marked area |
| 2 | Battle UI shows player HP, enemy HP, options | Visual inspection |
| 3 | Selecting "Attack" deals damage to enemy | HP decreases |
| 4 | Enemy attacks on its turn | Player HP decreases |
| 5 | Battle ends when enemy HP = 0 | Victory message, return to world |

### Key Learning Concepts
- Scene transitions with data passing
- State machine pattern for turn flow
- UI creation (health bars, menus)
- Damage calculation basics

### Battle State Machine
```
INTRO → PLAYER_TURN → ENEMY_TURN → CHECK_END → (loop or VICTORY/DEFEAT)
```

---

## Phase 3: Character Depth

**Goal:** Character creation with meaningful choices  
**Duration:** ~4-5 hours  
**Requirements:** R-001, R-002, R-003, R-004, R-005

### Deliverables
1. Title screen with "New Game" option
2. Character creation: name input + class selection
3. 3 classes with different stat distributions
4. XP gain after battle victory
5. Level up with stat increases
6. Stats affect battle calculations

### Success Criteria (Observable)
| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Can enter character name | Type name, see it in game |
| 2 | Can choose from 3 classes | Selection menu works |
| 3 | Different classes have different starting stats | Compare HP/attack |
| 4 | Defeating enemy grants XP | XP counter increases |
| 5 | Gaining enough XP triggers level up | Level increases, stats grow |

### Class Design (Example)
| Class | HP | Attack | Defense | Special |
|-------|-----|--------|---------|---------|
| Warrior | 30 | 12 | 8 | High HP |
| Mage | 20 | 15 | 4 | High damage |
| Rogue | 25 | 10 | 6 | Balanced |

---

## Phase 4: World Expansion

**Goal:** Full dungeon with story and boss  
**Duration:** ~6-8 hours  
**Requirements:** R-009 (full), R-010, R-013 (full), R-014, R-015, R-016

### Deliverables
1. Full dungeon map (~15 min of content)
2. 3+ enemy types with different stats/behaviors
3. NPCs with dialogue
4. Story beats (intro, midpoint, pre-boss)
5. Boss encounter at dungeon end
6. Victory screen after boss defeat

### Success Criteria (Observable)
| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Dungeon takes ~15 min to explore | Playtest timer |
| 2 | At least 3 different enemy types appear | Visual variety |
| 3 | Can talk to NPCs, see dialogue | Interact with NPC |
| 4 | Story unfolds at key points | Text appears at triggers |
| 5 | Boss has more HP and deals more damage | Harder fight |

### Dungeon Layout (Example)
```
[Entrance] → [Room 1: NPC + Story] → [Room 2: Encounters] 
    → [Room 3: Story beat] → [Room 4: Encounters] → [Boss Room]
```

---

## Phase 5: Systems & Polish

**Goal:** Complete playable experience  
**Duration:** ~6-8 hours  
**Requirements:** R-006, R-007, R-011 (full), R-017, R-018, R-019, R-020, R-021

### Deliverables
1. Inventory system with potions, key items
2. Use items in battle (heal HP)
3. Full battle actions (Attack, Defend, Item, Flee)
4. Save game (JSON to localStorage/file)
5. Load game from save
6. Background music
7. Sound effects (attack, damage, menu)
8. Polished menu UI

### Success Criteria (Observable)
| # | Criteria | Verification |
|---|----------|--------------|
| 1 | Can pick up and use potions | Inventory shows item, HP heals |
| 2 | Defend reduces incoming damage | Compare damage with/without |
| 3 | Flee has chance to escape battle | Sometimes works |
| 4 | Save game persists after closing | Save, close, reopen |
| 5 | Load returns to saved position | Position, HP, items match |
| 6 | Music plays in world and battle | Audio test |
| 7 | Sound effects on actions | Attack makes sound |

---

## Milestone Summary

| Phase | Deliverable | Est. Time | Cumulative |
|-------|-------------|-----------|------------|
| 1 | Walking Demo | 3-4 hrs | 3-4 hrs |
| 2 | First Battle | 4-6 hrs | 7-10 hrs |
| 3 | Character Depth | 4-5 hrs | 11-15 hrs |
| 4 | World Expansion | 6-8 hrs | 17-23 hrs |
| 5 | Systems & Polish | 6-8 hrs | 23-31 hrs |

**Total estimated:** 23-31 hours for complete V1

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict phase boundaries; defer all "nice to have" to V2 |
| Battle system complexity | Start with attack-only; add actions incrementally |
| Tilemap confusion | Follow Monster Tamer tutorial for Tiled workflow |
| State management mess | Use typed constants for registry keys |
| Motivation loss | Each phase produces visible progress |

---

## Learning Resources

### Primary (Follow These)
1. **[Monster Tamer Tutorial](https://www.youtube.com/playlist?list=PLmcXe0-sfoSgq-pyXrFx0GZjHbvoVUW8t)** — Complete Pokemon-style RPG in Phaser
2. **[Phaser Official Docs](https://docs.phaser.io/)** — API reference
3. **[Phaser Examples](https://phaser.io/examples)** — Code samples

### Secondary (Reference)
- [Game Programming Patterns - State](https://gameprogrammingpatterns.com/state.html)
- [Tiled Editor Docs](https://doc.mapeditor.org/)
- [OpenGameArt](https://opengameart.org/) — Free assets

---

## Next Steps

1. **Initialize project:** `npm create @phaserjs/game@latest fantasyrpg`
2. **Choose template:** Vite + TypeScript
3. **Install Tiled:** Download from mapeditor.org
4. **Begin Phase 1:** Create test tilemap, implement movement

Ready to start? Say: *"Let's start Phase 1"*
