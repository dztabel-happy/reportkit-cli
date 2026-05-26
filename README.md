# ReportKit

ReportKit exports prepared Markdown or `report.json` content into polished Typst PDF reports.

It is designed for LLMs and agents at the final delivery step: the agent prepares the content, then calls `report-kit` to produce a stable PDF.

## Install

```bash
npm install -g @dztabel/reportkit
```

Check the command:

```bash
report-kit --version
```

## Quick Start

Create `content.md`:

```markdown
---
title: Project Review Report
subtitle: Agent-prepared content
author: ReportKit
date: 2026-05-26
---

# Executive Summary

This report was prepared by an upstream agent. ReportKit is responsible for turning the prepared content into a polished PDF.

表：Delivery Checklist
| Item | Status | Notes |
| --- | --- | --- |
| Content prepared | Done | The agent has already written the report. |
| PDF export | Ready | ReportKit handles layout and rendering. |
```

Export the report:

```bash
report-kit build content.md --out ./report
```

Output files:

```text
report/report.pdf
report/report.json
report/report.typ
report/build-result.json
```

## Inputs

ReportKit accepts:

- Markdown prepared by an LLM or agent.
- A structured `report.json` file.

It is useful when the user asks for a formal PDF report, consulting-style deliverable, project review, research summary, or Chinese business report.

## What ReportKit Does

- Converts prepared content into a report structure.
- Applies a stable Typst report style.
- Generates PDF output.
- Returns machine-readable build results for agents.
- Keeps table captions, figure captions, formulas, code blocks, lists, callouts, and long tables in a controlled layout.

## What ReportKit Does Not Do

- It does not search the web.
- It does not judge facts.
- It does not replace the upstream LLM or agent's writing process.
- It does not require users to write Typst by hand.

## Agent Usage

Agents can call the CLI directly:

```bash
report-kit build prepared-report.md --out ./report
```

Then read `report/build-result.json` or stdout to locate the generated PDF.

Successful builds return JSON with `ok: true`, artifact paths, component counts, and warnings.

## Codex Skill

This repository includes a Codex skill that teaches an agent when and how to call the CLI:

```text
skills/codex/typst-report-kit
```

Install the npm package first:

```bash
npm install -g @dztabel/reportkit
```

Then link the skill into your Codex skills directory:

```bash
git clone https://github.com/dztabel-happy/reportkit-cli.git
cd reportkit-cli

SKILL_DIR="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$SKILL_DIR"
ln -sfn "$(pwd)/skills/codex/typst-report-kit" "$SKILL_DIR/typst-report-kit"
```

If your Codex or agent runtime uses a different skills directory, copy or symlink `skills/codex/typst-report-kit` into that directory instead.

After installing the skill, ask the agent to use it on prepared content:

```text
Use $typst-report-kit to export this prepared report content as a polished PDF:

<paste the prepared report content here>
```

The skill should save the content as Markdown or use an existing `report.json`, run `report-kit build`, inspect warnings, rebuild once if needed, and return the generated PDF path plus the editable `report.json` path.

## Platform Support

Current public beta:

- macOS Apple Silicon: supported through `@dztabel/reportkit-darwin-arm64`.

More platform packages can be added without changing the main `@dztabel/reportkit` command.
