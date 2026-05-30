# Report Markdown Contract

Use this reference when writing Markdown input for `report-kit build`.

## Metadata

```markdown
---
title: 项目复盘报告
subtitle: v0.1
author: Report Kit
client: 内部验证
date: 2026-05-25
confidentiality: 内部资料
---
```

Supported keys: `title`, `subtitle`, `author`, `client`, `date`, `language`, `confidentiality`.

You may omit `language`; it defaults to `zh-CN`. `zh` is accepted and normalized to `zh-CN`.

## Build Diagnostics

`build` returns `component_counts` and `warnings` in its JSON output. Use `component_counts` to check whether the report uses the expected mix of paragraphs, lists, tables, figures, equations, callouts, and code blocks. Markdown input no longer turns `术语：说明` or `- [状态] ...` into special glossary/checklist components; those lines stay as paragraphs or normal lists.

Each warning includes `severity`, `component`, `path`, `message`, and `suggestion`. `ok: true` only means the PDF was produced; it does not mean the report is ready to return. If warnings are present, follow their suggestions, revise the Markdown/report JSON, and rebuild once before returning final output. If a warning is intentionally acceptable, mention it in the final response.

## Sections

- If frontmatter has `title`, `#` is a level-1 report section.
- If frontmatter has no `title`, the first `#` becomes the cover title.
- Use `##` and `###` for lower levels.
- Do not manually number headings. Write `# 研究背景与方法论`, not `# 一、研究背景与方法论`; write `## 资料来源`, not `## （一）资料来源`.
- `###` is allowed when the subsection should appear in the table of contents. If it only groups examples, company tiers, scenarios, or source notes inside a section, prefer a normal list, table rows, or short paragraphs.

## Blocks

```markdown
普通段落会变成 paragraph。

- 无序列表会变成 bullet_list。

1. 有序列表会变成 ordered_list。

> 普通引用会变成 quote。
```

Prefer plain paragraphs, bullet lists, ordered lists, tables, formulas, figures, and callouts for normal consulting-report content. Use tables for field/status/action summaries when structure matters; otherwise use paragraphs or normal lists.

Do not use `---` as a decorative separator in body content. The CLI tolerates standalone horizontal-rule lines and strips leading decorative `--- ` prefixes, but normal reports should use headings, paragraphs, callouts, or page breaks instead of decorative Markdown rules.

Keep end-of-report source notes compact. A short paragraph or compact table is usually better than a long trailing bullet list, because long source lists can leave a sparse final page.

## Captions

Place captions directly before every table, figure, chart, and display equation. Captions become formal report titles such as `表 2.1` and `图 3.1`, so do not leave them implicit. For figures, keep the image alt text short and different from the formal `图：` caption. Image paths are resolved relative to the Markdown file.

```markdown
表：组件映射表
| 输入 | 组件 |
| --- | --- |
| 风险提示 | callout |

图：结算瀑布图
![备用图题](examples/assets/settlement_waterfall.pdf)

公式：质量评分口径
$$
Q = 0.5 content + 0.3 layout + 0.2 diagnostics
$$
```

Keep display formulas close to Typst math syntax. Put Chinese explanations in the paragraph or `公式：` caption, use Typst math symbols such as `times` and `dot`, and avoid LaTeX text macros such as `\text{...}` inside `$$ ... $$`. Use real symbols for common operators: write `-`, `+`, `%`, not words such as `minus`, `plus`, or `percent`. For English abbreviations in formulas, keep them as complete identifiers, for example `"ROI"` or `ROI`, not `R O I`. Prefer putting `公式：` before the formula block; if it is immediately after the block, the CLI will attach it to the previous formula.

Good:

```markdown
公式：AI 项目综合 ROI 计算
$$
ROI = (Delta_P times T - C) / C times 100%
$$
```

Avoid:

```markdown
$$
R O I = (Delta P times T minus C) / C times 100 percent
$$
```

## Table Width

Keep body tables within 7-8 columns when possible. If `build` returns `table_too_many_columns` or `table_dense_layout`, do not solve it only by accepting smaller text. Prefer splitting the table by topic, moving detail rows to an appendix, transposing a few-row many-metric table, or moving long explanations into paragraphs/callouts around the table.

Use `表[compact]：title` for a slightly dense table, and `表[landscape]：title` only when a wide table must remain intact.

## Callouts

```markdown
> [!risk] 主要风险
> 如果输入语言过于自由，LLM 会把复杂性带回最终排版。
```

Supported kinds: `risk`, `warning`, `note`, `insight`.

## Terms and Status Notes

```markdown
组件契约：模板根据组件类型负责排版和编号。
视觉回归：用样张检查 PDF 的真实表现。
- schema 校验：report.json 必须先通过结构校验。
- 组件映射：普通冒号句不应变成特殊组件。
```

These become `paragraph` or `bullet_list`. If a field glossary or action/status summary needs formal structure, use a table. Explicit `report.json` may still contain legacy `definition_list` and `checklist` blocks; Markdown/skill should not generate them for ordinary reports.

## Negative Examples

```markdown
# 一、研究背景
## （一）资料来源
- [✓] 资料整理：已完成。
阶段性结论：当前方案值得推进。
```

```markdown
# 研究背景
## 资料来源
- 资料整理已完成。
> [!insight] 阶段性结论
> 当前方案值得推进。
```

## Inline Math

```markdown
综合质量得分 $Q$ 由内容、版式和诊断三部分构成。
```
