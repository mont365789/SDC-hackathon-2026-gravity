import {test} from 'node:test';
import assert from 'node:assert/strict';
import {presets,matchRoles} from '../dist/model.mjs';
import {buildWeeklyPlan,reflectSkill} from '../dist/journey.mjs';

test('weekly plans account for every planned hour and respect weekly limits',()=>{
  for(const hours of [1,4,6,12,40]){
    const profile={...presets.transition,hours};
    const plan=buildWeeklyPlan(profile,'analyst','moderate','2026-10-24T00:00:00Z');
    assert.equal(plan.items.reduce((sum,x)=>sum+x.hours,0),plan.totalHours);
    assert.ok(plan.items.every(x=>x.hours>0&&x.hours<=hours));
    assert.equal(new Set(plan.items.map(x=>x.id)).size,plan.items.length);
    assert.equal(plan.items.length,Math.ceil(plan.totalHours/hours));
  }
});
test('plans use actual skill gaps and never mark skills as learned',()=>{
  const profile=structuredClone(presets.transition);
  const before=structuredClone(profile);
  const plan=buildWeeklyPlan(profile,'analyst');
  const role=matchRoles(profile).find(x=>x.id==='analyst');
  assert.deepEqual(profile,before);
  assert.ok(plan.items.filter(x=>x.skillId).every(x=>role.missing.includes(x.skillId)));
});
test('explicit self-assessment records a traceable before/after match',()=>{
  const result=reflectSkill(presets.transition,'data','analyst','moderate','2026-10-24T01:00:00Z');
  assert.equal(result.reflection.before,91);
  assert.equal(result.reflection.after,100);
  assert.equal(result.reflection.source,'self-reported');
  assert.ok(result.profile.skills.includes('data'));
  assert.ok(!presets.transition.skills.includes('data'));
});
test('duplicate or unknown self-assessments cannot inflate skills or scores',()=>{
  const once=reflectSkill(presets.transition,'data','analyst');
  const twice=reflectSkill(once.profile,'data','analyst');
  assert.equal(twice.reflection,null);
  assert.deepEqual(twice.profile,once.profile);
  assert.throws(()=>reflectSkill(presets.transition,'invalid','analyst'));
});
