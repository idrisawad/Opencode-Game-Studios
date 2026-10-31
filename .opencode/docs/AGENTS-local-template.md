# AGENTS.local.md Template

Copy this file to the project root as `AGENTS.local.md` for personal overrides.
This file is gitignored and will not be committed.

OpenCode only auto-loads files literally named `AGENTS.md`, so unlike the main
instructions file this one is picked up through the `instructions` array in
`opencode.json` (which lists `"AGENTS.local.md"` before the rules glob). If the
file is missing, OpenCode skips it silently.

```markdown
# Personal Preferences

## Model Preferences
- Prefer Opus for complex design tasks
- Use Haiku for quick lookups and simple edits

## Workflow Preferences
- Always run tests after code changes
- Compact context proactively at 60% usage
- Use /clear between unrelated tasks

## Local Environment
- Python command: python (or py / python3)
- Shell: Git Bash on Windows
- IDE: VS Code with OpenCode extension

## Communication Style
- Keep responses concise
- Show file paths in all code references
- Explain architectural decisions briefly

## Personal Shortcuts
- When I say "review", run /code-review on the last changed files
- When I say "status", show git status + sprint progress
```

## Setup

1. Copy this template to your project root: `cp .opencode/docs/AGENTS-local-template.md AGENTS.local.md`
2. Edit to match your preferences
3. Verify `AGENTS.local.md` is in `.gitignore` (it loads because `opencode.json` lists it in `instructions`, not by filename convention)
