// @ts-check
import fs from 'node:fs';
const input=JSON.parse(fs.readFileSync('.ua/tmp/architecture-input.json','utf8'));
const structural=JSON.parse(fs.readFileSync('.ua/tmp/ua-arch-results.json','utf8'));
// 以下边界由文件摘要及完整文件级依赖证据人工确定；代码只执行已确定归属并验证覆盖。
const definitions=[
 ['dom-foundation','DOM 与组合基础','提供核心 DOM/事件/几何工具、环境常量、Primitive、Slot、ref 合并及视觉隐藏语义，构成上层复合组件共享的最小组合基础。'],
 ['shared-state-hooks','共享状态与 Hook','集中管理作用域 Context、DOM 顺序集合、阅读方向、稳定 ID、受控状态、回调和水合兼容及尺寸订阅，供各组件复用状态与生命周期逻辑。'],
 ['overlay-focus','浮层定位与焦点交互','整合背景可访问性屏蔽、Popper 与箭头、Portal、Presence、焦点域和守卫、外部交互关闭与游走焦点，为模态和浮层组件提供交互机制。'],
 ['accessible-components','可访问复合组件','组合基础原语实现对话框、菜单、选择器、表单、折叠内容、滑块、通知等面向使用者的无样式组件，并提供各独立包的部件与类型入口。'],
 ['public-entrypoints','统一导出与消费入口','维护 radix-ui 聚合包的命名空间总入口、组件子路径、内部原语入口及实验性子路径，把独立组件包组织为统一消费界面。'],
 ['test-verification','测试与兼容性验证','汇集组件单元测试、快照、Playwright 场景、性能基准、RSC 导入验证以及共享测试数据和模拟环境，验证可访问性、引用稳定性与浏览器交互契约。'],
 ['examples-ssr','组件示例与服务端演示','通过 Storybook 故事及配套样式展示组件状态和组合方式，并用 Next.js 验证应用演示 SSR、水合、Portal 与 RSC 边界行为。'],
 ['engineering-ci','构建工具与持续交付','实现内部包构建器、Changesets 日志扩展及补丁、引用稳定性静态检查、共享环境声明和 GitHub Actions，支撑构建、回归检查与包发布。'],
 ['configuration','工作区与编译配置','集中定义各包和验证应用的发布清单、TypeScript 继承、pnpm 工作区、代码风格、测试运行器、Storybook 与 CI 复合动作等工程配置。'],
 ['documentation','设计原则与维护文档','保存项目设计哲学、贡献与发布流程、组件使用文档入口、包版本历史、Changeset 说明和社区协作模板。']
];
const layers=definitions.map(([id,name,description])=>({id:`layer:${id}`,name,description,nodeIds:[]}));
const byLayer=new Map(layers.map(l=>[l.id,l]));
const foundation=new Set(['primitive','slot','compose-refs','visually-hidden','accessible-icon']);
const shared=new Set(['context','collection','direction','id','use-callback-ref','use-controllable-state','use-effect-event','use-escape-keydown','use-is-hydrated','use-layout-effect','use-previous','use-rect','use-size']);
const interaction=new Set(['arrow','dismissable-layer','focus-guards','focus-scope','popper','portal','presence','roving-focus']);
const components=new Set(['accordion','alert-dialog','aspect-ratio','avatar','checkbox','collapsible','context-menu','dialog','dropdown-menu','form','hover-card','label','menu','menubar','navigation-menu','one-time-password-field','password-toggle-field','popover','progress','radio-group','scroll-area','select','separator','slider','switch','tabs','toast','toggle','toggle-group','toolbar','tooltip','announce']);
/** 按已核实职责分配文件，显式失败处理防止未识别文件被默默归入兜底层。 */
function assign(node){
 const p=node.filePath;
 if(node.type==='document')return 'documentation';
 if(node.type==='config'||['playwright.config.ts','vitest.config.mts'].includes(p)||/\/next\.config\.js$/.test(p)||/\/\.storybook\/(main|manager|preview)\.ts$/.test(p))return 'configuration';
 if(node.type==='pipeline')return 'engineering-ci';
 if(p.startsWith('e2e/')||/\.(test|spec)\./.test(p)||p.includes('/__snapshots__/')||p.includes('/bench/')||p.startsWith('internal/test-data/')||p.startsWith('internal/test-utils/')||['scripts/setup-tests.ts','scripts/rsc-client-boundary-stub.mts'].includes(p))return 'test-verification';
 if(p.startsWith('apps/'))return 'examples-ssr';
 if(p.startsWith('internal/')||p.startsWith('types/')||p.startsWith('.github/')||p.startsWith('.changeset/')||p.startsWith('patches/')||['.nvmrc','scripts/check-composed-refs.mjs'].includes(p))return 'engineering-ci';
 if(p==='packages/core/primitive/src/aria-hidden.ts')return 'overlay-focus';
 if(p.startsWith('packages/core/'))return 'dom-foundation';
 const match=p.match(/^packages\/react\/([^/]+)\//);
 if(match){const pkg=match[1];if(pkg==='radix-ui')return 'public-entrypoints';if(foundation.has(pkg))return 'dom-foundation';if(shared.has(pkg))return 'shared-state-hooks';if(interaction.has(pkg))return 'overlay-focus';if(components.has(pkg))return 'accessible-components';}
 throw new Error(`没有语义归属的文件 ${node.id}`);
}
// 仅使用输入中的文件级ID，不添加函数/类或任何虚构节点。
for(const node of input.fileNodes){if(['function','class'].includes(node.type))throw new Error(`非文件节点 ${node.id}`);byLayer.get(`layer:${assign(node)}`).nodeIds.push(node.id);}
for(const layer of layers)layer.nodeIds.sort();
const ids=layers.flatMap(l=>l.nodeIds);const expected=new Set(input.fileNodes.map(n=>n.id));const seen=new Set();const errors=[];
for(const id of ids){if(!expected.has(id))errors.push(`不存在 ${id}`);if(seen.has(id))errors.push(`重复归属 ${id}`);seen.add(id);}
for(const id of expected)if(!seen.has(id))errors.push(`未归属 ${id}`);
if(ids.length!==694||ids.length!==structural.fileStats.totalFileNodes)errors.push(`数量不匹配 ${ids.length}`);
if(layers.length<3||layers.length>10||layers.some(l=>!l.nodeIds.length))errors.push('层数或空层错误');
if(errors.length)throw new Error(errors.join('\n'));
// 统计实际跨层依赖，作为层次方向的可审计证据。
const ownership=new Map(layers.flatMap(l=>l.nodeIds.map(id=>[id,l.id])));const matrix={};
for(const e of input.allEdges){if(!['imports','depends_on'].includes(e.type))continue;const a=ownership.get(e.source),b=ownership.get(e.target);if(a===b)continue;const key=`${a} -> ${b}`;matrix[key]=(matrix[key]??0)+1;}
fs.writeFileSync('.ua/intermediate/layers.json',JSON.stringify(layers,null,2)+'\n');
const validation={totalInputNodes:expected.size,totalAssigned:ids.length,uniqueAssigned:seen.size,layers:layers.map(({id,name,nodeIds})=>({id,name,count:nodeIds.length})),crossLayerDependencies:matrix,errors,warnings:['确定性 imports 主要覆盖包内相对导入；分层同时参考441条 depends_on 与文件摘要，以保留 workspace 别名依赖结构。','分层展示职责关系，不代表严格无环约束；组件允许基于其他公开组件组合。']};
fs.writeFileSync('.ua/tmp/architecture-validation.json',JSON.stringify(validation,null,2)+'\n');
console.log(JSON.stringify(validation,null,2));
