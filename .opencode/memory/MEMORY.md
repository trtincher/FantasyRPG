---
tags: [memory, project-context, opencode, deep-seas]
created: 2026-01-19
updated: 2026-01-31
type: memory
status: active
project: deep-seas-ops
---

# Project Memory: Deep Seas Operations

> This file is automatically loaded at session start via the OpenCode plugin.

## Quick Context

**Project**: Deep Seas operations repository - SOPs, playbooks, and templates for strategic technology advisory firm
**Current Focus**: Migrated to OpenCode with streamlined factory workflow
**Key Constraint**: This is a documentation-only repo (no executable code) - all work is markdown

---

## Active Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Migrate from .claude/ to .opencode/ | Streamline around factory model, reduce complexity | 2026-01-31 |
| Factory-first architecture | 7-station workflow (Discovery → Report) as primary model | 2026-01-31 |
| Consolidate 25 agents into AGENTS.md | Single searchable file vs scattered files | 2026-01-31 |
| 4 essential skills only | gsd, git, browser, research - others inline in factory stations | 2026-01-31 |

---

## Established Patterns

### Documentation Standards
- All markdown files MUST have Obsidian-compatible YAML frontmatter
- Required fields: `tags`, `type`, `created`, `updated`, `status`
- Types: sop, stack, research, recommendation, report, guide, memory

### OpenCode Organization
- Factory stations in `.opencode/factory/`
- Skills in `.opencode/skills/` (4 essential only)
- Templates in `.opencode/templates/`
- Agents consolidated in `.opencode/AGENTS.md`
- Plugin logic in `.opencode/plugin.ts`

### LIFT Methodology
- All work sized: XS(1), S(2), M(3), L(5), XL(8), XXL(13+) lifts
- Categories: 🚀 Launch, 📈 Improve, 🔧 Fix, 🧪 Test
- Target: 8-12 lifts per developer per week

---

## Factory Workflow

```
Discovery → Architect → Plan → Develop → Review → Deploy → Report
    1          2         3        4         5        6        7
```

| Station | Command | Output |
|---------|---------|--------|
| 1 | `/factory:discovery` | PRD |
| 2 | `/factory:architect` | Roadmap |
| 3 | `/factory:plan` | Plans |
| 4 | `/factory:develop` | Code |
| 5 | `/factory:review` | Verification |
| 6 | `/factory:deploy` | Production |
| 7 | `/factory:report` | Insights |

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Master project instructions |
| `.opencode/FACTORY.md` | Factory workflow overview |
| `.opencode/AGENTS.md` | Consolidated agent definitions |
| `.opencode/plugin.ts` | OpenCode hooks and tools |
| `docs/factory_v0.md` | Factory documentation reference |

---

## Don't Forget

- Factory-first: Use `/factory:` commands instead of direct work
- Skills-first: Load appropriate skill for specialized behavior
- Context budget: Plans should complete within ~50% context
- Atomic commits: One task, one commit

---

## Session Log

### 2026-01-31 - OpenCode Migration
- Migrated from .claude/ to .opencode/ structure
- Consolidated 25 agents into single AGENTS.md
- Created 7 factory station files
- Reduced skills from 10 to 4 essential (gsd, git, browser, research)
- Created TypeScript plugin with hooks and tools

---

*Last updated: 2026-01-31*
