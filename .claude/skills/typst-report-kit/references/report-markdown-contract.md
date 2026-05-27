# Report Markdown Contract

Use this reference when writing Markdown input for `report-kit build`.

## Metadata

```markdown
---
title: 项目复盘报告
subtitle: v0.1
author: ReportKit
client: 内部验证
date: 2026-05-25
confidentiality: 内部资料
---
```

Supported keys: `title`, `subtitle`, `author`, `client`, `date`, `language`, `confidentiality`.

`language` defaults to `zh-CN`. `zh` is accepted and normalized to `zh-CN`.

## Build Diagnostics

`build` returns `component_counts` and `warnings`. Use `component_counts` to check whether special components such as `definition_list` or `checklist` are overused.

Each warning includes `severity`, `component`, `path`, `message`, and `suggestion`. If warnings are present, revise the Markdown or `report.json` once before returning the final PDF path, unless the warning is intentionally acceptable.

## Sections

- If frontmatter has `title`, `#` is a level-1 report section.
- If frontmatter has no `title`, the first `#` becomes the cover title.
- Use `##` and `###` for lower levels.
- Do not manually number headings. Write `# 研究背景与方法论`, not `# 一、研究背景与方法论`; write `## 资料来源`, not `## （一）资料来源`.

## Blocks

```markdown
普通段落会变成 paragraph。

- 无序列表会变成 bullet_list。

1. 有序列表会变成 ordered_list。

> 普通引用会变成 quote。
```

Prefer paragraphs, bullet lists, ordered lists, tables, formulas, figures, and callouts for normal report content.

## Captions

Place captions directly before every table, figure, chart, and display equation.

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

Keep display formulas close to Typst math syntax. Put Chinese explanations in surrounding prose or the `公式：` caption. Avoid LaTeX text macros such as `\text{...}` inside `$$ ... $$`.

## Table Width

Keep body tables within 7-8 columns when possible. If `build` returns `table_too_many_columns` or `table_dense_layout`, do not solve it only by accepting smaller text. Prefer splitting the table by topic, moving detail rows to an appendix, transposing a few-row many-metric table, or moving long explanations into paragraphs/callouts around the table.

Use `表[compact]：title` for a slightly dense table, and `表[landscape]：title` only when a wide table must remain intact.

## Callouts

```markdown
> [!risk] 主要风险
> 如果输入语言过于自由，LLM 会把复杂性带回最终排版。
```

Supported kinds: `risk`, `warning`, `note`, `insight`.

## Definition List

Use definition lists sparingly, usually in glossary, field-description, or appendix sections. Each item must be a short noun-like term followed by its definition. Write at least two consecutive definition lines; a single `术语：说明` line is treated as a normal paragraph.

Do not use definition lists for conclusions, recommendations, value judgments, or analysis sentences. Sentences such as `阶段性结论是：...` and `价值可以归纳为三层：...` should stay as normal paragraphs.

```markdown
组件契约：模板根据组件类型负责排版和编号。
视觉回归：用样张检查 PDF 的真实表现。
```

## Checklist

Use checklists for execution status, acceptance checks, action items, or delivery verification. Do not use checklists for strategic options, market judgments, or conceptual comparisons.

```markdown
- [通过] build 入口：Markdown 可以输出 report.json。
- [待调] 视觉样张：继续补充更多组件组合。
```

Use Chinese status words such as `通过`, `观察`, `待调`, `未通过`. Do not prefer symbolic statuses such as `[✓]`, `[△]`, or `[✗]`.

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
- [通过] 资料整理：已完成。
> [!insight] 阶段性结论
> 当前方案值得推进。
```

## Inline Math

```markdown
综合质量得分 $Q$ 由内容、版式和诊断三部分构成。
```
