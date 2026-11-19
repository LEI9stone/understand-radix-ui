// @ts-check
import fs from 'node:fs';
import path from 'node:path';
const [inputPath,outputPath]=process.argv.slice(2);
try {
const input=JSON.parse(fs.readFileSync(inputPath,'utf8'));
const nodes=input.nodes;
const index=new Map(nodes.map(n=>[n.id,n]));
// 输入还含函数端点，文件导览拓扑仅使用两端均在文件节点集合的边。
const edges=input.edges.filter(e=>index.has(e.source)&&index.has(e.target));
const incoming=new Map(nodes.map(n=>[n.id,new Set()]));
const outgoing=new Map(nodes.map(n=>[n.id,new Set()]));
for(const e of edges){incoming.get(e.target).add(e.source);outgoing.get(e.source).add(e.target);}
// 按独立邻居数计算重要度，避免同一对文件的多种关系重复抬高排名。
function ranking(map,key){return nodes.map(n=>({id:n.id,name:n.name,[key]:map.get(n.id).size})).sort((a,b)=>b[key]-a[key]||a.id.localeCompare(b.id)).slice(0,20);}
const fanInRanking=ranking(incoming,'fanIn');const fanOutRanking=ranking(outgoing,'fanOut');
const inValues=[...incoming.values()].map(s=>s.size).sort((a,b)=>a-b);
const outValues=[...outgoing.values()].map(s=>s.size).sort((a,b)=>a-b);
const low=inValues[Math.floor(nodes.length*.25)];const high=outValues[Math.floor(nodes.length*.9)];
const entryNames=new Set(['index.ts','index.js','main.ts','main.js','app.ts','app.js','server.ts','server.js','mod.rs','main.go','main.py','main.rs','manage.py','app.py','wsgi.py','asgi.py','run.py','__main__.py','Application.java','Main.java','Program.cs','config.ru','index.php','App.swift','Application.kt','main.cpp','main.c']);
// 入口分数采用技能定义，库聚合入口另作为显式学习路径分析而非虚构应用主函数。
const candidates=nodes.map(n=>{let score=0;if(n.type==='document'){if(n.filePath==='README.md')score=5;else if(!n.filePath?.includes('/'))score=2;}else if(n.type==='file'){if(entryNames.has(path.basename(n.filePath)))score+=3;if(n.filePath.split('/').length<=2)score++;if(outgoing.get(n.id).size>=high)score++;if(incoming.get(n.id).size<=low)score++;}return{id:n.id,name:n.name,type:n.type,summary:n.summary,score};}).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
// 使用严格 imports/calls 做标准 BFS；额外依赖/导出 BFS 用来解释别名未被解析的库结构。
function traverse(start,types){const order=[],depthMap={},byDepth={};if(!start)return{startNode:null,order,depthMap,byDepth};const queue=[start];depthMap[start]=0;for(let i=0;i<queue.length;i++){const id=queue[i];order.push(id);const depth=depthMap[id];(byDepth[depth]??=[]).push(id);for(const e of edges.filter(e=>e.source===id&&types.has(e.type))){if(depthMap[e.target]===undefined){depthMap[e.target]=depth+1;queue.push(e.target);}}}return{startNode:start,order,depthMap,byDepth};}
const topCode=candidates.find(n=>n.type==='file')?.id;
const bfsTraversal=traverse(topCode,new Set(['imports','calls']));
const aggregate='file:packages/react/radix-ui/src/index.ts';
const architectureTraversal=traverse(index.has(aggregate)?aggregate:topCode,new Set(['imports','calls','depends_on','exports']));
// 先寻找双向导入/调用，再按至少两个邻接点扩展到最多五个文件。
const coupled=edges.filter(e=>['imports','calls'].includes(e.type));const pairKeys=new Set(coupled.map(e=>`${e.source}\u0000${e.target}\u0000${e.type}`));const clusters=[];const seenClusters=new Set();
for(const e of coupled){if(!pairKeys.has(`${e.target}\u0000${e.source}\u0000${e.type}`))continue;const group=new Set([e.source,e.target]);for(const n of nodes){if(group.size>=5)break;if(group.has(n.id))continue;let links=0;for(const id of group)if(outgoing.get(n.id).has(id)||incoming.get(n.id).has(id))links++;if(links>=2)group.add(n.id);}const ids=[...group].sort();const key=ids.join('|');if(seenClusters.has(key))continue;seenClusters.add(key);clusters.push({nodes:ids,edgeCount:edges.filter(e=>group.has(e.source)&&group.has(e.target)).length});}
clusters.sort((a,b)=>b.edgeCount-a.edgeCount);
const nonCodeFiles={documentation:[],infrastructure:[],data:[],config:[]};
for(const n of nodes){const item={id:n.id,name:n.name,summary:n.summary};if(n.type==='document')nonCodeFiles.documentation.push(item);if(['service','pipeline','resource'].includes(n.type))nonCodeFiles.infrastructure.push(item);if(['table','schema','endpoint'].includes(n.type))nonCodeFiles.data.push(item);if(n.type==='config')nonCodeFiles.config.push(item);}
const result={scriptCompleted:true,entryPointCandidates:candidates.slice(0,5),fanInRanking,fanOutRanking,bfsTraversal,architectureTraversal,nonCodeFiles,clusters:clusters.slice(0,10),layers:{count:input.layers.length,list:input.layers},nodeSummaryIndex:Object.fromEntries(nodes.map(n=>[n.id,{name:n.name,type:n.type,filePath:n.filePath,summary:n.summary}])),totalNodes:nodes.length,totalEdges:edges.length,inputEdges:input.edges.length,excludedNonFileEdges:input.edges.length-edges.length};
fs.writeFileSync(outputPath,JSON.stringify(result,null,2));
// 完整紧凑索引用于 read 分段审阅，内容全部直接来自输入，未做语义推断。
fs.writeFileSync('.ua/tmp/tour-input-projection.txt',[JSON.stringify({layers:input.layers}),...nodes.map(n=>JSON.stringify(n)),JSON.stringify({edges})].join('\n'));
const overview={...result};delete overview.nodeSummaryIndex;delete overview.nonCodeFiles;delete overview.architectureTraversal;
fs.writeFileSync('.ua/tmp/tour-topology-overview.json',JSON.stringify(overview,null,2));
console.log(JSON.stringify({nodes:nodes.length,fileEdges:edges.length,inputEdges:input.edges.length,clusters:clusters.length,standardBfs:bfsTraversal.order.length,architectureBfs:architectureTraversal.order.length}));
} catch(error){console.error(error);process.exitCode=1;}
