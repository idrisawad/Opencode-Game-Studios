# Setup Requirements

This template requires a few tools to be installed for full functionality.
Hooks are implemented as an OpenCode V2 plugin (`.opencode/plugins/ccgs`) and
carry on without an optional tool, losing only the check it powers. The
required ones are required: without Python 3 every setting falls back to its
default and a commit that stages data JSON is blocked, and without Bash no hook
runs at all.

## Required

| Tool | Purpose | Install |
| ---- | ---- | ---- |
| **Git** | Version control, branch management | [git-scm.com](https://git-scm.com/) |
| **OpenCode V2** | AI agent CLI | Native installer: `curl -fsSL https://opencode.ai/v2/install | bash` (macOS, Linux, WSL) or `irm https://opencode.ai/v2/install.ps1 | iex` (Windows PowerShell). npm also works: `npm install -g @opencode/cli` (Node.js 22+). See [opencode.ai/v2/docs](https://opencode.ai/v2/docs) |
| **Python 3** | Reads `project.yaml` for every skill and hook | [python.org](https://www.python.org/). Without it every setting silently falls back to its default, and a commit that stages data JSON is blocked because it cannot be validated |
| **Bash** | Runs every hook | Built into macOS and Linux. On Windows, install [Git for Windows](https://git-scm.com/downloads/win) — OpenCode runs without it, but no CCGS hook does |

## Recommended

| Tool | Used By | Purpose | Install |
| ---- | ---- | ---- | ---- |
| **jq** | Hooks (8 of 12) | JSON parsing in commit/push/asset/agent hooks | See below |

### Installing jq

**Windows** (any of these):
```
winget install jqlang.jq
choco install jq
scoop install jq
```

**macOS**:
```
brew install jq
```

**Linux**:
```
sudo apt install jq     # Debian/Ubuntu
sudo dnf install jq     # Fedora
sudo pacman -S jq       # Arch
```

## Platform Notes

### Windows
- Git for Windows includes **Git Bash**, which provides the `bash` command
  used by all hooks in the `ccgs` plugin.
- The plugin prefers Git Bash at `C:\Program Files\Git\bin\bash.exe`. If it is
  installed elsewhere, set the environment variable `CCGS_BASH` to the full
  path of `bash.exe`.
- Hooks are invoked by the plugin as `bash .opencode/hooks/[name].sh` with the
  project root as working directory.

### macOS / Linux
- Bash is available natively
- Install `jq` via your package manager for full hook support

## Verifying Your Setup

Run these commands to check prerequisites:

```bash
git --version          # Should show git version
bash --version         # Should show bash version
jq --version           # Should show jq version (optional)
python --version       # Required: Python 3 (python3 or py also work)
opencode --version     # Should show 2.x (V2)
```

## What Happens Without Optional Tools

| Missing Tool | Effect |
| ---- | ---- |
| **jq** | Nothing is lost: every hook falls back to `grep` to read its JSON input. jq is only more robust with unusual input. |
| **Python 3** | Not optional (see Required). Every setting falls back to its default, because `project.yaml` is read through Python; the asset hook skips JSON validation and says so; a commit that stages data JSON is blocked. |
| **Both** | As without Python. |

## Configuration

OpenCode V2 uses a single project config file `opencode.json` at the repo root
(merged with global/user configs). This template ships a ready-to-use
`opencode.json` that includes:

* **Permissions** — ask-first for shell, allowlist for common git/read commands.
* **Instructions** — loads `AGENTS.local.md` (personal overrides, gitignored) then
  all `.opencode/rules/*.md` (path-scoped rules). Nested `AGENTS.md` files in
  subdirectories are discovered on-demand as the agent explores.
* **Plugins** — loads the local `ccgs` plugin from `.opencode/plugins/ccgs`.

Personal overrides: copy `.opencode/docs/AGENTS-local-template.md` to
`AGENTS.local.md` at the repo root (it is gitignored). Local plugin settings or
extra permissions go in `.opencode/settings.local.json` (also gitignored).

## Recommended IDE

OpenCode works with any editor, but the template is optimized for:
- **VS Code** with the OpenCode extension
- **Cursor** (OpenCode compatible)
- Terminal-based OpenCode CLI (`opencode` or `opencode run …`)