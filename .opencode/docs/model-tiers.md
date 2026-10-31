# Model Tier Assignment (OpenCode V2)

> **Skills and models in V2**
>
> In OpenCode V2, a skill runs with the model of the agent that invoked it.
> There is no per-skill `model:` override that switches the model mid-turn.
> The only model selection is:
>
> * **Session model** — set in `opencode.json` (`model:` at root) or via the
>   CLI `--model` flag.
> * **Agent model** — an agent's own frontmatter `model:` (provider/model#variant).
>   Subagents spawned by a skill inherit the agent's model unless the skill
>   explicitly spawns a subagent with a different model (rare).
>
> The old "Haiku/Sonnet/Opus tier" table below is retained as a *convention*
> for documentation and for any legacy tooling that reads it, but it does not
> drive runtime behavior in V2.

## Tier Convention (documentary)

| Tier | Alias | When to use (guideline) |
|------|-------|--------------------------|
| **Haiku** | `haiku` | Read-only status checks, formatting, simple lookups — no creative judgment needed |
| **Sonnet** | `sonnet` | Implementation, design authoring, analysis of individual systems — default for most work |
| **Opus** | `opus` | Multi-document synthesis, high-stakes phase gate verdicts, cross-system holistic review |
| **Session** | `inherit` | Agent runs on the session model (default) |

**Skills** — this template's 74 skills do **not** declare a `model:` in V2.
All skills run on the invoking agent's model. When authoring new skills,
document the intended tier in the skill's description for human readers.

**Agents** — 30 agents use `model: inherit` (run on session model).
19 agents pin a model in their frontmatter:

* **opus (3):** `creative-director`, `producer`, `technical-director`
* **sonnet (16):** `lead-programmer`, `prototyper`, `devops-engineer`,
  `community-manager` and the 12 engine sub-specialists:
  `godot-csharp-specialist`, `godot-gdextension-specialist`,
  `godot-gdscript-specialist`, `godot-shader-specialist`,
  `ue-blueprint-specialist`, `ue-gas-specialist`, `ue-replication-specialist`,
  `ue-umg-specialist`, `unity-addressables-specialist`,
  `unity-dots-specialist`, `unity-shader-specialist`, `unity-ui-specialist`.
* **haiku (0):** none — every agent drafts, writes, or judges.

Agents not listed above have `model: inherit` in their `.opencode/agents/<name>.md`.

## Context windows

A pinned agent gets its model's context window regardless of the session model.
On the Anthropic API `sonnet` resolves to Sonnet 5 (1 M window), `haiku` to
Haiku 4.5 (200 K). Behind an LLM gateway the resolved window may differ.
Subagents start from the brief they are given, not the parent conversation, so
window size only matters for very large briefs.

If you want *all* pinned agents to run on the session model (e.g. to avoid a
larger window), set in your `.opencode/settings.local.json`:

```json
{ "env": { "OPENCODE_SUBAGENT_MODEL_FORCE": "1" } }
```

(Requires OpenCode V2.2+. Applies to every pinned agent, including the three
`opus` directors.)

---
*This file replaces the V1 `model-tiers.md` which described Claude Code's
skill-model override semantics. The V2 behavior is simpler: one model per
session, optional per-agent pin.*