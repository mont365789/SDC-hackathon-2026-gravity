import {evidenceData} from './career-data.mjs';
// Curated task-level references, not an official O*NET skills dataset.
export const skills = {
  communication: ['客户需求沟通', 'Communication', 'Komunikasi'],
  coordination: ['跨部门协调', 'Project coordination', 'Penyelarasan projek'],
  reporting: ['业务报告分析', 'Reporting', 'Pelaporan'],
  spreadsheet: ['数据整理与电子表格', 'Spreadsheets', 'Hamparan'],
  operations: ['业务流程梳理', 'Operations', 'Operasi'],
  research: ['客户访谈与市场调研', 'Market research', 'Kajian pasaran'],
  data: ['数据可视化', 'Data visualisation', 'Visualisasi data'],
  planning: ['排期与里程碑', 'Project planning', 'Perancangan projek'],
  budgeting: ['项目预算与成本', 'Budgeting', 'Belanjawan'],
  sql: ['SQL 数据查询','SQL queries','Pertanyaan SQL'],
  programming: ['程序开发与维护','Software development','Pembangunan perisian'],
  testing: ['测试与问题排查','Testing & debugging','Pengujian & penyahpepijatan'],
  training: ['员工培训与带教','Staff training','Latihan kakitangan'],
  sourcing: ['采购与供应商评估','Sourcing & supplier review','Sumber & penilaian pembekal'],
  ai: ['AI 工具素养', 'AI literacy', 'Literasi AI']
};
export const roles = [
  {id:'project',family:'business',code:'13-1082.00',title:['项目管理专员','Project Management Specialist','Pakar Pengurusan Projek'],en:'Project Management Specialist',icon:'layers',tone:'green',required:['communication','coordination','planning','budgeting','reporting'],transfer:['communication','coordination','operations'],core:['planning','budgeting'],sdg:8,baseHours:35,source:'https://www.onetonline.org/link/summary/13-1082.00',description:['安排项目、协调资源，跟进工作交付。','Turn your coordination and delivery experience into momentum for complex projects.','Gunakan pengalaman penyelarasan dan pelaksanaan untuk memajukan projek.']},
  {id:'analyst',family:'business',code:'13-1111.00',title:['管理分析师','Management Analyst','Penganalisis Pengurusan'],en:'Management Analyst',icon:'chart',tone:'purple',required:['operations','reporting','spreadsheet','data','communication'],transfer:['operations','reporting','coordination'],core:['data'],sdg:9,baseHours:30,source:'https://www.onetonline.org/link/summary/13-1111.00',description:['分析业务流程，用数据提出改进建议。','Your understanding of business is the starting point for better systems and decisions.','Pemahaman perniagaan anda menjadi asas penambahbaikan sistem dan keputusan.']},
  {id:'market',family:'people',code:'13-1161.00',title:['市场研究分析师','Market Research Analyst','Penganalisis Penyelidikan Pasaran'],en:'Market Research Analyst',icon:'target',tone:'blue',required:['research','data','reporting','communication','spreadsheet'],transfer:['research','communication','reporting'],core:['research','data'],sdg:8,baseHours:30,source:'https://www.onetonline.org/link/summary/13-1161.00',description:['研究客户和市场，为业务决策提供依据。','Build on customer insight and market experience to guide evidence-based decisions.','Gunakan cerapan pelanggan dan pengalaman pasaran untuk keputusan berasaskan bukti.']},
  {id:'bi',family:'tech',code:'15-2051.01',title:['商业智能分析师','Business Intelligence Analyst','Penganalisis Perisikan Perniagaan'],en:'Business Intelligence Analysts',icon:'chart',tone:'blue',required:['operations','reporting','spreadsheet','data','sql'],transfer:['operations','reporting','spreadsheet'],core:['sql','data'],sdg:9,baseHours:80,source:'https://www.onetonline.org/link/summary/15-2051.01',description:['整理业务数据，制作看板，支持团队决策。','Turn business data into dashboards and decisions.','Tukar data perniagaan kepada papan pemuka dan keputusan.']},
  {id:'developer',family:'tech',code:'15-1252.00',title:['软件开发人员','Software Developer','Pembangun Perisian'],en:'Software Developers',icon:'layers',tone:'blue',required:['programming','testing','sql','communication','planning'],transfer:['programming','testing','coordination'],core:['programming','testing'],sdg:9,baseHours:160,source:'https://www.onetonline.org/link/summary/15-1252.00',description:['理解需求，开发、维护与测试软件。','Develop, maintain and test software against user needs.','Bangun, selenggara dan uji perisian mengikut keperluan pengguna.']},
  {id:'training',family:'people',code:'13-1151.00',title:['培训与发展专员','Training & Development Specialist','Pakar Latihan & Pembangunan'],en:'Training and Development Specialists',icon:'book',tone:'green',required:['communication','coordination','training','planning','reporting'],transfer:['communication','coordination','training'],core:['training','planning'],sdg:8,baseHours:45,source:'https://www.onetonline.org/link/summary/13-1151.00',description:['把工作经验整理成培训，帮助团队提升能力。','Design workplace training and evaluate its effectiveness.','Reka latihan tempat kerja dan nilai keberkesanannya.']},
  {id:'logistics',family:'business',code:'13-1081.00',title:['物流分析专员','Logistician','Pakar Logistik'],en:'Logisticians',icon:'path',tone:'green',required:['operations','coordination','planning','spreadsheet','reporting'],transfer:['operations','coordination','planning'],core:['planning'],sdg:9,baseHours:45,source:'https://www.onetonline.org/link/summary/13-1081.00',description:['协调供应与交付，分析库存和物流流程。','Coordinate supply and delivery, inventory and logistics flows.','Selaras bekalan, penghantaran, inventori dan aliran logistik.']},
  {id:'purchasing',family:'business',code:'13-1023.00',title:['采购专员','Purchasing Agent','Ejen Pembelian'],en:'Purchasing Agents, Except Wholesale, Retail, and Farm Products',icon:'briefcase',tone:'purple',required:['sourcing','budgeting','communication','spreadsheet','planning'],transfer:['sourcing','communication','budgeting'],core:['sourcing','budgeting'],sdg:8,baseHours:55,source:'https://www.onetonline.org/link/summary/13-1023.00',description:['比较供应商、控制成本，跟进采购交付。','Assess suppliers, manage costs and follow purchasing delivery.','Nilai pembekal, urus kos dan pantau penghantaran pembelian.']}

];
export const presets = {
  transition:{name:'Alex Tan',role:['运营与市场主管','Operations & Marketing Lead','Ketua Operasi & Pemasaran'],years:10,hours:6,budget:'free',skills:['communication','coordination','reporting','spreadsheet','operations']},
  employed:{name:'Alex Tan',role:['业务运营经理','Business Operations Manager','Pengurus Operasi Perniagaan'],years:12,hours:4,budget:'free',skills:['communication','coordination','operations','planning','budgeting']},
  returning:{name:'Alex Tan',role:['客户关系专员','Client Relations Specialist','Pakar Perhubungan Pelanggan'],years:7,hours:8,budget:'free',skills:['communication','research','reporting','spreadsheet']}
};
export const market = {source:'Department of Statistics Malaysia (DOSM)',url:evidenceData.dosm.periods['2026-Q2'].source_url,periods:['Q1 2026','Q2 2026'],totals:[626861,555509],professionals:[315768,285907],retrieved:evidenceData.dosm.verification[1].retrieved_at,scope:'Selected official quarterly online job-offering aggregates, not live vacancies.'};
export function matchRoles(profile, scenario='moderate') {
  const owned=new Set(profile.skills||[]);
  return roles.map(role=>{
    const matched=role.required.filter(x=>owned.has(x));
    const missing=role.required.filter(x=>!owned.has(x));
    const retained=role.transfer.filter(x=>owned.has(x));
    const hours=Math.max(20,missing.length*10+(owned.has(role.core[0])?8:role.baseHours));
    const weeks=Math.max(1,Math.ceil(hours/Math.max(1,Number(profile.hours)||1)));
    const skill=matched.length/role.required.length;
    const transfer=retained.length/role.transfer.length*Math.min(1,(Number(profile.years)||0)/8);
    const feasibility=Math.min(1,12/weeks);
    // Missing comparable role-level local demand: omit the 25% market component.
    // Renormalise the three available weights: 35/75, 25/75, 15/75.
    const hasTimeEstimate=profile.hoursConfirmed!==false;
    const score=Math.round(hasTimeEstimate?(skill*35+transfer*25+feasibility*15)/.75:(skill*35+transfer*25)/.60);
    const coreGap=role.core.filter(x=>!owned.has(x)).length;
    const scenarioAdjustment=scenario==='fast'?-(coreGap*4):0;
    return {...role,matched,missing,retained,hours,weeks,skill,transfer,feasibility,hasTimeEstimate,score:Math.max(0,Math.min(100,score+scenarioAdjustment)),scenarioAdjustment};
  }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
export const resources = {
  project:{name:'Project management: the start of the project journey',provider:'The Open University · OpenLearn',url:'https://www.open.edu/openlearn/money-business/leadership-management/project-management-the-start-the-project-journey',hours:35},
  data:{name:'Microsoft Power BI learning paths',provider:'Microsoft Learn',url:'https://learn.microsoft.com/en-us/training/powerplatform/power-bi',hours:null},
  ai:{name:'Introduction to AI concepts',provider:'Microsoft Learn',url:'https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/',hours:null}
};
