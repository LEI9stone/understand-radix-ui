// @ts-check
import {file,symbols,supplement,edges,save} from './worker-1-serialize.mjs';
// 本批实现节点与函数说明均由源码及测试断言确定。
const base='packages/react/';
const implementations={
 'toggle-group':'组合单选或多选 Toggle 状态与可选焦点漫游，单选使用 radiogroup/radio 语义，多选使用 toolbar 按压语义。',
 'toggle':'以可控状态 Hook 管理 pressed，组合消费者点击事件并在 Primitive.button 上暴露 aria-pressed 和 on/off 状态。',
 'toolbar':'把按钮、链接、分隔线和切换组组合进共享焦点漫游工具栏，统一方向并避免内嵌 ToggleGroup 重复管理焦点。',
 'tooltip':'管理延迟打开、跳过延迟、焦点和指针交互，通过 Popper/Portal 定位并计算指针宽容多边形保持可悬停内容。'};
for(const [pkg,summary] of Object.entries(implementations)){file(`${base}${pkg}/src/${pkg}.tsx`,summary,['组合组件','可访问性',pkg]);file(`${base}${pkg}/src/index.ts`,`重新导出${pkg}的组合部件、短别名和属性类型，作为包的公共导入入口。`,['公共入口','部件导出',pkg]);}
file(`${base}toggle-group/src/toggle-group.test.tsx`,'验证单选与多选切换组的值变化、取消选择、ARIA 角色、无障碍扫描和 asChild 属性传递。',['单元测试','切换组','属性传递']);
file(`${base}toggle/src/toggle.test.tsx`,'验证 Toggle 的默认、受控和禁用状态下点击行为、按压属性、无障碍及 asChild 属性转发。',['单元测试','按压状态','可访问性']);
file(`${base}toolbar/src/toolbar.test.tsx`,'验证工具栏单次点击、链接自身与传送后代的空格键边界，以及各部件的属性和 asChild 转发。',['单元测试','键盘交互','组合部件']);
symbols(`${base}toolbar/src/toolbar.test.tsx`,{component:'构造带一个按钮和可配置点击处理的最小工具栏，供事件次数回归测试使用。'});
file(`${base}tooltip/src/tooltip.test.tsx`,'验证悬停内容、aria-describedby 合并去重、自定义 id、单次子内容渲染和多提示间的延迟与重渲染边界。',['单元测试','提示语义','延迟行为']);
const defs={
 'toggle-group':[
['ToggleGroup',42,55,'按 type 区分单选和多选实现，赋予 radiogroup 或 toolbar 角色并拒绝缺失类型。'],
['ToggleGroupImplSingle',90,115,'用可控状态保存单个选中值，将其转换成共享数组接口，并在取消时清空。'],
['ToggleGroupImplMultiple',138,174,'用可控数组状态实现多项激活和移除，向各项目提供统一状态操作。'],
['ToggleGroupImpl',208,238,'共享禁用与方向配置，按 rovingFocus 选项组合焦点漫游根和 Primitive.div。'],
['ToggleGroupItem',255,276,'从组值推导按压与禁用状态，按配置注册为可聚焦且可标记 active 的焦点漫游项。'],
['ToggleGroupItemImpl',295,314,'将单选组项转换成 radio 语义，并将 Toggle 按压变化转发为组值激活或取消。']],
 'toggle':[['Toggle',32,57,'创建可控或非受控按压按钮，将点击事件组合后切换 pressed，并暴露 ARIA 和 data-state。']],
 'toolbar':[
['Toolbar',46,69,'建立方向上下文，以焦点漫游根包裹 toolbar 宿主并设置方向语义。'],
['ToolbarSeparator',87,97,'读取工具栏方向，令分隔线采用垂直于工具栏轴的方向。'],
['ToolbarButton',109,117,'把 Primitive.button 注册为可根据 disabled 状态导航的焦点漫游项。'],
['ToolbarLink',129,153,'将链接纳入焦点漫游，仅在链接本身接收空格键时触发点击，隔离后代冒泡。'],
['ToolbarToggleGroup',172,189,'继承工具栏方向并禁用内层 ToggleGroup 自身焦点漫游，避免重复导航。'],
['ToolbarToggleItem',205,215,'将 ToggleGroup 项通过 ToolbarButton 的 asChild 组合进统一工具栏焦点序列。']],
 'tooltip':[
['TooltipTrigger',273,330,'组合锚点与触发按钮，区分触摸、悬停、焦点和点击，并合并 aria-describedby 引用。'],
['TooltipContent',388,402,'根据挂载与开关状态保留内容，选择普通或具有指针宽容区的内容实现。'],
['TooltipContentHoverable',414,483,'监听触发器和内容的离开位置，创建凸包宽容区并在指针越界后关闭提示。'],
['TooltipContentImpl',514,606,'组合可关闭层和定位内容，注册模态焦点分支，响应滚动与其他提示打开并提供无重复的可访问描述。'],
['TooltipArrow',618,622,'将 Tooltip 的定位作用域传给 Popper 箭头并转发属性与引用。']]
};
for(const [pkg,list] of Object.entries(defs)){const p=`${base}${pkg}/src/${pkg}.tsx`;supplement(p,list.map(([name,startLine,endLine])=>({name,startLine,endLine})));symbols(p,Object.fromEntries(list.map(([name,,,desc])=>[name,desc])));}
// 为解析器已识别的 Tooltip 行为与几何函数补充具体职责。
symbols(`${base}tooltip/src/tooltip.tsx`,{
...Object.fromEntries(defs.tooltip.map(([name,,,desc])=>[name,desc])),
TooltipProvider:'共享延迟策略与指针传送标记，在提示间移动时用计时器决定是否跳过打开延迟。',
Tooltip:'维护开关、触发器和内容 id，协调受控状态及延迟打开，通知其他提示关闭。',
TooltipPortal:'通过 Presence 按开关或强制挂载状态把提示内容传送到目标容器。',
getExitSideFromRect:'比较离开点到矩形四边的距离，推导指针离开方向。',
getPaddedExitPoints:'按离开方向生成带宽容间距的两个起点，扩展指针移动走廊。',
isPointInPolygon:'利用射线交点奇偶性判断指针是否仍处于宽容多边形内。',
getHull:'先按坐标排序点集，再构建用于指针宽容区域的凸包。',
getHullPresorted:'对已排序点集建立上下凸包，合并外缘顶点以支持稳定悬停走廊。',
concatAriaDescribedby:'规范化并去重多个 ARIA 描述 id 列表，返回可用于 aria-describedby 的空格分隔引用。'});
const hooks={
'use-callback-ref/src/use-callback-ref.tsx':['通过稳定函数身份调用最新回调，在插入 effect 或布局 effect 更新 ref，避免依赖变化引发额外执行。',{useCallbackRef:'用 ref 保存当前回调并返回稳定包装函数，在提交阶段及时更新回调实现。'}],
'use-controllable-state/src/use-controllable-state.tsx':['统一受控与非受控值更新、函数式 setter 和变化通知，在开发环境检测控制模式切换。',{useControllableState:'根据 prop 是否为 undefined 选择受控值或内部状态，向适当的 setter 或回调分发更新。',useUncontrolledState:'保存默认初值并用 effect 比较前后值，更新最新通知引用后只在真实变化时触发 onChange。'}],
'use-controllable-state/src/use-controllable-state-reducer.tsx':['将受控状态与任意 reducer 附加状态组合，稳定变化通知并用内部同步 action 对齐外部 prop。',{useControllableStateReducer:'包装用户 reducer，在受控模式同步外部值并通知状态变更，在非受控模式于 effect 中通知。'}],
'use-effect-event/src/use-effect-event.tsx':['优先使用 React 原生 useEffectEvent，否则以提交阶段更新的 ref 和稳定函数实现兼容，阻止渲染期间调用。',{useEffectEvent:'返回稳定的效果事件回调，使用原生 API 或插入／布局 effect 兼容实现读取最新闭包。'}],
'use-escape-keydown/src/use-escape-keydown.tsx':['在目标文档捕获 Escape 键并忽略输入法组合事件，回调由稳定引用 Hook 保持最新；该 Hook 已标注弃用。',{useEscapeKeydown:'注册并清理文档捕获键盘监听，在非 IME 组合期间将 Escape 传给稳定回调。'}],
'use-is-hydrated/src/use-is-hydrated-legacy.ts':['用 effect 和模块共享标记检测旧 React 环境的客户端水合完成状态。',{useIsHydrated:'从共享水合标记初始化状态，首次客户端 effect 将标记和组件状态置为已水合。'}],
'use-is-hydrated/src/use-is-hydrated.tsx':['按 React 是否提供 useSyncExternalStore 选择现代水合检测或旧版 effect 实现，服务端快照为 false、客户端为 true。',{useIsHydratedModern:'借助服务端与客户端外部存储快照差异报告组件树水合状态。'}]
};
for(const [suffix,[summary,records]] of Object.entries(hooks)){file(base+suffix,summary,['共享Hook','状态兼容','React']);symbols(base+suffix,records);}
// 现代水合函数由条件导出的公共 Hook 引用，虽短仍属正式运行实现。
supplement(`${base}use-is-hydrated/src/use-is-hydrated.tsx`,[{name:'useIsHydratedModern',startLine:15,endLine:21,exported:true}]);
for(const [pkg,summary] of Object.entries({'use-callback-ref':'导出稳定回调引用 Hook。','use-controllable-state':'导出可控状态 Hook 与 reducer 版本，为交互组件提供统一状态入口。','use-effect-event':'导出效果事件兼容 Hook。','use-escape-keydown':'导出 Escape 捕获监听 Hook。','use-is-hydrated':'导出运行时选择的水合检测 Hook。','use-layout-effect':'导出服务端安全的布局 effect 入口。'}))file(`${base}${pkg}/src/index.ts`,summary,['公共入口','共享Hook','重新导出']);
file(`${base}use-controllable-state/src/use-controllable-state.test.tsx`,'验证受控初值、内外部更新、非受控默认值及控制模式切换警告，用简化 Checkbox 构建回归场景。',['单元测试','可控状态','警告']);
symbols(`${base}use-controllable-state/src/use-controllable-state.test.tsx`,{ControlledComponent:'在父级持有 checked 并提供清空按钮，验证受控值响应内外更新。',UnstableComponent:'允许 checked 在布尔值和 undefined 间切换，验证受控模式变化警告。',Checkbox:'将可控状态 Hook 接到带 checkbox 角色的按钮，为测试提供最小交互模型。'});
const dep=[];
// 已读源码且路径经 glob 确认的工作区运行依赖，以 depends_on 补充而不重新解析 imports。
const dependencies={
 'toggle-group/src/toggle-group.tsx':['context/src/create-context.tsx','primitive/src/primitive.tsx','roving-focus/src/roving-focus-group.tsx','toggle/src/toggle.tsx','use-controllable-state/src/use-controllable-state.tsx','direction/src/direction.tsx'],
 'toggle/src/toggle.tsx':['primitive/src/primitive.tsx','use-controllable-state/src/use-controllable-state.tsx'],
 'toolbar/src/toolbar.tsx':['context/src/create-context.tsx','roving-focus/src/roving-focus-group.tsx','primitive/src/primitive.tsx','separator/src/separator.tsx','toggle-group/src/toggle-group.tsx','direction/src/direction.tsx'],
 'tooltip/src/tooltip.tsx':['compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','dismissable-layer/src/dismissable-layer.tsx','focus-scope/src/focus-scope.tsx','popper/src/popper.tsx','portal/src/portal.tsx','presence/src/presence.tsx','primitive/src/primitive.tsx','slot/src/slot.tsx','use-controllable-state/src/use-controllable-state.tsx','use-layout-effect/src/use-layout-effect.tsx','visually-hidden/src/visually-hidden.tsx'],
 'use-callback-ref/src/use-callback-ref.tsx':['use-layout-effect/src/use-layout-effect.tsx'],
 'use-effect-event/src/use-effect-event.tsx':['use-layout-effect/src/use-layout-effect.tsx'],
 'use-escape-keydown/src/use-escape-keydown.tsx':['use-callback-ref/src/use-callback-ref.tsx'],
 'use-controllable-state/src/use-controllable-state-reducer.tsx':['use-effect-event/src/use-effect-event.tsx'],
 'use-controllable-state/src/use-controllable-state.tsx':['use-layout-effect/src/use-layout-effect.tsx']
};
for(const [src,targets] of Object.entries(dependencies))for(const t of targets)dep.push([`file:${base}${src}`,`file:${base}${t}`]);
for(const pkg of ['toggle-group','toggle','toolbar','tooltip'])dep.push([`file:${base}${pkg}/src/${pkg}.tsx`,`file:${base}${pkg}/src/${pkg}.test.tsx`,'tested_by']);
dep.push([`function:${base}use-controllable-state/src/use-controllable-state-reducer.tsx:useControllableStateReducer`,`function:${base}use-effect-event/src/use-effect-event.tsx:useEffectEvent`,'calls']);
edges(92,dep);
save([92]);
