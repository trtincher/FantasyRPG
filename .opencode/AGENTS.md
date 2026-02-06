# Agents

Custom agents that encode unique Deep Seas processes. For general development, use OpenCode's built-in `build` agent.

---

## discovery-agent

Interactive PRD gathering through iterative questioning.

**Why custom:** Encodes a specific 4-round questioning methodology, not just "write a PRD."

**Process:**
1. Ingest context (notes, transcripts)
2. Analyze known vs. unknown
3. Question rounds:
   - Round 1: Big Picture (problem, success, urgency)
   - Round 2: Scope (V1 vs later, exclusions)
   - Round 3: Technical (integrations, constraints)
   - Round 4: Risks (uncertainty, blockers)
4. Validate satisfaction criteria before finalizing

**Satisfaction Criteria:**
- [ ] Problem defined
- [ ] Users identified
- [ ] Success metrics measurable
- [ ] Must-have vs nice-to-have separated
- [ ] Out of scope explicit
- [ ] Timeline/constraints captured
- [ ] Dependencies identified

**Output:** `docs/01_discovery.md`

---

## architect

Goal-backward roadmap creation with 100% requirement coverage.

**Why custom:** Encodes requirement-to-phase derivation methodology, not just "make a plan."

**Process:**
1. Extract requirements with IDs from PRD
2. Group by category and dependencies
3. Derive phases from natural boundaries (not arbitrary layers)
4. For each phase, derive 2-5 observable success criteria (user perspective)
5. Validate 100% requirement coverage - no orphans

**Anti-patterns to avoid:**
- Horizontal layers (all models → all APIs → all UI)
- Vague success criteria ("auth works")
- Missing requirement mappings

**Output:** `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`

---

## verifier

Goal-backward verification: task completion ≠ goal achievement.

**Why custom:** Encodes 3-level artifact checking and stub detection, not just "review the code."

**Three-Level Check:**
1. **Exists:** File present?
2. **Substantive:** >15 lines, no TODO/placeholder, has exports?
3. **Wired:** Imported AND used somewhere?

| Exists | Substantive | Wired | Status |
|--------|-------------|-------|--------|
| ✓ | ✓ | ✓ | ✅ Verified |
| ✓ | ✓ | ✗ | ⚠️ Orphaned |
| ✓ | ✗ | - | ❌ Stub |
| ✗ | - | - | ❌ Missing |

**Stub Detection Patterns:**
```javascript
return <div>Component</div>    // Empty component
return null                     // Placeholder
onClick={() => {}}              // Empty handler
return Response.json([])        // No real data
```

**Output:** `.planning/phases/{phase}/{phase}-VERIFICATION.md`
