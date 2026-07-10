<h1 align="center">ReportKit</h1>

<p align="center">面向 Agent 的正式报告导出工具</p>

<p align="center">
  <a href="README.md">English</a>
  ·
  <a href="#安装">安装</a>
  ·
  <a href="#快速开始">快速开始</a>
  ·
  <a href="#效果预览">效果预览</a>
</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/@dztabel/reportkit?label=npm">
  <img alt="platforms" src="https://img.shields.io/badge/platform-macOS%20arm64%20%7C%20Linux%20x64%20%7C%20Windows%20x64-blue">
</p>

---

用户提供资料或报告目标，Agent 负责整理内容，ReportKit 负责把最终内容导出为排版稳定、可交付的 PDF 报告。

用户可以提供任意可被 Agent 读取和理解的资料，例如：

- 文档、表格、网页、截图或已有报告。
- 项目材料、调研资料、会议纪要或数据摘要。
- 一个明确的报告主题，由 Agent 自行检索和整理资料。

## 效果预览

以下截图展示 ReportKit 的默认报告效果。

| | | |
|:---:|:---:|:---:|
| <sub><strong>封面</strong></sub> | <sub><strong>正文与表格</strong></sub> | <sub><strong>图表混排</strong></sub> |
| <img src="examples/showcase/reference/01-executive-cover.png" alt="ReportKit 封面" width="260"> | <img src="examples/showcase/reference/02-centered-tables.png" alt="ReportKit 正文与表格" width="260"> | <img src="examples/showcase/reference/03-figure-and-table.png" alt="ReportKit 图表混排" width="260"> |
| <sub><strong>长表格</strong></sub> | <sub><strong>战略报告</strong></sub> | <sub><strong>技术报告</strong></sub> |
| <img src="examples/showcase/reference/04-long-table.png" alt="ReportKit 长表格" width="260"> | <img src="examples/showcase/reference/05-strategy-consulting.png" alt="ReportKit 战略咨询报告" width="260"> | <img src="examples/showcase/reference/06-technical-architecture.png" alt="ReportKit 技术方案报告" width="260"> |

## 安装

### 1. 安装 CLI

```bash
npm install -g @dztabel/reportkit
report-kit --version
```

出现类似输出代表 CLI 安装成功：

```text
report-kit 0.1.28
```

### 2. 安装 Agent skill（二选一）

#### 2.1 Codex

```bash
git clone https://github.com/dztabel-happy/reportkit-cli.git
cd reportkit-cli

node -e "const fs=require('fs'),os=require('os'),path=require('path');const src=path.join(process.cwd(),'skills','codex','typst-report-kit');const dest=path.join(os.homedir(),'.agents','skills','typst-report-kit');fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(src,dest,{recursive:true});console.log('Codex skill installed');"
```

检查 Codex skill 是否安装成功，在终端中输入：

```bash
node -e "const fs=require('fs'),os=require('os'),path=require('path');const p=path.join(os.homedir(),'.agents','skills','typst-report-kit','SKILL.md');if(!fs.existsSync(p))process.exit(1);console.log('Codex skill installed');"
```

出现以下输出代表成功：

```text
Codex skill installed
```

打开 Codex 后输入 `$typst-report-kit`。能按 `Tab` 选中该 skill，代表可用。若未出现，按 `Cmd+K` / `Ctrl+K` 选择 `Force Reload Skills`，或重新打开 Codex。

#### 2.2 Claude Code

```bash
git clone https://github.com/dztabel-happy/reportkit-cli.git
cd reportkit-cli

node -e "const fs=require('fs'),os=require('os'),path=require('path');const src=path.join(process.cwd(),'.claude','skills','typst-report-kit');const dest=path.join(os.homedir(),'.claude','skills','typst-report-kit');fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(src,dest,{recursive:true});console.log('Claude Code skill installed');"
```

检查 Claude Code skill 是否安装成功，在终端中输入：

```bash
node -e "const fs=require('fs'),os=require('os'),path=require('path');const p=path.join(os.homedir(),'.claude','skills','typst-report-kit','SKILL.md');if(!fs.existsSync(p))process.exit(1);console.log('Claude Code skill installed');"
```

出现以下输出代表成功：

```text
Claude Code skill installed
```

打开 Claude Code 后输入 `/typst-report-kit`。能选中该 skill，代表可用。若未出现，输入 `/reload-skills` 后重试；旧版本 Claude Code 可重新打开窗口。

## 快速开始

### 1. 用户带资料生成报告

```text
$typst-report-kit 请读取我上传的 Excel、PDF 和会议纪要，整理成一份正式项目复盘报告并导出 PDF。
/typst-report-kit 请读取我上传的 Excel、PDF 和会议纪要，整理成一份正式项目复盘报告并导出 PDF。
```

### 2. 用户只给目标，Agent 自行调研

```text
$typst-report-kit 请调研国内储能行业最新进展，整理成行业研究报告并导出 PDF。
/typst-report-kit 请调研国内储能行业最新进展，整理成行业研究报告并导出 PDF。
```

### 3. 用户已有草稿，Agent 重写成可交付报告

```text
$typst-report-kit 请把这份散乱的草稿改写成结构清晰的正式分析报告并导出 PDF。
/typst-report-kit 请把这份散乱的草稿改写成结构清晰的正式分析报告并导出 PDF。
```

### 4. 用户基于反馈迭代报告

```text
$typst-report-kit 请把刚才生成的报告压缩到 8 页，第二章改成更适合管理层阅读的版本，并重新导出 PDF。
/typst-report-kit 请把刚才生成的报告压缩到 8 页，第二章改成更适合管理层阅读的版本，并重新导出 PDF。
```

Agent 会完成资料读取、调研、正文组织、格式约束和 PDF 导出。

## 技术细节

报告排版由 ReportKit 统一保证：

- 表、图、公式按章节自动编号（表 2.1 / 图 3.1），正文中的“见表 x.x / 如图 x.x / 式 x.x”会渲染为可点击的交叉引用。
- 文末“资料来源”章节的有序条目渲染为 [1] [2] 参考文献格式，正文中的 [n] 引用会变成可点击的上标。
- 表格列宽和字号由内容实测决定：说明类长列自动加宽，短列保持紧凑，放不下才降紧凑字号。
- 构建返回结构化 errors / warnings：悬空引用等可证明缺陷会让构建失败，并附带可执行的修复建议。

Agent 会自动把资料整理成 ReportKit 可处理的中间内容，并调用：

```bash
report-kit build prepared-report.md --out ./report
```

ReportKit 输出：

```text
report/report.pdf
report/report.json
report/report.typ
report/<template-id>.typ
report/render-result.json
report/build-result.json
```

## 排障

当前公开测试版支持 macOS Apple Silicon、Linux x64 和 Windows x64。

如果全局 npm 安装跳过了 optional dependencies，显式安装对应平台包：

```bash
# macOS Apple Silicon
npm install -g @dztabel/reportkit @dztabel/reportkit-darwin-arm64

# Linux x64
npm install -g @dztabel/reportkit @dztabel/reportkit-linux-x64

# Windows x64
npm install -g @dztabel/reportkit @dztabel/reportkit-win32-x64
```

构建失败时，提交 issue 请附：

- `report-kit --version`
- `report/build-result.json`
- 可复现问题的最小 `content.md`

## 版本记录

见 [`CHANGELOG.md`](CHANGELOG.md)。

## 仓库范围

本公开仓库包含 npm wrapper 元数据、命令 shim、公开 skills、文档和轻量预览资产。

渲染器源码、私有模板、schemas、视觉回归样例和平台二进制不包含在本仓库中。平台二进制通过 npm 平台包分发。

## 许可

ReportKit 以专有 CLI 二进制形式通过 npm 分发。本仓库提供用于安装和使用 CLI 的公开 wrapper、skills 和文档。
