<p align="center">
  <h1 align="center">OpenCode Game Studios</h1>
  <p align="center">
    Turn a single OpenCode session into a full game development studio.
    <br />
    49 agents. 74 skills. One coordinated AI team.
  </p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href=".opencode/agents"><img src="https://img.shields.io/badge/agents-49-blueviolet" alt="49 Agents"></a>
  <a href=".opencode/skills"><img src="https://img.shields.io/badge/skills-74-green" alt="74 Skills"></a>
  <a href=".opencode/hooks"><img src="https://img.shields.io/badge/hooks-15-orange" alt="15 Hooks"></a>
  <a href=".opencode/rules"><img src="https://img.shields.io/badge/rules-14-red" alt="14 Rules"></a>
  <a href="https://opencode.ai/v2/docs"><img src="https://img.shields.io/badge/built%20for-OpenCode%20V2-5c6bc0?logo=opencode" alt="Built for OpenCode V2"></a>
</p>

---

## Why This Exists

Look, building a game by yourself with AI is awesome—until you realize you’re basically running a company with an intern who has severe ADHD and zero supervision.

Nobody is stopping you from hardcoding garbage, skipping basic design docs, or pasting spaghetti code until the whole thing collapses. There’s no QA, no design review, and no one sitting there asking the hard question: "Hey... what the hell are we actually making here?"

That’s where **Opencode Game Studios** comes in. It takes your lone AI assistant and forces it to act like a real, functioning studio instead of a chaotic free-for-all.

Instead of just one overworked assistant guessing what you want, you get 49 specialized agents structured like an actual company. You’ve got Directors protecting the vision, Department Leads owning their domain, and Specialists doing the heavy lifting. Everyone has a specific job, a chain of command, and actual quality checks so things don't blow up in production.

You’re still the boss calling all the shots. But now, you actually have a team behind you to ask the right questions, call out your bad ideas before they happen, and keep your project on track from the first high thought all the way to launch.

---

## Table of Contents

- [What's Included](#whats-included)
- [Studio Hierarchy](#studio-hierarchy)
- [Slash Commands](#slash-commands)
- [Does it produce games, or documents?](#does-it-produce-games-or-documents)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Upgrading](#upgrading)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design Philosophy](#design-philosophy)
- [Customization](#customization)
- [Platform Support](#platform-support)
- [Community](#community)
- [Supporting This Project](#supporting-this-project)
- [License](#license)

---

## What's Included

| Category | Count | Description |
|----------|-------|-------------|
| **Agents** | 49 | Specialized subagents across design, programming, art, audio, narrative, QA, and production |
| **Skills** | 74 | Slash commands for every workflow phase (`/start`, `/design-system`, `/create-epics`, `/create-stories`, `/dev-story`, `/story-done`, etc.) |
| **Hooks** | 15 | Automated validation on commits, pushes, asset changes, design-doc reads, writes and registries, session lifecycle, agent audit trail, and gap detection (via local `ccgs` plugin) |
| **Rules** | 14 | Path-scoped coding standards enforced when editing gameplay, engine, AI, UI, network code, scene and asset files, and more |
| **Templates** | 62 | Document templates for GDDs, UX specs, ADRs, sprint plans, HUD design, accessibility, and more |

## Studio Hierarchy

Agents are organized into three tiers, matching how real studios operate:

```
Tier 1 — Directors
  creative-director    technical-director    producer

Tier 2 — Department Leads
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead

Tier 3 — Specialists
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  performance-analyst  devops-engineer       analytics-engineer
  security-engineer    qa-tester             accessibility-specialist
  live-ops-designer    community-manager
```

Each agent declares a model in its V2 frontmatter: the three directors pin Opus,
`lead-programmer` and fifteen specialists pin Sonnet, and the remaining thirty
**inherit your session's model**. Treat the tiers as seniority of role, not as
a billing plan — most of the studio runs on whatever model you are already using.

### Engine Specialists

The template includes agent sets for all three major engines. Use the set that matches your project:

| Engine | Lead Agent | Sub-Specialists |
|--------|-----------|-----------------|
| **Godot 4** | `godot-specialist` | GDScript, Shaders, GDExtension |
| **Unity** | `unity-specialist` | DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit |
| **Unreal Engine 5** | `unreal-specialist` | GAS, Blueprints, Replication, UMG/CommonUI |

## Slash Commands

Type `/` in OpenCode to access all 74 skills:

**Onboarding & Navigation**
`/start` `/help` `/project-stage-detect` `/setup-engine` `/adopt` `/settings`

**Game Design**
`/brainstorm` `/map-systems` `/design-system` `/quick-design` `/review-all-gdds` `/propagate-design-change`

**Art & Assets**
`/art-bible` `/asset-spec` `/asset-audit`

**UX & Interface Design**
`/ux-design` `/ux-review`

**Architecture**
`/create-architecture` `/architecture-decision` `/architecture-review` `/create-control-manifest`

**Stories & Sprints**
`/create-epics` `/create-stories` `/dev-story` `/sprint-plan` `/sprint-status` `/story-readiness` `/story-done` `/estimate`

**Reviews & Analysis**
`/design-review` `/code-review` `/balance-check` `/content-audit` `/scope-check` `/perf-profile` `/tech-debt` `/gate-check` `/consistency-check` `/security-audit`

**QA & Testing**
`/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-setup` `/test-helpers` `/test-evidence-review` `/test-flakiness` `/skill-test` `/skill-improve`

**Production**
`/milestone-review` `/retrospective` `/bug-report` `/bug-triage` `/reverse-document` `/playtest-report`

**Release**
`/release-checklist` `/launch-checklist` `/changelog` `/patch-notes` `/hotfix` `/day-one-patch`

**Creative & Content**
`/prototype` `/vertical-slice` `/onboard` `/localize`

**Team Orchestration** (coordinate multiple agents on a single feature)
`/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` `/team-audio` `/team-level` `/team-live-ops` `/team-qa`

## Does it produce games, or documents?

A fair question, and the answer is a measurement rather than a sample project.
Four games were built from one brief at different `modes.rigor` levels and the
documents each wrote **before its first line of game code** were counted:

| `modes.rigor` | Docs before first line of game code | Time |
|---|---:|---:|
| `minimal` | **1** (the one-page brief) | 0 min |
| `standard` | 30 | 58 min |

All of them produced a running, tested game. Two blind reviewers and a human
playtest then ranked the `standard` build **last** — the extra 29 documents
bought traceability, not a better game.

### It runs the game and looks at it

The measurement above is about cost. The other half is whether the thing works,
and for a game that means someone has to *look* at it — a passing test says
nothing about a menu drawn off-screen. So a story that changes anything the
player sees is not closed until the game has been launched, observed, and a
screenshot retained in `production/qa/evidence/`. A parse check is not a run.
This holds at every rigor level, including `minimal`, where automated tests are
waived but the look is not.

The games themselves are deliberately **not** shipped here: this is a template
you clone to start your own project, and somebody else's game in your repo is
clutter, not evidence.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [OpenCode V2](https://opencode.ai/v2/docs) — native installer: `curl -fsSL https://opencode.ai/v2/install | bash` (macOS/Linux/WSL) or `irm https://opencode.ai/v2/install.ps1 | iex` (Windows PowerShell); npm also works: `npm install -g @opencode/cli` (Node.js 22+)
- [Python 3](https://www.python.org/) — reads `project.yaml` for every skill and hook; without it every setting silently falls back to its default
- **Bash** — runs every hook; built into macOS and Linux, and on Windows it comes with [Git for Windows](https://git-scm.com/downloads/win). The `ccgs` plugin prefers Git Bash at `C:\Program Files\Git\bin\bash.exe`; set `CCGS_BASH` if installed elsewhere.
- **Recommended**: [jq](https://jqlang.github.io/jq/) (for hook validation)

Hooks fail gracefully if optional tools are missing — you just lose validation — with one deliberate exception: a commit that stages data JSON is blocked when there is no Python to validate it.

### Setup

1. **Clone or use as template**:
   ```bash
   git clone https://github.com/idrisawad/OpenCode-Game-Studios.git my-game
   cd my-game
   ```

2. **Open OpenCode in the project's root folder** (the one holding
   `opencode.json`, `AGENTS.md` and `project.yaml`) and start a session:
   ```bash
   opencode
   ```
   Starting it in a subfolder such as `src/` skips the project's hooks, deny
   rules and ask-first permission mode.

3. **Run `/start`** — the system asks where you are (no idea, vague concept,
   clear design, existing work) and guides you to the right workflow. No assumptions.

   Or jump directly to a specific skill if you already know what you need:
   - `/brainstorm` — explore game ideas from scratch
   - `/setup-engine godot 4.7` — configure your engine if you already know
   - `/project-stage-detect` — analyze an existing project

## Configuration

`project.yaml` at the repo root is the single source of truth for how the
studio behaves on your project — engine, naming conventions, and a `modes`
block that controls how much process every skill enforces. `/start` writes it
for you; you rarely need to hand-edit it.

The one question that matters most is **`modes.rigor`** — `minimal`, `standard`,
or `full`. It's a single front door over six separate knobs (`workflow` —
which GDD sections are required, `docs.density`, `qa.level`,
`story_granularity`, `review_mode` — how many director agents review your work,
and `team.size`), so `/start` asks it once instead of six times:

- **`minimal`** (default) — jam-game speed. No GDDs required, terse docs, minimal QA evidence, solo review. `/start` → `/setup-engine` → `/brainstorm` (a one-page brief) → `/create-stories` → `/dev-story` ↔ `/story-done`.
- **`standard`** — 5 required GDD sections, balanced doc depth, standard QA evidence, lean review.
- **`full`** — all 8 GDD sections, thorough docs, full QA evidence on every story type, full director review.

`minimal` is the default because the heavier tier costs more to reach working
code without producing a better result, and gives nothing back when someone new
picks the project up. Raise it in one `/settings` call when your project grows
— `/help` and `/gate-check` will suggest it when they see the signs.

Two escape hatches keep one setting from being a blunt instrument.
**`system_overrides`** holds a single system to a higher standard than the rest
of the project — your combat system gets the full treatment while everything
else stays light. **`testing.strict`** sets, per test type (logic, integration,
visual, UI, config), whether missing evidence blocks a story or merely warns.

Any of the six underlying knobs can still be set individually if you want a mix
(e.g. `workflow: full` with `docs.density: terse` — comprehensive but compact).
Two of them — `review_mode` (`full` / `lean` / `solo`) and `team.size` — are
also **personal**: rigor sets the team-wide default, but you can override them
per-developer in a gitignored `project.local.yaml` without touching the shared
config. `modes.automation` (how often the AI pauses to ask before it acts) sits
outside rigor and is likewise personally overridable.

View or change any setting with the `/settings` skill:

```
/settings                              # view effective config
/settings modes.review_mode            # view one setting
/settings modes.rigor=full             # write to project.yaml (team-wide)
/settings --local modes.review_mode=solo   # write to project.local.yaml (just you)
```

Full schema and per-setting behavior: `.opencode/docs/effects-map.md`.

## Upgrading

Already using an older version of this template? See [UPGRADING.md](UPGRADING.md)
for step-by-step migration instructions, a breakdown of what changed between
versions, and which files are safe to overwrite vs. which need a manual merge.

## Project Structure

```
opencode.json                         # Root OpenCode V2 config (permissions, instructions, plugins)
AGENTS.md                             # Master instructions (nested AGENTS.md auto-discovered)
project.yaml                          # Machine-readable project config (engine, modes, stage) — source of truth
.opencode/
  agents/                             # 49 agent definitions (V2 frontmatter: mode: subagent, steps, permissions[])
  skills/                             # 74 slash command definitions (YAML frontmatter)
  hooks/                              # 15 bash hook scripts (invoked by the ccgs plugin)
  rules/                              # 14 path-scoped coding standards
  plugins/
    ccgs/                             # Hook adapter plugin (maps V2 events to bash hooks)
  docs/
    workflow-catalog.yaml             # 7-phase pipeline definition (read by /help)
    templates/                        # 62 document templates (+ per-section guidance)
src/                                  # Game source code (Godot). The code root is
                                      #   ENGINE-SPECIFIC: Unity compiles only
                                      #   Assets/, Unreal builds from Source/<Module>/
assets/                               # Art, audio, VFX, shaders, data files
design/                               # GDDs, narrative docs, level designs
docs/                                 # Technical documentation and ADRs
tests/                                # Test suites (unit, integration, performance, playtest)
tools/                                # Build and pipeline tools
prototypes/                           # Throwaway prototypes (isolated from src/)
production/                           # Sprint plans, milestones, release tracking
studio-tests/                         # QA for the skills and agents themselves
```

### Testing your customizations

CCGS is a template you are meant to edit. `studio-tests/` is how
you check that an edited or newly written skill still holds up — a catalog of all
74 skills and 49 agents, per-category quality rubrics, behavioral specs, and
templates for writing specs of your own.

```
/skill-test static [name]     # structural linter — 7 compliance checks
/skill-test category [name]   # category-specific quality rubric
/skill-test spec [name]       # behavioral spec assertions
/skill-test audit             # coverage report across skills and agents
/skill-improve [name]         # test-fix-retest loop; keeps or reverts on score change
```

It tests the *framework*, never your game — game tests live in `tests/`.

## How It Works

### Agent Coordination

Agents follow a structured delegation model:

1. **Vertical delegation** — directors delegate to leads, leads delegate to specialists
2. **Horizontal consultation** — same-tier agents can consult each other but can't make binding cross-domain decisions
3. **Conflict resolution** — disagreements escalate up to the shared parent (`creative-director` for design, `technical-director` for technical)
4. **Change propagation** — cross-department changes are coordinated by `producer`
5. **Domain boundaries** — agents don't modify files outside their domain without explicit delegation

### Collaborative, Not Autonomous

This is **not** an auto-pilot system. Every agent follows a strict collaboration protocol:

1. **Ask** — agents ask questions before proposing solutions
2. **Present options** — agents show 2-4 options with pros/cons
3. **You decide** — the user always makes the call
4. **Draft** — agents show work before finalizing
5. **Approve** — nothing gets written without your sign-off

You stay in control. The agents provide structure and expertise, not autonomy.

That is how a terminal session started at the project root behaves out of the
box. The `guided` and `autonomous` automation settings, and OpenCode's own
auto mode, trade some of these prompts for speed; see
[setup-requirements.md](.opencode/docs/setup-requirements.md) for the routes into
auto mode.

### Automated Safety (via `ccgs` plugin)

**Hooks** are implemented as an OpenCode V2 plugin (`.opencode/plugins/ccgs`)
that maps V2 hook events to the same bash scripts the upstream framework used.
The scripts are unchanged — they still speak the Claude hook protocol (JSON on
stdin, exit 0 = allow, exit 2 = block, hook JSON on stdout for advisories).

| Hook | Upstream Event | OpenCode V2 Hook | What It Does |
|------|----------------|------------------|--------------|
| `validate-commit.sh` | PreToolUse (Bash) | `tool.hook("execute.before")` on `shell` | Checks for hardcoded values, TODO format, JSON validity, design doc sections — exits early if not `git commit` |
| `validate-push.sh` | PreToolUse (Bash) | `tool.hook("execute.before")` on `shell` | Warns on pushes to protected branches, and on `git tag`, `git merge`, `gh release`, `butler push`, `steamcmd +run_app_build` |
| `validate-read.sh` | PreToolUse (Read) | `tool.hook("execute.before")` on `read` | Refuses whole-file read of design doc > 40 KB, returns headings (`features.read_guard`) |
| `validate-write.sh` | PreToolUse (Write/Edit) | `tool.hook("execute.before")` on `write`/`edit` | Warns (never blocks) when a write would break a rule skills state |
| `validate-registry.sh` | PreToolUse (Write/Edit) | `tool.hook("execute.before")` on `write`/`edit` | Warns when a write to entity/TR-ID registry would delete/renumber or set unknown status |
| `validate-assets.sh` | PostToolUse (Write/Edit) | `tool.hook("execute.after")` on `write`/`edit` | Checks data-file JSON under `assets/`, `Assets/`, `Content/` and Godot asset naming |
| `session-start.sh` | SessionStart | `session.hook("context")` (first per primary session) | Shows current branch, recent commits, sprint context, update line |
| `detect-gaps.sh` | SessionStart | `session.hook("context")` (first per primary session) | Detects fresh projects (suggests `/start`) and missing design docs when code/prototypes exist |
| `pre-compact.sh` | PreCompact | `session.hook("compaction")` | Logs compaction (output not shown) |
| `notify.sh` | Notification | `session.hook("experimental.idle")` (when idle) | Shows Windows toast via PowerShell |
| `session-stop.sh` | Stop (async) | `session.hook("experimental.idle")` (primary only) | Archives `active.md`, records git activity, fire-and-forget |
| `log-agent.sh` | SubagentStart | `tool.hook("execute.before")` on `subagent` | Audit trail start |
| `log-agent-stop.sh` | SubagentStop | `tool.hook("execute.after")` on `subagent` | Audit trail stop |
| `validate-agent-artifact.sh` | SubagentStop | `tool.hook("execute.after")` on `subagent` | Warns when subagent stops without writing its named file |
| `validate-skill-change.sh` | PostToolUse (Write/Edit) | `tool.hook("execute.after")` on `write`/`edit` | Advises `/skill-test` after any `.opencode/skills/` change |

> **Note**: `validate-commit.sh`, `validate-push.sh`, `validate-read.sh`, `validate-write.sh`, `validate-registry.sh`, `validate-assets.sh` and `validate-skill-change.sh` fire on every relevant tool call and exit immediately (exit 0) when the command or file path is not relevant. This is normal hook behavior — not a performance concern.

**Permissions** in `opencode.json` use an ordered array (ask-first for shell,
allowlist for common git/read commands). Read-only commands such as `git status`,
`git log` and `ls` need no rule: OpenCode runs them without asking.

### Path-Scoped Rules

Coding standards are automatically enforced based on file location. The paths
below are Godot's. Each rule also matches the Unity and Unreal layouts: the code
rules match C# under `Assets/**/Gameplay/` and C++ under `Source/**/Gameplay/` (and `Core`,
`AI`, `Networking`, `UI`), data matches JSON under `Assets/**/Data/` and
`Content/**/Data/`, shaders match by file type, and tests match
C# under `Assets/Tests/` and C++ under `Source/**/Tests/`.

| Path | Enforces |
|------|----------|
| `src/gameplay/**` | Data-driven values, delta time usage, no UI references |
| `src/core/**` | Zero allocations in hot paths, thread safety, API stability |
| `src/ai/**` | Performance budgets, debuggability, data-driven parameters |
| `src/networking/**` | Server-authoritative, versioned messages, security |
| `src/ui/**` | No game state ownership, localization-ready, accessibility |
| `design/gdd/**` | Required sections per `modes.workflow`, formula format, edge cases |
| `design/narrative/**` | Lore consistency, character voice, canon levels |
| `assets/data/**/*.json` | JSON validity, naming conventions, schema rules |
| `assets/shaders/**` | Naming conventions, performance targets, cross-platform rules |
| `**/*.tscn`, `**/*.tres` | Scene and resource files changed in the editor where possible; safe hand-edit rules |
| `tests/**` | Test naming, coverage requirements, fixture patterns |
| `prototypes/**` | Relaxed standards, README required, hypothesis documented |

## Design Philosophy

This template is grounded in professional game development practices:

- **MDA Framework** — Mechanics, Dynamics, Aesthetics analysis for game design
- **Self-Determination Theory** — Autonomy, Competence, Relatedness for player motivation
- **Flow State Design** — Challenge-skill balance for player engagement
- **Bartle Player Types** — Audience targeting and validation
- **Verification-Driven Development** — Tests first, then implementation

## Customization

This is a **template**, not a locked framework. Everything is meant to be customized:

- **Add/remove agents** — delete agent files you don't need, add new ones for your domains
- **Edit agent prompts** — tune agent behavior, add project-specific knowledge
- **Modify skills** — adjust workflows to match your team's process
- **Add rules** — create new path-scoped rules for your project's directory structure
- **Tune hooks** — adjust validation strictness, add new checks
- **Pick your engine** — use the Godot, Unity, or Unreal agent set (or none)
- **Tune process weight** — `modes.rigor` and its underlying knobs in `project.yaml` (see [Configuration](#configuration)). Override per-run with `--review solo` on any skill.

## Platform Support

Primary development on **Windows 10** with Git Bash. The hooks and scripts are also tested on **macOS** — its stock bash 3.2 and BSD tools, with and without `jq` — and on **Linux**. All hooks use POSIX-compatible patterns (`grep -E`, not `grep -P`) and include fallbacks for missing tools. The `notify.sh` hook uses PowerShell for Windows toast notifications and is a no-op elsewhere — desktop notifications on macOS/Linux are not yet wired. Please file issues for any platform-specific breakage.

## Community

- **Discussions** — [GitHub Discussions](https://github.com/idrisawad/OpenCode-Game-Studios/discussions) for questions, ideas, and showcasing what you've built
- **Issues** — [Bug reports and feature requests](https://github.com/idrisawad/OpenCode-Game-Studios/issues)

---

## Supporting This Project

OpenCode Game Studios is free and open source. If it saves you time or helps you ship your game, consider supporting continued development:

<p>
  <a href="https://www.buymeacoffee.com/idrisawad"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  &nbsp;
</p>

- **[Buy Me a Coffee](https://www.buymeacoffee.com/idrisawad)** — one-time support


Sponsorships help fund time spent maintaining skills, adding new agents, keeping up with OpenCode and engine API changes, and responding to community issues.

---

*Built for OpenCode V2. Maintained and extended — contributions welcome via [GitHub Discussions](https://github.com/idrisawad/OpenCode-Game-Studios/discussions).*

## License

MIT License. See [LICENSE](LICENSE) for details.
