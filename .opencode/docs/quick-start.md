# Game Studio Agent Architecture -- Quick Start Guide

## What Is This?

This is a complete OpenCode V2 agent architecture for game development. It
organizes 49 specialized AI agents into a studio hierarchy that mirrors
real game development teams, with defined responsibilities, delegation
rules, and coordination protocols. It includes engine-specialist agents
for Godot, Unity, and Unreal — each with dedicated sub-specialists for
major engine subsystems. All design agents and templates are grounded in
established game design theory (MDA Framework, Self-Determination Theory,
Flow State, Bartle Player Types). Use whichever engine set matches your project.

## The Default Path: Rigor Minimal

`modes.rigor` defaults to `minimal` (`/start` infers it from what you describe and shows it
before saving; `/settings` changes it any time). At `minimal` the path to code is four steps:

1. `/setup-engine` -- configure the engine
2. `/brainstorm` -- writes the one-page `design/game-brief.md`, in place of the
   concept doc, systems decomposition and per-system GDDs
3. `/create-stories` -- turns the brief's MVP list into stories under
   `production/epics/<slug>/`; the brief's build order is the plan, so there is
   no `/create-epics` or `/sprint-plan`
4. `/dev-story` then `/story-done`, story by story -- `/story-done` names the
   next story, and `/help` knows this route

Nothing at `minimal` runs `/gate-check`, so `project.stage` stays at Concept.
Every skill still runs at any tier. The trade: no GDDs catch design problems
before code. Raise rigor with `/settings` when the game outgrows the brief;
`standard` and `full` are the longer pipelines under
[First Steps for a New Project](#first-steps-for-a-new-project).

## How to Use

### 1. Understand the Hierarchy

There are three tiers of agents:

- **Tier 1 — Directors** who make high-level decisions (they run on Opus)
  - `creative-director` -- vision and creative conflict resolution
  - `technical-director` -- architecture and technology decisions
  - `producer` -- scheduling, coordination, and risk management

- **Tier 2 — Department leads** who own their domain
  - `game-designer`, `lead-programmer`, `art-director`, `audio-director`,
    `narrative-director`, `qa-lead`, `release-manager`, `localization-lead`

- **Tier 3 — Specialists** who execute within their domain
  - Designers, programmers, artists, writers, testers, engineers

The tiers are seniority of role. Most agents run on your session's model; the
agent file's own `model:` line says which do not
(`.opencode/docs/model-tiers.md`).

### 2. Pick the Right Agent for the Job

Ask yourself: "What department would handle this in a real studio?"

| I need to... | Use this agent |
|-------------|---------------|
| Design a new mechanic | `game-designer` |
| Write combat code | `gameplay-programmer` |
| Create a shader | `technical-artist` |
| Write dialogue | `writer` |
| Plan the next sprint | `producer` |
| Review code quality | `lead-programmer` |
| Write test cases | `qa-tester` |
| Design a level | `level-designer` |
| Fix a performance problem | `performance-analyst` |
| Set up CI/CD | `devops-engineer` |
| Design a loot table | `economy-designer` |
| Resolve a creative conflict | `creative-director` |
| Make an architecture decision | `technical-director` |
| Manage a release | `release-manager` |
| Prepare strings for translation | `localization-lead` |
| Test a mechanic idea quickly | `prototyper` |
| Review code for security issues | `security-engineer` |
| Check accessibility compliance | `accessibility-specialist` |
| Get Unreal Engine advice | `unreal-specialist` |
| Get Unity advice | `unity-specialist` |
| Get Godot advice | `godot-specialist` |
| Design GAS abilities/effects | `ue-gas-specialist` |
| Define BP/C++ boundaries | `ue-blueprint-specialist` |
| Implement UE replication | `ue-replication-specialist` |
| Build UMG/CommonUI widgets | `ue-umg-specialist` |
| Design DOTS/ECS architecture | `unity-dots-specialist` |
| Write Unity shaders/VFX | `unity-shader-specialist` |
| Manage Addressable assets | `unity-addressables-specialist` |
| Build UI Toolkit/UGUI screens | `unity-ui-specialist` |
| Write idiomatic GDScript | `godot-gdscript-specialist` |
| Write Godot C# code | `godot-csharp-specialist` |
| Create Godot shaders | `godot-shader-specialist` |
| Build GDExtension modules | `godot-gdextension-specialist` |
| Plan live events and seasons | `live-ops-designer` |
| Write patch notes for players | `community-manager` |
| Brainstorm a new game idea | Use `/brainstorm` skill |

### 3. Use Slash Commands for Common Tasks

| Command | What it does |
|---------|-------------|
| `/start` | First-time onboarding — asks where you are, guides you to the right workflow |
| `/help` | Context-aware "what do I do next?" — reads your current phase and artifacts |
| `/project-stage-detect` | Analyze project state, detect stage, identify gaps |
| `/setup-engine` | Configure engine + version, populate reference docs |
| `/adopt` | Brownfield audit and migration plan for existing projects |
| `/brainstorm` | Guided game concept ideation from scratch |
| `/map-systems` | Decompose concept into systems, map dependencies, guide per-system GDDs |
| `/design-system` | Guided, section-by-section GDD authoring for a single game system |
| `/quick-design` | Lightweight spec for small changes — tuning, tweaks, minor additions |
| `/review-all-gdds` | Cross-GDD consistency and game design theory review |
| `/propagate-design-change` | Find ADRs and stories affected by a GDD change |
| `/art-bible` | Guided, section-by-section Art Bible authoring — creates visual identity spec before asset production |
| `/asset-spec` | Generate per-asset visual specifications and AI generation prompts from GDDs or character profiles |
| `/ux-design` | Author UX specs (screen/flow, HUD, interaction patterns) |
| `/ux-review` | Validate UX specs for accessibility and GDD alignment |
| `/create-architecture` | Master architecture document for the game |
| `/architecture-decision` | Creates an ADR |
| `/architecture-review` | Validate all ADRs, dependency ordering, GDD traceability — writes the index to `docs/architecture/requirements-traceability.md` |

*(Full command list: 74 skills — see `.opencode/skills/` or run `/help` for a live index.)*

## First Steps for a New Project

### Prerequisites

See [Setup Requirements](setup-requirements.md) for Git, OpenCode V2, Python 3, Bash, and optional `jq`.

### Quick Start (minimal rigor)

```bash
# 1. Start OpenCode at the repo root
opencode

# 2. Run the onboarding skill
/start
```

`/start` will:
1. Ask which engine (Godot/Unity/Unreal) and version
2. Write `project.yaml` and engine reference docs
3. Offer the minimal pipeline: `/brainstorm` → `/create-stories` → `/dev-story` → `/story-done`
4. Create `AGENTS.local.md` from template if you want personal overrides

### Standard rigor (design docs before code)

```bash
/start
# choose "standard" when asked for rigor
/brainstorm
/map-systems
/design-system   # per system
/create-stories
/dev-story
/story-done
```

### Full rigor (all phases, gate checks)

```bash
/start
# choose "full"
/brainstorm
/map-systems
/design-system
/review-all-gdds
/create-architecture
/architecture-review
/create-stories
/sprint-plan
/dev-story
/gate-check
/story-done
```

## File Structure Reference

```
opencode.json                      -- Root OpenCode V2 config (permissions, instructions, plugins)
AGENTS.md                          -- Master instructions (read first, ~80 lines)
project.yaml                       -- Machine-readable project config (engine, modes, stage) — source of truth
.opencode/
  agents/                          -- 49 agent definitions (V2 frontmatter: mode: subagent, steps, permissions[])
  skills/                          -- 74 slash command definitions (YAML frontmatter)
  hooks/                           -- 15 bash hook scripts (invoked by the ccgs plugin)
  rules/                           -- 14 path-specific rule files
  plugins/
    ccgs/                          -- Hook adapter plugin (maps V2 events to bash hooks)
  docs/
    quick-start.md                 -- This file
    technical-preferences.md       -- Legacy fallback for project.yaml config (mirror; see project.yaml at repo root)
    coding-standards.md            -- Coding and design doc standards
    coordination-rules.md          -- Agent coordination rules
    context-management.md          -- Context budgets and compaction instructions
    directory-structure.md         -- Project directory layout
    workflow-catalog.yaml          -- 7-phase pipeline definition (read by /help)
    setup-requirements.md          -- System prerequisites (Git Bash, jq, Python)
    AGENTS-local-template.md       -- Personal AGENTS.local.md guide (gitignored overrides)
    templates/                     -- 62 document templates (+ per-section guidance)
```

## Key OpenCode V2 Differences from V1 / Claude Code

| Area | V1 / Claude Code | OpenCode V2 (this template) |
|------|------------------|-----------------------------|
| Config file | `.claude/settings.json` | `opencode.json` (project root) |
| Hook wiring | JSON in settings.json | Local plugin `.opencode/plugins/ccgs` |
| Instructions file | `CLAUDE.md` (fallback) | `AGENTS.md` (nested files auto-discovered on demand) |
| Personal overrides | `CLAUDE.local.md` | `AGENTS.local.md` (listed in `instructions` array) |
| Agent definition | `.claude/agents/*.md` (V1 frontmatter) | `.opencode/agents/*.md` (V2 frontmatter: `mode: subagent`, `steps`, `permissions[]`) |
| Skill definition | `.claude/skills/*/SKILL.md` | `.opencode/skills/*/SKILL.md` (unchanged) |
| Permission mode | `default` / `auto` / `bypass` | Ordered `permissions` array in `opencode.json` (ask-first shell, allowlist) |
| Model tier override | Skill `model:` switches model mid-turn | No mid-turn switch; agents may pin `model:` in frontmatter |
| Status line | `statusline.sh` | Not ported (no V2 equivalent) |
| Subagent model force | `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` | `OPENCODE_SUBAGENT_MODEL_FORCE` env var |

## Collaboration Protocol (unchanged)

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question → Options → Decision → Draft → Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
  (exempt: `active.md` appends, agent memory, a subagent's new file at the path
  its orchestrating skill named; see `.opencode/rules/agent-memory.md`)
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction
- A skipped or dismissed question is not an answer: act on nothing, re-ask in
  plain text and wait
- Started outside this file's folder? Warn first: hooks, deny rules and the
  ask-first mode load only when OpenCode starts at the repo root

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.

> **First session?** If the project has no engine configured and no game concept,
> run `/start` to begin the guided onboarding flow.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Hooks don't run | Ensure `bash` is on PATH (Git Bash on Windows). Set `CCGS_BASH` if Git Bash is not at `C:\Program Files\Git\bin\bash.exe`. |
| `validate-read.sh` blocks a read | Read the file by section: use `offset`/`limit` with the headings it printed, or set `features.read_guard: off` in `project.yaml`. |
| Permission prompt on every shell command | Normal — ask-first is the default. Add a rule to `.opencode/settings.local.json` for your frequent commands. |
| Subagent runs on wrong model | Check the agent's frontmatter `model:`; pins override session model. Use `OPENCODE_SUBAGENT_MODEL_FORCE=1` to ignore pins. |
| Nested `AGENTS.md` not loading | OpenCode V2 discovers `AGENTS.md` files on-demand as the agent explores directories between the target file and the workspace root. |

## Next Reading

- [Setup Requirements](setup-requirements.md) — prerequisites and verification
- [Hooks Reference](hooks-reference.md) — all 15 hooks, events, and advisories
- [Agent Roster](agent-roster.md) — 49 agents with domains
- [Model Tiers](model-tiers.md) — tier conventions and agent pins
- [Context Management](context-management.md) — budgets, compaction, session-state checkpoint
- [Coordination Rules](coordination-rules.md) — delegation, handoff, review gates
- [Directory Structure](directory-structure.md) — where everything lives