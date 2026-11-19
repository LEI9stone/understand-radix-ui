// @ts-check
// 将既有语义批次均衡分配给五名分析代理，保持原始批次编号及独立输出。
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const data = path.join(root, '.ua');
const input = JSON.parse(fs.readFileSync(path.join(data, 'intermediate/batches.json'), 'utf8'));
const groups = Array.from({ length: 5 }, (_, index) => ({ worker: index + 1, load: 0, batches: [] }));
// 按行数估算语义阅读量，优先分配较重的批次以减少等待。
for (const batch of [...input.batches].sort((a, b) => b.files.reduce((s, f) => s + f.sizeLines, 0) - a.files.reduce((s, f) => s + f.sizeLines, 0))) {
  const group = [...groups].sort((a, b) => a.load - b.load)[0];
  group.batches.push(batch);
  group.load += batch.files.reduce((sum, file) => sum + file.sizeLines + 100, 0);
}
for (const group of groups) {
  group.batches.sort((a, b) => a.batchIndex - b.batchIndex);
  fs.writeFileSync(path.join(data, `tmp/worker-${group.worker}.json`), JSON.stringify(group, null, 2));
}
const overview = input.batches.map(batch => ({ batchIndex: batch.batchIndex, files: batch.files.length, lines: batch.files.reduce((sum, file) => sum + file.sizeLines, 0), preview: batch.files.slice(0, 3).map(file => file.path), worker: groups.find(group => group.batches.includes(batch)).worker }));
fs.writeFileSync(path.join(data, 'tmp/batch-overview.json'), JSON.stringify({ totalFiles: input.totalFiles, totalBatches: input.totalBatches, groups: groups.map(group => ({worker: group.worker, load: group.load, batchIndices: group.batches.map(batch => batch.batchIndex)})), overview }, null, 2));
console.log(`Prepared ${input.totalBatches} batches across ${groups.length} isolated workers.`);
