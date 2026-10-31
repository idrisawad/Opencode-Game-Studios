# Active Hooks (via `ccgs` plugin)

The framework's hooks are wired through the local OpenCode V2 plugin
`.opencode/plugins/ccgs`. The plugin translates OpenCode V2 hook events
(`session.hook("context")`, `session.hook("compaction")`,
`session.hook("experimental.idle")`, `tool.hook("execute.before")`,
`tool.hook("execute.after")`) into the same bash scripts the upstream
framework used. The scripts themselves are unchanged — they still speak the
Claude hook protocol (JSON on stdin, exit 0 = allow, exit 2 = block, hook
JSON on stdout for advisories).

| Hook | Upstream Event | OpenCode V2 Hook | Trigger | Action |
| ---- | -------------- | ---------------- | ------- | ------ |
| `validate-commit.sh` | PreToolUse (Bash) | `tool.hook("execute.before")` on `shell` | `git commit` commands | Validates design doc sections, JSON data files, hardcoded values, TODO format |
| `validate-push.sh` | PreToolUse (Bash) | `tool.hook("execute.before")` on `shell` | `git push`, `git tag`, `git merge` and release commands | Warns on pushes to protected branches (`main`, `master`, `release/*`), and on `git tag` (not a listing), `git merge` (not `--abort`), `gh release`, `butler push`, `steamcmd +run_app_build` |
| `validate-registry.sh` | PreToolUse (Write/Edit) | `tool.hook("execute.before")` on `write`/`edit` | Writes/edits of `design/registry/entities.yaml` and `docs/architecture/tr-registry.yaml` | Warns (never blocks) when change would delete/renumber an entry or set a status outside header values |
| `validate-write.sh` | PreToolUse (Write/Edit) | `tool.hook("execute.before")` on `write`/`edit` | Writes/edits matching rule list | Warns (never blocks) on replacing files skills never overwrite, config out-of-range, prototype header missing, crossing prototype boundary, string-table freeze, subagent writing outside `production/`, `docs/`, `tests/` |
| `validate-read.sh` | PreToolUse (Read) | `tool.hook("execute.before")` on `read` | Whole-file read (no offset/limit) under `design/`, `docs/architecture/`, `production/session-state/` | Blocks reads > 40 KB (`features.read_guard_kb`), returns headings; ranged reads always pass. `features.read_guard: off` disables |
| `validate-agent-artifact.sh` | SubagentStop | `tool.hook("execute.after")` on `subagent` | Subagent stops | Warns (never blocks) when the file named in its return contract is missing |
| `validate-assets.sh` | PostToolUse (Write/Edit) | `tool.hook("execute.after")` on `write`/`edit` | Asset file changes | Validates JSON under `assets/`, `Assets/`, `Content/` and Godot asset naming |
| `session-start.sh` | SessionStart | `session.hook("context")` (first call per primary session) | Session begins | Loads sprint context, milestone, git activity; detects active session-state file for recovery; shows update line if newer release |
| `detect-gaps.sh` | SessionStart | `session.hook("context")` (first call per primary session) | Session begins | Detects fresh projects (suggests `/start`), missing docs when code/prototypes exist (suggests `/reverse-document` or `/project-stage-detect`) |
| `pre-compact.sh` | PreCompact | `session.hook("compaction")` | Context compression | Appends one line to `production/session-logs/compaction-log.txt`; prints nothing |
| `notify.sh` | Notification (`permission_prompt`, `idle_prompt`) | `session.hook("experimental.idle")` (when no background work) | OpenCode idle / waiting for permission | Shows Windows toast via PowerShell |
| `session-stop.sh` | Stop (async) | `session.hook("experimental.idle")` (primary session only) | Every response ends | Updates session log, writes subagent spawn tally to `production/session-logs/session-cost.md`; archives `active.md` only when hash changed; runs fire-and-forget |
| `log-agent.sh` | SubagentStart | `tool.hook("execute.before")` on `subagent` | Agent spawned/resumed | Audit trail start — logs invocation with timestamp and session id |
| `log-agent-stop.sh` | SubagentStop | `tool.hook("execute.after")` on `subagent` | Agent stops | Audit trail stop — completes record; skips internal agents (empty `agent_type`) |
| `validate-skill-change.sh` | PostToolUse (Write/Edit) | `tool.hook("execute.after")` on `write`/`edit` | Skill file changes | Advises running `/skill-test` after any `.opencode/skills/` file written/edited |

**Advisories** from the `validate-*` hooks are emitted as hook JSON
(`systemMessage` / `hookSpecificOutput.additionalContext`) and appended to the
tool result content, where both you and the model see them. Only `validate-read.sh`
(whole-file refusal) and any hook that exits 2 actually block the action.

### Subagent cost visibility

`log-agent.sh` writes a record per spawn to
`production/session-logs/agent-audit.log` in a fixed three-field shape:

```
YYYYMMDD_HHMMSS | <session_id> | Agent invoked: <agent_type>
```

`session-stop.sh` greps that literal string to tally the current session and
writes a count plus per-agent breakdown to
`production/session-logs/session-cost.md`. The field order is fixed; a
different order silently zeroes the count.

### Events considered and deliberately not added

| Event | Why not |
| ---- | ---- |
| `UserPromptSubmit` | Would re-inject session state on every prompt; config is resolved per skill invocation instead. |
| `ConfigChange` | Fires only for OpenCode's own settings files, not for `project.yaml`. |
| `FileChanged` on `project.yaml` | Config is resolved per skill invocation; staleness is accepted trade-off. |
| `PreToolUse` `updatedInput` | Silently rewriting input contradicts collaboration protocol (block and explain). |
| `PostToolUseFailure` | Would add another log with no reader. |
| `SessionEnd` | `session-stop.sh` stays on `Stop`; `SessionEnd` may not fire on crash. |
| `PostCompact` | Output never reaches conversation; `session-start.sh` restores context. |
| `InstructionsLoaded` | Diagnostic only; wire locally via `.opencode/settings.local.json` when needed. |

Hook reference documentation: `.opencode/docs/hooks-reference/`
Hook input schema documentation: `.opencode/docs/hooks-reference/hook-input-schemas.md`
Plugin source (event map + wiring): `.opencode/plugins/ccgs/index.ts`