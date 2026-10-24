import {test} from 'node:test';
import assert from 'node:assert/strict';
import {presets,matchRoles} from '../dist/model.mjs';
import {cleanWorkDetails,transitionStrategy} from '../dist/work-context.mjs';
import {skillCoverage} from '../dist/discovery-model.mjs';
import {buildWeeklyPlan} from '../dist/journey.mjs';

test('core experience categories exclude AI and expose concrete tasks',()=>{
  const groups=skillCoverage([...presets.transition.skills,'ai']);
  assert.equal(groups.length,4);
  assert.ok(groups.every(group=>group.ids.length>=2&&!group.ids.includes('ai')));
});
test('AI types and proficiency are separate self-reported inputs, without a general fit bonus',()=>{
  const details=cleanWorkDetails({aiUsage:{coding:'independent',analysis:'basic',content:'invalid'},aiFocus:'algorithms'});
  assert.equal(details.aiUsage.coding,'independent');
  assert.equal(details.aiUsage.content,'none');
  assert.equal(details.aiFocus,'algorithms');
  assert.deepEqual(matchRoles(presets.transition,'fast'),matchRoles({...presets.transition,skills:[...presets.transition.skills,'ai'],...details},'fast'));
});
test('income urgency changes the action strategy without claiming a different capability score',()=>{
  const urgent={...presets.transition,context:{priority:'income'}};
  const study={...presets.transition,context:{priority:'study'}};
  assert.equal(transitionStrategy(urgent).id,'income');
  assert.equal(transitionStrategy(study).learnFirst,true);
  assert.deepEqual(matchRoles(urgent),matchRoles(study));
  const urgentPlan=buildWeeklyPlan(urgent,'analyst');
  assert.equal(urgentPlan.items[0].stage,'applications');
  assert.equal(buildWeeklyPlan(study,'analyst').items[0].stage,'story');
  assert.equal(urgentPlan.items.reduce((sum,item)=>sum+item.hours,0),urgentPlan.totalHours);
});
test('a layoff does not infer income urgency or savings',()=>{
  const profile={context:{employment:'left',reason:'layoff'}};
  assert.equal(cleanWorkDetails(profile).context.priority,'unspecified');
  assert.equal(transitionStrategy(profile).id,'explore');
  assert.ok(!Object.hasOwn(cleanWorkDetails(profile).context,'savings'));
});
test('project responsibility, output and future preference survive normalisation',()=>{
  const profile=cleanWorkDetails({project:{name:'流程项目',actions:'协调客户与运营，整理业务报告',result:'交付处理清单'},context:{goal:'newfield',concern:'希望先了解差距'}});
  assert.equal(profile.project.result,'交付处理清单');
  assert.equal(profile.context.goal,'newfield');
  assert.equal(profile.context.concern,'希望先了解差距');
  assert.match(transitionStrategy(profile).actions[0][2],/新领域/);
});
