// @ts-check
import fs from 'node:fs';
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-2.json','utf8'));
const report={batches:[],warnings:['CSS 解析器未产生结构，20个样式文件已逐个直接阅读并补齐文件节点。','CODEOWNERS 与 .nvmrc 无注册解析器，已直接阅读并补齐文件节点。','React.forwardRef 组件提取不完整，已按源码阅读补齐重要组件及精确行号。','正式 importMap 未解析多数工作区别名，已用有源码证据的 depends_on 关系补充；未重写 imports。']};
const chunks=new Map();
// 仅读取本 worker 已知的原始编号输出，不枚举或修改其他 worker 产物。
for(const b of worker.batches){const names=b.batchIndex===88?[`.ua/intermediate/batch-88-part-1.json`,`.ua/intermediate/batch-88-part-2.json`]:[`.ua/intermediate/batch-${b.batchIndex}.json`];chunks.set(b.batchIndex,names.map(name=>({name,graph:JSON.parse(fs.readFileSync(name,'utf8'))})));}
/** 在本批次源节点所在分片中补充经人工确认的语义边。 */
function add(batch,source,target,type,weight){
 const part=chunks.get(batch).find(x=>x.graph.nodes.some(n=>n.id===source));
 if(!part)throw new Error(`源节点不存在: ${source}`);
 if(!part.graph.edges.some(e=>e.source===source&&e.target===target&&e.type===type))part.graph.edges.push({source,target,type,direction:'forward',weight});
}
// 样式与示例的关系来自正式输入的邻居表，避免独立样式节点失去上下文。
const cssBatch=worker.batches.find(b=>b.batchIndex===15);
for(const [file,neighbors]of Object.entries(cssBatch.neighborMap))for(const n of neighbors)add(15,`file:${file}`,`file:${n.path}`,'related',.5);
// barrel 来源已逐文件阅读；使用依赖边保留公开入口到实现之间的实际关系。
for(const pkg of ['hover-card','id','label','menu','menubar','navigation-menu','one-time-password-field','password-toggle-field','popover','popper'])add(88,`file:packages/react/${pkg}/src/index.ts`,`file:packages/react/${pkg}/src/${pkg}.tsx`,'depends_on',.6);
add(90,'file:packages/react/roving-focus/src/index.ts','file:packages/react/roving-focus/src/roving-focus-group.tsx','depends_on',.6);
for(const pkg of ['context','compose-refs','slot','use-layout-effect'])add(4,'file:packages/react/collection/src/collection.tsx',`file:packages/react/${pkg}/src/index.ts`,'depends_on',.6);
// 对包元数据补充到已确认存在的公开入口的配置和文档关系。
for(const b of worker.batches){
 if(![25,40,42,45,46,48,54,62,64,72,80].includes(b.batchIndex))continue;
 const dir=b.files[0].path.slice(0,b.files[0].path.lastIndexOf('/'));
 const target=`file:${dir}/src/index.ts`;
 add(b.batchIndex,`config:${dir}/package.json`,target,'configures',.6);
 add(b.batchIndex,`config:${dir}/tsconfig.json`,target,'configures',.6);
 add(b.batchIndex,`document:${dir}/README.md`,target,'documents',.5);
}
// 对最终待写图进行覆盖、标识唯一性、必填项、行号及 imports 完整性检查。
let totalNodes=0,totalEdges=0,totalFiles=0;
for(const b of worker.batches){
 const parts=chunks.get(b.batchIndex);
 const nodes=parts.flatMap(x=>x.graph.nodes),edges=parts.flatMap(x=>x.graph.edges);
 const ids=new Set(nodes.map(n=>n.id));
 if(ids.size!==nodes.length)throw new Error(`重复节点 batch ${b.batchIndex}`);
 const missing=b.files.filter(f=>!nodes.some(n=>n.filePath===f.path&&!['function','class'].includes(n.type)));
 if(missing.length)throw new Error(`文件遗漏 batch ${b.batchIndex}`);
 for(const n of nodes){
  if(!n.summary||!n.tags?.length||!n.name||!n.type)throw new Error(`必填字段缺失 ${n.id}`);
  const meta=b.files.find(f=>f.path===n.filePath);
  if(!meta)throw new Error(`批次外文件节点 ${n.id}`);
  if(n.lineRange&&(n.lineRange[0]<1||n.lineRange[1]>meta.sizeLines||n.lineRange[1]<n.lineRange[0]))throw new Error(`行号非法 ${n.id}`);
 }
 const expected=b.files.reduce((sum,f)=>sum+(b.batchImportData[f.path]||[]).length,0);
 if(edges.filter(e=>e.type==='imports').length!==expected)throw new Error(`imports 数量错误 batch ${b.batchIndex}`);
 for(const e of edges){
  if(e.source===e.target)throw new Error(`自环 ${e.source}`);
  for(const id of [e.source,e.target]){
   if(ids.has(id))continue;
   if(!id.startsWith('file:')||!fs.existsSync(id.slice(5)))throw new Error(`无效外部端点 ${id}`);
  }
 }
 for(const part of parts)fs.writeFileSync(part.name,JSON.stringify(part.graph,null,2));
 report.batches.push({batchIndex:b.batchIndex,files:b.files.length,nodes:nodes.length,edges:edges.length,imports:expected,outputs:parts.map(p=>p.name),coverage:'complete',json:'valid'});
 totalNodes+=nodes.length;totalEdges+=edges.length;totalFiles+=b.files.length;
}
report.totalFiles=totalFiles;report.totalNodes=totalNodes;report.totalEdges=totalEdges;report.batchCount=worker.batches.length;report.partCount=[...chunks.values()].reduce((n,ps)=>n+ps.length,0);
fs.writeFileSync('.ua/tmp/worker-2-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
