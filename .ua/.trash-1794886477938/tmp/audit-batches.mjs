// @ts-check
// 合并前检查所有原始批次是否落盘，并验证文件覆盖、节点字段和导入边数量。
import fs from 'node:fs';
import path from 'node:path';
const data = path.join(process.cwd(), '.ua');
const intermediate = path.join(data, 'intermediate');
const batches = JSON.parse(fs.readFileSync(path.join(intermediate, 'batches.json'), 'utf8'));
const allNames = fs.readdirSync(intermediate);
const fileTypes = new Set(['file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint']);
const errors = [];
const reports = [];
for (const batch of batches.batches) {
  const files = allNames.filter(name => name === `batch-${batch.batchIndex}.json` || new RegExp(`^batch-${batch.batchIndex}-part-\\d+\\.json$`).test(name));
  if (!files.length) {
    errors.push(`Missing batch ${batch.batchIndex}`);
    continue;
  }
  const graphs = files.map(name => JSON.parse(fs.readFileSync(path.join(intermediate, name), 'utf8')));
  const nodes = graphs.flatMap(graph => graph.nodes);
  const edges = graphs.flatMap(graph => graph.edges);
  const covered = new Set(nodes.filter(node => fileTypes.has(node.type)).map(node => node.filePath));
  const missing = batch.files.map(file => file.path).filter(file => !covered.has(file));
  errors.push(...missing.map(file => `Batch ${batch.batchIndex} missing file ${file}`));
  const ids = new Set();
  for (const node of nodes) {
    if (ids.has(node.id)) errors.push(`Batch ${batch.batchIndex} duplicate node ${node.id}`);
    ids.add(node.id);
    if (!node.id || !node.type || !node.name || !node.summary || !node.tags?.length) errors.push(`Batch ${batch.batchIndex} malformed node ${node.id}`);
  }
  const importsExpected = Object.values(batch.batchImportData).reduce((sum, targets) => sum + targets.length, 0);
  const importsActual = edges.filter(edge => edge.type === 'imports').length;
  if (importsActual !== importsExpected) errors.push(`Batch ${batch.batchIndex} imports ${importsActual}/${importsExpected}`);
  reports.push({ batchIndex: batch.batchIndex, shards: files.length, files: batch.files.length, nodes: nodes.length, edges: edges.length, importsExpected, importsActual, missing });
}
const report = { expectedBatches: batches.totalBatches, completedBatches: reports.length, filesCovered: reports.reduce((sum, report) => sum + report.files - report.missing.length, 0), nodes: reports.reduce((sum, report) => sum + report.nodes, 0), edges: reports.reduce((sum, report) => sum + report.edges, 0), errors, reports };
fs.writeFileSync(path.join(data, 'tmp/batch-audit.json'), JSON.stringify(report, null, 2));
console.log(`Batch audit: ${report.completedBatches}/${report.expectedBatches} batches, ${report.filesCovered} files, ${errors.length} errors.`);
process.exitCode = errors.length ? 1 : 0;
