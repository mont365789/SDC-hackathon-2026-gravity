import {readFile,writeFile} from 'node:fs/promises';
import {fetchArxivSnapshot} from '../dist/rss.mjs';
const path=new URL('../dist/research-cache.json',import.meta.url);
let previous;try{previous=JSON.parse(await readFile(path,'utf8'));if(previous.source!=='arXiv cs.AI RSS')previous=null}catch{}
const now=new Date().toISOString();
const cache=await fetchArxivSnapshot(previous,{now});
await writeFile(path,JSON.stringify(cache,null,2)+'\n');
console.log(JSON.stringify({status:cache.status,items:cache.items.length,fetched_at:cache.fetched_at||null,error:cache.last_error}));
