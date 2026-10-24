import {skills,roles,resources} from './model.mjs';
import {cleanWorkDetails} from './work-context.mjs';

export const RECORD_FILE_LIMIT=2*1024*1024;
export const RECORD_STORAGE_KEY='repath-demo-v0.2';
const recordRoles=roles.map(r=>r.id);
const isRecordObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const recordText=(v,limit)=>typeof v==='string'?v.slice(0,limit):'';
const recordNumber=(v,min,max,fallback)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
const recordDate=v=>typeof v==='string'&&v.length<=40&&Number.isFinite(Date.parse(v))?v:null;
const recordList=(v,valid,max=300)=>Array.isArray(v)?[...new Set(v.filter(valid))].slice(0,max):[];
const recordSkill=v=>Object.hasOwn(skills,v);

export function blankRecordData(){return {profile:{name:'',role:'',years:0,experience:'',hours:6,hoursConfirmed:false,budget:'free',skills:[],...cleanWorkDetails({})},saved:[],target:'analyst',scenario:'moderate',pro:false,progress:{},executionPlans:{},weeklyProgress:{},reflections:[],planReady:{},goalChosen:false,profileConfirmed:false,sessionReady:false,onboardingComplete:false}}

function sanitizeRecordProfile(p){
  if(!isRecordObject(p)||!Array.isArray(p.skills)||!p.skills.every(x=>typeof x==='string')||!(typeof p.role==='string'||Array.isArray(p.role)&&p.role.length===3&&p.role.every(x=>typeof x==='string')))throw new Error('record_profile');
  return {name:recordText(p.name,40),role:Array.isArray(p.role)?p.role.map(x=>recordText(x,100)):recordText(p.role,100),years:recordNumber(p.years,0,45,0),experience:recordText(p.experience,1500),hours:recordNumber(p.hours,1,40,6),hoursConfirmed:p.hoursConfirmed===true,budget:p.budget==='low'?'low':'free',skills:recordList(p.skills,recordSkill,30),...cleanWorkDetails(p)};
}

function sanitizeRecordPlans(input){
  const plans={};
  if(!isRecordObject(input))return plans;
  for(const roleId of recordRoles){
    const p=input[roleId];if(!isRecordObject(p)||p.roleId!==roleId||p.schemaVersion!==3||!Array.isArray(p.items)||p.items.length>300)continue;
    const items=[];const ids=new Set();
    for(const item of p.items){
      if(!isRecordObject(item)||!Number.isInteger(item.week)||item.week<1||item.week>300||item.id!==`${roleId}:w${item.week}`||ids.has(item.id)||!['applications','sprint','story','review','project','learn'].includes(item.stage)||!Number.isFinite(item.hours)||item.hours<=0||item.hours>40)throw new Error('record_plan');
      ids.add(item.id);const skillId=recordSkill(item.skillId)?item.skillId:null;
      const safe={id:item.id,week:item.week,hours:item.hours,stage:item.stage,skillId,resource:skillId&&['data','reporting','spreadsheet'].includes(skillId)?resources.data:skillId&&['planning','budgeting'].includes(skillId)?resources.project:null};
      if(['foundation','apply','validate','present'].includes(item.phase))safe.phase=item.phase;
      items.push(safe);
    }
    plans[roleId]={schemaVersion:3,roleId,createdAt:recordDate(p.createdAt)||new Date(0).toISOString(),scenario:p.scenario==='fast'?'fast':'moderate',baselineScore:recordNumber(p.baselineScore,0,100,0),baselineSkills:recordList(p.baselineSkills,recordSkill,30),weeklyHours:recordNumber(p.weeklyHours,1,40,6),totalHours:items.reduce((sum,x)=>sum+x.hours,0),items};
  }
  return plans;
}

export function sanitizeRecordData(input){
  if(!isRecordObject(input))throw new Error('record_data');
  const profile=sanitizeRecordProfile(input.profile);
  const data={profile,saved:recordList(input.saved,id=>recordRoles.includes(id),8),target:recordRoles.includes(input.target)?input.target:'analyst',scenario:input.scenario==='fast'?'fast':'moderate',pro:input.pro===true,progress:{},executionPlans:sanitizeRecordPlans(input.executionPlans),weeklyProgress:{},reflections:[],planReady:{},goalChosen:input.goalChosen===true,profileConfirmed:input.profileConfirmed===true,sessionReady:input.sessionReady===true,onboardingComplete:input.onboardingComplete===true};
  for(const id of recordRoles){
    if(isRecordObject(input.progress)&&Array.isArray(input.progress[id]))data.progress[id]=recordList(input.progress[id],n=>Number.isInteger(n)&&n>=0&&n<=2,3);
    if(isRecordObject(input.weeklyProgress)&&Array.isArray(input.weeklyProgress[id]))data.weeklyProgress[id]=recordList(input.weeklyProgress[id],v=>typeof v==='string'&&new RegExp('^'+id+':w([1-9][0-9]{0,2})$').test(v)&&Number(v.split(':w')[1])<=300);
    if(isRecordObject(input.planReady)&&input.planReady['personal:'+id]===true)data.planReady['personal:'+id]=true;
  }
  data.reflections=Array.isArray(input.reflections)?input.reflections.filter(r=>isRecordObject(r)&&recordSkill(r.skillId)&&recordRoles.includes(r.roleId)&&recordDate(r.timestamp)&&Number.isFinite(r.before)&&Number.isFinite(r.after)).slice(0,500).map(r=>({skillId:r.skillId,roleId:r.roleId,before:recordNumber(r.before,0,100,0),after:recordNumber(r.after,0,100,0),timestamp:r.timestamp,source:'self-reported'})):[];
  return data;
}

export function createRecordBackup(state,exportedAt=new Date().toISOString()){
  return {format:'repath-records',schemaVersion:1,exportedAt,data:sanitizeRecordData(state)};
}

export function parseRecordBackup(text){
  if(typeof text!=='string'||text.length>RECORD_FILE_LIMIT)throw new Error('record_size');
  let doc;try{doc=JSON.parse(text.replace(/^\uFEFF/,''))}catch{throw new Error('record_json')}
  if(!isRecordObject(doc)||doc.format!=='repath-records'||doc.schemaVersion!==1||!recordDate(doc.exportedAt))throw new Error('record_format');
  return {format:'repath-records',schemaVersion:1,exportedAt:doc.exportedAt,data:sanitizeRecordData(doc.data)};
}

export function recordSummary(data){return {hasProfile:!!data.profile?.project?.name,saved:data.saved?.length||0,completed:Object.values(data.weeklyProgress||{}).reduce((sum,x)=>sum+(Array.isArray(x)?x.length:0),0)}}

export const recordMessages={
  recordsTitle:['记录管理','My records','Rekod saya'],recordsShort:['记录','Records','Rekod'],recordsSub:['管理已保存的项目经历、收藏和行动进度。','Manage saved experience, paths and progress.','Urus pengalaman, arah dan kemajuan tersimpan.'],
  recordExport:['导出记录','Export records','Eksport rekod'],recordExportSub:['下载 JSON 备份，换设备也能继续。','Download a JSON backup to continue on another device.','Muat turun sandaran JSON untuk peranti lain.'],
  recordImport:['导入记录','Import records','Import rekod'],recordImportSub:['选择此前导出的 RePath JSON 文件。','Choose a previously exported RePath JSON file.','Pilih fail JSON RePath yang pernah dieksport.'],
  recordDelete:['删除记录','Delete records','Padam rekod'],recordDeleteSub:['清除当前浏览器中的个人记录。','Clear personal records from this browser.','Kosongkan rekod peribadi dalam pelayar ini.'],
  recordPrivacy:['文件可能含个人经历，请妥善保存。','The file may contain personal experience. Keep it safe.','Fail mungkin mengandungi pengalaman peribadi. Simpan dengan selamat.'],
  recordProfile:['项目经历','Project experience','Pengalaman projek'],recordSaved:['收藏方向','Saved paths','Arah tersimpan'],recordCompleted:['已完成周任务','Weeks completed','Minggu selesai'],recordFilled:['已填写','Added','Diisi'],recordEmpty:['未填写','Not added','Belum diisi'],
  recordImportTitle:['导入这份记录？','Import these records?','Import rekod ini?'],recordImportReplace:['确认后将替换当前记录，建议先导出备份。','This replaces current records. Export a backup first if needed.','Rekod semasa akan diganti. Eksport sandaran dahulu jika perlu.'],recordImportConfirm:['确认导入','Confirm import','Sahkan import'],recordImportCancel:['取消导入','Cancel import','Batal import'],recordBackupDate:['备份时间','Backup date','Tarikh sandaran'],
  recordDeleteTitle:['删除当前浏览器的记录？','Delete records from this browser?','Padam rekod daripada pelayar ini?'],recordDeleteWarning:['项目经历、收藏、行动计划和进度都会清除。已导出的备份文件仍可重新导入。','Experience, saved paths, plans and progress will be cleared. Exported backups can be imported again.','Pengalaman, arah, pelan dan kemajuan akan dikosongkan. Sandaran boleh diimport semula.'],recordDeleteConfirm:['确认删除记录','Confirm deletion','Sahkan pemadaman'],recordCancel:['取消','Cancel','Batal'],
  recordExported:['记录已导出','Records exported','Rekod dieksport'],recordImported:['记录已导入','Records imported','Rekod diimport'],recordDeleted:['记录已清除','Records cleared','Rekod dikosongkan'],recordInvalid:['无法导入，请选择有效的 RePath 记录文件。','Import failed. Choose a valid RePath records file.','Import gagal. Pilih fail rekod RePath yang sah.'],recordTooLarge:['文件超过 2 MB，请选择 RePath 导出的备份。','File exceeds 2 MB. Choose a RePath backup.','Fail melebihi 2 MB. Pilih sandaran RePath.'],recordStorageError:['浏览器未能保存更改，请检查存储空间后重试。','The browser could not save changes. Check storage and try again.','Pelayar tidak dapat menyimpan perubahan. Semak storan dan cuba lagi.']
};

export function recordSummaryHtml(c,data){const s=recordSummary(data);return `<div class="r-summary"><span>${c.t('recordProfile')}<strong>${c.t(s.hasProfile?'recordFilled':'recordEmpty')}</strong></span><span>${c.t('recordSaved')}<strong>${s.saved}</strong></span><span>${c.t('recordCompleted')}<strong>${s.completed}</strong></span></div>`}

export function recordsDialog(c,data){return `<div class="r-dialog"><h2 id="dialog-title">${c.t('recordsTitle')}</h2><p>${c.t('recordsSub')}</p>${recordSummaryHtml(c,data)}<div class="r-actions"><button data-action="records-export"><span class="r-action-icon">${c.icon('download')}</span><span><strong>${c.t('recordExport')}</strong><small>${c.t('recordExportSub')}</small></span>${c.icon('arrow')}</button><button data-action="records-import"><span class="r-action-icon">${c.icon('upload')}</span><span><strong>${c.t('recordImport')}</strong><small>${c.t('recordImportSub')}</small></span>${c.icon('arrow')}</button><button class="r-danger-row" data-action="records-delete"><span class="r-action-icon">${c.icon('trash')}</span><span><strong>${c.t('recordDelete')}</strong><small>${c.t('recordDeleteSub')}</small></span>${c.icon('arrow')}</button></div><input id="records-file" type="file" accept=".json,application/json" hidden><p id="records-error" class="r-error" role="alert"></p><small class="r-privacy">${c.t('recordPrivacy')}</small></div>`}

export function recordImportDialog(c,backup,filename){return `<div class="r-dialog"><h2 id="dialog-title">${c.t('recordImportTitle')}</h2><p class="r-file-name">${c.esc(filename)}</p>${recordSummaryHtml(c,backup.data)}<p>${c.t('recordImportReplace')}</p><small class="r-privacy">${c.t('recordBackupDate')}: ${c.esc(backup.exportedAt.slice(0,10))}</small><div class="r-confirm-actions"><button class="small-button" data-action="close">${c.t('recordImportCancel')}</button><button class="primary-button" data-action="records-confirm-import">${c.t('recordImportConfirm')}${c.icon('arrow')}</button></div><p id="records-error" class="r-error" role="alert"></p></div>`}

export function recordDeleteDialog(c){return `<div class="r-dialog"><h2 id="dialog-title">${c.t('recordDeleteTitle')}</h2><p>${c.t('recordDeleteWarning')}</p><div class="r-confirm-actions"><button class="small-button" data-action="close">${c.t('recordCancel')}</button><button class="r-danger-button" data-action="records-confirm-delete">${c.icon('trash')}${c.t('recordDeleteConfirm')}</button></div><p id="records-error" class="r-error" role="alert"></p></div>`}
