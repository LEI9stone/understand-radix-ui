// @ts-check
import fs from 'node:fs';
import path from 'node:path';
const worker=JSON.parse(fs.readFileSync('.ua/tmp/worker-1.json','utf8'));
const report={batches:[],totalFiles:0,totalNodes:0,totalEdges:0,nodeTypes:{},edgeTypes:{},warnings:[],issues:[]};
// 只检查自己的原始批次片段，严格保留分配编号与文件覆盖约束。
for(const b of worker.batches){
const names=fs.readdirSync('.ua/intermediate').filter(n=>new RegExp(`^batch-${b.batchIndex}(?:-part-\\d+)?\\.json$`).test(n));
if(!names.length){report.issues.push(`无产物:${b.batchIndex}`);continue;}
const parts=names.map(n=>JSON.parse(fs.readFileSync(path.join('.ua/intermediate',n),'utf8')));
const nodes=parts.flatMap(p=>p.nodes),edges=parts.flatMap(p=>p.edges);
const nodeIds=new Set(nodes.map(n=>n.id));
if(nodeIds.size!==nodes.length)report.issues.push(`重复节点:${b.batchIndex}`);
const fileTypes=new Set(['file','config','document','pipeline','service','resource','schema','table','endpoint']);
for(const f of b.files){
if(!nodes.some(n=>n.filePath===f.path&&fileTypes.has(n.type)))report.issues.push(`缺少文件:${f.path}`);
const expected=(b.batchImportData[f.path]||[]).length;
const actual=edges.filter(e=>e.type==='imports'&&e.source.endsWith(':'+f.path)).length;
if(expected!==actual)report.issues.push(`导入不一致:${f.path}:${expected}/${actual}`);
}
for(const n of nodes){
if(!n.id||!n.name||!n.summary||!n.tags?.length||!['simple','moderate','complex'].includes(n.complexity))report.issues.push(`字段缺失:${n.id}`);
if(n.filePath&&!fs.existsSync(n.filePath))report.issues.push(`路径缺失:${n.id}`);
if(n.type==='function'){
const lines=fs.readFileSync(n.filePath,'utf8').split('\n').length;
if(!n.lineRange||n.lineRange[0]<1||n.lineRange[1]<n.lineRange[0]||n.lineRange[1]>lines)report.issues.push(`范围无效:${n.id}`);
}
report.nodeTypes[n.type]=(report.nodeTypes[n.type]||0)+1;
}
for(const e of edges){
if(e.source===e.target)report.issues.push(`自指边:${e.source}`);
if(!nodeIds.has(e.source))report.issues.push(`未知源:${e.source}`);
if(!nodeIds.has(e.target)){
const m=e.target.match(/^(?:file|config|document|pipeline|service|resource|schema|table|endpoint):(.+)$/);
if(!m||!fs.existsSync(m[1]))report.issues.push(`未验证外部端点:${e.target}`);
}
report.edgeTypes[e.type]=(report.edgeTypes[e.type]||0)+1;
}
const extraction=JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${b.batchIndex}.json`,'utf8'));
if(extraction.filesUnreadable?.length)report.issues.push(`读取失败:${b.batchIndex}`);
for(const p of extraction.filesSkipped||[])report.warnings.push(`提取器不支持，已阅读补文件节点:${p}`);
report.batches.push({batch:b.batchIndex,parts:names,files:b.files.length,nodes:nodes.length,edges:edges.length});
report.totalFiles+=b.files.length;report.totalNodes+=nodes.length;report.totalEdges+=edges.length;
}
report.warnings.push('use-effect-event/README.md 标题仍为 react-use-is-hydrated，与包名不一致。');
report.warnings.push('forwardRef 组件未被结构解析器完整识别；已按源码手工补重要组件与精确行号。');
fs.writeFileSync('.ua/tmp/worker-1-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.issues.length)process.exitCode=1;
