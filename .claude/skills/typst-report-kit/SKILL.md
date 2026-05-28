---
name: typst-report-kit
description: Use when prepared report content, uploaded user materials, Markdown, or report.json should be delivered as a polished PDF through the local report-kit CLI. Use at the final report-export step after content is available, when a task naturally needs a formal PDF deliverable, or when the user explicitly asks to use this skill. This skill formats and exports reports; it does not gather sources by itself.
---

# Typst Report Kit

Use this skill when the next deliverable is a polished PDF report. The user may have uploaded materials for Claude to organize, the current task may naturally end in a report, or the user may explicitly ask to use this skill.

This skill drives the local `report-kit` CLI. It should not hand-write Typst for ordinary reports.

## Core Workflow

1. Prepare the final report content from the materials already available in the conversation, uploaded files, or an existing Markdown / `report.json` input.
2. Save Markdown input as `content.md`, or use the existing `report.json`.
3. Run `report-kit build <input> --out <output-dir>`.
4. Read the JSON printed by the CLI and, if present, `build-result.json`.
5. Verify `ok: true`, `pdf_path`, `report_path`, and artifact paths.
6. Inspect `warnings` and `component_counts`.
7. If warnings are actionable, revise the Markdown or `report.json` once and rebuild.
8. Return the PDF path, editable `report.json` path, and any useful warnings.

## Commands

```bash
report-kit build content.md --out ./outputs/report
report-kit build report.json --out ./outputs/report
report-kit validate report.json
report-kit preview report.json --out ./outputs/preview
```

Use `--no-pdf` only when PDF compilation is unavailable or the user explicitly wants JSON / Typst output without PDF.

## Markdown Contract

For Markdown input, follow `references/report-markdown-contract.md`. If examples help, read `references/examples.md`.

Minimum rules:

- Put frontmatter at the top for title, subtitle, author, client, date, language, and confidentiality when available.
- Use unnumbered headings such as `# 研究背景`; do not write `# 一、研究背景`, `# 1. 研究背景`, or `## （一）研究方法`.
- Put `表：` before every Markdown table.
- Keep body tables within 7-8 columns when possible; split, transpose, or move very wide detail tables to an appendix. Use `表[compact]：title` for slightly dense tables and `表[landscape]：title` only when a wide table must remain intact.
- Put `图：` before every image or chart; image paths are resolved relative to the Markdown file.
- Put `公式：` before every display equation. Use Typst math symbols such as `times` and `dot`.
- Use `> [!risk]`, `> [!warning]`, `> [!note]`, or `> [!insight]` for callouts.
- Use definition lists only for glossary or field definitions.
- Use checklists only for action items, acceptance checks, or delivery status.
- Keep analysis conclusions, recommendations, and value judgments as paragraphs, tables, normal lists, formulas, or callouts.

Avoid these common LLM habits:

- manual heading numbers: `# 一、背景`, `# 1. 背景`, `## （一）方法`;
- symbolic checklist statuses: `- [✓]`, `- [△]`, `- [✗]`; prefer `- [通过]`, `- [观察]`, `- [未通过]`;
- conclusion sentences as glossary lines; use paragraphs or callouts instead.

## Guardrails

- Do not invent sources or facts as part of this skill.
- If the user asked Claude to analyze uploaded materials, use only the available materials and conversation context unless the user separately requested research.
- Do not convert normal conclusions into definition lists.
- Do not convert strategic judgments into checklists unless they are truly action or acceptance items.
- Do not edit Typst directly unless debugging a renderer problem.
