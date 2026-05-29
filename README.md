# ReportKit

LLM / Agent 准备内容，ReportKit 负责排版输出 PDF。一个 CLI，接收 Markdown 或 `report.json`，生成稳定、可复现的 Typst 报告。

> **平台支持：** 当前支持 macOS Apple Silicon (arm64)、Linux x64、Windows x64。安装主包时会自动拉取对应平台二进制。

## 安装

```bash
npm install -g @dztabel/reportkit
report-kit --version
# report-kit 0.1.12 (cli-contract 0.1)
```

## 安装 Skill

Skill 让 Agent 知道怎么写出 ReportKit 能正确处理的 Markdown。先 clone 本仓库：

```bash
git clone https://github.com/dztabel-happy/reportkit-cli.git
cd reportkit-cli
```

Codex：

```bash
SKILL_DIR="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$SKILL_DIR"
ln -sfn "$(pwd)/skills/codex/typst-report-kit" "$SKILL_DIR/typst-report-kit"
```

Claude Code：

```bash
SKILL_DIR="$HOME/.claude/skills"
mkdir -p "$SKILL_DIR"
ln -sfn "$(pwd)/.claude/skills/typst-report-kit" "$SKILL_DIR/typst-report-kit"
```

## 用法

准备 `content.md`，然后：

```bash
report-kit build content.md --out ./report
```

输出：

```
report/report.pdf       # 最终 PDF
report/report.json      # 可编辑的结构化报告
report/report.typ       # Typst 源文件
report/build-result.json # 构建诊断（ok/warnings/component_counts）
```

Agent 读取 `build-result.json` 确认 `ok: true`，把 PDF 路径返回给用户即可。

### 典型场景

用户对 Agent 说：

```
帮我调研一下国内储能行业最新进展，整理成报告，用 typst-report-kit 导出 PDF。
```

Agent 搜集资料、组织内容、按 skill 规则写 Markdown、调用 CLI 导出。整个过程对用户透明。

## 输入格式要点

完整规则在 skill 的 `references/report-markdown-contract.md` 里，这里只列关键几条：

- frontmatter 写 title、subtitle、author、date 等元数据
- 标题不编号：写 `# 研究背景`，不写 `# 一、研究背景`
- 表格前加 `表：标题`，图片前加 `图：标题`，公式前加 `公式：标题`
- 公式用 Typst math 语法，乘号写 `times`，不写 `\times`
- 提示框用 `> [!risk]`、`> [!warning]`、`> [!note]`、`> [!insight]`
- 宽表用 `表[landscape]：标题`，紧凑表用 `表[compact]：标题`
- checklist 状态用中文：`- [通过]`、`- [观察]`、`- [未通过]`

示例：

```markdown
---
title: 项目复盘报告
subtitle: Q2 交付总结
author: 产品团队
date: 2026-05-28
---

# 执行摘要

本季度完成三个核心模块的交付。

表：交付检查
| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 用户系统 | 已上线 | 通过压测 |
| 支付对接 | 观察中 | 等待银行回调确认 |

公式：综合评分
$$
Q = 0.5 C + 0.3 L + 0.2 S
$$

> [!insight] 阶段判断
> 整体进度符合预期，支付模块需要额外一周观察期。
```

## 仓库边界

本仓库是公开入口，包含：npm 包元数据、CLI shim、skill 定义、用户文档。

不包含：渲染器源码、私有模板、平台二进制、schema、视觉回归样例。平台二进制通过 npm 平台包分发。

## 版本记录

| 版本 | 变更 |
| --- | --- |
| 0.1.12 | 修复 Windows 全局 npm shim 路径识别；固定 Typst 编译输出为 UTF-8，避免中文 Windows GBK 解码失败 |
| 0.1.11 | 发布 macOS arm64、Linux x64、Windows x64 平台二进制；Windows 平台包改用 `win32-x64` 标准命名 |
| 0.1.10 | 增加跨平台 CI 构建与平台包发布流程 |
| 0.1.9 | 修复正文页码格式（罗马数字→阿拉伯数字），目录引用页码修正 |
| 0.1.8 | 修复标题层级扁平化、`times` 乘号渲染、图片路径解析、后置公式标题容错、checklist 符号映射、横向页空白 |
| 0.1.7 | 首个公开测试版 |

## 反馈

遇到问题请提 [issue](https://github.com/dztabel-happy/reportkit-cli/issues)，附上：

- `report-kit --version` 输出
- `build-result.json` 内容
- 触发问题的 `content.md`（脱敏后）

## 许可

CLI 二进制通过 npm 分发，当前为非开源许可。本仓库中的 skill 定义和文档用于安装和使用 ReportKit，可在该用途下参考。
