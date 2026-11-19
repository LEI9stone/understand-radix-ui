// @ts-check
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-3.json','utf8'));
/** 将人工分析的文件语义与确定性提取结果合并，不代替语义判断。 */
export function fragment(index, descriptions, symbolDescriptions={}, extras=[]) {
 const batch=worker.batches.find(b=>b.batchIndex===index);
 const extracted=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${index}.json`,'utf8'));
 const nodes=[]; const edges=[];
 // 文件描述由分析者逐项提供；结构数据只用于行号、重要性与导出关系。
 for(const f of batch.files){
  const d=descriptions[f.path]; if(!d)throw new Error(`Missing semantic description ${f.path}`);
  const r=extracted.results.find(r=>r.path===f.path);
  const type=f.fileCategory==='docs'?'document':f.fileCategory==='config'?'config':'file';
  const id=`${type}:${f.path}`;
  nodes.push({id,type,name:path.basename(f.path),filePath:f.path,summary:d[0],tags:d[1],complexity:(r?.nonEmptyLines??f.sizeLines)>200?'complex':(r?.nonEmptyLines??f.sizeLines)>=50?'moderate':'simple'});
  for(const fn of r?.functions??[]){
   const exp=(r.exports??[]).some(e=>e.name===fn.name);
   if(fn.endLine-fn.startLine+1<10&&!exp)continue;
   const sd=symbolDescriptions[`${f.path}:${fn.name}`];if(!sd)throw new Error(`Missing symbol semantics ${f.path}:${fn.name}`);
   const fid=`function:${f.path}:${fn.name}`;
   nodes.push({id:fid,type:'function',name:fn.name,filePath:f.path,lineRange:[fn.startLine,fn.endLine],summary:sd[0],tags:sd[1],complexity:fn.endLine-fn.startLine>200?'complex':fn.endLine-fn.startLine>=50?'moderate':'simple'});
   edges.push({source:id,target:fid,type:'contains',direction:'forward',weight:1});
   if(exp)edges.push({source:id,target:fid,type:'exports',direction:'forward',weight:.8});
  }
  for(const target of batch.batchImportData[f.path]??[])edges.push({source:id,target:`file:${target}`,type:'imports',direction:'forward',weight:.7});
 }
 for(const x of extras){if(x.id)nodes.push(x);else edges.push(x);}
 // 按协议以文件归属切分超限批次，避免融合原始编号。
 const count=Math.ceil(Math.max(nodes.length/60,edges.length/120));
 const files=[...batch.files].sort((a,b)=>a.path.localeCompare(b.path)); const size=Math.ceil(files.length/count);
 for(let k=0;k<count;k++){
  const paths=new Set(files.slice(k*size,(k+1)*size).map(f=>f.path)); const ns=nodes.filter(n=>paths.has(n.filePath));const ids=new Set(ns.map(n=>n.id));
  const es=edges.filter(e=>ids.has(e.source));
  const out=`.ua/intermediate/batch-${index}${count>1?`-part-${k+1}`:''}.json`;
  fs.writeFileSync(out,JSON.stringify({nodes:ns,edges:es},null,2)+'\n');
 }
 console.log(JSON.stringify({batch:index,files:batch.files.length,nodes:nodes.length,edges:edges.length,parts:count}));
}
/** 为已证实的文件关系生成统一方向和权重。 */
export function edge(source,target,type='depends_on'){return {source,target,type,direction:'forward',weight:{depends_on:.6,configures:.6,documents:.5,tested_by:.5,calls:.8,contains:1,exports:.8,related:.5}[type]??.6};}
/** 仅在源码直接读取得到声明时补足提取器未枚举的组件。 */
export function component(file,name,start,end,summary,exported=true){const id=`function:${file}:${name}`;return [{id,type:'function',name,filePath:file,lineRange:[start,end],summary,tags:['组件','组合模式','可访问性'],complexity:end-start>200?'complex':end-start>=50?'moderate':'simple'},edge(`file:${file}`,id,'contains'),...(exported?[edge(`file:${file}`,id,'exports')]:[])];}
