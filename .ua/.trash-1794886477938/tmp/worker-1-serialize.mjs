// @ts-check
// 中文语义由逐批阅读后明确填写，本脚本只承担结构字段与关系的序列化。
import fs from 'node:fs';
import path from 'node:path';
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-1.json','utf8'));
export const semantics={};
export const symbolSemantics={};
export const extraEdges={};
export const supplementFunctions={};
// 补齐解析器漏识别的 forwardRef 命名组件，范围由源码阅读确认。
export function supplement(p,records) { supplementFunctions[p]=records; }
// 记录经过阅读确认的文件说明，避免自动按文件名编造语义。
export function file(p,summary,tags=['组件','可访问性','React']) { semantics[p]={summary,tags}; }
// 记录经过阅读确认的符号职责，行号仍由捆绑解析器提供。
export function symbols(p,records) { symbolSemantics[p]=records; }
// 记录有源码证据的补充依赖；不改变正式输入中的 imports。
export function edges(i,records) { extraEdges[i]=records; }
// 将已分析批次写成严格编号的片段，并校验覆盖与导入数。
export function save(indices) {
for(const b of worker.batches.filter(b=>indices.includes(b.batchIndex))){
const x=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${b.batchIndex}.json`,'utf8'));
if(x.filesUnreadable?.length) throw new Error('存在不可读文件 '+JSON.stringify(x.filesUnreadable));
const nodes=[], es=[];
for(const f of b.files){
const r=x.results.find(r=>r.path===f.path)||{functions:[],classes:[],exports:[],nonEmptyLines:f.sizeLines};
const sem=semantics[f.path]; if(!sem) throw new Error('缺少文件语义 '+f.path);
const type=f.fileCategory==='docs'?'document':f.fileCategory==='config'?'config':f.fileCategory==='infra'?'pipeline':'file';
const id=`${type}:${f.path}`;
nodes.push({id,type,name:path.basename(f.path),filePath:f.path,...sem,complexity:r.nonEmptyLines>200?'complex':r.nonEmptyLines>=50?'moderate':'simple'});
const ex=new Set((r.exports||[]).map(e=>e.name));
for(const fn of [...(r.functions||[]),...(supplementFunctions[f.path]||[])]){
if(fn.endLine-fn.startLine+1<10&&!ex.has(fn.name)&&!fn.exported)continue;
const desc=symbolSemantics[f.path]?.[fn.name]; if(!desc)throw new Error(`缺少符号语义 ${f.path}:${fn.name}`);
const sid=`function:${f.path}:${fn.name}`;
if(nodes.some(n=>n.id===sid))continue;
nodes.push({id:sid,type:'function',name:fn.name,filePath:f.path,lineRange:[fn.startLine,fn.endLine],summary:desc,tags:sem.tags,complexity:fn.endLine-fn.startLine>200?'complex':fn.endLine-fn.startLine>=50?'moderate':'simple'});
es.push({source:id,target:sid,type:'contains',direction:'forward',weight:1});
if(ex.has(fn.name))es.push({source:id,target:sid,type:'exports',direction:'forward',weight:.8});
}
for(const cls of r.classes||[]){if((cls.methods||[]).length<2&&cls.endLine-cls.startLine+1<20&&!ex.has(cls.name))continue;
const desc=symbolSemantics[f.path]?.[cls.name]; if(!desc)throw new Error(`缺少类语义 ${f.path}:${cls.name}`);
const sid=`class:${f.path}:${cls.name}`;nodes.push({id:sid,type:'class',name:cls.name,filePath:f.path,lineRange:[cls.startLine,cls.endLine],summary:desc,tags:sem.tags,complexity:'moderate'});es.push({source:id,target:sid,type:'contains',direction:'forward',weight:1});if(ex.has(cls.name))es.push({source:id,target:sid,type:'exports',direction:'forward',weight:.8});}
for(const target of b.batchImportData[f.path]||[])es.push({source:id,target:`file:${target}`,type:'imports',direction:'forward',weight:.7});
}
for(const [source,target,type='depends_on'] of extraEdges[b.batchIndex]||[])es.push({source,target,type,direction:'forward',weight:type==='documents'||type==='tested_by'||type==='related'?.5:type==='calls'||type==='exports'?.8:type==='deploys'?.7:.6});
const groups=Math.ceil(Math.max(nodes.length/60,es.length/120));
const sorted=[...b.files].sort((a,b)=>a.path.localeCompare(b.path));
const chunk=Math.ceil(sorted.length/groups);
for(let i=0;i<groups&&i*chunk<sorted.length;i++){
const paths=new Set(sorted.slice(i*chunk,(i+1)*chunk).map(f=>f.path));
const ns=nodes.filter(n=>paths.has(n.filePath));const ids=new Set(ns.map(n=>n.id));
const fragment={nodes:ns,edges:es.filter(e=>ids.has(e.source))};
const out=`.ua/intermediate/batch-${b.batchIndex}${groups>1?`-part-${i+1}`:''}.json`;
fs.writeFileSync(out,JSON.stringify(fragment,null,2));JSON.parse(fs.readFileSync(out,'utf8'));
}
const expected=Object.values(b.batchImportData).reduce((a,v)=>a+v.length,0);
if(es.filter(e=>e.type==='imports').length!==expected)throw new Error('导入数量不一致');
console.log(JSON.stringify({batch:b.batchIndex,files:b.files.length,nodes:nodes.length,edges:es.length,parts:Math.ceil(sorted.length/chunk),skipped:x.filesSkipped||[]}));
}
}
