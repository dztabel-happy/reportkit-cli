---
name: typst-report-kit
description: Use when prepared report content, uploaded user materials, Markdown, or report.json should be delivered as a polished PDF through the local report-kit CLI. Use at the final report-export step after content is available, when a task naturally needs a formal PDF deliverable, or when the user explicitly asks to use this skill. This skill formats and exports reports; it does not gather sources by itself.
---

# Typst Report Kit

Use this skill when the next deliverable is a polished PDF report. The user may have uploaded materials for Codex to organize, the current task may naturally end in a report, or the user may explicitly ask to use this skill.

This skill drives the local CLI. It does not research, gather facts, or decide source material by itself.

## Principle

- Keep the editable surface as Report Markdown or `report.json`.
- Use the CLI to generate `report.json`, Typst source, PDF, and diagnostics.
- Return both the PDF path and editable `report.json` path.
- Keep direct Typst edits for template authors or debugging only.

## Input Contract

For Markdown input, follow `references/report-markdown-contract.md`. If the task needs examples, read `references/examples.md`.

- frontmatter for title, subtitle, author, client, date, language, confidentiality;
- unnumbered section headings such as `# 研究背景`; do not write `# 一、研究背景`, `# 1. 研究背景`, or `## （一）研究方法`;
- `表：` before every Markdown table;
- keep body tables within 7-8 columns when possible; split, transpose, or move very wide detail tables to an appendix instead of shrinking text;
- `图：` before every image or chart, with image alt text kept short and not identical to the formal figure caption;
- `公式：` before every display equation `$$ ... $$`; keep the formula body simple and Typst-friendly, and put Chinese explanations in surrounding prose or the caption instead of LaTeX text macros such as `\text{...}`;
- `> [!risk]`, `> [!warning]`, `> [!note]`, `> [!insight]` for callouts;
- two or more consecutive `术语：说明` lines for definition lists;
- `- [状态] 标签：说明` lines for checklists;
- fenced code blocks for JSON/config/code.

Use definition lists only for glossary or field definitions. Use checklists only for action, acceptance, or delivery status. Keep analysis conclusions, recommendations, and value judgments as paragraphs, tables, normal lists, formulas, or callouts.

Avoid these common LLM habits:

- manual heading numbers: `# 一、背景`, `# 1. 背景`, `## （一）方法`;
- symbolic checklist statuses: `- [✓]`, `- [△]`, `- [✗]`; prefer `- [通过]`, `- [观察]`, `- [未通过]`;
- conclusion sentences as glossary lines; use paragraphs or callouts instead.

When the content includes tables, figures, charts, or display equations, add explicit concise captions before the block. Do this in the Markdown before running the CLI instead of relying on build warnings to repair missing captions later.

## CLI Commands

```bash
report-kit build content.md --out ./outputs/report
report-kit build report.json --out ./outputs/report
report-kit validate report.json
report-kit preview report.json --out ./outputs/preview
```

Use `--no-pdf` only when Typst is unavailable or the user explicitly wants JSON/Typst without compiling PDF.

## Workflow

1. Prepare the final report content from the materials already available in the conversation, uploaded files, or an existing Markdown / `report.json` input.
2. Save the draft as `content.md` or use an existing `report.json`.
3. Run `report-kit build <input> --out <output-dir>`.
4. Read the JSON result printed by the CLI.
5. Verify the returned `report_path`, `pdf_path`, and `artifacts.build_result` exist. `build-result.json` should match the stdout JSON.
6. Inspect `component_counts` and `warnings`.
7. If `warnings` is non-empty, follow each warning's `suggestion`, revise the Markdown/report JSON, and rebuild once before returning final output. If a warning is intentionally acceptable, mention it in the response.
8. Return the PDF path, editable `report.json` path, and any useful diagnostics.

## Revision Workflow

When the user asks for changes:

1. Edit Report Markdown if the source was Markdown, or edit `report.json` if that is the active editable artifact.
2. Re-run `build` for Markdown or `build <report.json>` for JSON.
3. Keep the same output directory only if overwriting is intended; otherwise use a versioned folder such as `outputs/report-v2`.

## Guardrails

- Do not search the web or invent sources as part of this skill.
- Use the local CLI or binary command shown above for report export.
- Do not hand-write Typst for ordinary reports.
- If CLI validation fails, inspect structured errors, fix the Markdown or JSON, and rerun.
- If Typst compilation fails, read `typst_compile.log`, fix the source contract or renderer issue, and rerun.
