---
name: typst-report-kit
description: Use when prepared report content, uploaded user materials, Markdown, or report.json should be delivered as a polished PDF through the local report-kit CLI. Use at the final report-export step after content is available, when a task naturally needs a formal PDF deliverable, or when the user explicitly asks to use this skill. This skill formats and exports reports; it does not gather sources by itself.
---

# Typst Report Kit

Use this skill when the next deliverable is a polished PDF report. The user may have uploaded materials for Claude to organize, the current task may naturally end in a report, or the user may explicitly ask to use this skill.

This skill drives the local CLI. It does not research, gather facts, or decide source material by itself.

## Requirements

This skill matches `@dztabel/reportkit >= 0.1.28`. Ensure the CLI is current before building:

```bash
report-kit --version
```

If the command is missing or older, install or upgrade the platform-specific pair, for example on macOS Apple Silicon: `npm install -g @dztabel/reportkit @dztabel/reportkit-darwin-arm64`.

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

## Input Contract

For Markdown input, follow `references/report-markdown-contract.md`. If the task needs examples, read `references/examples.md`.

- frontmatter for title, subtitle, author, client, date, language, confidentiality;
- headings are unnumbered (`# 研究背景`, never `# 一、研究背景` or `## （一）研究方法`), and long chapters get real `##` subsections — the template numbers them 2.1 / 2.2 automatically and the TOC nests them. A report where every chapter is a flat `#` reads like an outline, not a formal report;
- `表：` before every Markdown table;
- table font size is automatic (normal size first, compact tier only when the measured content cannot fit) — never try to control it; `表[compact]：` no longer changes anything and triggers a warning. Use `表[landscape]：title` only when a wide table must remain intact;
- introduce each table/figure in the prose before it appears, referencing it as `见表 x.x` / `如图 x.x` — these become clickable cross-references in the PDF. Chapter numbering counts every level-1 `#` section from 1 (an opening `# 执行摘要` is chapter 1), and table/figure/equation numbers follow their chapter;
- cite sources inline as `[1]` after the supported claim and list them in a final `# 资料来源` chapter as an ordered list of `[名称](url)，出处，日期。` items — they render as numbered reference entries and inline `[n]` becomes a clickable superscript; never invent sources, never paste naked URLs into prose;
- `图：` before every image or chart, with image alt text kept short and not identical to the formal figure caption; image paths are resolved relative to the Markdown file;
- `公式：` before every display equation `$$ ... $$`; reference it in prose as `式 x.x` or `公式 x.x`. Keep the formula body simple and Typst-friendly, use Typst math symbols such as `times` and `dot`, use real symbols for subtraction and percentages such as `-` and `100%`, and put Chinese explanations in surrounding prose or the caption instead of LaTeX text macros such as `\text{...}`;
- fenced code blocks for JSON/config/code.

For direct `report.json`, formula fields must not contain Typst code escapes such as `#read(...)`; figure paths should be relative to the input file directory unless they are inside an allowed asset root.

Keep analysis conclusions, recommendations, field explanations, status notes, and action items as paragraphs, tables, normal lists, or formulas. Do not create glossary/checklist-style blocks in Markdown unless the user provides an existing `report.json` that already uses them.

Do not make a section only a pile of tables, figures, or equations. Add one or two explanatory paragraphs around data blocks when the section needs interpretation, assumptions, conclusions, or risk boundaries. If the section is only raw detail, make it an appendix-like section or accept the related warning explicitly.

Avoid long runs of bullet items. If a section has more than five or six action/status/risk items, use a table or keep only the highest-signal bullets and move background, judgment, and reasoning back into prose. Do not write status bullets such as `- [Done] ...` or `- [通过] ...`; use a table for status tracking.

Use callouts sparingly. For most professional reports, prefer normal paragraphs, lists, or tables. `> [!note]` and `> [!insight]` are acceptable only for one or two high-signal statements that would be missed in normal prose. Do not use `> [!risk]` or `> [!warning]` merely because the report has a risk section; keep ordinary risk analysis in paragraphs or tables. Use `risk` or `warning` callouts only when the user explicitly asks for a visual risk/warning box.

Use `###` only when the subsection deserves to appear in the table of contents. If a heading is only grouping examples, company tiers, scenarios, or source notes inside a section, prefer a normal list, table rows, or short paragraphs so the table of contents stays readable. Put source material in a final `# 资料来源` chapter as an ordered list — it renders as compact numbered `[n]` reference entries, not a loose bullet list.

## Delivery Gate

`ok: true` only means no error-level check fired. It is not enough to return success.

Error-level checks fail the build (`ok: false`, exit code 1): dangling `表/图/式 x.x` references, `[n]` beyond the source list, and table rows wider than the header. Fix the content at the reported `path` and rebuild — never work around the gate. `dangling_caption_reference` messages list the document's actual auto-generated numbers; copy from there instead of guessing, or write the skeleton first, build once, then fill in references.

Before returning the final PDF path, inspect `errors` and `warnings` in the CLI JSON result or `build-result.json`. If any warning is present, revise the Markdown/report JSON according to the warning `suggestion` and rebuild once. Return with warnings only when the warning is intentionally acceptable, and mention the remaining warning clearly. Pass `--strict` to promote warning-level checks to failures in CI/batch pipelines.

Treat structural warnings as report-expression feedback, not as factual criticism. They mean the existing content may need clearer prose, fewer checklist-like bullets, fewer callouts, explicit captions, or a better table layout before it becomes a polished formal PDF.

If the CLI returns `heading_manual_numbering`, it has already normalized the rendered title to avoid duplicate numbering. Still revise the Markdown heading to the suggested unnumbered form and rebuild once.

Also inspect `component_counts.callout`. If the report contains callouts and the user did not ask for emphasis boxes, confirm they are only one or two light `note`/`insight` blocks. Rewrite unintended `risk`/`warning` callouts as normal paragraphs or table rows and rebuild before returning.

Avoid these common LLM habits:

- manual heading numbers: `# 一、背景`, `# 1. 背景`, `## （一）方法`;
- conclusion sentences as glossary lines; use paragraphs, tables, or normal lists instead.

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
5. Verify the returned `report_path`, `pdf_path`, and `artifacts.build_result` exist. `build-result.json` should match the stdout JSON.
6. Inspect `component_counts`, `errors`, and `warnings`.
7. If `errors` is non-empty the build already failed — fix the content at each reported `path` and rebuild. If `warnings` is non-empty, treat the output as needing revision unless the warning is intentionally acceptable. Follow each warning's `suggestion`, revise the Markdown/report JSON, and rebuild once before returning final output.
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
