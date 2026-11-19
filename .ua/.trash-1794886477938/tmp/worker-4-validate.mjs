// @ts-check
import fs from 'node:fs';
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-4.json','utf8'));
const reports=[],allIds=new Set(),outputs=[];
/** 检查引用是否为真实且已确认的项目文件路径，不猜测模块解析结果。 */
function referencePath(id){
 if(id.startsWith('file:')||id.startsWith('config:')||id.startsWith('document:')) return id.slice(id.indexOf(':')+1);
 if(id.startsWith('function:')||id.startsWith('class:')) return id.slice(id.indexOf(':')+1).replace(/:[^:]+$/,'');
 return null;
}
// 仅遍历本 worker 原始批次对应的规范文件名，避免读取其他代理产物。
for(const batch of worker.batches){
 const base=`.ua/intermediate/batch-${batch.batchIndex}`;
 const paths=fs.existsSync(`${base}.json`)?[`${base}.json`]:[];
 for(let k=1;fs.existsSync(`${base}-part-${k}.json`);k++) paths.push(`${base}-part-${k}.json`);
 if(!paths.length) throw Error(`缺少原始批次${batch.batchIndex}`);
 const fragments=paths.map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
 const nodes=fragments.flatMap(f=>f.nodes),edges=fragments.flatMap(f=>f.edges);
 const ids=new Set(nodes.map(n=>n.id));
 if(ids.size!==nodes.length) throw Error(`批次${batch.batchIndex}重复ID`);
 for(const node of nodes){
  if(!node.id||!node.type||!node.name||!node.summary||node.tags?.length<3) throw Error(`节点字段缺失${node.id}`);
  if(!['simple','moderate','complex'].includes(node.complexity)) throw Error(`复杂度无效${node.id}`);
  if(['function','class'].includes(node.type)&&(!Array.isArray(node.lineRange)||node.lineRange[0]>node.lineRange[1])) throw Error(`行范围无效${node.id}`);
  allIds.add(node.id);
 }
 for(const file of batch.files){
  if(!nodes.some(n=>n.filePath===file.path&&['file','config','document'].includes(n.type))) throw Error(`缺少文件级覆盖${file.path}`);
  const expected=batch.batchImportData[file.path]??[];
  const actual=edges.filter(e=>e.type==='imports'&&e.source===`file:${file.path}`).map(e=>e.target.slice(5));
  if(JSON.stringify([...expected].sort())!==JSON.stringify([...actual].sort())) throw Error(`导入不一致${file.path}`);
 }
 const extraction=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${batch.batchIndex}.json`,'utf8'));
 for(const result of extraction.results){
  for(const fn of result.functions??[]){
   if(fn.endLine-fn.startLine+1>=10||(result.exports??[]).some(e=>e.name===fn.name)){
    if(!ids.has(`function:${result.path}:${fn.name}`)) throw Error(`重要函数遗漏${result.path}:${fn.name}`);
   }
  }
  for(const c of result.classes??[]) if((c.methods?.length??0)>=2||c.endLine-c.startLine+1>=20) if(!ids.has(`class:${result.path}:${c.name}`)) throw Error(`重要类遗漏${c.name}`);
 }
 for(const edge of edges){
  if(edge.source===edge.target) throw Error(`自引用${edge.source}`);
  for(const endpoint of [edge.source,edge.target]){
   if(ids.has(endpoint)) continue;
   const file=referencePath(endpoint);
   if(!file||!fs.existsSync(file)) throw Error(`引用文件不存在${endpoint}`);
  }
 }
 reports.push({batchIndex:batch.batchIndex,fileCount:batch.files.length,nodeCount:nodes.length,edgeCount:edges.length,outputs:paths,parserSkipped:extraction.filesSkipped??[]});
 outputs.push(...paths);
}
const report={worker:4,batches:reports.length,files:reports.reduce((a,r)=>a+r.fileCount,0),nodes:reports.reduce((a,r)=>a+r.nodeCount,0),edges:reports.reduce((a,r)=>a+r.edgeCount,0),outputFiles:outputs.length,reports,warnings:['官方CSS解析器跳过批次16的13份CSS，均已通过逐文件源码阅读生成文件级节点。','官方结构提取未识别forwardRef部件，已人工阅读并补精确行范围；不把类型别名作类节点。']};
fs.writeFileSync('.ua/tmp/worker-4-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({worker:report.worker,batches:report.batches,files:report.files,nodes:report.nodes,edges:report.edges,outputFiles:report.outputFiles,completed:reports.map(r=>r.batchIndex),warnings:report.warnings},null,2));
