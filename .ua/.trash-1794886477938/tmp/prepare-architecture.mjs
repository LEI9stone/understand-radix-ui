// @ts-check
// 为后续架构和导览代理准备只读输入，剔除不需要的逐函数字段以减少上下文开销。
import fs from 'node:fs';
import path from 'node:path';
const ua = path.join(process.cwd(), '.ua');
const graph = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate/assembled-graph.json'), 'utf8'));
const scan = JSON.parse(fs.readFileSync(path.join(ua, 'intermediate/scan-result.json'), 'utf8'));
const fileTypes = new Set(['file','config','document','service','pipeline','table','schema','resource','endpoint']);
const fileNodes = graph.nodes.filter(node => fileTypes.has(node.type));
const fileIds = new Set(fileNodes.map(node => node.id));
// 架构分析只需文件间拓扑，仍保留所有类别的文件级关系。
const allFileEdges = graph.edges.filter(edge => fileIds.has(edge.source) && fileIds.has(edge.target));
const input = {
 project: {name: scan.name, description: scan.description, languages: scan.languages, frameworks: scan.frameworks},
 directoryTree: [...new Set(scan.files.map(file => file.path.split('/').slice(0, 2).join('/')))].sort(),
 fileNodes: fileNodes.map(({id,type,name,filePath,summary,tags}) => ({id,type,name,filePath,summary,tags})),
 importEdges: allFileEdges.filter(edge => edge.type === 'imports'),
 allEdges: allFileEdges
};
fs.writeFileSync(path.join(ua, 'tmp/architecture-input.json'), JSON.stringify(input, null, 2));
// 导览保留完整边列表，供代理根据文件层级过滤或关联重要符号。
const layersPath = path.join(ua, 'intermediate/layers.json');
if (fs.existsSync(layersPath)) {
 const rawLayers = JSON.parse(fs.readFileSync(layersPath, 'utf8'));
 const layers = Array.isArray(rawLayers) ? rawLayers : rawLayers.layers;
 fs.writeFileSync(path.join(ua, 'tmp/tour-input.json'), JSON.stringify({nodes:fileNodes.map(({id,name,filePath,summary,type}) => ({id,name,filePath,summary,type})),layers:layers.map(({id,name,description}) => ({id,name,description})),edges:graph.edges}, null, 2));
}
console.log(`Prepared architecture input for ${fileNodes.length} file nodes and ${allFileEdges.length} file edges.`);
