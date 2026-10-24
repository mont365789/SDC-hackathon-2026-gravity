import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evidenceData} from '../dist/career-data.mjs';
import {roles,presets,matchRoles,skills} from '../dist/model.mjs';
import {compareDemand,localDemandForRole,orderDirections,occupationReference} from '../dist/market-evidence.mjs';
import {parseArxivRss,mergeResearchCache,fetchArxivSnapshot} from '../dist/rss.mjs';
import {buildWeeklyPlan,learningExercises} from '../dist/journey.mjs';

test('quarter comparisons use matched categories with correct counts and rates',()=>{
  const d=compareDemand('all_online_job_offerings');assert.equal(d.before,626861);assert.equal(d.after,555509);assert.equal(d.delta,-71352);assert.equal(d.change.toFixed(1),'-11.4');
  assert.equal(compareDemand('software_developers').delta,-190);assert.equal(compareDemand('missing'),null);
  const missing=structuredClone(evidenceData.dosm);delete missing.periods['2026-Q1'].values.software_developers;assert.equal(localDemandForRole('developer',missing),null);
  assert.equal(localDemandForRole('purchasing'),null);assert.equal(localDemandForRole('analyst').level,'broad');
});
test('a network outage preserves the previous feed and does not claim a refresh',async()=>{
  const previous={items:[{title:'Previous paper',url:'https://arxiv.org/abs/2601.00001'}],fetched_at:'2026-10-23T00:00:00Z'};
  const result=await fetchArxivSnapshot(previous,{fetcher:async()=>{throw new Error('offline')},now:'2026-10-24T00:00:00Z'});
  assert.equal(result.status,'stale');assert.equal(result.fetched_at,previous.fetched_at);assert.deepEqual(result.items,previous.items);assert.equal(result.last_attempt_at,'2026-10-24T00:00:00Z');
  const empty=await fetchArxivSnapshot(null,{fetcher:async()=>{throw new Error('offline')}});assert.equal(empty.status,'unavailable');assert.equal(empty.items.length,0);
});
test('market ordering changes with observed related-category data; personal scores do not',()=>{
  const ranked=matchRoles(presets.transition);const before=orderDirections(ranked,{sort:'market'});assert.equal(before[0].id,'developer');
  const changed=structuredClone(evidenceData.dosm);changed.periods['2026-Q2'].values.advertising_and_marketing_professionals=60000;
  const after=orderDirections(ranked,{sort:'market',snapshot:changed});assert.equal(after[0].id,'market');
  assert.deepEqual(new Map(before.map(r=>[r.id,r.score])),new Map(after.map(r=>[r.id,r.score])));
  assert.equal(localDemandForRole('market',changed).before,48186);
});
test('all eight directions have official O*NET tasks and complete preparation coverage',()=>{
  assert.equal(roles.length,8);for(const r of roles){const ref=occupationReference(r.code);assert.ok(ref?.tasks.length);assert.equal(ref.onetsoc_code,r.code);assert.ok(r.required.every(s=>skills[s]&&learningExercises[s]));const p=buildWeeklyPlan(presets.transition,r.id);assert.ok(p.items.length>0)}
});
test('RSS parsing handles entities, empty feeds, external links and failed refresh retention',()=>{
  const xml='<rss><channel><lastBuildDate>Sat, 24 Oct 2026 00:00:00 GMT</lastBuildDate><item><title>A &amp; B</title><link>https://arxiv.org/abs/2601.00001</link><pubDate>Fri, 23 Oct 2026</pubDate></item><item><title>Unsafe</title><link>javascript:alert(1)</link></item></channel></rss>';
  const parsed=parseArxivRss(xml);assert.equal(parsed.items.length,1);assert.equal(parsed.items[0].title,'A & B');assert.ok(parsed.feed_date.startsWith('Sat'));
  assert.throws(()=>parseArxivRss('<html>Error</html>'));
  const old={...parsed,fetched_at:'2026-10-23T00:00:00Z'};const empty=parseArxivRss('<rss><channel></channel></rss>');const merged=mergeResearchCache(old,empty,'2026-10-24T00:00:00Z');assert.equal(merged.status,'stale');assert.equal(merged.fetched_at,old.fetched_at);assert.deepEqual(merged.items,old.items);assert.equal(mergeResearchCache(null,empty,'now').status,'empty');
});
