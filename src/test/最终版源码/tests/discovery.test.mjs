import {test} from 'node:test';
import assert from 'node:assert/strict';
import {presets,matchRoles} from '../dist/model.mjs';
import {suggestSkills,skillCoverage} from '../dist/discovery-model.mjs';

test('unconfirmed study time does not affect career matching',()=>{
  const profile={...presets.transition,hoursConfirmed:false};
  const short=matchRoles({...profile,hours:1});
  const long=matchRoles({...profile,hours:20});
  assert.deepEqual(short.map(x=>[x.id,x.score]),long.map(x=>[x.id,x.score]));
  assert.ok(short.every(x=>x.hasTimeEstimate===false));
  assert.equal(short[0].id,'analyst');
});
test('explicit time confirmation enables learning feasibility only after selection',()=>{
  const unconfirmed=matchRoles({...presets.transition,hoursConfirmed:false});
  const confirmed=matchRoles({...presets.transition,hoursConfirmed:true});
  assert.equal(unconfirmed[0].score,88);
  assert.equal(confirmed[0].score,91);
  assert.ok(confirmed.every(x=>x.hasTimeEstimate));
});
test('experience hints use canonical skills with no fabricated proficiency scores',()=>{
  assert.deepEqual(suggestSkills('用 Excel 整理运营报告，协调客户需求'),['communication','coordination','reporting','spreadsheet','operations']);
  assert.ok(suggestSkills('customer communication and Power BI dashboard').includes('data'));
  assert.deepEqual(suggestSkills(''),[]);
});
test('skill chart counts are based on selected unique skills',()=>{
  const groups=skillCoverage(['communication','communication','spreadsheet','invalid']);
  assert.equal(groups.reduce((sum,g)=>sum+g.count,0),2);
  assert.ok(groups.every(g=>g.count>=0&&g.count<=g.total));
});
