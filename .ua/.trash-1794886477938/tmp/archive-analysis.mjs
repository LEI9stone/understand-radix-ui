// @ts-check
// 保留验证摘要与扫描清单，将分析临时文件归档而不是删除，以便出错时可追溯。
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const ua = path.join(root, '.ua');
const intermediate = path.join(ua, 'intermediate');
const tmp = path.join(ua, 'tmp');
// 汇集正式产物与校验结果；此报告不改变图谱节点和语义关系。
const readJson = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const graph = readJson(path.join(ua, 'knowledge-graph.json'));
const scan = readJson(path.join(intermediate, 'scan-result.json'));
const review = readJson(path.join(intermediate, 'review.json'));
const report = {
 project: graph.project,
 fileCount: scan.totalFiles,
 filesByCategory: scan.files.reduce((counts, file) => { counts[file.fileCategory] = (counts[file.fileCategory] || 0) + 1; return counts; }, {}),
 stats: review.stats,
 layers: graph.layers.map(({id,name,description,nodeIds}) => ({id,name,description,files:nodeIds.length})),
 tour: graph.tour.map(({order,title}) => ({order,title})),
 validation: readJson(path.join(intermediate, 'strict-validation.json')),
 assemblyReview: readJson(path.join(intermediate, 'assemble-review.json')),
 warnings: [
  '官方导入映射仅解析115条包内或应用内关系；workspaces别名相关依赖已依据源码以语义依赖补充，imports字段未被猜测扩充。',
  '部分forwardRef、CSS、HTML、MTS、快照和patch未被结构提取器完整支持，已通过源码阅读补充节点与精确组件范围。',
  '65个孤立节点多为独立文档、模板和声明文件，不表示文件缺失。',
  'use-effect-event包README标题与包名不一致，未修改原始文档。',
  '执行期间收到代理中断通知；已保留产物并完成续做，各代理报告本地提取与写入命令均成功。'
 ],
 orphanWarnings: review.warnings,
 sourceCodeChanged: false
};
fs.writeFileSync(path.join(ua, 'analysis-summary.json'), `${JSON.stringify(report, null, 2)}\n`);
// 移动前确认数据根目录与源目录均为本仓库下的预期绝对路径，拒绝符号链接重定向。
for (const expected of [ua, intermediate, tmp]) {
 if (fs.realpathSync(expected) !== expected) throw new Error(`Unexpected resolved directory: ${expected}`);
}
const trash = path.join(ua, `.trash-${Date.now()}`);
if (path.dirname(trash) !== ua || !/^\.trash-\d{13}$/.test(path.basename(trash)) || fs.existsSync(trash)) throw new Error('Unexpected archive target.');
console.log(`Verified archive source: ${intermediate}; target: ${trash}`);
fs.mkdirSync(trash);
let moved = 0;
for (const name of fs.readdirSync(intermediate)) {
 if (name === 'scan-result.json') continue;
 const source = path.resolve(intermediate, name);
 const target = path.resolve(trash, name);
 if (path.dirname(source) !== intermediate || path.dirname(target) !== trash || fs.existsSync(target)) throw new Error(`Unsafe move target: ${target}`);
 fs.renameSync(source, target);
 moved++;
}
const tmpTarget = path.join(trash, 'tmp');
if (path.dirname(tmpTarget) !== trash || fs.existsSync(tmpTarget)) throw new Error('Unsafe temporary archive target.');
console.log(`Verified temporary source: ${tmp}; target: ${tmpTarget}`);
fs.renameSync(tmp, tmpTarget);
console.log(`Archived ${moved} intermediate entries and temporary directory; scan inventory preserved.`);
