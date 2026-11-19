// @ts-check
import fs from 'node:fs';
const graphPath='.ua/intermediate/assembled-graph.json';
const reviewPath='.ua/intermediate/assemble-review.json';
const graph=JSON.parse(fs.readFileSync(graphPath,'utf8'));
const scan=JSON.parse(fs.readFileSync('.ua/intermediate/scan-result.json','utf8'));
const byId=new Map(graph.nodes.map(n=>[n.id,n]));
let restored=0,additional=0,importsAdded=0;
/** 仅为已存在且有源码证据的端点添加去重语义边。 */
function add(source,target,type,weight){
 if(!byId.has(source)||!byId.has(target))throw new Error(`端点不在图谱: ${source} -> ${target}`);
 if(graph.edges.some(e=>e.source===source&&e.target===target&&e.type===type))return false;
 graph.edges.push({source,target,type,direction:'forward',weight});return true;
}
const context='file:packages/react/context/src/create-context.tsx';
const roving='file:packages/react/roving-focus/src/roving-focus-group.tsx';
// 恢复合并报告中的五条丢失依赖；实际实现路径已由清单、入口导出和源码共同确认。
for(const [source,target]of [
 ['file:packages/react/radio-group/src/radio-group.tsx',context],
 ['file:packages/react/radio-group/src/radio-group.tsx',roving],
 ['file:packages/react/radio-group/src/radio.tsx',context],
 ['file:packages/react/popper/src/popper.tsx',context],
 ['file:packages/react/progress/src/progress.tsx',context]
])if(add(source,target,'depends_on',.6))restored++;
// 仅补齐已经逐个读过且明确 include src 的14个孤立包配置，不扩大为全仓关系重建。
const configDirs=['packages/core/number',...['accessible-icon','avatar','context','dropdown-menu','focus-guards','form','id','portal','slot','tabs','toast','toolbar','use-layout-effect'].map(p=>`packages/react/${p}`)];
for(const dir of configDirs){
 const config=JSON.parse(fs.readFileSync(`${dir}/tsconfig.json`,'utf8'));
 if(!config.include?.includes('src'))throw new Error(`编译范围证据不匹配: ${dir}`);
 if(add(`config:${dir}/tsconfig.json`,`file:${dir}/src/index.ts`,'configures',.6))additional++;
}
// 逐条核对正式 importMap；仅允许恢复明确存在的内部导入。
let expectedImports=0;
for(const [source,targets]of Object.entries(scan.importMap))for(const target of targets){expectedImports++;if(add(`file:${source}`,`file:${target}`,'imports',.7))importsAdded++;}
const fileTypes=new Set(['file','config','document','service','pipeline','table','endpoint','schema','resource']);
const inventory=new Set(scan.files.map(f=>f.path));
const missingFiles=scan.files.filter(f=>!graph.nodes.some(n=>fileTypes.has(n.type)&&n.filePath===f.path&&!n.lineRange));
const danglingEdges=graph.edges.filter(e=>!byId.has(e.source)||!byId.has(e.target));
const invalidNodeTypes=graph.nodes.filter(n=>!['file','function','class','module','concept','config','document','service','table','endpoint','pipeline','schema','resource'].includes(n.type));
const invalidComplexities=graph.nodes.filter(n=>!['simple','moderate','complex'].includes(n.complexity));
const extraFiles=graph.nodes.filter(n=>n.filePath&&!inventory.has(n.filePath));
if(missingFiles.length||danglingEdges.length||invalidNodeTypes.length||invalidComplexities.length||extraFiles.length)throw new Error('保存前验证失败，保留原候选供诊断');
const connected=new Set(graph.edges.flatMap(e=>[e.source,e.target]));
const orphanNodes=graph.nodes.filter(n=>!connected.has(n.id));
const review={
 fixedSectionOk:true,nodesRecovered:0,edgesRestored:restored,crossBatchEdgesAdded:importsAdded,additionalEdgesAdded:additional,typesRemapped:0,complexityRemapped:0,
 notes:[
  '完整读取129行合并报告：无大规模节点ID或复杂度修正，五项 could-not-fix 均为补充依赖边使用了不存在的实现文件名。',
  '已以扫描清单、实际文件和入口导出确认 create-context.tsx 与 roving-focus-group.tsx，恢复五条 depends_on；未新增或伪造文件节点。',
  `正式 importMap 共 ${expectedImports} 条，全部已存在；未添加推测性 imports。`,
  `扫描清单 ${scan.files.length} 个文件全部有文件级节点；无图谱外文件路径、悬空边、非法节点类型或非法复杂度。`,
  `补充 ${additional} 条由已读 tsconfig include src 直接证明的 configures，连接孤立包配置与各自公开入口。`,
  `仍有 ${orphanNodes.length} 个孤立节点，多为独立变更说明、仓库模板、类型声明和构建辅助文件；孤立不表示文件遗漏，未为消除警告建立猜测关系。`,
  '主会话收到系统任务中断报告，但本地所有已执行工具均成功，系统未提供中断原因；已保留诊断并按一次恢复指令完成本阶段落盘。'
 ],
 stats:{totalNodes:graph.nodes.length,totalEdges:graph.edges.length,analyzedFiles:scan.files.length,coveredFiles:scan.files.length-missingFiles.length,imports:graph.edges.filter(e=>e.type==='imports').length,orphanNodes:orphanNodes.length,missingFiles:0,danglingEdges:0}
};
// 先验证完整候选再落盘，保持所有原有节点和语义说明不变。
fs.writeFileSync(graphPath,JSON.stringify(graph,null,2));
fs.writeFileSync(reviewPath,JSON.stringify(review,null,2));
console.log(JSON.stringify(review,null,2));
