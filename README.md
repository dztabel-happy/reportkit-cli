# ReportKit

ReportKit 是一个面向 LLM / Agent 的报告导出工具：上游模型负责理解资料、组织内容和形成结论，ReportKit 负责把已经准备好的 Markdown 或 `report.json` 输出成漂亮、稳定、可复现的 Typst PDF。

它适合放在任务的最后一步：当用户需要一份正式 PDF 报告时，Agent 调用 skill，skill 驱动本地 `report-kit` CLI 完成交付。

## 安装 CLI

```bash
npm install -g @dztabel/reportkit
report-kit --version
```

当前公开测试版支持 macOS Apple Silicon，对应平台包是 `@dztabel/reportkit-darwin-arm64`。后续平台会通过同一个 `report-kit` 命令扩展。

## 快速开始：三种调用场景

### 1. 用户上传资料，由 LLM 整理后输出 PDF

用户把会议纪要、调研材料、网页摘录、表格数据或项目文档交给 Agent。Agent 先根据用户目标整理成报告内容，最后调用 `typst-report-kit` skill，把内容导出为 PDF。

示例提示词：

```text
请阅读我上传的资料，整理成一份中文市场分析报告，最后使用 typst-report-kit 输出 PDF。
```

### 2. 任务执行过程中自然需要 PDF 交付

用户一开始未显式要求 PDF，但任务最终明显需要正式交付物，例如咨询报告、复盘报告、研究总结、项目汇报、周报月报。Agent 在完成内容准备后，可以触发 skill 调用 CLI 输出 PDF。

示例提示词：

```text
帮我完成这个项目复盘，最后给我一份正式报告。
```

### 3. 用户显式调用 skill 输出 PDF

用户已经准备好正文，或已经有 Markdown / `report.json`，直接要求使用 skill 导出。

示例提示词：

```text
Use $typst-report-kit to export this prepared report content as a polished PDF:

<paste report content here>
```

## 安装 Skill

先克隆这个公开仓库：

```bash
git clone https://github.com/dztabel-happy/reportkit-cli.git
cd reportkit-cli
```

### Codex

```bash
SKILL_DIR="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$SKILL_DIR"
ln -sfn "$(pwd)/skills/codex/typst-report-kit" "$SKILL_DIR/typst-report-kit"
```

### Claude Code

Claude Code 支持把 skill 放在个人目录 `~/.claude/skills`。安装方式：

```bash
SKILL_DIR="$HOME/.claude/skills"
mkdir -p "$SKILL_DIR"
ln -sfn "$(pwd)/.claude/skills/typst-report-kit" "$SKILL_DIR/typst-report-kit"
```

如果你的 Agent 运行时使用其他 skill 目录，也可以把对应的 `typst-report-kit` skill 文件夹复制或软链接过去。

## 直接使用 CLI

Agent 最终调用的是同一个 CLI。准备好 `content.md`：

```markdown
---
title: 项目复盘报告
subtitle: 阶段交付总结
author: ReportKit
date: 2026-05-26
---

# 执行摘要

本报告基于用户提供的资料整理，目标是形成可交付的 PDF 报告。

表：交付检查
| 事项 | 状态 | 说明 |
| --- | --- | --- |
| 内容整理 | 完成 | Agent 已完成正文组织 |
| PDF 导出 | 待执行 | ReportKit 负责排版和生成 |
```

执行：

```bash
report-kit build content.md --out ./report
```

输出：

```text
report/report.pdf
report/report.json
report/report.typ
report/build-result.json
```

Agent 应读取 CLI 输出的 JSON 或 `build-result.json`，确认 `ok: true`，并把 `report.pdf` 和可编辑的 `report.json` 路径返回给用户。

## 输入契约

ReportKit 接收两类输入：

- LLM / Agent 准备好的 Report Markdown。
- 结构化 `report.json`。

Markdown 中建议显式写出组件语义：

- 章节标题只写标题本身，例如 `# 研究背景与方法论`，不要写 `# 一、研究背景与方法论` 或 `# 1. 研究背景与方法论`。
- `表：标题` 放在 Markdown 表格前。
- `图：标题` 放在图片或图表前；图片路径按 Markdown 文件所在目录解析。
- `公式：标题` 放在行间公式前；公式主体尽量使用 Typst math，例如 `$$ Q = 0.5 content + 0.3 layout $$`，乘号用 `times`。
- 正文表格尽量控制在 7-8 列以内；超过 8 列优先拆表、转附录或转置。确需保留时可用 `表[compact]：标题` 或 `表[landscape]：标题`。
- `> [!risk]`、`> [!warning]`、`> [!note]`、`> [!insight]` 表示提示框。
- 连续多行 `术语：说明` 用于真正的术语或字段解释。
- `- [状态] 标签：说明` 用于验收清单、行动项或交付状态，状态建议使用 `通过`、`观察`、`待调`、`未通过` 等中文词。

普通分析结论、建议、判断和价值归纳应优先写成正文、表格、列表、公式或提示框，不要误写成术语表或清单。

常见错误写法：

```markdown
# 一、研究背景与方法论
- [✓] 资料整理：已完成
阶段性结论：当前方案值得推进
```

推荐写法：

```markdown
# 研究背景与方法论
- [通过] 资料整理：已完成
> [!insight] 阶段性结论
> 当前方案值得推进。
```

## ReportKit 做什么

- 把准备好的内容转换为报告结构。
- 应用稳定的 Typst 报告样式。
- 生成 PDF、Typst 源文件、`report.json` 和构建诊断。
- 固化图题、表题、公式标题、代码块、列表、提示框、长表格等排版规则。
- 为 Agent 返回机器可读的构建结果。

## ReportKit 不做什么

- 不负责搜索网页。
- 不负责判断事实真伪。
- 不替代上游 LLM / Agent 的资料理解和写作过程。
- 不要求普通用户或 Agent 手写 Typst。

## Public Repository Boundary

这个仓库是公开入口，包含 npm wrapper、平台包元数据、Codex skill、Claude Code skill 和用户文档。

它不包含渲染器源码、私有模板、schema、视觉回归样例、构建产物、平台二进制或 source map。平台二进制通过 npm 平台包发布。
