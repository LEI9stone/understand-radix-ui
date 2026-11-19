// @ts-check
const {file,symbols,edge,save}=require('./serialize-worker-5.cjs');
// 下列语义来自逐文件结构证据与对关键实现、变更记录的人工阅读。
const presence='packages/react/presence/src/';
file(presence+'presence.test.tsx','验证 Presence 在子节点重渲染和引用变化时保持挂载及引用行为稳定，覆盖会引发循环更新的回归场景。',['测试','挂载管理','引用稳定性']);
file(presence+'presence.tsx','通过挂载状态机与 CSS 动画事件延迟卸载子节点，并稳定合并引用，兼容 React 18/19 的引用读取和清理方式。',['挂载管理','退出动画','引用合并']);
symbols(presence+'presence.tsx',{Presence:'根据 present 与退出动画状态克隆或卸载唯一子节点，支持渲染函数强制保留节点。',usePresence:'比较动画名称并监听动画开始、结束和取消事件，在退出动画结束前暂停卸载，同时缓存样式读取以避免重复重排。',useStableComposedRefs:'用固定身份的回调分发最新引用并执行引用清理，避免 React 19 反复分离引用导致循环更新。',getElementRef:'检查 React 开发模式的警告 getter，在 props.ref 和 element.ref 之间选择兼容的读取方式。'});
file(presence+'use-state-machine.tsx','用泛型状态图和 React reducer 实现 Presence 所需的事件驱动有限状态机。',['状态机','泛型','状态管理']);
symbols(presence+'use-state-machine.tsx',{useStateMachine:'依据当前状态和事件查询下一状态，返回状态值与 reducer 派发函数，并保持非法转换时的现状。'});
edge(7,'function:'+presence+'presence.tsx:usePresence','function:'+presence+'use-state-machine.tsx:useStateMachine','calls',0.8);
edge(7,'file:'+presence+'presence.tsx','file:'+presence+'presence.test.tsx','tested_by',0.5);
const radio='packages/react/radio-group/src/';
file(radio+'radio-group.test.tsx','覆盖传统与可组合单选组 API 的受控/非受控选择、键盘导航、表单重置和点击冒泡，包含异步状态与并发更新回归用例。',['测试','单选组','表单事件']);
symbols(radio+'radio-group.test.tsx',{ClassicRadioGroup:'以传统 Item 组件生成固定选项的单选组，为行为断言提供统一测试夹具。',ComposableRadioGroup:'通过 ItemProvider、ItemTrigger 和 ItemBubbleInput 组装单选项，验证分拆 API 与传统 API 的一致性。'});
file(radio+'radio-group.tsx','将单选状态、作用域上下文和游走焦点组合为可访问的单选组，提供传统 Item 与拆分部件，并处理表单重置与方向键选中。',['单选组','键盘导航','受控状态']);
symbols(radio+'radio-group.tsx',{RadioGroupItemProvider:'读取组级状态并按条目值计算 checked，将表单属性与禁用状态传给底层 RadioProvider。'});
file(radio+'radio.tsx','实现单选按钮的上下文、触发器、指示器和隐藏原生输入框，区分用户点击与程序更新以正确传递表单 change 和 click 事件。',['单选按钮','表单事件','部件组合']);
symbols(radio+'radio.tsx',{RadioProvider:'管理单选按钮节点、隐藏输入节点与最近用户点击，把 checked、表单关联和检查动作提供给各部件。'});
edge(8,'file:'+radio+'radio-group.tsx','file:'+radio+'radio-group.test.tsx','tested_by',0.5);
edge(8,'file:'+radio+'radio-group.tsx','file:'+radio+'radio.tsx');
// 每个包的用途与变更记录单独确定，重复的清单形状只用于序列化其真实职责。
const packages=[
[21,'packages/core/rect','矩形观测内部工具','记录 @radix-ui/rect 1.1.2 与 1.1.3 的发布历史。',true],
[23,'packages/react/accordion','可访问折叠面板','记录 Accordion 的回调类型修复、可选属性类型兼容及集合实现迁移。',false],
[33,'packages/react/context-menu','上下文菜单','记录 ContextMenu 的类型修复以及 Content 方位与偏移属性开放覆盖。',false],
[37,'packages/react/dismissable-layer','外部交互关闭层内部工具','记录 DismissableLayer 的回调类型、可选属性类型和服务端组件兼容性修复。',true],
[44,'packages/react/label','表单标签','记录 Label 从 2.1.4 至 2.1.17 的版本发布与关联依赖更新。',false],
[53,'packages/react/presence','动画挂载内部工具','记录 Presence 的内部重构、样式重排优化、服务端组件兼容与引用相关依赖更新。',true],
[55,'packages/react/progress','进度指示组件','记录 Progress 的回调类型修复、可选属性类型兼容及底层依赖更新。',false],
[59,'packages/react/scroll-area','自定义滚动区域','记录 ScrollArea 新增 Content 部件、可选属性类型兼容与 SWC tree-shaking 修复。',false],
[60,'packages/react/select','可访问选择框','记录 Select 的表单冒泡修复、禁用选项对齐、回调类型与 SWC tree-shaking 修复。',false],
[61,'packages/react/separator','语义分隔线','记录 Separator 从 1.1.4 至 1.2.0 的组件发布历史。',false],
[67,'packages/react/toggle-group','单选及多选切换组','记录 ToggleGroup 的回调类型修复、可选属性类型兼容及游走焦点依赖更新。',false],
[74,'packages/react/use-escape-keydown','Escape 按键监听内部 Hook','记录 useEscapeKeydown 从 1.1.2 至 1.1.6 的发布与维护历史。',true],
[75,'packages/react/use-is-hydrated','客户端水合状态内部 Hook','记录 useIsHydrated 从 0.1.0 至 0.1.3 的初始发布和修订历史。',true],
[77,'packages/react/use-previous','前次值保存内部 Hook','记录 usePrevious 的 1.1.2、1.1.3 与 1.1.4 版本历史。',true],
[78,'packages/react/use-rect','元素矩形订阅内部 Hook','记录 useRect 的 1.1.2、1.1.3 与 1.1.4 版本历史。',true],
];
for(const [batch,p,purpose,changelog,internal] of packages){
 file(p+'/CHANGELOG.md',changelog,['变更记录','版本发布',purpose]);
 file(p+'/README.md',internal?`说明 ${purpose} 属于内部工具，不面向公共使用。`:`提供 ${purpose} 包的文档入口，引导使用者查看官方组件文档。`,['文档','包入口',internal?'内部工具':'组件文档']);
 file(p+'/package.json',`声明 ${purpose} 包的源码入口、发布产物、构建脚本与依赖约束，控制该包在工作区和发布后的消费方式。`,['包配置','构建发布',purpose]);
 file(p+'/tsconfig.json',`为 ${purpose} 包配置 TypeScript 编译范围和共享编译选项，将源码检查与包构建配置衔接。`,['编译配置','类型检查',purpose]);
 edge(batch,'document:'+p+'/README.md','config:'+p+'/package.json','documents',0.5);
 edge(batch,'document:'+p+'/CHANGELOG.md','config:'+p+'/package.json','documents',0.5);
 edge(batch,'config:'+p+'/package.json','config:'+p+'/tsconfig.json','configures',0.6);
}
save([7,8,...packages.map(p=>p[0])]);
