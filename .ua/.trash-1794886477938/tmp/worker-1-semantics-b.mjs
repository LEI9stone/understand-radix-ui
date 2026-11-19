// @ts-check
import {file,edges,save} from './worker-1-serialize.mjs';
// 各包摘要根据结构和发布记录分别判读；公共字段仅统一序列化格式。
const packages=[
[29,'checkbox','复选框','记录三态复选框与表单冒泡输入的更新，包含受控更新事件、RSC 兼容及回调类型修复。','声明复选框包的双模块发布入口、React 兼容范围和构建脚本，依赖 Presence、上下文、尺寸测量与可控状态等内部包。'],
[32,'compose-refs','引用组合','记录引用组合工具的 RSC 兼容回滚、CI 来源证明重新发布及仓库元数据更新。','声明 ref 组合工具的源码与 ESM/CommonJS 发布入口，配置 React peer 依赖及内部构建工具，无运行时工作区依赖。'],
[36,'direction','方向提供器','记录方向上下文工具的可选属性类型兼容、RSC 回滚和客户端入口声明等更新。','声明方向提供器工具的双模块入口与 React peer 版本范围，为组件提供独立发布的方向上下文依赖。'],
[47,'navigation-menu','导航菜单','记录导航菜单激活模式、子菜单切换控制、Viewport 子元素保留以及焦点、ARIA 和引用稳定性修复。','配置导航菜单的发布入口与构建流程，并声明集合、方向、可关闭层、Slot、Presence 和状态 Hook 等内部依赖。'],
[50,'popover','弹出层','记录 Popover 标题与描述部件、新增可访问性关联、嵌套模态层兼容以及关闭时 aria-controls 修复。','声明弹出层包的模块与类型入口，组合 Popper、Portal、焦点域、可关闭层与滚动锁实现弹层行为。'],
[51,'popper','浮层定位','记录浮层锚点回调引用、虚拟锚点、子菜单定位、遮挡隐藏和动画样式兼容等修复。','声明基于 Floating UI 的定位包，依赖 Arrow、矩形与尺寸观察、Primitive、上下文和引用组合工具。'],
[56,'radio-group','单选组','记录单选组表单重置与冒泡事件修复、底层 Provider/Trigger/BubbleInput 组合接口以及 RovingFocus 依赖更新。','声明单选组的模块与类型发布入口，依赖 RovingFocus、方向、状态、尺寸和 Presence 支撑键盘导航与表单集成。'],
[68,'toggle','切换按钮','记录切换按钮可选属性类型、回调类型、树摇优化与受控状态依赖更新。','声明切换按钮发布与编译配置，仅依赖事件组合 primitive、DOM Primitive 与可控状态 Hook 实现按压切换。'],
[71,'use-callback-ref','回调引用','记录 useCallbackRef 的回调更新时序修复、RSC 兼容回滚与 CI 来源证明发布。','声明稳定回调引用 Hook 的独立发布配置，运行时依赖服务端安全的 use-layout-effect。'],
[73,'use-effect-event','效果事件','记录潜在缺失 React API 的条件导入兼容修复，以及 RSC 回滚与布局 effect 依赖更新。','声明 useEffectEvent 兼容工具的源码及双模块发布产物，依赖布局 effect Hook 并允许 React 16 至 19 消费。']
];
for(const [i,p,label,changelog,manifest] of packages){
const base=`packages/react/${p}`;
file(`${base}/CHANGELOG.md`,changelog,['变更记录',label,'版本发布']);
file(`${base}/package.json`,manifest,['包配置',label,'模块发布']);
file(`${base}/tsconfig.json`,`为${label}包继承内部 React 库 TypeScript 编译规则，将 src 纳入编译并将产物定位到 dist。`,['编译配置','React库','TypeScript']);
file(`${base}/README.md`,p==='use-effect-event'?'标明该工具仅供内部使用；文档标题仍为 react-use-is-hydrated，与所在 use-effect-event 包名称不一致。':['compose-refs','use-callback-ref'].includes(p)?`声明${label}是内部工具，不面向公共使用。`:`提供${label}包名称与官方网站组件使用文档入口。`,['包文档',label,'使用范围']);
edges(i,[[`document:${base}/README.md`,`config:${base}/package.json`,'documents'],[`document:${base}/CHANGELOG.md`,`config:${base}/package.json`,'documents'],[`config:${base}/tsconfig.json`,`config:${base}/package.json`,'related']]);
}
save([29,32,36,47,50,51,56,68,71,73]);
