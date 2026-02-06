# FantasyRPG Client Interview Transcript

**Session Started:** Feb 5, 2026  
**Status:** COMPLETE

---

## Initial Client Input

> I want to build a basic fantasyRPG with basic rpg mechanics. Think d&d light. The exercise here is more about learning how to build an rpg game at a more general level more than particulars around the specifics of the game. So it should have your rpg elements like characters, npcs, turn based battle mechanics, and character attributes and states. I really don't know the best way to go about building this.

### Key Points Extracted:
- **Type:** Basic fantasy RPG ("D&D light")
- **Primary Goal:** Learning exercise—understanding how to build an RPG at a general level
- **Secondary Goal:** Specifics of the game are less important than the learning
- **Mentioned Elements:**
  - Characters
  - NPCs
  - Turn-based battle mechanics
  - Character attributes and stats

---

## Round 1: Big Picture

### Q1: Core Problem / Desired Experience
**Question:** What's the core problem you're solving—or put differently, what do you want to *experience* when this is done? Is this primarily a learning project where the finished game is secondary, or do you want something actually playable/shareable at the end?

**Answer:** Want something playable, but primary goal is learning how this type of game is made. Keeping scope very small—one overworld map with a few points of interest, where at least one is an actual battle.

### Q2: Intended Player
**Question:** Who's the intended player? Just you tinkering? Friends testing it? Eventually public?

**Answer:** Primarily me, maybe some friends. Mostly a learning experience, but should be playable locally.

### Q3: Success Criteria for V1
**Question:** What does "success" look like for V1?

**Answer:** A ~15-minute dungeon crawl with a couple of story beats and a couple of encounters.

### Q4: Timeline/Urgency
**Question:** Is there urgency or a deadline?

**Answer:** No real urgency—this is mostly for myself and for learning.

---

## Round 2: Scope

### Q5: V1 Must-Haves vs Nice-to-Haves
**Question:** Using Pokemon Red/Blue as a reference, which elements are must-haves for V1?

**Answer:** All of the following confirmed as V1 must-haves:

| Element | V1 Status |
|---------|-----------|
| Name your character | ✅ Must-have |
| Choose a "class" (or starter type affecting playstyle) | ✅ Must-have |
| Leveling / XP | ✅ Must-have |
| Simple inventory (potions, key items) | ✅ Must-have |
| Multiple enemy types | ✅ Must-have |
| Boss fight at end | ✅ Must-have |
| Story dialogue / NPC text | ✅ Must-have |
| Save/Load | ✅ Must-have |
| Sound/Music | ✅ Must-have |

### Q6: What's Explicitly Out of Scope?
**Question:** What are you *not* building?

**Answer:**
- Multiplayer (explicitly single-player only)
- Mobile
- Browser-based not required
- Nothing more complex than Pokemon Red/Blue scale

### Reference Point
**Pokemon Red/Blue** — Simple tile-based movement, turn-based battles, retro 2D graphics, menu-driven UI. This is the complexity ceiling.

---

## Round 3: Technical

### Q7: Technical Background
**Question:** What's your technical background?

**Answer:**
- **Frontend:** React, TypeScript, JavaScript, CSS
- **Backend:** Rails, Node
- **Databases:** PostgreSQL
- **Game Dev:** First time—no prior experience

### Q8: Platform Target
**Question:** What platforms need to be supported?

**Answer:** Mac only. Local execution is fine—no need to distribute executables.

### Q9: Preferences/Constraints
**Question:** Stack preferences?

**Answer:** TypeScript preferred, or whatever is standard for building this type of game. Open to recommendations.

### Q10: Assets
**Question:** Art and sound approach?

**Answer:** Free placeholder pixel art is fine. Same for sound/music.

### Stack Recommendation (to be detailed in architecture phase)
TypeScript + 2D game framework (Phaser.js or Excalibur.js) would leverage existing skills. Godot is the indie industry standard but requires learning GDScript.

---

## Round 4: Risks & Unknowns

### Q11: What are you most uncertain about?
**Question:** What aspects are you most uncertain about?

**Answer:** 
- Understands turn-based battle systems conceptually from tabletop gaming
- Uncertain how to translate that into code structure

### Q12: What could block you?
**Question:** What could block progress?

**Answer:** Scope creep. Wants to keep scope very tight for this iteration.

### Q13: Known Unknowns
**Question:** What do you know you don't know?

**Answer:**
- How game loops work
- How sprite/tile grid movement works
- State management feels more familiar from web dev background

---

## Discovery Summary

### Project Vision
A **learning-focused** Pokemon Red/Blue-style RPG: ~15-minute dungeon crawl with story beats and turn-based combat. Single-player, Mac-only, local execution.

### V1 Scope (Tight)
- One small overworld/dungeon map
- Character creation (name + class/starter choice)
- Tile-based movement
- Turn-based combat system
- Multiple enemy types + boss encounter
- Simple inventory (potions, key items)
- Leveling/XP system
- Story dialogue/NPC interactions
- Save/Load functionality
- Placeholder pixel art + sounds

### Out of Scope (Enforced)
- Multiplayer
- Mobile
- Browser deployment
- Anything beyond Pokemon R/B complexity
- Procedural generation
- Complex crafting systems
- Open world

### Technical Direction
- **Stack:** TypeScript-based (specific framework TBD in architecture phase)
- **Platform:** Mac, local execution
- **Assets:** Free placeholders

### Key Risks to Manage
1. **Scope creep** — Primary risk; enforce tight boundaries
2. **Learning curve** — Game loops, tile movement, battle system architecture are new concepts
3. **Translation gap** — Knows tabletop battle design, needs to learn code structure

### Satisfaction Criteria
- [x] Problem defined (learning how RPGs are built)
- [x] Users identified (self, maybe friends)
- [x] Success metrics measurable (15-min playable dungeon crawl)
- [x] Must-have vs nice-to-have separated
- [x] Out of scope explicit
- [x] Timeline/constraints captured (no rush, learning focus)
- [x] Dependencies identified (need to learn game loops, tile movement)

---

## Next Steps

Discovery is complete. Ready to proceed to **Architecture Phase**:
1. Finalize tech stack recommendation
2. Create requirements document with IDs
3. Build phased roadmap with observable success criteria

To continue, say:
> "Let's move to architecture for FantasyRPG"
