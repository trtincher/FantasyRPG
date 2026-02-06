# FantasyRPG Tech Stack Decision Record

**Date:** Feb 5, 2026  
**Status:** Approved

---

## Decision: Phaser 3 + TypeScript + Vite

### Context

Building a Pokemon Red/Blue-style RPG as a learning project. Developer has strong TypeScript/React background, no game dev experience.

### Options Evaluated

| Framework | Pros | Cons |
|-----------|------|------|
| **Phaser 3** | Largest community, Monster Tamer tutorial, mature ecosystem | Larger bundle, UI requires manual work |
| **Excalibur.js** | TypeScript-native, simpler API, smaller bundle | Smaller community, fewer examples, pre-1.0 |
| **Godot** | Industry standard for indie 2D | Requires learning GDScript, different paradigm |

### Decision

**Phaser 3** — Chosen for the following reasons:

1. **Monster Tamer Tutorial** — A complete Pokemon-style RPG tutorial exists ([GitHub](https://github.com/devshareacademy/monster-tamer), [YouTube](https://www.youtube.com/playlist?list=PLmcXe0-sfoSgq-pyXrFx0GZjHbvoVUW8t)). This dramatically reduces learning curve risk.

2. **Community Size** — 500K monthly npm downloads vs 10K for Excalibur. More Stack Overflow answers, more tutorials, faster help.

3. **Tilemap Support** — First-class Tiled integration with battle-tested patterns.

4. **TypeScript Support** — Official templates (Vite + TS) work well despite not being native TypeScript.

### Trade-offs Accepted

- Will need to build UI components manually (dialog boxes, menus, health bars)
- Need to use typed constants to avoid registry key bugs
- Larger bundle size (~200KB vs ~100KB) — acceptable for desktop

---

## Architecture Patterns

### Turn-Based Combat: State Machine

```typescript
enum BattleState {
  INTRO = 'INTRO',
  PLAYER_TURN = 'PLAYER_TURN',
  ENEMY_TURN = 'ENEMY_TURN',
  ABILITY_ANIMATION = 'ABILITY_ANIMATION',
  POST_ATTACK_CHECK = 'POST_ATTACK_CHECK',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT'
}
```

**Rationale:** Explicit state enums prevent nested conditional hell. Each state has clear enter/exit hooks.

### Entity Pattern: Component-Based OOP

```typescript
class Character {
  stats: Stats;
  abilities: Ability[];
  statusEffects: StatusEffect[];
}
```

**Rationale:** Pure ECS is overkill for 2-6 battle entities. Component composition provides flexibility without complexity.

### State Management: Typed Registry

```typescript
// Avoid magic strings
const DATA_KEYS = {
  PLAYER_PARTY: 'PLAYER_PARTY',
  INVENTORY: 'INVENTORY',
  STORY_FLAGS: 'STORY_FLAGS'
} as const;

// Type-safe access
this.registry.set(DATA_KEYS.PLAYER_PARTY, party);
```

**Rationale:** Phaser's registry has no built-in type safety. Typed constants prevent typo bugs.

### Save/Load: JSON + localStorage

```typescript
interface SaveData {
  player: { name: string; class: string; level: number; xp: number };
  party: PartyMember[];
  inventory: InventoryItem[];
  position: { mapId: string; x: number; y: number };
  storyFlags: Record<string, boolean>;
}

// Save
localStorage.setItem('save', JSON.stringify(saveData));

// Load
const saveData = JSON.parse(localStorage.getItem('save'));
```

**Rationale:** Simple, works on Mac, no external dependencies. Can upgrade to file system later if needed.

---

## Project Structure

```
fantasyrpg/
├── public/
│   └── assets/
│       ├── sprites/          # Character/enemy sprites
│       ├── tilesets/         # Tilemap graphics
│       ├── maps/             # Tiled JSON exports
│       └── audio/            # Music and SFX
├── src/
│   ├── main.ts               # Entry point
│   ├── config.ts             # Phaser game config
│   ├── scenes/
│   │   ├── BootScene.ts      # Preload assets
│   │   ├── TitleScene.ts     # Main menu
│   │   ├── WorldScene.ts     # Overworld exploration
│   │   ├── BattleScene.ts    # Turn-based combat
│   │   └── MenuScene.ts      # Inventory/party screen
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   └── Enemy.ts
│   ├── systems/
│   │   ├── BattleSystem.ts   # Combat state machine
│   │   ├── DialogueSystem.ts # NPC text display
│   │   └── SaveSystem.ts     # Persistence
│   ├── data/
│   │   ├── classes.json      # Character class definitions
│   │   ├── enemies.json      # Enemy stat blocks
│   │   └── items.json        # Item definitions
│   └── utils/
│       ├── Constants.ts      # Registry keys, enums
│       └── Formulas.ts       # Damage/XP calculations
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Tool Setup

### Required
- **Node.js** 18+ (LTS)
- **Tiled Map Editor** — https://www.mapeditor.org/
- **VS Code** with Phaser 3 snippets extension

### Nice to Have
- **Aseprite** — Pixel art editor (if making custom sprites)
- **Audacity** — Audio editing (if tweaking sounds)

---

## Key Resources

| Resource | Purpose |
|----------|---------|
| [Monster Tamer Repo](https://github.com/devshareacademy/monster-tamer) | Reference implementation |
| [Monster Tamer YouTube](https://www.youtube.com/playlist?list=PLmcXe0-sfoSgq-pyXrFx0GZjHbvoVUW8t) | Step-by-step tutorial |
| [Phaser Docs](https://docs.phaser.io/) | API reference |
| [Phaser Examples](https://phaser.io/examples) | Code samples |
| [OpenGameArt](https://opengameart.org/) | Free sprites/audio |
| [itch.io Assets](https://itch.io/game-assets/free) | Free game assets |

---

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Phaser vs Excalibur? | Phaser — larger community, tutorial availability |
| ECS vs OOP? | Component-based OOP — sufficient for small entity count |
| Save format? | JSON to localStorage — simple, works on Mac |
| Tilemap editor? | Tiled — industry standard, Phaser integration |
