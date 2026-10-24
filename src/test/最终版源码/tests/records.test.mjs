import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRecordBackup,parseRecordBackup,blankRecordData,recordSummary,RECORD_FILE_LIMIT} from '../dist/records.mjs';
import {buildWeeklyPlan} from '../dist/journey.mjs';
import {presets} from '../dist/model.mjs';

const recordFixture=()=>{
  const profile={...presets.transition,hoursConfirmed:true,project:{name:'售后流程改进',actions:'协调团队，用 Excel 汇总客户问题',result:'交付运营报告'},context:{employment:'left',reason:'layoff',priority:'income',goal:'nearby',concern:'需要尽快恢复收入'},aiUsage:{analysis:'basic'},aiFocus:'verification'};
  const plan=buildWeeklyPlan(profile,'analyst','moderate','2026-10-24T12:00:00Z');
  return {...blankRecordData(),profile,saved:['analyst','project'],target:'analyst',pro:true,profileConfirmed:true,sessionReady:true,goalChosen:true,executionPlans:{analyst:plan},weeklyProgress:{analyst:['analyst:w1']},planReady:{'personal:analyst':true},reflections:[{roleId:'analyst',skillId:'data',before:80,after:95,timestamp:'2026-10-24T12:30:00Z',source:'self-reported'}]};
};

test('record export/import restores experience, circumstances, saved paths and progress',()=>{
  const data=recordFixture();const backup=createRecordBackup(data,'2026-10-24T13:00:00Z');const roundtrip=parseRecordBackup(JSON.stringify(backup));
  assert.equal(roundtrip.data.profile.project.name,data.profile.project.name);assert.equal(roundtrip.data.profile.context.priority,'income');assert.equal(roundtrip.data.profile.aiUsage.analysis,'basic');
  assert.deepEqual(roundtrip.data.saved,data.saved);assert.deepEqual(roundtrip.data.weeklyProgress,data.weeklyProgress);assert.deepEqual(roundtrip.data.executionPlans.analyst.items,data.executionPlans.analyst.items);assert.deepEqual(roundtrip.data.reflections,data.reflections);assert.equal(roundtrip.data.planReady['personal:analyst'],true);assert.equal(roundtrip.data.pro,true);
  assert.deepEqual(recordSummary(roundtrip.data),{hasProfile:true,saved:2,completed:1});
});

test('backups exclude sample identities, app settings and research caches',()=>{
  const source={...recordFixture(),isSample:true,demoProfile:{name:'Synthetic sample'},theme:'light',lang:'ms',research:{secret:'not personal records'}};
  const backup=createRecordBackup(source);assert.equal(backup.data.profile.name,source.profile.name);assert.ok(!JSON.stringify(backup).includes('Synthetic sample'));assert.ok(!('theme' in backup.data));assert.ok(!('research' in backup.data));
});

test('invalid, oversized and incompatible imports are rejected without changing original data',()=>{
  const original=recordFixture();const copy=structuredClone(original);
  for(const text of ['not json','{}',JSON.stringify({format:'other',schemaVersion:1}),JSON.stringify({format:'repath-records',schemaVersion:2,exportedAt:new Date().toISOString(),data:original}),JSON.stringify({...createRecordBackup(original),data:{profile:'invalid'}}),' '.repeat(RECORD_FILE_LIMIT+1)])assert.throws(()=>parseRecordBackup(text));
  assert.deepEqual(original,copy);
});

test('import retains only known record fields and restores canonical resource links',()=>{
  const backup=createRecordBackup(recordFixture());const learning=backup.data.executionPlans.analyst.items.find(x=>x.resource);assert.ok(learning);learning.resource={name:'Unknown',url:'javascript:alert(1)'};
  backup.data.saved.push('__proto__','unknown');backup.data.planReady['sample:analyst']=true;backup.data.executionPlans.unknown={};backup.data.profile.skills.push('not-a-skill');
  const text=JSON.stringify(backup).replace('"saved":','"__proto__":{"polluted":true},"saved":');const imported=parseRecordBackup(text);
  assert.deepEqual(imported.data.saved,['analyst','project']);assert.ok(!('sample:analyst' in imported.data.planReady));assert.ok(!imported.data.executionPlans.unknown);assert.ok(!imported.data.profile.skills.includes('not-a-skill'));assert.equal({}.polluted,undefined);
  assert.ok(imported.data.executionPlans.analyst.items.find(x=>x.resource).resource.url.startsWith('https://learn.microsoft.com/'));
});

test('cleared records contain no personal experience, saved directions or progress',()=>{
  const empty=blankRecordData();assert.deepEqual(recordSummary(empty),{hasProfile:false,saved:0,completed:0});assert.equal(empty.profile.name,'');assert.equal(empty.profile.project.actions,'');assert.equal(empty.profile.context.concern,'');assert.deepEqual(empty.reflections,[]);assert.deepEqual(empty.executionPlans,{});assert.equal(empty.pro,false);assert.equal(empty.profileConfirmed,false);
  assert.deepEqual(parseRecordBackup(JSON.stringify(createRecordBackup(empty))).data,empty);
});
