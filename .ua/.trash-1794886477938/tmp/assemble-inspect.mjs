// @ts-check
import fs from 'node:fs';
const graph=JSON.parse(fs.readFileSync('.ua/intermediate/assembled-graph.json','utf8'));
const scan=JSON.parse(fs.readFileSync('.ua/intermediate/scan-result.json','utf8'));
const validNodes=new Set(['file','function','class','module','concept','config','document','service','table','endpoint','pipeline','schema','resource']);
const validEdges=new Set(['imports','exports','contains','inherits','implements','calls','subscribes','publishes','middleware','reads_from','writes_to','transforms','validates','depends_on','tested_by','configures','related','similar_to','deploys','serves','provisions','triggers','migrates','documents','routes','defines_schema']);
const fileTypes=new Set(['file','config','document','service','pipeline','table','endpoint','schema','resource']);
/** 统计分类，供人工检查异常分布。 */
function tally(items,key){const out={};for(const item of items){out[item[key]]=(out[item[key]]||0)+1;}return out;}
const ids=new Set(graph.nodes.map(n=>n.id));
const fileNodes=graph.nodes.filter(n=>fileTypes.has(n.type)&&!n.lineRange);
const inventory=new Set(scan.files.map(f=>f.path));
const importEdges=new Set(graph.edges.filter(e=>e.type==='imports').map(e=>`${e.source}|${e.target}`));
const expectedImports=[];
for(const [source,targets]of Object.entries(scan.importMap))for(const target of targets)expectedImports.push({source:`file:${source}`,target:`file:${target}`});
const connected=new Set(graph.edges.flatMap(e=>[e.source,e.target]));
const report={
 nodes:graph.nodes.length,edges:graph.edges.length,files:scan.files.length,
 nodeTypes:tally(graph.nodes,'type'),edgeTypes:tally(graph.edges,'type'),complexities:tally(graph.nodes,'complexity'),
 duplicateNodes:graph.nodes.filter((n,i,all)=>all.findIndex(x=>x.id===n.id)!==i),
 invalidNodes:graph.nodes.filter(n=>!validNodes.has(n.type)||!['simple','moderate','complex'].includes(n.complexity)||!n.id||!n.name||!n.summary||!n.tags?.length),
 invalidEdges:graph.edges.filter(e=>!validEdges.has(e.type)||!ids.has(e.source)||!ids.has(e.target)||e.source===e.target),
 missingFiles:scan.files.filter(f=>!fileNodes.some(n=>n.filePath===f.path)),
 extraFilePaths:graph.nodes.filter(n=>n.filePath&&!inventory.has(n.filePath)),
 expectedImports:expectedImports.length,actualImports:importEdges.size,
 missingImports:expectedImports.filter(e=>!importEdges.has(`${e.source}|${e.target}`)),
 extraImports:graph.edges.filter(e=>e.type==='imports'&&!expectedImports.some(x=>x.source===e.source&&x.target===e.target)),
 orphanFileNodes:fileNodes.filter(n=>!connected.has(n.id)).map(n=>({id:n.id,type:n.type,filePath:n.filePath,summary:n.summary})),
 correctEndpoints:graph.nodes.filter(n=>['file:packages/react/context/src/create-context.tsx','file:packages/react/roving-focus/src/roving-focus-group.tsx'].includes(n.id))
};
fs.writeFileSync('.ua/tmp/assemble-inspection.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({nodes:report.nodes,edges:report.edges,files:report.files,invalidNodes:report.invalidNodes.length,invalidEdges:report.invalidEdges.length,missingFiles:report.missingFiles.length,missingImports:report.missingImports.length,expectedImports:report.expectedImports,actualImports:report.actualImports,orphans:report.orphanFileNodes.length}));
