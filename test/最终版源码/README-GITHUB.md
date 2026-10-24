# RePath 完整源码：GitHub 上传与运行

本 ZIP 从当前线上版本的 Git 提交导出。原始 53 个项目文件保持不变，另附本说明、来源信息和 SHA-256 文件校验清单。

## 本地运行

1. 解压后进入 RePath 文件夹，即 package.json 所在目录。
2. 使用 Node.js 20 或更高版本，运行 `npm start` 或 `node server.mjs`。
3. 在浏览器打开 http://localhost:5173 。如果设置了 PORT，以终端输出为准。

本项目没有第三方 npm 依赖，无需 npm install。页面使用 JavaScript ES Modules，请通过服务器运行，不要直接双击 index.html。

运行现有测试：`npm test`。

## 上传 GitHub

创建 GitHub 仓库后，通过 Add file → Upload files 上传解压后的 RePath 文件夹内的项目文件及子目录，再提交。不要只上传 ZIP 本身，否则仓库无法直接浏览和修改源码。也可用 Git 或 GitHub Desktop 在此目录提交并推送。

请保留 .gitignore、.openai/hosting.json 等以点开头的配置文件。包内没有 .git 历史、访问令牌或浏览器个人记录。

上传 GitHub 只保存代码，不会自动发布网站。需要部署时，将 dist/ 设为静态网站根目录，无需构建。GitHub Pages 可通过自定义 Actions 发布 dist/，本导出未添加自动部署流程。

## 目录说明

- dist/：可编辑的 HTML、CSS、JavaScript/MJS、Logo、图标和数据缓存。项目采用原生前端，这些文件本身就是运行源码。
- data/source-pack/：职业方向资料摘录和来源目录。
- scripts/：资料导入、研究缓存刷新、主题和单文件演示打包工具。
- tests/：现有功能测试。
- server.mjs、package.json、.replit：本地运行与项目配置。
- .openai/hosting.json：原 Sites 静态托管配置，包含来源项目 ID，不含部署凭据，不影响本地运行。
- README.md、LICENSE、NOTICE：产品说明、开源许可与第三方资源说明。
- release.json、AGENTS.md：原版发布信息和开发协作约定，保留原文。
- SOURCE-EXPORT.json、SHA256SUMS.txt：本次导出的来源和校验清单。

## 对应版本

- 网站：https://repath-ai-0-2.lianghuihu.chatgpt.site
- 源码提交：ae4e5901f51fa6d4028d80a680dc4ef2fc1c100e
- 包含深浅主题、中英马三语、项目经历、职业方向、Free/Pro 演示、行动计划、收藏，以及记录导入/导出/删除。
- 运行时使用浏览器匹配规则，不调用大模型 API；个人记录保存在浏览器，源码包不携带这些记录。
- 刷新职业资料或 arXiv 缓存需要网络；包内已保留当前资料快照和研究缓存。

数据边界和资源许可详见 README.md 与 NOTICE。
