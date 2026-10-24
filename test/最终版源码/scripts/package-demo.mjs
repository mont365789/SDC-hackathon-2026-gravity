import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const project=fileURLToPath(new URL('../',import.meta.url));
const destination=process.argv[2]?resolve(process.argv[2]):resolve(project,'../RePath-0.2.html');
let html=await readFile(resolve(project,'dist/index.html'),'utf8');
for(const filename of ['styles.css','discovery.css','entry.css','work-profile.css','theme-palette.css','visual-polish.css']){
  const css=await readFile(resolve(project,'dist',filename),'utf8');
  html=html.replace(`<link rel="stylesheet" href="${filename}">`,`<style>${css}</style>`);
}
const modules=['branding.mjs','career-data.mjs','market-evidence.mjs','rss.mjs','model.mjs','i18n.js','journey-i18n.mjs','discovery-i18n.mjs','journey.mjs','discovery-model.mjs','work-context.mjs','records.mjs','experience.mjs','work-profile.mjs','discovery.mjs','career-ui.mjs','app.js'];
const source=[];
for(const filename of modules){
  let text=await readFile(resolve(project,'dist',filename),'utf8');
  text=text.split('\n').filter(line=>!line.startsWith('import ')).join('\n');
  text=text.replace(/\bexport (?=const |function |async function )/g,'');
  source.push(text);
}
let script=source.join('\n');
for(const [asset,type] of [['repath-logo.png','image/png']]){
  const bytes=await readFile(resolve(project,'dist/assets',asset));
  script=script.replaceAll(`assets/${asset}`,`data:${type};base64,${bytes.toString('base64')}`);
}
const favicon=await readFile(resolve(project,'dist/assets/repath-favicon.svg'));
html=html.replace('href="assets/repath-favicon.svg"',`href="data:image/svg+xml;base64,${favicon.toString('base64')}"`);
script=script.replace('render();loadResearch();',`state.research=JSON.parse(document.getElementById('research-data').textContent);render();`);
const check=spawnSync(process.execPath,['--check','--input-type=module'],{input:script,encoding:'utf8'});
if(check.status!==0)throw new Error(check.stderr||'Standalone JavaScript check failed');
const cache=await readFile(resolve(project,'dist/research-cache.json'),'utf8');
const safeCache=JSON.stringify(JSON.parse(cache)).replace(/</g,'\\u003c');
const safeScript=script.replace(/<\/script/gi,'<\\/script');
html=html.replace('<script type="module" src="app.js"></script>',`<script type="application/json" id="research-data">${safeCache}</script>\n<script type="module">${safeScript}</script>`);
await writeFile(destination,html,'utf8');
console.log(`Standalone demo written: ${destination}`);
console.log('Inline JavaScript syntax: PASS');
