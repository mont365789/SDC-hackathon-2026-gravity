import {evidenceData} from './career-data.mjs';
// Human-reviewed crosswalks. O*NET and DOSM use different occupation systems.
export const demandCrosswalk={
  project:{category:'professionals',level:'broad'},analyst:{category:'professionals',level:'broad'},market:{category:'advertising_and_marketing_professionals',level:'related'},
  bi:{category:'professionals',level:'broad'},developer:{category:'software_developers',level:'related'},training:{category:'professionals',level:'broad'},logistics:{category:'professionals',level:'broad'},purchasing:null
};
export const demandCategories={all_online_job_offerings:['全部在线招聘','All online offerings','Semua iklan kerja'],managers:['管理人员大类','Managers group','Kumpulan pengurus'],professionals:['专业人员大类','Professionals group','Kumpulan profesional'],advertising_and_marketing_professionals:['广告与营销专业人员','Advertising & marketing professionals','Profesional pengiklanan & pemasaran'],software_developers:['软件开发人员','Software developers','Pembangun perisian']};
export function compareDemand(category,snapshot=evidenceData.dosm){
  const first=snapshot.periods['2026-Q1'],last=snapshot.periods['2026-Q2'];
  const before=first?.values?.[category],after=last?.values?.[category];
  if(!Number.isFinite(before)||!Number.isFinite(after)||before<=0)return null;
  return {category,before,after,delta:after-before,change:(after/before-1)*100,periods:['2026-Q1','2026-Q2'],sources:[first.source_url,last.source_url]};
}
export function localDemandForRole(roleId,snapshot=evidenceData.dosm){const mapping=demandCrosswalk[roleId];const comparison=mapping&&compareDemand(mapping.category,snapshot);return comparison?{...mapping,...comparison}:null}
export function orderDirections(ranked,{family='all',sort='fit',snapshot=evidenceData.dosm}={}){
  const candidates=ranked.filter(r=>family==='all'||r.family===family);
  if(sort!=='market')return candidates;
  // Separate selectable order, never changes the personal fit score. Broad proxies are excluded.
  return candidates.sort((a,b)=>{const x=localDemandForRole(a.id,snapshot),y=localDemandForRole(b.id,snapshot);const xv=x?.level==='related'&&Number.isFinite(x.change)?x.change:-Infinity,yv=y?.level==='related'&&Number.isFinite(y.change)?y.change:-Infinity;return yv-xv||b.score-a.score||a.id.localeCompare(b.id)});
}
export function occupationReference(code){return evidenceData.onet.records.find(r=>r.onetsoc_code===code)}
