// @ts-check
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-2.json','utf8'));
const semantics=JSON.parse(fs.readFileSync('.ua/tmp/worker-2-semantics.json','utf8'));
/** 按已完成的人工语义记录组装节点，禁止自动猜测摘要。 */
function makeNode(type,file,name,summary,tags,range,lines){
 const n={id:`${type}:${file}${range?`:${name}`:''}`,type,name,filePath:file,summary,tags,complexity:lines>200?'complex':lines>=50?'moderate':'simple'};
 if(range)n.lineRange=range;
 return n;
}
/** 保持边的方向和权重与知识图谱协议一致。 */
function edge(source,target,type){return {source,target,type,direction:'forward',weight:{contains:1,exports:.8,imports:.7,calls:.8,depends_on:.6,documents:.5,configures:.6,tested_by:.5,related:.5,triggers:.6}[type]};}
/** 把人工语义和结构提取逐批合并，并按协议分片。 */
function emitBatch(b){
 const extraction=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${b.batchIndex}.json`,'utf8'));
 if(extraction.filesUnreadable.length)throw new Error('存在不可读源文件');
 const nodes=[],edges=[];
 for(const f of b.files){
  const s=semantics.files[f.path];
  if(!s)throw new Error(`缺少人工摘要: ${f.path}`);
  const r=extraction.results.find(x=>x.path===f.path);
  const type=s.type||({docs:'document',config:'config'}[f.fileCategory]||'file');
  const n=makeNode(type,f.path,path.basename(f.path),s.summary,s.tags,undefined,r?.nonEmptyLines||f.sizeLines);
  if(s.languageNotes)n.languageNotes=s.languageNotes;
  nodes.push(n);
  // 导入关系严格使用正式输入，绝不重新解析 workspace 别名。
  for(const target of b.batchImportData[f.path]||[])edges.push(edge(n.id,`file:${target}`,'imports'));
  const exports=new Set((r?.exports||[]).map(x=>x.name));
  for(const fn of r?.functions||[]){
   if(fn.endLine-fn.startLine+1<10&&!exports.has(fn.name))continue;
   const key=`${f.path}:${fn.name}`;
   const summary=semantics.symbols[key];
   if(!summary)throw new Error(`缺少函数语义: ${key}`);
   const node=makeNode('function',f.path,fn.name,summary,s.symbolTags||['函数','行为实现','组件协作'],[fn.startLine,fn.endLine],fn.endLine-fn.startLine+1);
   nodes.push(node);edges.push(edge(n.id,node.id,'contains'));
   if(exports.has(fn.name))edges.push(edge(n.id,node.id,'exports'));
  }
  for(const cls of r?.classes||[]){
   if(cls.endLine-cls.startLine+1<20&&(cls.methods||[]).length<2&&!exports.has(cls.name))continue;
   const summary=semantics.symbols[`${f.path}:${cls.name}`];
   if(!summary)throw new Error(`缺少类语义: ${f.path}:${cls.name}`);
   const node=makeNode('class',f.path,cls.name,summary,['数据结构','有序集合','泛型'],[cls.startLine,cls.endLine],cls.endLine-cls.startLine+1);
   nodes.push(node);edges.push(edge(n.id,node.id,'contains'));
   if(exports.has(cls.name))edges.push(edge(n.id,node.id,'exports'));
  }
  for(const m of s.extraSymbols||[]){
   const node=makeNode(m.type||'function',f.path,m.name,m.summary,m.tags||['组件','组合模式','交互行为'],m.range,m.range[1]-m.range[0]+1);
   if(nodes.some(x=>x.id===node.id))continue;
   nodes.push(node);edges.push(edge(n.id,node.id,'contains'));
   if(m.exported)edges.push(edge(n.id,node.id,'exports'));
  }
  for(const x of s.edges||[])edges.push(edge(x.source||n.id,x.target,x.type));
 }
 // 根据节点和边数量决定分片，严格保留每个原始批次编号。
 const parts=Math.ceil(Math.max(nodes.length/60,edges.length/120));
 const sorted=[...b.files].sort((a,b)=>a.path.localeCompare(b.path));
 const chunkSize=Math.ceil(sorted.length/Math.max(1,parts));
 const written=[];
 for(let k=0;k<Math.max(1,parts);k++){
  const files=new Set(sorted.slice(k*chunkSize,(k+1)*chunkSize).map(f=>f.path));
  const ns=nodes.filter(n=>files.has(n.filePath));
  if(!ns.length)continue;
  const ids=new Set(ns.map(n=>n.id));
  const es=edges.filter(e=>ids.has(e.source));
  const out=parts<=1?`.ua/intermediate/batch-${b.batchIndex}.json`:`.ua/intermediate/batch-${b.batchIndex}-part-${k+1}.json`;
  if(fs.existsSync(out))throw new Error(`禁止意外覆盖已完成文件: ${out}`);
  fs.writeFileSync(out,JSON.stringify({nodes:ns,edges:es},null,2));written.push(out);
 }
 console.log(JSON.stringify({batch:b.batchIndex,files:b.files.length,nodes:nodes.length,edges:edges.length,written}));
}
// 仅执行命令行明确选中的本 worker 批次。
const requested=new Set(process.argv.slice(2).map(Number));
for(const b of worker.batches)if(requested.has(b.batchIndex))emitBatch(b);
