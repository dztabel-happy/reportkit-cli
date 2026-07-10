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

Supported keys: `title`, `subtitle`, `author`, `client`, `date`, `language`, `confidentiality`, `list_of_figures`, `list_of_tables`.

You may omit `language`; it defaults to `zh-CN`. `zh` is accepted and normalized to `zh-CN`.

Set `list_of_figures: true` / `list_of_tables: true` to append 图目录 / 表目录 after the main TOC. Entries show the caption number, title, and page number, and jump to the caption. Enable them only for figure/table-heavy reports.

## Build Diagnostics

`build` returns `component_counts`, `errors`, and `warnings` in its JSON output. Use `component_counts` to check whether the report uses the expected mix of paragraphs, lists, tables, figures, equations, and code blocks. Markdown input no longer turns `术语：说明` or `- [状态] ...` into special glossary/checklist components; those lines stay as paragraphs or normal lists.

Each entry includes `severity`, `component`, `path`, `message`, and `suggestion`. Error-level checks fail the build (`ok: false`, exit code 1):

| code | severity | meaning |
| --- | --- | --- |
| `dangling_caption_reference` | error | 正文引用的 表/图/式 x.x 不存在（报错会列出实际存在的编号） |
| `dangling_source_reference` | error | `[n]` 超出资料来源条目数 |
| `table_row_wider_than_columns` | error | 行内单元格多于列数，数据会被丢弃 |
| `table_row_narrower_than_columns` | warning | 行内单元格少于列数，缺口渲染为空白 |
| `table_consider_landscape` | warning | 竖版按正常字号实测放不下才提示，建议 `表[landscape]：` |
| `table_compact_layout_ignored` | warning | 字号已自动化，`表[compact]：` 标记应移除 |
| `unreferenced_caption` | warning | 带题注的表/图从未在正文引用；应在正文用"见表/图 x.x"引出 |
| `manual_numbering_in_title` | warning | 标题带手工编号（模板会自动编号） |
| `flat_section_structure` | warning | 全文无二级标题且存在大体量章节 |
| `mechanical_section_nesting` | warning | 多数一级章只挂唯一一个二级节，像为凑篇幅横向摊开 |

`ok: true` only means no error-level check fired; it does not mean the report is ready to return. If warnings are present, follow their suggestions, revise the Markdown/report JSON, and rebuild once before returning final output. If a warning is intentionally acceptable, mention it in the final response. Pass `--strict` to `report-kit build` to promote warning-level checks to build failures (for CI/batch pipelines); the default is iterate-until-clean.

Warnings do not judge whether the source material is true, and they do not decide the user's point of view. They flag report-expression risks: manually numbered headings, a section with only tables/figures/formulas and no explanatory prose, too many continuous bullet items, checklist-like status bullets such as `- [Done] ...`, excessive callouts, missing captions, unreferenced captions, crowded outlines, or loose trailing source lists.

## Sections

- If frontmatter has `title`, `#` is a level-1 report section.
- If frontmatter has no `title`, the first `#` becomes the cover title.
- Use `##` and `###` for lower levels. Long chapters should be split into `##` subsections — the template numbers them 2.1 / 2.2 automatically and the TOC nests them. A report where every chapter is a flat `#` reads like an outline and triggers `flat_section_structure`:

```markdown
# 市场规模与需求结构

## 渗透率走势

## 区域结构变化
```

- Do not manually number headings. Write `# 研究背景与方法论`, not `# 一、研究背景与方法论`; write `## 资料来源`, not `## （一）资料来源`.
- Do not pad structure the other way either: many level-1 chapters each carrying exactly one `##` subsection reads as mechanical nesting (`mechanical_section_nesting`). Prefer fewer chapters, each with several subsections.
- The importer defensively strips manual heading numbers before rendering so PDF numbering is not duplicated. If the CLI returns `heading_manual_numbering`, revise the Markdown to the suggested unnumbered heading and rebuild once.
- `###` is allowed when the subsection should appear in the table of contents. If it only groups examples, company tiers, scenarios, or source notes inside a section, prefer a normal list, table rows, or short paragraphs.

## Blocks

```markdown
普通段落会变成 paragraph。

- 无序列表会变成 bullet_list。

1. 有序列表会变成 ordered_list。

> 普通引用会变成 quote。
```

Prefer plain paragraphs, bullet lists, ordered lists, tables, formulas, and figures for normal consulting-report content. Use tables for field/status/action summaries when structure matters; otherwise use paragraphs or normal lists. Callouts are low-frequency emphasis blocks, not default containers for ordinary conclusions or risks.

Do not make a section only a pile of tables, figures, or formulas. Add one or two explanatory paragraphs around data blocks when interpretation, assumptions, conclusions, or risk boundaries matter. If the section is raw detail, put it in an appendix-like section or accept the warning explicitly.

Avoid long runs of bullet items. More than five or six action/status/risk bullets often reads like a checklist rather than a formal report section. Use a table for status tracking, or keep only high-signal bullets and move the reasoning back into prose.

Do not use `---` as a decorative separator in body content. The CLI tolerates standalone horizontal-rule lines and strips leading decorative `--- ` prefixes, but normal reports should use headings, paragraphs, or natural page flow instead of decorative Markdown rules.

## Captions and Cross-References

Place captions directly before every table, figure, chart, and display equation. Captions become formal report titles such as `表 2.1` and `图 3.1`, so do not leave them implicit. For figures, keep the image alt text short and different from the formal `图：` caption. Image paths are resolved relative to the Markdown file. For direct `report.json`, absolute figure paths are accepted only when they stay inside an allowed asset root such as the input file directory, output directory, or built-in example assets.

Introduce every table or figure in the surrounding prose before it appears, referencing it as `见表 x.x` / `如图 x.x` / `式 x.x` — these render as clickable cross-references that jump to the block (references written inside table cells are linked too). Professional reports should not show a table or figure first and then explain it afterward.

Chapter numbering counts every level-1 section from 1 — an opening `# 执行摘要` or `# 导论` **is chapter 1**, pushing later chapters up. Table/figure/equation numbers follow their chapter (`表 2.1` = first table in chapter 2). When a `dangling_caption_reference` error fires, its message lists the actual numbers that exist — copy from there instead of guessing, or write the skeleton first, build once, then fill in references.

```markdown
见表 1.1，渠道效率对比应先由正文说明阅读目的，再放置表格。

表：渠道效率对比
| 渠道 | 状态 | 说明 |
| --- | --- | --- |
| Partner Program | 继续投入 | 线索质量稳定。 |
```

## Sources

Put source material in a final `# 资料来源` section (参考文献 / references are also recognized). Use ordered-list items only. ReportKit renders them as `[1] xxxx`, `[2] xxxx` reference entries with hanging indent.

```markdown
公开口径显示，预算压力主要来自回款周期延长[1]。

# 资料来源

1. [国家统计局](https://www.stats.gov.cn/)，公开数据，2026-07-02 访问。
2. [行业协会研究报告](https://example.com/report)，行业资料，2026-07-02 访问。
```

Do not paste naked long URLs into prose or tables. Use `[来源名称](URL)` in the source list. Inline `[1]` / `[2]` citations become clickable superscript references that jump to the entry — inside table cells as well. A `[n]` beyond the number of entries fails the build with `dangling_source_reference`.

```markdown
表：组件映射表
| 输入 | 组件 |
| --- | --- |
| 重点说明 | paragraph |

图：结算瀑布图
![备用图题](examples/assets/settlement_waterfall.pdf)

公式：质量评分口径
$$
Q = 0.5 content + 0.3 layout + 0.2 diagnostics
$$
```

Keep display formulas close to Typst math syntax. Put Chinese explanations in the paragraph or `公式：` caption, use Typst math symbols such as `times` and `dot`, and avoid LaTeX text macros such as `\text{...}` inside `$$ ... $$`. Use real symbols for common operators: write `-`, `+`, `%`, not words such as `minus`, `plus`, or `percent`. For English abbreviations in formulas, keep them as complete identifiers, for example `"ROI"` or `ROI`, not `R O I`. Prefer putting `公式：` before the formula block; if it is immediately after the block, the CLI will attach it to the previous formula. Do not put Typst code escapes such as `#read(...)` in formulas; `report.json` formula fields reject `#`.

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

Column widths and table font size are inferred from the measured content: descriptor columns (说明/建议/观察…) get more room, short columns (序号/状态/等级…) stay narrow, and tables render at the normal size, dropping to the dense tier only when the measured content cannot fit at normal size (typically 8-9 short columns in portrait). Do not try to control table font size; `表[compact]：` from older documents is still accepted but no longer changes anything and triggers a `table_compact_layout_ignored` warning.

If `build` returns `table_consider_landscape`, do not solve it only by accepting smaller text. Prefer splitting the table by topic, moving detail rows to an appendix, transposing a few-row many-metric table, or moving long explanations into paragraphs around the table. Use `表[landscape]：title` only when a wide table must remain intact.

Use direct `report.json` with `widths` only when a table needs exact control.

## Callouts

```markdown
> [!note] 关键说明
> 这句话必须从正文中被快速扫到，且普通段落不足以承载它。
```

Supported kinds: `note`, `insight`, `risk`, `warning`. Use callouts sparingly. `note` and `insight` are acceptable for one or two high-signal statements that would be missed in normal prose. Do not use `risk` or `warning` merely because a report has a risk section; ordinary risks belong in paragraphs, lists, or tables. Use `risk` or `warning` only when the user explicitly asks for a visual risk/warning box.

## Terms and Status Notes

```markdown
组件契约：模板根据组件类型负责排版和编号。
视觉回归：用样张检查 PDF 的真实表现。
- schema 校验：report.json 必须先通过结构校验。
- 组件映射：普通冒号句不应变成特殊组件。
```

These become `paragraph` or `bullet_list`. If a field glossary or action/status summary needs formal structure, use a table. Explicit `report.json` may still contain legacy `definition_list` and `checklist` blocks; Markdown/skill should not generate them for ordinary reports.

Checklist-like bullets such as `- [通过] CLI 可以生成 PDF` stay as normal bullet items, but the CLI may warn because they visually read like a checklist. Use a table for status tracking, or remove the bracketed status prefix when the item is just a normal point.

## Negative Examples

```markdown
# 一、研究背景
## （一）资料来源
- [✓] 资料整理：已完成。
阶段性结论：当前方案值得推进。
> [!risk] 一般风险
> 普通风险说明不应默认放进橙色风险框。
```

```markdown
# 研究背景
## 资料来源
- 资料整理已完成。
阶段性结论是：当前方案值得推进。
```

## Inline Math

```markdown
综合质量得分 $Q$ 由内容、版式和诊断三部分构成。
```
