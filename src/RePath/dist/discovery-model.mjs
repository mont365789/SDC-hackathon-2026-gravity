import {skills} from './model.mjs';

const aliases={
  communication:/沟通|客户|客服|communicat|customer|client|pelanggan|komunikasi/i,
  coordination:/协调|协作|团队|coordinat|team|stakeholder|pasukan|penyelarasan/i,
  reporting:/报告|报表|周报|report|laporan|pelaporan/i,
  spreadsheet:/excel|表格|透视|spreadsheet|hamparan/i,
  operations:/运营|流程|operati|process|proses|operasi/i,
  research:/调研|访谈|市场调查|research|interview|kajian|penyelidikan/i,
  data:/可视化|看板|power\s?bi|dashboard|visuali[sz]|visualisasi/i,
  planning:/规划|里程碑|排期|planning|milestone|perancangan/i,
  budgeting:/预算|成本|budget|cost|belanjawan/i,
  sql:/\bsql\b|数据库查询|pertanyaan sql/i,
  programming:/编程|程序开发|软件开发|python|javascript|coding|programming|pembangunan perisian/i,
  testing:/测试|排查|调试|testing|debug|pengujian/i,
  training:/培训|带教|training|mentoring|latihan/i,
  sourcing:/采购|供应商|purchas|procure|supplier|pembekal/i,
  ai:/(?:\bAI\b)|人工智能|智能工具|kecerdasan buatan/i
};
export function suggestSkills(text){return Object.keys(skills).filter(id=>aliases[id].test(String(text)))}

export const skillGroups=[
  {label:['业务理解','Business context','Konteks perniagaan'],ids:['operations','research','sourcing']},
  {label:['沟通协作','Collaboration','Kerjasama'],ids:['communication','coordination','training']},
  {label:['数据与技术','Data & technology','Data & teknologi'],ids:['reporting','spreadsheet','data','sql','programming']},
  {label:['项目执行','Project delivery','Pelaksanaan projek'],ids:['planning','budgeting','testing']}
];
export function skillCoverage(selected){const set=new Set(selected);return skillGroups.map(group=>({...group,count:group.ids.filter(id=>set.has(id)).length,total:group.ids.length}))}
