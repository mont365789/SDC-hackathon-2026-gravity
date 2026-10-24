# RePath · Team Gravity

SDC Hackathon 2026 · Domain 1

RePath is a career exploration prototype for people changing careers, growing in their current roles, or returning to work. It starts with users' existing project experience, identifies transferable skills, compares career directions, and generates an action plan based on the time they can commit each week.

This repository contains the RePath 0.2 source code, a judge evaluation kit, and submission documents. The product interface uses the name RePath.

## Demo and Video

| Resource | Link / Instructions |
| --- | --- |
| Online demo | [Open RePath](https://repath-ai-0-2.lianghuihu.chatgpt.site) |
| Local demo | Download the repository and double-click the [standalone demo](test/本地演示.html) |
| Evaluation guide | [Judge evaluation instructions](test/README.md) |
| Demo video (YouTube) | [Watch the RePath demo](https://youtu.be/V1pJCyuwFq0) |

Access to the hosted demo may be restricted. Confirm that reviewers have access before evaluation. If the site is unavailable, use the local demo or run the source code as described below. The demo's in-product experience requires no registration; hosting access is managed separately.

## Three-Minute Walkthrough

1. Open the demo, select English, click **See an example**, and choose **Changing careers**, **Growing in my role**, or **Returning to work**. All examples are fictional.
2. Review existing skills, recommended career directions, and skill gaps. Compare the eight available career directions.
3. Choose a direction, click **View preparation plan**, confirm your weekly availability, and select **Build my action plan**.
4. Click **Try my full weekly plan** to explore the full Pro weekly tasks, progress tracking, self-assessment, direction comparisons, and plan downloads. No payment is required.

To test personal record management, open **Records → Import records** and select a JSON file from the [sample data folder](test/演示数据/). Importing replaces the current browser's personal records, so export any existing records first. All sample data is fictional; see the [case descriptions](test/演示数据/案例说明.md).

## Run Locally

Requirement: **Node.js 20 or later**. The project uses native HTML, CSS, and JavaScript ES Modules with no third-party npm dependencies. You do not need to run `npm install`.

```bash
git clone https://github.com/mont365789/SDC-hackathon-2026-gravity.git
cd SDC-hackathon-2026-gravity/src/RePath
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser. If you set the `PORT` environment variable, use the address printed in the terminal. If you downloaded a ZIP instead, open `src/RePath/` inside the extracted repository and run `npm start`.

The source entry point, `src/RePath/dist/index.html`, must be served through a web server. The standalone local demo at `test/本地演示.html` can be opened directly by double-clicking it.

Run the existing tests from `src/RePath/`:

```bash
npm test
```

## Repository and Submission Materials

| Path | Contents |
| --- | --- |
| [`src/RePath/`](src/RePath/) | Main source: frontend files in `dist/`, the local server in `server.mjs`, utilities in `scripts/`, tests in `tests/`, and source excerpts in `data/source-pack/` |
| [`src/RePath/README.md`](src/RePath/README.md) | Product details, matching rules, data sources, and implementation limits |
| [`src/RePath/README-GITHUB.md`](src/RePath/README-GITHUB.md) | Source export, local setup, and static deployment instructions |
| [`test/`](test/) | Judge evaluation kit: standalone demo, walkthrough, fictional sample data, and a source copy. Use `src/RePath/` for development |
| [`submission/SDC2026_gravity_Preliminary.pdf`](submission/SDC2026_gravity_Preliminary.pdf) | Preliminary submission document |
| [`submission/RePath_Technical_Tools_Declaration.docx`](submission/RePath_Technical_Tools_Declaration.docx) | Technical tools declaration |
| [`submission/SDC2026_gravity_Replit_POU.pdf`](submission/SDC2026_gravity_Replit_POU.pdf) | Replit proof-of-use materials |
| [`submission/RePath-RunPod-Non-Applicability-Declaration-Gravity.pdf`](submission/RePath-RunPod-Non-Applicability-Declaration-Gravity.pdf) | RunPod non-applicability declaration |

Some linked supporting documents and filenames remain in Chinese. The application supports English as well as Chinese and Bahasa Melayu.

## Implemented Features and Limits

- Eight career directions, skill and experience matching, skill gap explanations, and action plans based on weekly availability.
- Free / Pro demo experiences, saved directions, weekly task progress, self-assessment, and TXT plan downloads.
- Chinese, English, and Bahasa Melayu interfaces, with light and dark themes.
- Personal records stored in the browser, JSON export, import with preview, and deletion with confirmation.

This is a frontend competition demo. Career matching uses rules computed in the browser; **no large language model API is called at runtime**. Match scores do not represent the probability of getting hired. Accounts, subscriptions, and the RM 19/month price are demonstration concepts. The prototype does not process real payments or submit job applications. Personal records are stored in the current browser without cross-device synchronization.

Career information uses source snapshots or summaries from DOSM, O*NET, and WEF. arXiv RSS provides research updates; network or cross-origin restrictions may affect refreshes, while cached content remains available for offline display. See the [source documentation](src/RePath/README.md) for sources, mappings, and limitations.

## License

The code is licensed under [Apache-2.0](src/RePath/LICENSE). Third-party data, logos, and fonts remain subject to their respective terms; see [NOTICE](src/RePath/NOTICE).
