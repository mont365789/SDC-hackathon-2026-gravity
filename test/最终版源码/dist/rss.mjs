export function parseArxivRss(xml){
  if(!/<rss[\s>]/i.test(xml))throw new Error('Not an RSS feed');
  const decode=v=>v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&(?:amp|lt|gt|quot|apos);/g,s=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"}[s])).replace(/&#(x[0-9a-f]+|\d+);/gi,(_,v)=>String.fromCodePoint(v[0]==='x'?parseInt(v.slice(1),16):Number(v))).trim();
  const tag=(s,n)=>decode(s.match(new RegExp('<'+n+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+n+'>','i'))?.[1]||'');
  const header=xml.split('<item')[0];
  const items=[...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(([,s])=>({title:tag(s,'title').replace(/\s*\(arXiv:.*$/,''),url:tag(s,'link'),published_date:tag(s,'pubDate'),creator:tag(s,'dc:creator')})).filter(x=>/^https:\/\/arxiv\.org\/abs\//.test(x.url)).slice(0,8);
  return {source:'arXiv cs.AI RSS',source_url:'https://rss.arxiv.org/rss/cs.AI',feed_date:tag(header,'lastBuildDate')||tag(header,'pubDate'),items};
}
export function mergeResearchCache(previous,next,now){
  if(!next.items.length)return {...(previous||next),status:previous?.items?.length?'stale':'empty',last_attempt_at:now,last_error:'empty_feed'};
  return {...next,fetched_at:now,last_attempt_at:now,status:'cached',last_error:null};
}
export async function fetchArxivSnapshot(previous,{fetcher=fetch,now=new Date().toISOString()}={}){
  try{const response=await fetcher('https://rss.arxiv.org/rss/cs.AI',{signal:AbortSignal.timeout(14000)});if(!response.ok)throw new Error('HTTP '+response.status);return mergeResearchCache(previous,parseArxivRss(await response.text()),now)}
  catch{return {...(previous||{source:'arXiv cs.AI RSS',source_url:'https://rss.arxiv.org/rss/cs.AI',items:[]}),status:previous?.items?.length?'stale':'unavailable',last_attempt_at:now,last_error:'network_or_source_unavailable'}};
}
