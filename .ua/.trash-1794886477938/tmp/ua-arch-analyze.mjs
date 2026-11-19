// @ts-check
import fs from 'node:fs';
import path from 'node:path';
/** 为结构统计累加键值，避免修改输入图谱。 */
function increment(map,key,amount=1){map[key]=(map[key]??0)+amount;}
/** 将项目目录映射到顶层分组；根文件单独归组。 */
function groupOf(file,prefix=''){const relative=file.slice(prefix.length);return relative.includes('/')?relative.split('/')[0]:'<root>';}
/** 以实际包边界补充顶层目录统计，保留React monorepo的内部组织证据。 */
function packageOf(file){const p=file.split('/');if(p[0]==='packages')return p.slice(0,3).join('/');if(['apps','internal'].includes(p[0]))return p.slice(0,2).join('/');return groupOf(file);}
/** 根据目录或文件名标识明显的测试、类型、文档和工程职责，不代替后续语义分层。 */
function patternOf(file){if(/(^|\/)(test|tests|e2e|__tests__)(\/|$)|\.(test|spec)\./.test(file))return 'test';if(/\.d\.ts$/.test(file))return 'types';if(/\.md$/.test(file))return 'documentation';if(file.startsWith('.github/'))return 'ci-cd';if(/(^|\/)use-[^/]+\//.test(file))return 'hooks';if(/(^|\/)(context|collection)\//.test(file))return 'state';if(/(^|\/)(package|tsconfig)\.json$/.test(file))return 'config';if(/(^|\/)index\.[jt]sx?$/.test(file))return 'entry';if(file.startsWith('packages/react/'))return 'ui';if(file.startsWith('packages/core/'))return 'utility';if(file.startsWith('internal/'))return 'utility';return 'shared';}
/** 计算完整输入的目录、邻接、类别、密度、基础设施和文档覆盖统计。 */
function analyze(input){
 const nodes=input.fileNodes;const byId=new Map(nodes.map(n=>[n.id,n]));
 const segments=nodes.map(n=>path.dirname(n.filePath).split('/'));let common=[];
 for(let i=0;i<Math.min(...segments.map(s=>s.length));i++){const x=segments[0][i];if(x==='.'||!segments.every(s=>s[i]===x))break;common.push(x);}
 const prefix=common.length?common.join('/')+'/':'';
 const directoryGroups={},nodeTypeGroups={},packageGroups={},adjacency={},fileFanIn={},fileFanOut={},patternMatches={},crossCategory={},interGroup={},packageDeps={},intra={},groupImports={},groupImportedBy={};
 for(const n of nodes){const g=groupOf(n.filePath,prefix),p=packageOf(n.filePath);(directoryGroups[g]??=[]).push(n.id);(packageGroups[p]??=[]).push(n.id);(nodeTypeGroups[n.type]??=[]).push(n.id);adjacency[n.id]=[];fileFanIn[n.id]=0;fileFanOut[n.id]=0;patternMatches[n.id]=patternOf(n.filePath);}
 for(const e of input.importEdges){const s=byId.get(e.source),t=byId.get(e.target);if(!s||!t)throw Error('Import endpoint missing');adjacency[e.source].push(e.target);increment(fileFanOut,e.source);increment(fileFanIn,e.target);const a=groupOf(s.filePath,prefix),b=groupOf(t.filePath,prefix);increment(interGroup,`${a} -> ${b}`);(groupImports[a]??=new Set()).add(b);(groupImportedBy[b]??=new Set()).add(a);for(const g of new Set([a,b])){const d=intra[g]??={internalEdges:0,totalEdges:0};d.totalEdges++;if(a===b)d.internalEdges++;}}
 for(const e of input.allEdges){const s=byId.get(e.source),t=byId.get(e.target);if(!s||!t)throw Error('File edge endpoint missing');increment(crossCategory,`${s.type} -> ${t.type}: ${e.type}`);if(['imports','depends_on'].includes(e.type))increment(packageDeps,`${packageOf(s.filePath)} -> ${packageOf(t.filePath)}`);}
 const coverage=Object.entries(directoryGroups).map(([g,ids])=>({group:g,hasDocs:ids.some(id=>byId.get(id).type==='document')}));
 const infra=nodes.filter(n=>['pipeline','service','resource'].includes(n.type));
 return {scriptCompleted:true,commonPrefix:prefix,directoryGroups,nodeTypeGroups,packageGroups,adjacency,fileFanIn,fileFanOut,groupImports:Object.fromEntries(Object.entries(groupImports).map(([k,v])=>[k,[...v]])),groupImportedBy:Object.fromEntries(Object.entries(groupImportedBy).map(([k,v])=>[k,[...v]])),crossCategoryEdges:crossCategory,interGroupImports:interGroup,intraGroupDensity:Object.fromEntries(Object.entries(intra).map(([g,d])=>[g,{...d,density:d.internalEdges/d.totalEdges}])),patternMatches,deploymentTopology:{hasDockerfile:nodes.some(n=>/Dockerfile/.test(n.filePath)),hasCompose:nodes.some(n=>/docker-compose|compose\.ya?ml/.test(n.filePath)),hasK8s:nodes.some(n=>/k8s|kubernetes/.test(n.filePath)),hasTerraform:nodes.some(n=>/\.tf$/.test(n.filePath)),hasCI:infra.some(n=>n.type==='pipeline'),infraFiles:infra.map(n=>n.filePath)},dataPipeline:{schemaFiles:nodes.filter(n=>n.type==='schema').map(n=>n.filePath),migrationFiles:nodes.filter(n=>n.type==='table').map(n=>n.filePath),dataModelFiles:[],apiHandlerFiles:nodes.filter(n=>n.type==='endpoint').map(n=>n.filePath)},docCoverage:{groupsWithDocs:coverage.filter(x=>x.hasDocs).length,totalGroups:coverage.length,coverageRatio:coverage.filter(x=>x.hasDocs).length/coverage.length,undocumentedGroups:coverage.filter(x=>!x.hasDocs).map(x=>x.group)},dependencyDirection:Object.entries(interGroup).filter(([key,count])=>{const [a,b]=key.split(' -> ');return a!==b&&count>(interGroup[`${b} -> ${a}`]??0);}).map(([key,count])=>({dependent:key.split(' -> ')[0],dependsOn:key.split(' -> ')[1],count})),packageDependencies:packageDeps,nonCodeToCode:input.allEdges.filter(e=>byId.get(e.source)?.type!=='file'&&byId.get(e.target)?.type==='file'),fileStats:{totalFileNodes:nodes.length,filesPerGroup:Object.fromEntries(Object.entries(directoryGroups).map(([k,v])=>[k,v.length])),nodeTypeCounts:Object.fromEntries(Object.entries(nodeTypeGroups).map(([k,v])=>[k,v.length]))}};
}
const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const result=analyze(input);fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+'\n');
// 用编号引用完整编码全部节点与边，降低重复长路径；字段和值不丢失。
const index=new Map(input.fileNodes.map((n,i)=>[n.id,i]));
const lines=[JSON.stringify({project:input.project,directoryTree:input.directoryTree,nodeColumns:['i','id','type','name','filePath','summary','tags'],edgeColumns:['sourceIndex','targetIndex','type','direction','weight']})];
for(const [i,n] of input.fileNodes.entries())lines.push(JSON.stringify([i,n.id,n.type,n.name,n.filePath,n.summary,n.tags]));
lines.push('IMPORT_EDGES');for(const e of input.importEdges)lines.push(JSON.stringify([index.get(e.source),index.get(e.target),e.type,e.direction,e.weight]));
lines.push('ALL_EDGES');for(const e of input.allEdges)lines.push(JSON.stringify([index.get(e.source),index.get(e.target),e.type,e.direction,e.weight]));
fs.writeFileSync('.ua/tmp/architecture-complete-review.jsonl',lines.join('\n')+'\n');
const summary={...result,directoryGroups:undefined,nodeTypeGroups:undefined,packageGroups:Object.fromEntries(Object.entries(result.packageGroups).map(([k,v])=>[k,v.length])),adjacency:undefined,fileFanIn:undefined,fileFanOut:undefined,patternMatches:undefined,nonCodeToCode:undefined,topImportFanIn:Object.entries(result.fileFanIn).sort((a,b)=>b[1]-a[1]).slice(0,25),topDependencyFanIn:input.fileNodes.map(n=>({id:n.id,count:input.allEdges.filter(e=>['imports','depends_on'].includes(e.type)&&e.target===n.id).length})).sort((a,b)=>b.count-a.count).slice(0,25)};
fs.writeFileSync('.ua/tmp/architecture-structural-summary.json',JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({nodes:input.fileNodes.length,importEdges:input.importEdges.length,allEdges:input.allEdges.length,reviewLines:lines.length,groups:result.fileStats.filesPerGroup}));
