---
name: typst-report-kit
description: Use when prepared report content, uploaded user materials, Markdown, or report.json should be delivered as a polished PDF through the local report-kit CLI. Use at the final report-export step after content is available, when a task naturally needs a formal PDF deliverable, or when the user explicitly asks to use this skill. This skill formats and exports reports; it does not gather sources by itself.
---

# Typst Report Kit

Use this skill when the next deliverable is a polished PDF report. The user may have uploaded materials for Claude to organize, the current task may naturally end in a report, or the user may explicitly ask to use this skill.

This skill drives the local CLI. It does not research, gather facts, or decide source material by itself.

## Principle

- Keep the editable surface as Report Markdown or `report.json`.
- Use the CLI to generate `report.json`, Typst source, PDF, and diagnostics.
- Return both the PDF path and editable `report.json` path.
- Keep direct Typst edits for template authors or debugging only.
- Default to the current project/workspace directory for artifacts.
- Use the default Chinese delivery-report template unless the user explicitly asks for another template.

## Output Location

Unless the user gives an explicit output path, write report artifacts under `./output_report` in the current project/workspace directory.

Use a stable file name for the editable source, such as `./output_report/content.md`, and run the CLI with `--out ./output_report`. If `./output_report` already contains a report that should be preserved, use a versioned sibling such as `./output_report_v2`.

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
- Put `图：` before every image or chart, with image alt text kept short and not identical to the formal figure caption; image paths are resolved relative to the Markdown file.
- Put `公式：` before every display equation `$$ ... $$`; keep the formula body simple and Typst-friendly, use Typst math symbols such as `times` and `dot`, use real symbols for subtraction and percentages such as `-` and `100%`, and put Chinese explanations in surrounding prose or the caption instead of LaTeX text macros such as `\text{...}`.
- Use `> [!risk]`, `> [!warning]`, `> [!note]`, or `> [!insight]` for callouts.
- Use two or more consecutive `术语：说明` lines for definition lists.
- Use `- [状态] 标签：说明` lines for checklists.
- Use fenced code blocks for JSON/config/code.
- Keep analysis conclusions, recommendations, and value judgments as paragraphs, tables, normal lists, formulas, or callouts.

Use definition lists only for glossary or field definitions. Use checklists only for action, acceptance, or delivery status. Keep analysis conclusions, recommendations, and value judgments as paragraphs, tables, normal lists, formulas, or callouts.

## Delivery Gate

`ok: true` only means the PDF was produced. It is not enough to return success.

Before returning the final PDF path, inspect `warnings` in the CLI JSON result or `build-result.json`. If any warning is present, revise the Markdown/report JSON according to the warning `suggestion` and rebuild once. Return with warnings only when the warning is intentionally acceptable, and mention the remaining warning clearly.

For `checklist_item_missing_detail`, do not leave `- [状态] 说明内容` as-is. Either change it to `- [状态] 标签：说明内容`, or convert it to a normal bullet list if it is not a delivery/status checklist.

Avoid these common LLM habits:

- manual heading numbers: `# 一、背景`, `# 1. 背景`, `## （一）方法`;
- symbolic checklist statuses: `- [✓]`, `- [△]`, `- [✗]`; prefer `- [通过]`, `- [观察]`, `- [未通过]`;
- conclusion sentences as glossary lines; use paragraphs or callouts instead.

When the content includes tables, figures, charts, or display equations, add explicit concise captions before the block. Do this in the Markdown before running the CLI instead of relying on build warnings to repair missing captions later.

## CLI Commands

```bash
report-kit build ./output_report/content.md --out ./output_report
report-kit build ./output_report/report.json --out ./output_report
report-kit validate report.json
report-kit preview report.json --out ./outputs/preview
```

Use `--no-pdf` only when Typst is unavailable or the user explicitly wants JSON/Typst without compiling PDF.

## Workflow

1. Prepare the final report content from the materials already available in the conversation, uploaded files, or an existing Markdown / `report.json` input.
2. Save the draft as `./output_report/content.md`, or use an existing `report.json` when editing a prior build.
3. Run `report-kit build <input> --out ./output_report` unless the user asked for another path.
4. Read the JSON result printed by the CLI.
5. Verify the returned `report_path`, `pdf_path`, and artifact paths. `build-result.json` should match the stdout JSON.
6. Inspect `component_counts` and `warnings`.
7. If `warnings` is non-empty, treat the output as needing revision unless the warning is intentionally acceptable. Follow each warning's `suggestion`, revise the Markdown/report JSON, and rebuild once before returning final output.
8. Return the PDF path, editable `report.json` path, and any useful diagnostics.

## Revision Workflow

When the user asks for changes:

1. Edit Report Markdown if the source was Markdown, or edit `report.json` if that is the active editable artifact.
2. Re-run `build` for Markdown or `build <report.json>` for JSON.
3. Keep the same output directory only if overwriting is intended; otherwise use a versioned folder such as `./output_report_v2`.
4. Return the new PDF path and the edited source path so the user or agent can continue iterating.

## Guardrails

- Do not search the web or invent sources as part of this skill.
- Use the local CLI or binary command shown above for report export.
- Do not hand-write Typst for ordinary reports.
- If CLI validation fails, inspect structured errors, fix the Markdown or JSON, and rerun.
- If Typst compilation fails, read `typst_compile.log`, fix the source contract or renderer issue, and rerun.
