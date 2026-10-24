# RePath · Team Gravity

SDC Hackathon 2026 · Domain 1

RePath 是面向转型求职、在职进阶和重返职场人群的职业探索原型。它从用户已有的项目经历出发，梳理可迁移能力，比较职业方向，并结合每周可投入时间生成行动计划。

本仓库收录 RePath 0.2 源码、评委体验材料和提交文档；产品界面使用 RePath 名称。

## Demo 与视频

| 入口 | 链接 / 说明 |
| --- | --- |
| 在线 Demo | [打开 RePath](https://repath-ai-0-2.lianghuihu.chatgpt.site) |
| 本地 Demo | 下载仓库后，双击 [`test/本地演示.html`](test/本地演示.html) |
| 评委体验说明 | [`test/README.md`](test/README.md) |
| 演示视频（YouTube） | [观看 RePath 演示视频](https://youtu.be/V1pJCyuwFq0) |

在线 Demo 的托管访问权限可能受限，评审前需确认已开放相应权限；无法访问时，可使用本地 Demo 或按下方步骤运行源码。产品内无需注册的演示流程与托管平台访问权限相互独立。

## 3 分钟体验

1. 打开 Demo，点击「看案例」，选择转型求职、在职进阶或重返职场的虚构案例。
2. 查看已有能力、推荐方向与待补能力，比较 8 个职业方向。
3. 选择方向，进入准备方案，确认每周时间并生成行动计划。
4. 点击「体验我的完整周计划」，查看完整周任务、进度、自评、方向对比与计划下载；无需付款。

需要验证个人记录时，可在「记录管理 → 导入记录」选择 [`test/演示数据/`](test/演示数据/) 内的 JSON。导入会替换当前浏览器的个人记录，请先导出已有记录。案例均为虚构，详见[案例说明](test/演示数据/案例说明.md)。

## 本地运行

环境要求：**Node.js 20 或更高版本**。项目使用原生 HTML、CSS、JavaScript ES Modules，无第三方 npm 依赖，无需执行 `npm install`。

```bash
git clone https://github.com/mont365789/SDC-hackathon-2026-gravity.git
cd SDC-hackathon-2026-gravity/src/RePath
npm start
```

浏览器打开 [http://localhost:5173](http://localhost:5173)。若设置了 `PORT` 环境变量，以终端打印的地址为准。下载 ZIP 的用户可直接进入解压目录中的 `src/RePath/` 执行 `npm start`。

源码入口 `src/RePath/dist/index.html` 需要通过服务器运行；可直接双击的独立演示文件位于 `test/本地演示.html`。

在 `src/RePath/` 内运行现有测试：

```bash
npm test
```

## 材料目录

| 路径 | 内容 |
| --- | --- |
| [`src/RePath/`](src/RePath/) | 主源码：`dist/` 前端文件、`server.mjs` 本地服务、`scripts/` 工具、`tests/` 测试、`data/source-pack/` 来源摘录 |
| [`src/RePath/README.md`](src/RePath/README.md) | 产品、匹配规则、数据来源与实现边界 |
| [`src/RePath/README-GITHUB.md`](src/RePath/README-GITHUB.md) | 源码导出、运行与静态部署说明 |
| [`test/`](test/) | 评委体验包：单文件 Demo、体验说明、虚构演示数据与源码副本；开发以 `src/RePath/` 为入口 |
| [`submission/SDC2026_gravity_Preliminary.pdf`](submission/SDC2026_gravity_Preliminary.pdf) | 初赛项目文档 |
| [`submission/RePath_Technical_Tools_Declaration.docx`](submission/RePath_Technical_Tools_Declaration.docx) | 技术与工具声明 |
| [`submission/SDC2026_gravity_Replit_POU.pdf`](submission/SDC2026_gravity_Replit_POU.pdf) | Replit 使用证明材料 |
| [`submission/RePath-RunPod-Non-Applicability-Declaration-Gravity.pdf`](submission/RePath-RunPod-Non-Applicability-Declaration-Gravity.pdf) | RunPod 不适用声明 |

## 已实现功能与技术边界

- 8 个职业方向、能力与经验匹配、能力差距说明、按每周时间生成行动计划。
- Free / Pro 体验、收藏、周任务进度、自评、计划 TXT 下载。
- 中文、English、Bahasa Melayu，深色与浅色主题。
- 浏览器个人记录保存，以及 JSON 导出、预览后导入、确认删除。

当前为前端比赛 Demo。职业匹配使用浏览器中的规则计算，**未接入运行时大模型 API**；匹配分数不代表录用概率。账户、订阅与 RM 19/月定价为演示，无真实支付或招聘投递。个人记录保存在当前浏览器，无跨设备同步。

职业资料采用 DOSM、O*NET 与 WEF 的来源快照或摘要；arXiv RSS 用于研究资讯，网络或跨域限制可能影响刷新，缓存可供离线展示。具体来源、映射与限制见[源码说明](src/RePath/README.md)。

## 许可

代码采用 [Apache-2.0](src/RePath/LICENSE)。第三方数据、Logo 与字体按各自许可使用，详见 [NOTICE](src/RePath/NOTICE)。
