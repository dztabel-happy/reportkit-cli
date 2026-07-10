# Changelog

## 0.1.29

- 根治 Linux 字体回退：楷体备选链加入 Linux 可自由获得的 AR PL UKai CN（fonts-arphic-ukai）与 LXGW WenKai（霞鹜文楷），有更好的楷体就用、没有才退宋体系兜底；等宽栈加入 DejaVu Sans Mono / Liberation Mono。
- 新增 `kai_font_fallback` 警告：楷体候选全部缺失、正文退为宋体观感时明确提示（区别于完全无中文字体的 `cjk_font_missing`）。
- README 新增 Linux 字体标准安装方案：西文首选 MS Core Fonts（真 Times New Roman），楷体首选 fonts-arphic-ukai，自备字体走 TYPST_FONT_PATHS（Typst 按真实 family name 匹配，不认 fontconfig 别名）。
- CI 三平台统一下载固定版本楷体/宋体字体（sha256 校验）验证真实楷体渲染；macOS 跑器同样无中文字体，系统字体不可依赖。
- 安全加固（外部审查修复）：`figure.width` 只接受明确的长度/百分比语法，阻断 Typst 代码注入；未闭合 frontmatter 现在报错而不是静默吞掉全文；题注只对紧邻的下一个块生效，不再跨章节错误附着（新增 caption_without_target 警告）。
- 排版修复：图与图题强制同页，不再被分页拆开。
- 契约修复：`--strict` 提升的检查在 errors 中以 error 级呈现，符合 build-result schema；移除从未生效的 theme.accent/theme.density 字段；模板 manifest 补上 source_list。
- 供应链加固：Typst 运行时与 CI 字体下载全部固定 sha256 并强制校验；GitHub Actions 固定完整 commit SHA、声明最小权限；发布门禁（版本锁步/skill 漂移/包边界）在 CI 强制执行，skill 漂移改为内容哈希比较。

## 0.1.28

- 新增图目录/表目录：frontmatter `list_of_figures: true` / `list_of_tables: true` 在主目录后追加 图目录/表目录，条目带页码并可跳转到题注。
- 表格单元格内的“见表/图/式 x.x”与 [n] 来源引用现在同样渲染为可点击链接，与正文行为一致。
- 新增中文字体降级检测：正文字体栈全部缺失时返回 `cjk_font_missing` warning，防止 Linux 服务器上静默产出方块字 PDF。
- 示例与 skill 全面示范“少数章 × 多小节”的分层结构；SKILL 高频规则强调长章必须配 `##` 小节。

## 0.1.27

- 题注编号与正文交叉引用：表/图/公式按章自动编号，正文"见表 x.x / 如图 x.x / 式 x.x"渲染为可点击链接；悬空引用成为 error 级门禁并列出实际存在的编号。
- 参考文献体系：文末"资料来源"章节的有序条目自动转为 `source_list`，渲染为 [1] [2] 参考文献条目（支持 `[名称](url)` 链接）；正文 `[n]` 引用渲染为可点击上标，超范围引用报错。
- 列宽算法重写：基于文字度量（中文按双宽）与换行规划的多目标成本优化，说明列自动加宽、短列保持紧凑；表格字号改为自动决定，`表[compact]` 不再改变字号并提示移除。
- 内容门禁对齐 DocxKit：新增 unreferenced_caption、table_consider_landscape（实测替代字符数猜测）、flat_section_structure、mechanical_section_nesting、表格行列不匹配等检查；build 返回结构化 `errors` 字段，新增 `--strict`。
- 修复 minimal-cn 模板表/图计数器不随章节重置的编号错误。

## 0.1.26

- 增强 CLI `--help` 和各子命令帮助，明确 Agent 推荐入口、参数边界和输出文件。

## 0.1.25

- 从默认 Markdown / skill 路径移除术语表和 checklist，改用正文、普通列表、表格表达。

## 0.1.24

- 取消单行“标签：说明”的噪声诊断，减少正式报告正文中的 false positive warning。

## 0.1.23

- 增加目录密度和末尾来源列表诊断，保留正常三级目录，提醒 Agent 收敛过碎结构。

## 0.1.22

- 修复普通文本中的 `@` 转义，避免 npm 包名、邮箱或账号被 Typst 误判为引用。

## 0.1.21

- 增加模板扩展边界和发行前模板契约检查；默认中文交付报告风格保持不变。

## 0.1.20

- 短代码块默认整体保留，避免配置片段被分页拆开；长代码块仍可跨页。

## 0.1.19

- 修复 `approx` 近似符号被当作普通文本的问题。

## 0.1.18

- 修复带中文引号下标的公式归一化，避免 `Delta_"收益"` 生成多余引号。

## 0.1.17

- 增加公式文本运算符诊断；同步 Claude Code skill 的输出目录、warnings 和公式规则。

## 0.1.16

- 增加 `reportkit` 命令别名；skill 默认输出到 `./output_report`；过滤正文中的 Markdown 分隔线装饰符。

## 0.1.15

- 安装文档改为显式安装平台包；缺少平台包时 CLI 输出精确补装命令。

## 0.1.14

- 将目录 leader 改为强制字体的中点填充，修复 Windows 上目录点线变粗变散的问题。

## 0.1.13

- 强化 warnings 交付门禁；缺少说明的 checklist 自动使用更稳的两列兜底排版。

## 0.1.12

- 修复 Windows 全局 npm shim 路径识别；固定 Typst 编译输出为 UTF-8，避免中文 Windows GBK 解码失败。

## 0.1.11

- 发布 macOS arm64、Linux x64、Windows x64 平台二进制；Windows 平台包改用 `win32-x64` 标准命名。

## 0.1.10

- 增加跨平台 CI 构建与平台包发布流程。

## 0.1.9

- 修复正文页码格式（罗马数字→阿拉伯数字），目录引用页码修正。

## 0.1.8

- 修复标题层级扁平化、`times` 乘号渲染、图片路径解析、后置公式标题容错、checklist 符号映射、横向页空白。

## 0.1.7

- 首个公开测试版。
