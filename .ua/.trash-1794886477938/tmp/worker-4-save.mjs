// @ts-check
import fs from 'node:fs';
import path from 'node:path';
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-4.json','utf8'));
/** 将人工语义记录与官方结构合并，完整保留导入关系并按协议分片。 */
export function saveBatch(index, semantics, extraEdges=[], extraFunctions={}) {
 const batch=worker.batches.find(b=>b.batchIndex===index);
 const extraction=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${index}.json`,'utf8'));
 if(extraction.filesUnreadable?.length) throw Error('发现不可读文件');
 const nodes=[],edges=[];
 // 每个扫描文件必须有独立节点；语义缺失时立即报错，避免模板代替分析。
 for(const file of batch.files){
  const record=semantics[file.path];
  if(!record) throw Error(`缺少文件语义 ${file.path}`);
  const type=file.fileCategory==='docs'?'document':file.fileCategory==='config'?'config':'file';
  const result=extraction.results.find(r=>r.path===file.path);
  const id=`${type}:${file.path}`;
  nodes.push({id,type,name:path.basename(file.path),filePath:file.path,summary:record.summary,tags:record.tags,complexity:record.complexity??((result?.nonEmptyLines??file.sizeLines)>200?'complex':file.sizeLines>50?'moderate':'simple'),...(record.languageNotes?{languageNotes:record.languageNotes}:{})});
  for(const target of batch.batchImportData[file.path]??[]) edges.push({source:id,target:`file:${target}`,type:'imports',direction:'forward',weight:0.7});
  // 类声明使用提取器行范围，语义必须由分析者显式提供，避免漏掉测试替身模型。
  for(const c of result?.classes??[]){
   const exported=(result?.exports??[]).some(e=>e.name===c.name);
   if((c.methods?.length??0)<2&&c.endLine-c.startLine+1<20&&!exported) continue;
   const semantic=record.classes?.[c.name];
   if(!semantic) throw Error(`缺少类语义 ${file.path}:${c.name}`);
   const cid=`class:${file.path}:${c.name}`;
   nodes.push({id:cid,type:'class',name:c.name,filePath:file.path,lineRange:[c.startLine,c.endLine],summary:semantic,tags:record.tags,complexity:'moderate'});
   edges.push({source:id,target:cid,type:'contains',direction:'forward',weight:1});
   if(exported) edges.push({source:id,target:cid,type:'exports',direction:'forward',weight:0.8});
  }
  const functions=[...(result?.functions??[]),...(extraFunctions[file.path]??[])];
  for(const f of functions){
   const exported=(result?.exports??[]).some(e=>e.name===f.name);
   if(f.endLine-f.startLine+1<10&&!exported) continue;
   const s=record.functions?.[f.name];
   if(!s) throw Error(`缺少函数语义 ${file.path}:${f.name}`);
   const fn={id:`function:${file.path}:${f.name}`,type:'function',name:f.name,filePath:file.path,lineRange:[f.startLine,f.endLine],summary:typeof s==='string'?s:s.summary,tags:typeof s==='string'?record.tags:s.tags,complexity:f.endLine-f.startLine>150?'complex':f.endLine-f.startLine>40?'moderate':'simple'};
   nodes.push(fn);
   edges.push({source:id,target:fn.id,type:'contains',direction:'forward',weight:1});
   if(exported) edges.push({source:id,target:fn.id,type:'exports',direction:'forward',weight:0.8});
  }
 }
 edges.push(...extraEdges);
 const uniqueEdges=[...new Map(edges.map(e=>[`${e.source}|${e.target}|${e.type}`,e])).values()];
 if(new Set(nodes.map(n=>n.id)).size!==nodes.length) throw Error('重复节点');
 // 分片只改变序列化容器，不改变人工判断的节点或关系。
 const count=Math.ceil(Math.max(nodes.length/60,uniqueEdges.length/120));
 const files=[...batch.files].sort((a,b)=>a.path.localeCompare(b.path));
 const groupSize=Math.ceil(files.length/count);
 const parts=[];
 for(let k=0;k<count;k++){
  const owned=new Set(files.slice(k*groupSize,(k+1)*groupSize).map(f=>f.path));
  if(!owned.size) continue;
  const partNodes=nodes.filter(n=>owned.has(n.filePath));
  const ids=new Set(partNodes.map(n=>n.id));
  const part={nodes:partNodes,edges:uniqueEdges.filter(e=>ids.has(e.source))};
  const output=count===1?`.ua/intermediate/batch-${index}.json`:`.ua/intermediate/batch-${index}-part-${k+1}.json`;
  fs.writeFileSync(output,JSON.stringify(part,null,2));
  JSON.parse(fs.readFileSync(output,'utf8'));
  parts.push(output);
 }
 console.log(JSON.stringify({batch:index,files:batch.files.length,nodes:nodes.length,edges:uniqueEdges.length,parts}));
 return {nodes,edges:uniqueEdges};
}
/** 构造明确指定端点的依赖关系，不执行导入解析。 */
export function relation(source,target,type='depends_on') {return {source,target,type,direction:'forward',weight:type==='calls'?0.8:type==='tested_by'?0.5:type==='documents'?0.5:type==='configures'?0.6:0.6};}
