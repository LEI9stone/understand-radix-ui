// @ts-check
// 将人工确认的语义数据与官方提取的结构字段组合，避免重新猜测导入或行号。
const fs = require('node:fs');
const path = require('node:path');
const worker = JSON.parse(fs.readFileSync('.ua/tmp/worker-5.json', 'utf8'));
const fileSemantics = {};
const symbolSemantics = {};
const extraEdges = {};
const supplementalDeclarations = {};
// 为官方提取器未展开的 forwardRef 组件登记人工核实的声明范围。
function supplement(p, entries) { supplementalDeclarations[p] = entries; }
// 登记人工阅读后形成的文件摘要与标签。
function file(p, summary, tags) { fileSemantics[p] = { summary, tags }; }
// 登记人工判断的符号职责，符号范围与导出状态仍来自官方结构提取。
function symbols(p, entries) { symbolSemantics[p] = entries; }
// 登记具有明确源码证据的补充关系。
function edge(batch, source, target, type='depends_on', weight=0.6) { (extraEdges[batch] ||= []).push({source,target,type,weight,direction:'forward'}); }
// 生成指定原始批次，保留全部文件与重要声明，并检查没有遗漏人工语义。
function save(indices) {
  for (const b of worker.batches.filter(b => indices.includes(b.batchIndex))) {
    const x = JSON.parse(fs.readFileSync(`.ua/tmp/ua-file-extract-results-${b.batchIndex}.json`, 'utf8'));
    if (x.filesUnreadable.length || x.filesSkipped.length) throw Error(`unreadable/skipped ${b.batchIndex}`);
    const nodes = []; const edges = [];
    for (const r of x.results) {
      const type = r.fileCategory === 'docs' ? 'document' : r.fileCategory === 'config' ? 'config' : 'file';
      const id = `${type}:${r.path}`; const s = fileSemantics[r.path];
      if (!s) throw Error(`missing file semantics ${r.path}`);
      nodes.push({id,type,name:path.basename(r.path),filePath:r.path,...s,complexity:r.nonEmptyLines>200?'complex':r.nonEmptyLines>=50?'moderate':'simple'});
      const exported = new Set((r.exports || []).map(e => e.name));
      const declarations = [...(r.functions || []).filter(f => exported.has(f.name) || f.endLine-f.startLine+1>=10).map(f=>({...f,type:'function'})), ...(r.classes || []).filter(c=>exported.has(c.name)||(c.methods||[]).length>=2||c.endLine-c.startLine+1>=20).map(c=>({...c,type:'class'})), ...(supplementalDeclarations[r.path] || []).map(d=>({...d,type:'function'}))];
      for(const d of declarations) {
        const summary = symbolSemantics[r.path]?.[d.name];
        if (!summary) throw Error(`missing symbol semantics ${r.path}:${d.name}`);
        const sid = `${d.type}:${r.path}:${d.name}`;
        nodes.push({id:sid,type:d.type,name:d.name,filePath:r.path,lineRange:[d.startLine,d.endLine],summary,tags:s.tags.slice(0,3),complexity:d.endLine-d.startLine+1>100?'complex':d.endLine-d.startLine+1>=30?'moderate':'simple'});
        edges.push({source:id,target:sid,type:'contains',direction:'forward',weight:1});
        if(exported.has(d.name)) edges.push({source:id,target:sid,type:'exports',direction:'forward',weight:0.8});
      }
      for(const target of b.batchImportData[r.path]||[]) edges.push({source:id,target:`file:${target}`,type:'imports',direction:'forward',weight:0.7});
      for(const c of r.callGraph||[]) {
        const a=nodes.find(n=>n.filePath===r.path&&n.name===c.caller&&n.type==='function');
        const z=nodes.find(n=>n.filePath===r.path&&n.name===c.callee&&n.type==='function');
        if(a&&z&&a.id!==z.id)edges.push({source:a.id,target:z.id,type:'calls',direction:'forward',weight:0.8});
      }
    }
    edges.push(...(extraEdges[b.batchIndex]||[]));
    const uniqueEdges = [...new Map(edges.map(e=>[`${e.source}|${e.target}|${e.type}`,e])).values()];
    const expectedImports = Object.values(b.batchImportData).reduce((n, a)=>n+a.length,0);
    if(uniqueEdges.filter(e=>e.type==='imports').length!==expectedImports) throw Error(`imports mismatch ${b.batchIndex}`);
    const parts = Math.ceil(Math.max(nodes.length/60,uniqueEdges.length/120));
    const files = [...b.files].sort((a,b)=>a.path.localeCompare(b.path));
    const chunk = Math.ceil(files.length/parts);
    for(let k=0;k<parts;k++) {
      const paths = new Set(files.slice(k*chunk,(k+1)*chunk).map(f=>f.path));
      const partNodes = nodes.filter(n=>paths.has(n.filePath));
      const ids = new Set(partNodes.map(n=>n.id));
      const fragment={nodes:partNodes,edges:uniqueEdges.filter(e=>ids.has(e.source))};
      fs.writeFileSync(`.ua/intermediate/batch-${b.batchIndex}${parts>1?`-part-${k+1}`:''}.json`,JSON.stringify(fragment,null,2));
    }
    console.log(JSON.stringify({batch:b.batchIndex,files:files.length,nodes:nodes.length,edges:uniqueEdges.length,parts}));
  }
}
module.exports={file,symbols,edge,save,supplement};
