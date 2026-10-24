import {skills,matchRoles,resources} from './model.mjs';

// Planning is illustrative. Completion never automatically verifies a skill.
export function buildWeeklyPlan(profile,roleId,scenario='moderate',createdAt=new Date().toISOString()) {
  const role=matchRoles(profile,scenario).find(r=>r.id===roleId);
  if(!role)throw new Error('Unknown target role');
  const weeklyHours=Math.max(1,Math.min(40,Number(profile.hours)||6));
  const weekCount=Math.ceil(role.hours/weeklyHours);
  const items=Array.from({length:weekCount},(_,index)=>{
    const fraction=weekCount===1?.5:index/(weekCount-1);
    const stage=index===0&&profile.context?.priority==='income'?'applications':weekCount===1?'sprint':index===0?'story':index===weekCount-1?'review':fraction>.7?'project':'learn';
    const learningIndex=Math.max(0,Math.min(role.missing.length-1,Math.floor(fraction*Math.max(1,role.missing.length))));
    const skillId=stage==='learn'?(role.missing[learningIndex]||null):null;
    const resource=skillId&&['data','reporting','spreadsheet'].includes(skillId)?resources.data:skillId&&['planning','budgeting'].includes(skillId)?resources.project:null;
    return {id:`${roleId}:w${index+1}`,week:index+1,hours:Math.min(weeklyHours,role.hours-index*weeklyHours),stage,skillId,resource};
  });
  const learning=items.filter(item=>item.stage==='learn'&&role.missing.length);
  learning.forEach((item,index)=>{
    item.skillId=role.missing[Math.min(role.missing.length-1,Math.floor(index*role.missing.length/learning.length))];
  });
  for(const skillId of role.missing){
    const group=learning.filter(item=>item.skillId===skillId);
    group.forEach((item,index)=>{
      item.phase=group.length===1?'apply':['foundation','apply','validate','present'][Math.floor(index*4/group.length)];
      item.resource=['data','reporting','spreadsheet'].includes(skillId)?resources.data:['planning','budgeting'].includes(skillId)?resources.project:null;
    });
  }
  return {schemaVersion:3,roleId,createdAt,scenario,baselineScore:role.score,baselineSkills:[...profile.skills],weeklyHours,totalHours:role.hours,items};
}

export function reflectSkill(profile,skillId,roleId,scenario='moderate',timestamp=new Date().toISOString()) {
  if(!Object.hasOwn(skills,skillId))throw new Error('Unknown skill');
  if(profile.skills.includes(skillId))return {profile,reflection:null};
  const before=matchRoles(profile,scenario).find(r=>r.id===roleId);
  if(!before)throw new Error('Unknown target role');
  const updated={...profile,skills:[...profile.skills,skillId]};
  const after=matchRoles(updated,scenario).find(r=>r.id===roleId);
  return {profile:updated,reflection:{skillId,roleId,before:before.score,after:after.score,timestamp,source:'self-reported'}};
}

export const learningExercises={
  communication:['写一页项目进展说明，为客户与内部团队分别调整信息重点。','Write a project update and adapt it for a client and an internal team.','Tulis kemas kini projek untuk pelanggan dan pasukan dalaman.'],
  coordination:['为一个样例项目建立职责表，安排一次进度同步。','Create a responsibility map and a check-in schedule for a sample project.','Bina peta tanggungjawab dan jadual semakan projek contoh.'],
  reporting:['用公开样例重写一份运营报告，分清观察、证据与建议。','Rewrite a sample operations report, separating observations, evidence and recommendations.','Tulis semula laporan operasi contoh dengan pemerhatian, bukti dan cadangan.'],
  spreadsheet:['清理公开样例数据，制作透视表，并添加两项数据检查。','Clean a public sample dataset, build a pivot table and add two data checks.','Bersihkan set data awam, bina jadual pangsi dan dua semakan data.'],
  operations:['绘制一个熟悉的业务流程，找出瓶颈并提出可检验的改进。','Map a familiar business process, identify a bottleneck and propose a testable improvement.','Petakan proses perniagaan, kenal pasti masalah dan cadangkan penambahbaikan.'],
  research:['设计五个客户访谈问题，区分已有证据与待验证的假设。','Design five customer interview questions and separate evidence from assumptions.','Reka lima soalan temu bual pelanggan dan bezakan bukti daripada andaian.'],
  data:['用公开示例数据制作一页可视化报告，解释三个业务发现。','Build a one-page visual report from public sample data and explain three business insights.','Bina laporan visual satu halaman daripada data awam dan terangkan tiga cerapan.'],
  planning:['把样例项目拆成目标、里程碑、依赖关系和验收标准。','Break a sample project into goals, milestones, dependencies and acceptance criteria.','Pecahkan projek contoh kepada matlamat, pencapaian, kebergantungan dan kriteria.'],
  budgeting:['用合成数据制作一份项目预算，记录假设并检查预算偏差。','Build a project budget with synthetic data, recording assumptions and checking variances.','Bina belanjawan projek menggunakan data rekaan dan semak perbezaan.'],
  sql:['用公开样例数据编写筛选、分组和连接查询，并核对结果。','Write filtering, grouping and join queries on public sample data; check the results.','Tulis pertanyaan penapis, kumpulan dan cantuman pada data awam; semak hasil.'],
  programming:['为合成业务案例开发一个小工具，记录需求和使用说明。','Build a small tool for a fictional business case, with requirements and usage notes.','Bina alat kecil untuk kes perniagaan rekaan dengan nota penggunaan.'],
  testing:['为一个示例功能编写测试用例，复现并修复一个错误。','Write test cases for a sample feature; reproduce and fix a bug.','Tulis kes ujian untuk ciri contoh; hasilkan semula dan baiki pepijat.'],
  training:['把熟悉的工作流程整理为十五分钟培训，并设计效果检查。','Turn a familiar workflow into a 15-minute training session with an effectiveness check.','Tukar aliran kerja kepada latihan 15 minit dan semakan keberkesanan.'],
  sourcing:['用合成报价比较三家供应商，记录价格、质量与交付风险。','Compare three fictional supplier quotes for cost, quality and delivery risk.','Bandingkan tiga sebut harga rekaan dari segi kos, kualiti dan risiko penghantaran.'],
  ai:['为合成业务案例设计 AI 辅助步骤，并写下人工核验清单。','Design AI-assisted steps for a fictional business case and a human review checklist.','Reka langkah berbantu AI bagi kes rekaan serta senarai semakan manusia.']
};
