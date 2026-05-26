# Report Markdown Examples

Use these examples as patterns. Replace content with the user's prepared material; do not invent sources.

## Project Review

```markdown
---
title: 项目复盘报告
subtitle: 阶段交付复盘
author: Report Kit
date: 2026-05-25
confidentiality: 内部资料
---

# 执行摘要

本报告总结项目目标、当前状态、主要风险和后续动作。

- 目标闭环已经形成。
- 视觉样式仍需通过真实 PDF 校准。
- 后续重点是稳定输入契约。

> [!risk] 主要风险
> 如果输入语言过于自由，交付质量会重新依赖模型临场发挥。

# 进展检查

表：阶段状态
| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| 模板 | 完成 | 已抽出 executive-cn |
| CLI | 完成 | 支持 build/validate/render |
| Skill | 进行中 | 需要更多真实样例 |

# 交付核对

- [完成] CLI build：Markdown 可以生成 report.json 和 PDF。
- [进行中] Skill 触发：继续用真实任务压力测试。
```

## Market Analysis

```markdown
---
title: 市场分析报告
subtitle: 结构化交付样例
author: Report Kit
date: 2026-05-25
---

# 核心判断

本报告基于用户已经提供的材料组织结论，不负责额外搜索。

阶段性结论是：当前机会来自交付层确定性，而不是继续扩展资料搜索能力。

市场吸引力 $S$ 可由需求、供给和风险三部分综合判断。

公式：评分口径
$$
S = 0.4 demand + 0.3 supply + 0.3 risk
$$

表：机会评估
| 维度 | 判断 | 依据 |
| --- | --- | --- |
| 需求 | 较强 | 用户材料显示需求集中 |
| 风险 | 中等 | 仍需验证交付稳定性 |

> [!insight] 组件选择
> 市场判断、阶段性结论和价值假设应优先写成正文、表格或提示框，不要写成术语列表。
```

## Weekly Summary

```markdown
---
title: 周报总结
subtitle: 本周进展与下周计划
author: Report Kit
date: 2026-05-25
---

# 本周进展

1. 完成核心功能验证。
2. 补充输入契约。
3. 建立可复用导出流程。

# 下周计划

1. 增加更多 Markdown 组件识别。
2. 建立样例任务集。

> [!note] 说明
> 周报适合保持短句、清单和状态表，避免堆叠长段落。

# 交付核对

- [待办] 组件识别：补充更多 Markdown 映射规则。
- [待办] 样例任务集：建立可重复压力测试样例。
```
