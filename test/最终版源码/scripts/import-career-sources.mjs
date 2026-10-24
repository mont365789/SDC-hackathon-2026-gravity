// Refresh only verified public reference data. No credentials or personal profiles.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const base=fileURLToPath(new URL('../',import.meta.url));
const sourceRoot='https://www.onetcenter.org/dl_files/database/db_31_0_json/';
const codes=['13-1082.00','13-1111.00','13-1161.00','15-2051.01','15-1252.00','13-1151.00','13-1081.00','13-1023.00'];
const fetchedAt=new Date().toISOString();
async function get(url){const r=await fetch(url,{signal:AbortSignal.timeout(55000)});if(!r.ok)throw new Error(`HTTP ${r.status}: ${url}`);return r}
const tables=await Promise.all(['occupation_data','task_statements'].map(async name=>({name,rows:(await (await get(sourceRoot+name+'.json')).json()).row})));
for(const table of tables){if(!Array.isArray(table.rows))throw new Error('Unexpected O*NET table shape: '+table.name)}
const occupations=tables[0].rows.filter(row=>codes.includes(row.onetsoc_code));
if(occupations.length!==codes.length)throw new Error('Missing occupation reference');
const records=occupations.map(row=>({...row,tasks:tables[1].rows.filter(t=>t.onetsoc_code===row.onetsoc_code).slice(0,3)}));
const dosm=JSON.parse(await readFile(base+'data/source-pack/dosm_excerpt.json','utf8'));
const verification=[];
for(const [period,entry] of Object.entries(dosm.periods)){
  const text=await (await get(entry.source_url)).text();
  const verified=Object.values(entry.values).every(v=>text.includes(v.toLocaleString('en-US')));
  if(!verified)throw new Error('DOSM excerpt does not match release: '+period);
  verification.push({period,source_url:entry.source_url,retrieved_at:new Date().toISOString(),verified:true});
}
const output={onet:{version:'31.0',publisher:'O*NET / U.S. Department of Labor',source_url:'https://www.onetcenter.org/database.html',license:'https://creativecommons.org/licenses/by/4.0/',retrieved_at:fetchedAt,tables:tables.map(t=>sourceRoot+t.name+'.json'),records},dosm:{...dosm,verification},wef:{title:'The Future of Jobs Report 2025',publisher:'World Economic Forum',published_date:'2025-01-07',period:'2025–2030',source_url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',retrieved_at:fetchedAt}};
await mkdir(base+'dist/data',{recursive:true});
await writeFile(base+'dist/career-data.mjs','// Official excerpts; local task/skill crosswalks are separately labelled product interpretations.\nexport const evidenceData='+JSON.stringify(output,null,2)+';\n');
console.log(`Imported ${records.length} O*NET 31.0 occupations; verified ${verification.length} DOSM releases.`);

