// 复用官方结构结果，并将人工撰写的中文语义安全序列化为两个独立批次的图分片。
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {semantics83} from './scanner-semantic-83.mjs';
import {semantics84} from './scanner-semantic-84.mjs';
const root = '/Users/xiaolei/Desktop/understand/understand-radix-ui';
const ua = root + '/.ua';
const batchIndex = Number(process.argv[2]);
assert([83,84].includes(batchIndex));
const input = JSON.parse(fs.readFileSync(`${ua}/tmp/ua-file-analyzer-input-${batchIndex}.json`, 'utf8'));
const extraction = JSON.parse(fs.readFileSync(`${ua}/tmp/ua-file-extract-results-${batchIndex}.json`, 'utf8'));
const semantics = batchIndex === 83 ? semantics83 : semantics84;
const nodes = [], edges = [], seenEdges = new Set();
const labels = {
 'accessible-icon':'AccessibleIcon 无障碍图标','accordion':'Accordion 折叠面板','alert-dialog':'AlertDialog 确认对话框',
 'arrow':'Arrow 箭头','aspect-ratio':'AspectRatio 比例容器','avatar':'Avatar 头像','checkbox':'Checkbox 复选框',
 'collapsible':'Collapsible 折叠区域','collection':'Collection 条目集合','dismissable-layer':'DismissableLayer 可关闭层',
 'focus-scope':'FocusScope 焦点作用域','form':'Form 表单','hover-card':'HoverCard 悬停卡片','label':'Label 标签',
 'menu':'Menu 菜单','navigation-menu':'NavigationMenu 导航菜单','one-time-password-field':'OneTimePasswordField 验证码',
 'password-toggle-field':'PasswordToggleField 密码切换','popper':'Popper 定位浮层','portal':'Portal 容器挂载',
 'presence':'Presence 生命周期','progress':'Progress 进度条','radio-group':'RadioGroup 单选组',
 'roving-focus-group':'RovingFocusGroup 焦点组','scroll-area':'ScrollArea 滚动区域','separator':'Separator 分隔线',
 'slider':'Slider 滑块','slot':'Slot 插槽','switch':'Switch 开关','tabs':'Tabs 标签页','toast':'Toast 通知',
 'toggle-group':'ToggleGroup 切换组','toggle':'Toggle 切换按钮','toolbar':'Toolbar 工具栏','tooltip':'Tooltip 提示',
 'visually-hidden':'VisuallyHidden 视觉隐藏'
};
// 根据官方行数度量分配结构复杂度，避免从文件名猜测。
function complexity(lines) { return lines > 200 ? 'complex' : lines >= 50 ? 'moderate' : 'simple'; }
// 为确有相同职责的基础故事补充组件专属说明；特殊交互均在语义表中显式定义。
function commonSummary(name, label) {
 if(name === 'Styled') return `组合 ${label} 的基础部件和展示样式，提供可直接操作的组件使用示例。`;
 if(name === 'Controlled') return `用 React 状态控制 ${label}，将状态更新回调与界面显示保持同步。`;
 if(name === 'Chromatic') return `集中排列 ${label} 的不同展示状态与布局，为 Chromatic 视觉回归提供稳定截图场景。`;
 if(name === 'Animated') return `为 ${label} 应用状态相关动画样式，演示交互过程中的视觉过渡。`;
 throw new Error(`缺少显式语义：${label}:${name}`);
}
// 仅添加格式合法且非重复的有向关系。
function edge(source,target,type,weight) {
 assert.notEqual(source,target);
 const key = `${source}|${target}|${type}`;
 if(!seenEdges.has(key)) { edges.push({source,target,type,direction:'forward',weight}); seenEdges.add(key); }
}
assert.equal(extraction.scriptCompleted, true);
assert.deepEqual(extraction.filesUnreadable, []);
assert.deepEqual(extraction.filesSkipped, []);
assert.equal(extraction.results.length, input.batchFiles.length);
for(const result of extraction.results) {
 const file = input.batchFiles.find(f => f.path === result.path);
 assert(file, `未知文件 ${result.path}`);
 const story = path.basename(file.path).replace('.stories.tsx','');
 const semantic = semantics[file.path] || semantics[story];
 assert(semantic, `缺少文件语义 ${file.path}`);
 const isStory = file.path.endsWith('.stories.tsx');
 const label = labels[story];
 const type = file.fileCategory === 'config' ? 'config' : 'file';
 const fileId = `${type}:${file.path}`;
 const tags = isStory ? ['组件演示','交互验证','视觉回归'] : file.fileCategory === 'config' ? ['项目配置','工作区管理','类型检查'] : file.path.includes('/builder/') ? ['构建工具','产物生成','类型声明'] : file.path.includes('ref-stability') ? ['测试工具','引用稳定性','回归验证'] : file.path.endsWith('foods.ts') ? ['测试数据','分组内容','组件演示'] : file.path.endsWith('.d.ts') ? ['类型声明','样式模块','静态检查'] : ['展示配置','全局参数','组件演示'];
 const fileNode = {id:fileId,type,name:path.basename(file.path),filePath:file.path,summary:semantic[0],tags,complexity:complexity(result.nonEmptyLines)};
 if(file.path.endsWith('builder.js')) fileNode.languageNotes = 'JavaScript 使用 @ts-check 与 JSDoc 类型注解；声明清理器以括号深度扫描并跳过字符串和注释。';
 if(file.path.includes('ref-stability')) fileNode.languageNotes = '空依赖 useCallback 保持探针 ref 身份稳定，将循环更新归因于被测组件；同时断言不抛异常和渲染次数上界。';
 if(file.path.endsWith('index.d.ts')) fileNode.languageNotes = '通配模块声明为 CSS 文件导入补充类型，readonly 索引签名约束类名映射。';
 nodes.push(fileNode);
 if(file.fileCategory === 'code') for(const target of input.batchImportData[file.path] || []) edge(fileId,`file:${target}`,'imports',0.7);
 const exported = new Set((result.exports || []).map(e=>e.name));
 const local = new Map();
 for(const fn of result.functions || []) {
  // 构建器八个协作函数由委派要求完整保留，包括较短的行注释跳过器。
  if(fn.endLine-fn.startLine+1 < 10 && !exported.has(fn.name) && !file.path.endsWith('builder.js')) continue;
  const id = `function:${file.path}:${fn.name}`;
  const summary = semantic[1][fn.name] || commonSummary(fn.name,label);
  nodes.push({id,type:'function',name:fn.name,filePath:file.path,lineRange:[fn.startLine,fn.endLine],summary,tags:file.path.includes('/builder/') ? ['构建流程','声明处理','内部函数'] : file.path.includes('ref-stability') ? ['回归断言','引用稳定性','渲染检测'] : ['组件示例','交互逻辑',exported.has(fn.name)?'导出函数':'内部组件'],complexity:complexity(fn.endLine-fn.startLine+1)});
  local.set(fn.name,id);
  edge(fileId,id,'contains',1);
  if(exported.has(fn.name)) edge(fileId,id,'exports',0.8);
 }
 for(const cls of result.classes || []) {
  if(cls.endLine-cls.startLine+1 < 20 && (cls.methods || []).length < 2 && !exported.has(cls.name)) continue;
  const id = `class:${file.path}:${cls.name}`;
  assert(semantic[1][cls.name]);
  nodes.push({id,type:'class',name:cls.name,filePath:file.path,lineRange:[cls.startLine,cls.endLine],summary:semantic[1][cls.name],tags:['错误边界','异常恢复','组件演示'],complexity:complexity(cls.endLine-cls.startLine+1)});
  edge(fileId,id,'contains',1);
  if(exported.has(cls.name)) edge(fileId,id,'exports',0.8);
 }
 for(const call of result.callGraph || []) {
  if(local.has(call.caller) && local.has(call.callee) && call.caller!==call.callee) edge(local.get(call.caller),local.get(call.callee),'calls',0.8);
 }
}
// 配置关联仅指向本批次明确存在的文件，不生成目录或模块占位节点。
if(batchIndex===83) edge('config:apps/storybook/package.json','file:apps/storybook/.storybook/preview.ts','configures',0.6);
if(batchIndex===84) {
 for(const p of ['internal/builder/builder.js','internal/builder/radix-build.js']) edge('config:internal/builder/package.json',`file:${p}`,'configures',0.6);
 edge('config:internal/builder/tsconfig.json','file:internal/builder/builder.js','configures',0.6);
 edge('config:internal/test-data/package.json','file:internal/test-data/foods.ts','configures',0.6);
 edge('config:internal/test-data/tsconfig.json','file:internal/test-data/foods.ts','configures',0.6);
 edge('config:internal/test-utils/package.json','file:internal/test-utils/ref-stability.tsx','configures',0.6);
 edge('file:internal/builder/radix-build.js','function:internal/builder/builder.js:build','calls',0.8);
 for(const file of input.batchFiles.filter(f=>f.path.endsWith('.stories.tsx'))) edge('config:apps/storybook/tsconfig.json',`file:${file.path}`,'configures',0.6);
}
const ids = new Set(nodes.map(n=>n.id));
assert.equal(ids.size,nodes.length);
const knownExternalFiles = new Set(Object.values(input.batchImportData).flat().map(p=>`file:${p}`));
for(const e of edges) {
 assert(ids.has(e.source));
 assert(ids.has(e.target) || knownExternalFiles.has(e.target),`关系目标无证据：${e.target}`);
}
for(const f of input.batchFiles) {
 assert(nodes.some(n=>n.filePath===f.path && ['file','config'].includes(n.type)), `文件未覆盖 ${f.path}`);
 const expected = f.fileCategory==='code' ? (input.batchImportData[f.path] || []).length : 0;
 assert.equal(edges.filter(e=>e.source===`file:${f.path}` && e.type==='imports').length,expected);
}
for(const n of nodes) {
 assert(n.summary && n.tags.length>=3 && n.tags.length<=5);
 if(['function','class'].includes(n.type)) assert(n.lineRange.length===2 && n.lineRange[0]<=n.lineRange[1]);
}
const files = input.batchFiles.map(f=>f.path).sort();
let parts = Math.ceil(Math.max(nodes.length/60,edges.length/120));
let fragments;
// 以定义要求的文件边界分组；当文件间大小不均导致分片超限时增加分片数，保持同一文件的节点完整。
for(;parts<=files.length;parts++) {
 const chunkSize = Math.ceil(files.length/parts);
 fragments=[];
 for(let start=0;start<files.length;start+=chunkSize) {
  const group=new Set(files.slice(start,start+chunkSize));
  const groupNodes=nodes.filter(n=>group.has(n.filePath));
  const groupIds=new Set(groupNodes.map(n=>n.id));
  fragments.push({nodes:groupNodes,edges:edges.filter(e=>groupIds.has(e.source))});
 }
 if(fragments.every(f=>f.nodes.length<=60 && f.edges.length<=120)) break;
}
assert(fragments.every(f=>f.nodes.length<=60 && f.edges.length<=120));
const written=[];
for(let k=0;k<fragments.length;k++) {
 const output=`${ua}/intermediate/batch-${batchIndex}-part-${k+1}.json`;
 assert(!fs.existsSync(output), `目标已存在，避免覆盖 ${output}`);
 fs.writeFileSync(output,JSON.stringify(fragments[k],null,2)+'\n');
 assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),fragments[k]);
 written.push({path:output,nodes:fragments[k].nodes.length,edges:fragments[k].edges.length});
}
console.log(JSON.stringify({batchIndex,files:input.batchFiles.length,nodes:nodes.length,functions:nodes.filter(n=>n.type==='function').length,classes:nodes.filter(n=>n.type==='class').length,edges:edges.length,imports:edges.filter(e=>e.type==='imports').length,parts:written,warnings:[],validation:'文件覆盖、结构符号、imports逐项数量、关系引用、分片上限和JSON均通过'},null,2));
