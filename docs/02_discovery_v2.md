# FantasyRPG V2 - Product Requirements Document

**Version:** 2.0  
**Status:** Discovery Complete  
**Date:** Mar 7, 2026  
**Predecessor:** `docs/01_discovery.md` (V1 — Complete)

---

## 1. Problem Statement

### Core Problem
V1 achieved its learning goals — the developer now understands game loops, tile-based movement, state machines, and turn-based combat at a structural level. V2 shifts focus from **learning how RPGs work** to **making an RPG that feels good to play and share**. The combat and character progression systems need enough depth to be genuinely engaging, not just mechanically functional.

### Why Now
V1 is complete (5 phases, 161 tests, all core systems working). The foundation exists. The developer has the technical knowledge to tackle deeper systems.

### Success Criteria
A single-dungeon experience where:
- Combat encounters (especially bosses) feel **tactical and rewarding** — not just "press Attack until enemy dies"
- Character progression creates **meaningful build identity** — two playthroughs feel different
- Party composition **matters** — encounters require team coordination, not solo power
- The mechanical depth is **simple to learn, complex to combine** — each individual system is straightforward, depth emerges from interactions

### Design Principle
> **Simple to learn, complex to combine.** Like chess — each piece has simple movement rules, but the game is infinitely deep because of combinations. The basic idea of character development should be straightforward and graspable. Complexity comes from the potential combinations.

---

## 2. Users

| User | Description | Priority | Change from V1 |
|------|-------------|----------|----------------|
| Developer (self) | Primary player and designer | Primary | Same |
| Friends | Playtesters and early audience | **Elevated** | Shifted from "maybe" to active target |

**Shift:** V1 was "learning project, maybe friends play it." V2 is "make something fun enough to share."

---

## 3. Narrative Frame

### 3.1 Genre & Inspiration

**Genre:** LitRPG-inspired Fantasy RPG  
**Tone:** Humor as coping mechanism in genuine danger (Mage Tank / He Who Fights with Monsters balance)

**Primary Novel References:**
| Reference | What to Take |
|-----------|-------------|
| **He Who Fights with Monsters** (Shirtaloon) | Essence/ability system, rank thresholds (Iron→Bronze→Silver→Gold), spirit coin economy, magical concentrations spawning monsters, party role synergy, affliction-based combat |
| **Mage Tank** (Cornman) | Classless stat-based builds, stat evolution milestones, non-linear stat scaling, dungeon crawling as core loop, snarky System personality, D&D-like party dynamics |

**Secondary Novel References:**
| Reference | What to Take |
|-----------|-------------|
| **Dungeon Crawler Carl** (Matt Dinniman) | Achievement-triggered loot, tiered loot economy, floor structure as pacing |
| **Azarinth Healer** (Rhaegar) | Skill-use leveling, behavior-gated class evolution, dual-class slots |
| **1% Life Steal** (Robert Blaise) | Single-ability build identity, build coherence through constraint |
| **Awaken Online** (Travis Bagwell) | Behavior-driven affinity shifts, AI dungeon master concept |
| **Last Life** (Alexey Osadchuk) | Multi-dimensional resource management, earned progression |

**Primary Game References:**
| Reference | What to Take |
|-----------|-------------|
| **Octopath Traveler** | Break/Shield system, Boost Points, turn order manipulation, discoverable weaknesses |
| **Expedition 33** | AP budget per turn, character-specific combat mechanics, stance system |
| **Baldur's Gate 3** | Party build control, D&D action economy, Advantage/Disadvantage |
| **D&D 5e** | Action + Bonus Action + Movement, short/long rest resource dichotomy |

### 3.2 Story Setup (Long-term Direction — NOT V2 scope)

- **Isekai origin** — MC is from the mundane world, arrives in a magical world
- **Single MC + recruited party** — player controls all 4 party member builds, but the narrative centers on one main character
- **Party members are NPCs with agency** — the player controls their mechanical builds (like BG3/Expedition 33), but narratively they are distinct characters with their own motivations

### 3.3 The System (In-World UI)

The MC manifests a magical "interface" — a game-like overlay that presents stats, notifications, and ability descriptions. This is the MC's personal interpretation of magic, shaped by their Earth gaming experience (directly inspired by HWFWM).

**Key implications:**
- The MC sees stat screens, level-up notifications, ability descriptions — because that's how their brain processes magic
- Party members experience the same progression differently ("I feel stronger" vs the MC seeing "+2 STR")
- The System's "voice" has personality — snarky descriptions, humorous tooltips (Mage Tank style)
- Creates a natural tutorial mechanism — the MC is learning the world's rules and translating them into game terms
- Opens narrative possibilities — the System can be unreliable, have opinions, or withhold information

---

## 4. V2 Scope

### 4.1 What V2 IS
- **One dungeon** — same surface area as V1, dramatically deeper mechanics underneath
- **4-member party combat** — MC + 3 recruited party members
- **Deep battle system** — AP budget, Break/Shield, weaknesses/resistances, skill-use leveling
- **Essence-based character progression** — build identity from essence combinations + rank thresholds
- **Modular architecture** — dungeons, overworld (future), homebase (future) designed as pluggable containers
- **Better test coverage** — integration tests and scene tests, not just pure logic unit tests

### 4.2 What V2 is NOT
- Not a visual upgrade (placeholder art continues)
- Not an audio upgrade (deferred to V3)
- Not a content expansion (still one dungeon)
- Not the full isekai narrative (narrative frame exists but V2 focuses on mechanics)

---

## 5. Requirements

### 5.1 Combat System

| ID | Category | Requirement | Inspiration |
|----|----------|-------------|-------------|
| V2-001 | Combat | AP/Boost budget system — each character has action points per turn, can spend to amplify actions | Octopath BP / Expedition 33 AP |
| V2-002 | Combat | Break/Shield system — enemies have shield counters reduced by hitting weaknesses, Break state grants burst window | Octopath Traveler |
| V2-003 | Combat | Layered weakness/resistance system — enemies have multiple weaknesses AND resistances across physical and essence types | Octopath + HWFWM |
| V2-004 | Combat | Essence-typed damage — damage types flow from the essence system (Dark, Blood, Fire, etc.), not arbitrary elements | HWFWM |
| V2-005 | Combat | Discoverable weaknesses — enemy weaknesses start hidden ("?"), revealed through combat or recon abilities | Octopath + HWFWM |
| V2-006 | Combat | Party role synergy — encounters designed around team coordination (tank/healer/DPS/support), combos matter more than individual power | HWFWM Team Biscuit / D&D |
| V2-007 | Combat | 4-member party combat — MC + 3 party members, all controllable | BG3 / Expedition 33 |
| V2-008 | Combat | Boss encounters that feel tactical — bosses require strategic use of Break, weaknesses, party coordination | Octopath / Expedition 33 |
| V2-009 | Combat | Turn order display — visible timeline showing upcoming turns for planning | Octopath / FFX |

### 5.2 Character Progression

| ID | Category | Requirement | Inspiration |
|----|----------|-------------|-------------|
| V2-010 | Progression | Essence/ability system — characters have 3-4 essence slots that define their ability tree | HWFWM |
| V2-011 | Progression | Rank threshold progression — hard tier gates (Iron→Bronze→Silver) that qualitatively change the character, not just stat bumps | HWFWM |
| V2-012 | Progression | Skill-use leveling — abilities improve through use in combat, creating deliberate training decisions | Azarinth Healer |
| V2-013 | Progression | Build identity — essence combinations create distinct playstyles; two characters with different essences feel meaningfully different | HWFWM / Mage Tank |
| V2-014 | Progression | Party member builds — player controls essence/ability choices for all 4 party members | BG3 / Expedition 33 |

### 5.3 Architecture

| ID | Category | Requirement | Rationale |
|----|----------|-------------|-----------|
| V2-015 | Architecture | Modular dungeon system — dungeons are self-contained modules that narrative content plugs into | Future-proofing for V3+ multi-dungeon/overworld |
| V2-016 | Architecture | Modular world containers — overworld, homebase, dungeon modules designed as interchangeable containers | Long-term vision: isekai world with multiple areas |
| V2-017 | Architecture | Build on V1 codebase — extend existing Phaser 3 + TypeScript + Vite project | Leverage existing foundation |

### 5.4 Quality

| ID | Category | Requirement | Rationale |
|----|----------|-------------|-----------|
| V2-018 | Testing | Integration tests for combat system | Combinatorial complexity demands automated verification |
| V2-019 | Testing | Scene-level tests for game flow | V1 only tested pure logic; V2 needs broader coverage |
| V2-020 | Testing | Pure logic unit tests for all new systems | Continue V1 pattern for essence, progression, damage calc |

### 5.5 V1 Systems to Retain/Extend

| V1 ID | System | V2 Status |
|-------|--------|-----------|
| R-001 | Character naming | Retain |
| R-002 | Class selection | **Replace** with essence system |
| R-003 | Character attributes | **Extend** with essence-derived attributes |
| R-004 | XP system | **Extend** with rank thresholds |
| R-005 | Stats on level up | **Extend** with skill-use leveling |
| R-006 | Inventory | Retain |
| R-007 | Items in combat | Retain |
| R-008 | Turn-based battle | **Major overhaul** — AP, Break/Shield, weaknesses |
| R-009 | Multiple enemy types | **Extend** with essence-typed weaknesses/resistances |
| R-010 | Boss encounter | **Extend** with tactical boss design |
| R-011 | Battle actions | **Replace** with AP-based action system |
| R-012 | Tile-based movement | Retain |
| R-013 | Dungeon map | **Extend** with modular architecture |
| R-014 | Points of interest | Retain |
| R-015 | NPC dialogue | Retain |
| R-016 | Story beats | Retain |
| R-017 | Save game | **Extend** for deeper state (essences, skill levels, rank) |
| R-018 | Load game | **Extend** to match |
| R-019 | Background music | Deferred to V3 |
| R-020 | Sound effects | Deferred to V3 |
| R-021 | Menu-driven UI | Retain |
| R-022 | Battle UI | **Major overhaul** — AP display, Break/Shield, weaknesses, turn order |

---

## 6. Out of Scope (V2)

| Category | Excluded | Reason |
|----------|----------|--------|
| Art | Custom art / visual upgrades | Deferred to V3; V2 focuses on mechanics |
| Audio | Background music | Deferred to V3 |
| Audio | Sound effects | Deferred to V3 |
| World | Multiple dungeons | V2 is single-dungeon; modular architecture enables V3 expansion |
| World | Overworld / hub world | Long-term vision, not V2 |
| World | Homebase | Long-term vision, not V2 |
| Narrative | Full isekai story arc | Narrative frame exists but V2 is mechanics-focused |
| Narrative | Deep NPC backstories | V3+ |
| Systems | Crafting | Not yet needed |
| Systems | Real-time combat elements | Turn-based only |
| Platform | Multiplayer | Never |
| Platform | Mobile | Mac-only |

---

## 7. Reference Research Summary

### 7.1 LitRPG Mechanical Patterns (Cross-Series)

Six universal patterns identified across the referenced LitRPG series:

| # | Pattern | Description | Appears In |
|---|---------|-------------|-----------|
| 1 | **Behavior-Gated Progression** | What you *do* determines what you *become* — not just XP totals | All 7 series |
| 2 | **Rank Thresholds** | Hard tier walls where characters qualitatively change | HWFWM, Mage Tank, Azarinth, DCC |
| 3 | **Essence/Multi-Slot Classes** | Build identity from combining 2-4 ability sources | HWFWM, Azarinth, Mage Tank |
| 4 | **Skill-Use Leveling** | Skills improve by using them | Azarinth, Awaken Online, 1% Lifesteal |
| 5 | **Branching Evolution at Milestones** | At key thresholds, choose from options gated by history | Azarinth, Mage Tank, DCC |
| 6 | **Dual Economy** | Currency that is both money AND consumable power | HWFWM, 1% Lifesteal, DCC |

### 7.2 HWFWM Key Systems (Primary Reference)

- **Rank System:** Iron → Bronze → Silver → Gold → Diamond. Hard walls between tiers — a Silver ranker is categorically different from Bronze. Advancement requires all abilities to cross the threshold (bottleneck = weakest ability).
- **Essence System:** 4 essence slots (3 chosen + 1 auto-generated confluence). Each essence provides 5 ability slots = 20 total abilities. Awakening stones unlock abilities semi-randomly.
- **Spirit Coins:** Dual-use currency (money + consumable power source). Rank-matched tiers. Silver coins can temporarily boost a Bronze ranker to Silver stats at cost of exhaustion.
- **Mana Saturation/Density:** Two independent variables — saturation = spawn rate, density = monster rank. Enables zone difficulty tuning.
- **Team Biscuit:** Role specialization with synergistic overlap. Affliction specialist (Jason) + tank (Humphrey) + healer (Neil) + striker (Sophie) + support (Clive) + control (Belinda). Combos chains, not individual power.

### 7.3 Mage Tank Key Systems (Primary Reference)

- **Classless System:** No predefined classes — identity from 8 attributes + skill acquisition + attunement.
- **Non-Linear Stat Scaling:** Fortitude gives MORE HP per point as you invest more, creating "go big or go home" build decisions.
- **Evolution Milestones:** At stat thresholds (10/30/50/70/100), choose from branching permanent upgrades. Same base stat, radically different evolutions based on playstyle.
- **Delve System:** Dungeons with selectable difficulty, Dungeon Cores as semi-sentient NPCs, System Phases as world-level meta-progression.
- **System Personality:** The System writes snarky, fourth-wall-adjacent descriptions. Humor is mechanically embedded — tooltips and notifications have voice.

### 7.4 Game Design Patterns (Selected for V2)

| System | Source | Why Selected |
|--------|--------|-------------|
| **Break/Shield** | Octopath Traveler | Creates "chip then burst" tactical loop. Each enemy has a shield number + weakness icons. Hitting weakness reduces shield. At 0 = Broken (loses turn, takes bonus damage). Immediately readable, low UI complexity. |
| **AP Budget** | Octopath BP / Expedition 33 | Multi-action turns with resource management. Accumulates over turns, can be spent to amplify actions. Rewards patience and planning. |
| **Discoverable Weaknesses** | Octopath | Weaknesses start as "?" — revealed through combat or recon. Creates research phase, rewards replaying encounters. |
| **Action Economy** | D&D 5e / BG3 | Action + Bonus Action + Movement = 3 decisions per turn. Immediately triples decision space. |
| **Party Combat UI** | Octopath / FFX | Turn order timeline (top), party status (bottom-left), action menu (bottom). Standard proven pattern. |

---

## 8. Technical Constraints

### 8.1 Stack (Unchanged from V1)
| Layer | Technology |
|-------|-----------|
| Framework | Phaser 3 |
| Language | TypeScript |
| Build | Vite |
| Maps | Tiled Editor |
| Art | Free placeholder pixel art |
| Audio | Deferred |

### 8.2 Architecture Requirements (New for V2)
- **Modular design** — dungeons, world containers, and narrative features as pluggable modules
- **Pure logic systems** — continue V1 pattern of Phaser-independent game logic (BattleSystem, etc.) for testability
- **Extended save schema** — save/load must handle essences, skill levels, rank, party state

### 8.3 Testing Strategy (New for V2)
- **Unit tests** — pure logic for all new systems (essence, rank, damage calc, skill leveling)
- **Integration tests** — combat system interactions (Break + weakness + AP + party synergy)
- **Scene tests** — game flow verification (battle scene transitions, party management, save/load with new data)

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep | High | High | Multiple plan iterations before implementation; tight phase boundaries; same-surface-area constraint (one dungeon) |
| Systems don't feel fun | Medium | High | Playtest each system in isolation before combining; iterate on feel |
| Combinatorial explosion | Medium | High | Build foundationally — start with 2-3 essences, expand; simple to learn, complex to combine |
| Technical complexity (state/save) | Medium | Medium | Modular architecture; comprehensive test coverage; pure logic separation |
| Combat feels too complex for players | Medium | Medium | Individual mechanics are simple; tutorial through System interface; complexity is opt-in through combinations |
| Motivation loss from scope size | Low | High | Tight phases with visible progress; each phase produces playable improvements |

---

## 10. Long-Term Vision (V3+)

*Documented for architectural planning, NOT V2 scope:*

- **Multiple modular dungeons** with distinct themes, difficulty, and loot
- **Overworld** connecting dungeon entrances, towns, points of interest
- **Homebase / hub world** for party management, crafting, narrative beats
- **Full isekai narrative arc** with the MC's journey through the magical world
- **Art upgrade** — cohesive pixel art style replacing placeholders
- **Audio** — background music, sound effects, ambient audio
- **Deeper party narratives** — individual character arcs, loyalty systems
- **Monster ecology** — magical concentrations/anomalies spawning monsters (HWFWM-style mana saturation/density)
- **Economy system** — spirit coin-style dual-use currency
- **Guild/faction system** — Adventure Society-style quest infrastructure

---

## 11. Satisfaction Checklist

- [x] Problem defined (make combat and progression feel good/shareable)
- [x] Users identified (self + friends, shifted toward shareable)
- [x] Success metrics measurable (tactical combat, meaningful builds, party synergy)
- [x] Urgency understood (no deadline, quality over speed)
- [x] Must-haves listed (20 requirements across 5 categories)
- [x] Nice-to-haves separated (narrative depth, art, audio → V3)
- [x] Out of scope explicit (12 exclusions documented)
- [x] Timeline known (no rush, iterative phases with multiple plan reviews)
- [x] Technical constraints captured (build on V1, modular architecture, testing strategy)
- [x] Dependencies identified (plan iterations needed, playtest-per-system approach, foundational-first build order)

---

## 12. Open Questions

*To be resolved in architecture phase:*

1. How many essences to start with in V2? (2-3 recommended for foundational phase)
2. How many abilities per essence in V2? (5 per HWFWM, but may simplify for V2)
3. How many rank thresholds are achievable in one dungeon? (Iron→Bronze likely sufficient for V2)
4. AP budget numbers — how many AP per turn? How much do actions cost?
5. Break/Shield numbers — how many shield points per enemy? How does shield interact with rank?
6. How does skill-use leveling interact with rank thresholds? (Does rank-up require skill levels?)
7. What recon abilities exist for weakness discovery? (Party role or item-based?)
8. Save schema design for essences, skill levels, rank, party state
9. Modular architecture patterns — how to structure dungeon/world containers in Phaser 3

---

## Next Phase

**Station 2: Architecture**
- Define essence types and ability framework
- Design combat system flow (AP + Break/Shield + weaknesses)
- Plan modular architecture for dungeon/world containers
- Create phased roadmap with iterative complexity layering
- Define observable success criteria per phase

Trigger: `/factory:architect`
