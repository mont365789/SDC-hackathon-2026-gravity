const oneOf=(value,values,fallback)=>values.includes(value)?value:fallback;
const text=value=>String(value||'').trim().slice(0,1500);
export const aiTypes={
  content:['内容与资料检索','Content & research','Kandungan & carian'],
  analysis:['数据分析辅助','Data analysis assistance','Bantuan analisis data'],
  coding:['编程与调试辅助','Coding & debugging','Pengekodan & penyahpepijatan'],
  workflow:['模型 / API 工作流','Model / API workflows','Aliran kerja model / API']
};
export const aiLevels={none:['未使用','Not used','Belum guna'],basic:['基础使用','Basic use','Penggunaan asas'],independent:['能独立完成任务','Independent task use','Boleh guna secara berdikari']};
export function cleanWorkDetails(p={}){
  const context=p.context||{};
  return {
    project:{name:text(p.project?.name).slice(0,100),actions:text(p.project?.actions||p.experience),result:text(p.project?.result).slice(0,300)},
    context:{employment:oneOf(context.employment,['employed','left','returning','unspecified'],'unspecified'),reason:oneOf(context.reason,['growth','voluntary','layoff','return','unspecified'],'unspecified'),priority:oneOf(context.priority,['income','parallel','study','unspecified'],'unspecified'),goal:oneOf(context.goal,['nearby','advance','newfield','unsure'],'unsure'),concern:text(context.concern).slice(0,300)},
    aiUsage:Object.fromEntries(Object.keys(aiTypes).map(id=>[id,oneOf(p.aiUsage?.[id],Object.keys(aiLevels),'none')])),
    aiFocus:oneOf(p.aiFocus,['none','verification','integration','principles','algorithms'],'none')
  };
}
// Explicit preferences change the action strategy, not the evidence-based fit score.
// No salary, family details, savings amount or hiring guarantee is inferred.
function baseTransitionStrategy(profile){
  const context=cleanWorkDetails(profile).context;
  if(context.priority==='income')return {id:'income',title:['优先恢复收入','Prioritise income','Utamakan pendapatan'],description:['先联系相近岗位，把已有项目改成求职材料；补技能与投递同时进行。','Contact adjacent roles first. Prepare project evidence and practise alongside applications.','Hubungi jawatan berkaitan dahulu. Sediakan bukti projek dan belajar sambil memohon.'],actions:[['整理项目案例与简历','联系相近岗位','只补申请中的关键缺口'],['Prepare project evidence and CV','Contact adjacent roles','Practise the gaps needed for applications'],['Sediakan bukti projek dan CV','Hubungi jawatan berkaitan','Latih jurang untuk permohonan']],learnFirst:false};
  if(context.priority==='study')return {id:'study',title:['先安排学习与项目实践','Plan a study and project period','Rancang tempoh belajar dan projek'],description:['保留原有经验作为基础，先完成一项目标岗位作品，再评估转型。','Build a target-role project on your existing experience before reviewing the transition.','Bina projek peranan sasaran berasaskan pengalaman sebelum menilai peralihan.'],actions:[['选定一个目标方向','安排技能练习和项目','用作品检验方向'],['Choose a target direction','Plan practice and a project','Review the direction using your work'],['Pilih arah sasaran','Rancang latihan dan projek','Semak arah melalui hasil projek']],learnFirst:true};
  return {id:context.priority==='parallel'?'parallel':'explore',title:context.priority==='parallel'?['保留工作并行准备','Prepare alongside your job','Bersedia sambil bekerja']:['先核对经历与方向','Review experience and directions','Semak pengalaman dan arah'],description:context.priority==='parallel'?['先整理手头项目，逐步补关键缺口，再决定是否换岗。','Document current projects and close key gaps before deciding on a move.','Rekod projek semasa dan tutup jurang utama sebelum membuat keputusan.']:['先确认做过的项目和当前需求，再决定投递还是留出学习期。','Confirm project experience and current needs before choosing applications or a study period.','Sahkan pengalaman projek dan keperluan sebelum memilih permohonan atau belajar.'],actions:[['整理已有项目','确认目标岗位缺口','安排下一步行动'],['Document existing projects','Confirm target-role gaps','Plan the next action'],['Rekod projek sedia ada','Sahkan jurang peranan sasaran','Rancang tindakan seterusnya']],learnFirst:false};
}

export function transitionStrategy(profile){
  const strategy=baseTransitionStrategy(profile);
  const goal=cleanWorkDetails(profile).context.goal;
  const goalActions={
    nearby:['用项目结果核对岗位要求','Check role requirements against project results','Semak keperluan jawatan dengan hasil projek'],
    advance:['在现有领域验证一项进阶任务','Test an advanced task in your current field','Uji tugas lanjutan dalam bidang semasa'],
    newfield:['核对新领域的岗位任务与差距','Check tasks and gaps in the new field','Semak tugas dan jurang bidang baharu']
  };
  if(!goalActions[goal])return strategy;
  return {...strategy,actions:strategy.actions.map((items,index)=>[...items.slice(0,2),goalActions[goal][index]])};
}
