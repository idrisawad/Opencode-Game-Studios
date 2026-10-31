// CCGS hook adapter -- runs the framework's bash hooks from OpenCode V2.
//
// The upstream framework (Claude Code Game Studios, v1.2.0) wires 15 event
// hooks in `.claude/settings.json`. OpenCode has no JSON hook config; it
// intercepts live operations through plugin hooks, so this adapter spawns the
// same scripts with the payloads they expect. The scripts themselves are
// unchanged: they still speak Claude's hook protocol (JSON on stdin, exit 0
// allow / exit 2 block, hook JSON on stdout), and this file is the only place
// that translation lives.
//
// Event map (upstream event -> OpenCode hook):
//   SessionStart          -> session.hook("context"), first call per primary
//                            session; stdout is injected as system context.
//                            Subagent child sessions are skipped (Claude never
//                            fired SessionStart for them either).
//   PreCompact            -> session.hook("compaction")
//   Stop                  -> session.hook("experimental.idle"), primary only,
//                            fire-and-forget (upstream registered it async)
//   Notification          -> session.hook("experimental.idle"), when no
//                            background work is pending
//   PreToolUse Read       -> tool.hook("execute.before") on `read`
//   PreToolUse Write|Edit -> tool.hook("execute.before") on `write`/`edit`
//   PreToolUse Bash       -> tool.hook("execute.before") on `shell`
//   PostToolUse Write|Edit-> tool.hook("execute.after") on `write`/`edit`
//   SubagentStart         -> tool.hook("execute.before") on `subagent`
//   SubagentStop          -> tool.hook("execute.after") on `subagent`
//
// Known semantic drifts, all fail-open or advisory:
// - A hook timeout (Claude killed the script) allows the action; the guard
//   scripts are written to fail open, and a stuck hook must not wedge tools.
// - Claude injected PostToolUse / advisory stderr into the transcript UI and,
//   via additionalContext, next to the tool result. OpenCode has no per-tool
//   feedback channel except the result itself, so advisories are appended to
//   the tool result content, where both the user and the model see them.
// - Claude re-ran SessionStart with source `compact` after a compaction;
//   OpenCode does not. The compaction checkpoint lives in
//   production/session-state/active.md, and AGENTS.md tells the agent to read
//   it after any compaction, so nothing is lost.
// - `instructions` path-scoped rules cannot load on demand in OpenCode V2;
//   opencode.json loads .opencode/rules/*.md always, and log-instructions.sh
//   records the load events from the context hook's instruction metadata.
// - statusline.sh has no OpenCode equivalent and is not wired.
//
// Requires bash on PATH (Git Bash on Windows), same as upstream.

import { Plugin } from "@opencode/plugin"
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

interface HookRun {
  code: number | null
  stdout: string
  stderr: string
  /** spawn failed or the hook was killed; callers treat this as "no opinion" */
  skipped: boolean
}

interface ClaudePayload {
  tool_name?: string
  tool_input?: Record<string, unknown>
  agent_type?: string
  session_id?: string
  [key: string]: unknown
}

export default Plugin.define({
  id: "ccgs",
  async setup(ctx) {
    const root = String(ctx.location.project.canonical)
    const hooksDir = join(root, ".opencode", "hooks")
    const agentsDir = join(root, ".opencode", "agents")
    const env: NodeJS.ProcessEnv = { ...process.env, OPENCODE_PROJECT_DIR: root }

    let bashAvailable: boolean | undefined
    let warnedNoBash = false
    const warnedHooks = new Set<string>()
    const started = new Set<string>() // sessions whose SessionStart banner ran
    const pending = new Map<string, string>() // tool call id -> advisory text
    const subagents = new Map<string, { name: string; prompt: string }>()

    // The scripts are POSIX and assume a POSIX-ish bash. On Windows, WSL's
    // bash (C:\Windows\System32\bash.exe) usually shadows Git Bash on PATH and
    // would run them against a different root filesystem, so Git Bash is
    // preferred when it is installed; CCGS_BASH overrides the choice.
    const bashPath = (() => {
      const override = process.env.CCGS_BASH
      if (override) return override
      if (process.platform !== "win32") return "bash"
      const candidates = [
        "C:\\Program Files\\Git\\bin\\bash.exe",
        "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
        `${process.env.ProgramFiles ?? "C:\\Program Files"}\\Git\\bin\\bash.exe`,
      ]
      for (const candidate of candidates) if (existsSync(candidate)) return candidate
      return "bash"
    })()

    // Git Bash opens `C:/x/y.sh` but is only reliable with its own spelling of
    // an absolute path, so Windows paths are converted to /c/x/y.sh for argv.
    const scriptArg = (path: string): string => {
      const win = path.replace(/\//g, "\\")
      const m = /^([A-Za-z]):\\(.*)$/.exec(win)
      return m ? `/${m[1].toLowerCase()}/${m[2].replace(/\\/g, "/")}` : path
    }

    const warnOnce = (key: string, text: string) => {
      if (warnedHooks.has(key)) return
      warnedHooks.add(key)
      console.warn(`[ccgs] ${text}`)
    }

    // Spawn one hook script with a Claude-shaped JSON payload on stdin.
    // Never throws: a hook that cannot run gets no opinion (fail open).
    const run = (script: string, payload: ClaudePayload, timeoutMs: number): Promise<HookRun> =>
      new Promise((resolve) => {
        if (bashAvailable === false) {
          return resolve({ code: null, stdout: "", stderr: "bash not available", skipped: true })
        }
        const child = spawn(bashPath, [scriptArg(join(hooksDir, script))], {
          cwd: root,
          env,
          stdio: ["pipe", "pipe", "pipe"],
        })
        let stdout = ""
        let stderr = ""
        let settled = false
        const done = (r: HookRun) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          resolve(r)
        }
        const timer = setTimeout(() => {
          child.kill()
          done({ code: null, stdout, stderr: `${script} timed out after ${timeoutMs}ms`, skipped: true })
        }, timeoutMs)
        child.stdout.setEncoding("utf8")
        child.stderr.setEncoding("utf8")
        child.stdout.on("data", (d: string) => (stdout += d))
        child.stderr.on("data", (d: string) => (stderr += d))
        child.on("error", (err) => {
          bashAvailable = false
          if (!warnedNoBash) {
            warnedNoBash = true
            console.warn(
              `[ccgs] bash not found on PATH; every framework hook is disabled. ` +
                `Install Git Bash (Windows) or bash (macOS/Linux), or set CCGS_BASH. (${err.message})`,
            )
          }
          done({ code: null, stdout, stderr: err.message, skipped: true })
        })
        child.on("close", (code) => done({ code, stdout, stderr, skipped: false }))
        child.stdin.on("error", () => {
          /* the script exited before reading stdin; close code decides */
        })
        child.stdin.end(JSON.stringify(payload))
      })

    // Exit 2 = the hook blocked the action; stderr is the reason shown to the
    // model (Claude showed hook stderr on exit 2 verbatim).
    const blockError = (r: HookRun): Error =>
      new Error((r.stderr.trim() || "Blocked by a project guard hook (.opencode/hooks).").trim())

    // stdout hook JSON: {"systemMessage": "...", "hookSpecificOutput":
    // {"additionalContext": "..."}} -- surfaced next to the tool result.
    const advisory = (r: HookRun): string => {
      if (r.code === 2 || r.skipped) return ""
      const parts: string[] = []
      for (const line of r.stdout.split("\n")) {
        const text = line.trim()
        if (!text.startsWith("{")) continue
        try {
          const parsed = JSON.parse(text) as {
            systemMessage?: unknown
            hookSpecificOutput?: { additionalContext?: unknown }
          }
          const add = parsed.hookSpecificOutput?.additionalContext
          const msg = parsed.systemMessage
          const value = typeof add === "string" && add ? add : typeof msg === "string" ? msg : ""
          if (value && !parts.includes(value)) parts.push(value)
        } catch {
          /* not hook JSON: debug chatter, ignored like Claude ignored it */
        }
      }
      return parts.join("\n")
    }

    const appendContent = (result: { content?: unknown }, text: string) => {
      const current = result.content
      if (typeof current === "string") result.content = current ? `${current}\n\n${text}` : text
      else if (Array.isArray(current)) result.content = [...current, { type: "text", text }]
      else result.content = [{ type: "text", text }]
    }

    // OpenCode tool input -> Claude tool_input for hook-input.sh and friends:
    // path -> file_path, content, oldString/newString/replaceAll ->
    // old_string/new_string/replace_all, offset/limit pass through. offset and
    // limit are only sent when numeric: their presence is what marks a read as
    // "bounded" (validate-read.sh refuses only whole-file reads).
    const claudeToolInput = (tool: string, raw: unknown): Record<string, unknown> => {
      const input = (raw ?? {}) as Record<string, unknown>
      const path = typeof input.path === "string" ? input.path : ""
      if (tool === "read") {
        const bounded: Record<string, unknown> = { file_path: path }
        if (typeof input.offset === "number") bounded.offset = input.offset
        if (typeof input.limit === "number") bounded.limit = input.limit
        return bounded
      }
      if (tool === "write") return { file_path: path, content: typeof input.content === "string" ? input.content : "" }
      return {
        file_path: path,
        old_string: typeof input.oldString === "string" ? input.oldString : "",
        new_string: typeof input.newString === "string" ? input.newString : "",
        replace_all: input.replaceAll === true,
      }
    }

    const claudeToolName: Record<string, string> = { read: "Read", write: "Write", edit: "Edit", shell: "Bash" }
    const isCCGSAgent = (name: string) => name.length > 0 && existsSync(join(agentsDir, `${name}.md`))

    // --- SessionStart -> first context call per primary session -------------
    await ctx.session.hook("context", async (event) => {
      if (started.has(event.sessionID)) return
      started.add(event.sessionID)
      const info = await ctx.session.get({ sessionID: event.sessionID }).catch(() => undefined)
      if (info?.parentID) return // subagent child: no SessionStart in Claude either

      const payload: ClaudePayload = {
        session_id: event.sessionID,
        transcript_path: "",
        cwd: root,
        hook_event_name: "SessionStart",
        source: "startup",
      }
      const parts: string[] = []
      for (const [script, timeoutMs] of [
        ["session-start.sh", 10_000],
        ["detect-gaps.sh", 10_000],
      ] as const) {
        const r = await run(script, payload, timeoutMs)
        if (r.stdout.trim()) parts.push(r.stdout.trim())
        if (!r.skipped && r.code !== 0 && r.code !== null) {
          parts.push(`(${script} exited with status ${r.code}${r.stderr.trim() ? `: ${r.stderr.trim()}` : ""})`)
        }
      }

      // InstructionsLoaded audit: log-instructions.sh records which instruction
      // sources the context hook sees, from OpenCode's experimental metadata.
      try {
        const system = event.system as Array<{ metadata?: { experimental?: { instructions?: unknown } } }>
        const sources = system.flatMap((part) => {
          const list = part?.metadata?.experimental?.instructions
          return Array.isArray(list) ? (list as Array<{ key?: unknown }>) : []
        })
        let logged = 0
        const seen = new Set<string>()
        for (const source of sources) {
          const key = typeof source?.key === "string" ? source.key : ""
          if (!key || seen.has(key) || logged >= 24) continue
          seen.add(key)
          logged++
          void run(
            "log-instructions.sh",
            { session_id: event.sessionID, file_path: key, load_reason: "session-context", source: "session-context" },
            5_000,
          )
        }
      } catch {
        /* metadata is experimental; absence just skips the audit */
      }

      if (parts.length) event.system.push({ type: "text", text: parts.join("\n\n") })
    })

    // --- PreCompact ---------------------------------------------------------
    await ctx.session.hook("compaction", async (event) => {
      await run(
        "pre-compact.sh",
        { session_id: event.sessionID, hook_event_name: "PreCompact", trigger: "auto", custom_instructions: "" },
        10_000,
      )
    })

    // --- Stop + Notification -> idle (experimental; absent names are skipped)
    try {
      await ctx.session.hook("experimental.idle", (event) => {
        void (async () => {
          const info = await ctx.session.get({ sessionID: event.sessionID }).catch(() => undefined)
          if (info?.parentID) return // Claude's Stop never fired for subagents
          await run(
            "session-stop.sh",
            { session_id: event.sessionID, hook_event_name: "Stop", stop_hook_active: false },
            10_000,
          )
          if (event.background.length === 0) {
            await run(
              "notify.sh",
              {
                session_id: event.sessionID,
                hook_event_name: "Notification",
                message: "OpenCode is idle and waiting for your input.",
              },
              10_000,
            )
          }
        })().catch(() => {
          /* a turn-end log must never surface as an error */
        })
      })
    } catch (err) {
      warnOnce(
        "idle",
        `session-stop.sh and notify.sh are not wired: the experimental.idle hook is unavailable (${String(err)}).`,
      )
    }

    // --- PreToolUse: read / write / edit ------------------------------------
    await ctx.tool.hook("execute.before", async (event) => {
      const claudeName = claudeToolName[event.tool]
      if (!claudeName) return
      const toolInput = claudeToolInput(event.tool, event.input)
      const payload: ClaudePayload = {
        tool_name: claudeName,
        tool_input: toolInput,
        agent_type: event.agent,
        session_id: event.sessionID,
      }

      if (event.tool === "read") {
        const r = await run("validate-read.sh", payload, 10_000)
        if (r.code === 2) throw blockError(r)
        return
      }

      if (event.tool === "shell") {
        // Claude ran these on every Bash/PowerShell call. The payload is
        // {tool_name:"Bash", tool_input:{command}} plus cwd, which
        // validate-commit.sh also reads.
        const command = (event.input as { command?: unknown } | undefined)?.command
        const withCwd: ClaudePayload = {
          tool_name: "Bash",
          tool_input: { command: typeof command === "string" ? command : "" },
          cwd: root,
          session_id: event.sessionID,
        }
        const commit = await run("validate-commit.sh", withCwd, 15_000)
        if (commit.code === 2) throw blockError(commit)
        const push = await run("validate-push.sh", withCwd, 10_000)
        if (push.code === 2) throw blockError(push)
        const note = [advisory(commit), advisory(push)].filter(Boolean).join("\n")
        if (note) pending.set(event.id, note)
        return
      }

      // write / edit: registry guard first, then the write guard, both
      // PreToolUse in upstream and both advisory-or-block.
      const registry = await run("validate-registry.sh", payload, 15_000)
      if (registry.code === 2) throw blockError(registry)
      const write = await run("validate-write.sh", payload, 15_000)
      if (write.code === 2) throw blockError(write)
      const note = [advisory(registry), advisory(write)].filter(Boolean).join("\n")
      if (note) pending.set(event.id, note)
    })

    // --- PostToolUse: write / edit ------------------------------------------
    await ctx.tool.hook("execute.after", async (event) => {
      if (event.tool !== "write" && event.tool !== "edit") return
      const payload: ClaudePayload = {
        tool_name: claudeToolName[event.tool],
        tool_input: claudeToolInput(event.tool, event.input),
        agent_type: event.agent,
        session_id: event.sessionID,
      }
      const notes: string[] = []
      const before = pending.get(event.id)
      if (before) {
        pending.delete(event.id)
        notes.push(before)
      }
      const assets = await run("validate-assets.sh", payload, 10_000)
      if (assets.code === 2) {
        // A PostToolUse hook cannot block in Claude either: the write already
        // happened. Exit 2 meant "this reaches the model as feedback".
        notes.push(`Write validation failed: ${assets.stderr.trim() || "see .opencode/hooks/validate-assets.sh"}`)
      } else {
        const note = advisory(assets)
        if (note) notes.push(note)
      }
      const skill = await run("validate-skill-change.sh", payload, 5_000)
      const skillNote = advisory(skill)
      if (skillNote) notes.push(skillNote)
      if (notes.length && event.status === "completed") {
        appendContent(event.result as { content?: unknown }, notes.join("\n"))
      }
    })

    // --- PreToolUse / PostToolUse on the shell tool --------------------------
    await ctx.tool.hook("execute.after", async (event) => {
      if (event.tool !== "shell") return
      const note = pending.get(event.id)
      if (!note) return
      pending.delete(event.id)
      if (event.status === "completed") appendContent(event.result as { content?: unknown }, note)
    })

    // --- SubagentStart / SubagentStop ---------------------------------------
    // Upstream logged every spawn; Claude's own internal subagents arrived with
    // an empty agent_type and were skipped. OpenCode's built-in agents have
    // names, so the same filter is "the name is a framework agent in
    // .opencode/agents/".
    await ctx.tool.hook("execute.before", async (event) => {
      if (event.tool !== "subagent") return
      const input = (event.input ?? {}) as { agent?: unknown; prompt?: unknown }
      const name = typeof input.agent === "string" ? input.agent : ""
      if (!isCCGSAgent(name)) return
      if (typeof input.prompt === "string") subagents.set(event.id, { name, prompt: input.prompt })
      await run(
        "log-agent.sh",
        { session_id: event.sessionID, agent_id: name, agent_type: name, hook_event_name: "SubagentStart" },
        5_000,
      )
    })

    await ctx.tool.hook("execute.after", async (event) => {
      if (event.tool !== "subagent") return
      const invocation = subagents.get(event.id)
      if (!invocation) return
      subagents.delete(event.id)
      const payload: ClaudePayload = {
        session_id: event.sessionID,
        agent_id: invocation.name,
        agent_type: invocation.name,
        hook_event_name: "SubagentStop",
      }
      await run("log-agent-stop.sh", payload, 5_000)

      // validate-agent-artifact.sh reads the return contract from the first
      // user message of the subagent transcript. OpenCode keeps transcripts in
      // its own storage, so the prompt is replayed as a one-line JSONL file in
      // the same shape the hook greps for.
      let transcript = ""
      try {
        transcript = mkdtempSync(join(tmpdir(), "ccgs-"))
        const file = join(transcript, "transcript.jsonl")
        writeFileSync(file, `${JSON.stringify({ type: "user", text: invocation.prompt })}\n`, "utf8")
        const r = await run(
          "validate-agent-artifact.sh",
          { ...payload, agent_transcript_path: file, last_assistant_message: "" },
          10_000,
        )
        const note = advisory(r)
        if (note && event.status === "completed") appendContent(event.result as { content?: unknown }, note)
      } catch {
        /* transcript replay is best-effort */
      } finally {
        if (transcript) rmSync(transcript, { recursive: true, force: true })
      }
    })
  },
})
