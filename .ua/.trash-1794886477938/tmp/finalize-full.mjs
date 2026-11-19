// @ts-check
// 仅处理知识图谱产物：规范化分层与导览，严格校验后发布，指纹成功后才写入元信息。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { KnowledgeGraphSchema } from '/Users/xiaolei/.understand-anything/repo/understand-anything-plugin/packages/core/dist/index.js';
const root = process.cwd();
const ua = path.join(root, '.ua');
const intermediate = path.join(ua, 'intermediate');
const assembledPath = path.join(intermediate, 'assembled-graph.json');
const stage = process.argv[2];
const fileTypes = new Set(['file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint']);
// 读取已经过人工/LLM审查的JSON产物，不重新推导任何语义。
function load(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}
// 仅写入指定的图谱数据文件，统一使用可读的JSON编码。
function save(filename, value) {
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`);
}
// 将遗留的裸文件路径转换为图中实际文件级节点标识符。
function normalizeRefs(values, graph) {
  const ids = new Set(graph.nodes.map(node => node.id));
  const byPath = new Map(graph.nodes.filter(node => fileTypes.has(node.type)).map(node => [node.filePath, node.id]));
  return [...new Set((values || []).map(value => typeof value === 'object' ? value.id : value).map(value => ids.has(value) ? value : byPath.get(value) || `file:${value}`).filter(value => ids.has(value)))];
}
// 除仪表盘Schema外，额外验证本次扫描的每个文件都有图谱节点、范围不越界。
function check(graph) {
  const parsed = KnowledgeGraphSchema.safeParse(graph);
  if (!parsed.success) throw new Error(JSON.stringify(parsed.error.issues));
  const scan = load(path.join(intermediate, 'scan-result.json'));
  const fileInventory = new Map(scan.files.map(file => [file.path, file.sizeLines]));
  const covered = new Set(graph.nodes.filter(node => fileTypes.has(node.type)).map(node => node.filePath));
  const issues = scan.files.filter(file => !covered.has(file.path)).map(file => `Missing file ${file.path}`);
  for (const node of graph.nodes) {
    if (node.filePath && !fileInventory.has(node.filePath)) issues.push(`Unknown file ${node.filePath}`);
    if (node.lineRange && (node.lineRange[0] < 1 || node.lineRange[1] < node.lineRange[0] || node.lineRange[1] > fileInventory.get(node.filePath))) issues.push(`Invalid range ${node.id}`);
  }
  const report = { schemaValid: parsed.success, scannedFiles: scan.totalFiles, coveredFiles: covered.size, issues };
  save(path.join(intermediate, 'strict-validation.json'), report);
  if (issues.length) throw new Error(JSON.stringify(issues));
  return report;
}
if (stage === 'assemble') {
  const graph = load(assembledPath);
  const scan = load(path.join(intermediate, 'scan-result.json'));
  const rawLayers = load(path.join(intermediate, 'layers.json'));
  const rawTour = load(path.join(intermediate, 'tour.json'));
  graph.version = '1.0.0';
  graph.project = { name: scan.name, languages: scan.languages, frameworks: scan.frameworks, description: scan.description, analyzedAt: new Date().toISOString(), gitCommitHash: execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim() };
  graph.layers = (Array.isArray(rawLayers) ? rawLayers : rawLayers.layers).map((layer, index) => ({ id: layer.id || `layer:generated-${index + 1}`, name: layer.name, description: layer.description, nodeIds: normalizeRefs(layer.nodeIds || layer.nodes, graph) }));
  graph.tour = (Array.isArray(rawTour) ? rawTour : rawTour.steps).map(step => ({ order: step.order, title: step.title, description: step.description || step.whyItMatters, nodeIds: normalizeRefs(step.nodeIds || step.nodesToInspect, graph), ...(step.languageLesson ? { languageLesson: step.languageLesson } : {}) })).sort((a, b) => a.order - b.order);
  check(graph);
  save(assembledPath, graph);
  console.log('Full graph assembled; strict schema and inventory validation passed.');
} else if (stage === 'publish') {
  const graph = load(assembledPath);
  const review = load(path.join(intermediate, 'review.json'));
  if (review.issues.length) throw new Error('Inline review still has unresolved issues.');
  const report = check(graph);
  save(path.join(ua, 'knowledge-graph.json'), graph);
  save(path.join(intermediate, 'fingerprint-input.json'), { projectRoot: root, filePaths: load(path.join(intermediate, 'scan-result.json')).files.map(file => file.path), gitCommitHash: graph.project.gitCommitHash });
  console.log(`Published ${graph.nodes.length} nodes and ${graph.edges.length} edges; coverage ${report.coveredFiles}/${report.scannedFiles}.`);
} else if (stage === 'meta') {
  const graph = load(path.join(ua, 'knowledge-graph.json'));
  const fingerprints = load(path.join(ua, 'fingerprints.json'));
  const scan = load(path.join(intermediate, 'scan-result.json'));
  if (Object.keys(fingerprints.files).length !== scan.totalFiles) throw new Error('Fingerprint coverage does not match scan inventory.');
  save(path.join(ua, 'meta.json'), { lastAnalyzedAt: graph.project.analyzedAt, gitCommitHash: graph.project.gitCommitHash, version: graph.version, analyzedFiles: scan.totalFiles });
  console.log(`Metadata saved after fingerprint coverage verified: ${scan.totalFiles} files.`);
} else {
  throw new Error('Expected stage: assemble, publish, or meta.');
}
