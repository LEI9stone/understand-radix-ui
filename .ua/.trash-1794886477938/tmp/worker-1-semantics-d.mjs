// @ts-check
import {file,symbols,supplement,edges,save} from './worker-1-serialize.mjs';
const root='packages/react/';
// 文件级职责分别依据源码组合及测试范围确认。
const descriptions={
'roving-focus/src/roving-focus-group.tsx':'维护组内唯一 Tab 停靠点，按方向、循环、激活项与水合阶段注册可聚焦集合，提供方向键和出入组焦点行为。',
'select/src/select.tsx':'将可控值、选项集合、键盘搜索、模态焦点与定位组合成 Select，并以隐藏原生 select 同步表单和用户选择事件。',
'slider/src/slider.tsx':'实现单值或多值滑块，处理方向与指针坐标、步进精度、Thumb 排序或保序、最小间距、表单重置和冒泡输入。',
'slot/src/slot.tsx':'实现 asChild 属性与 ref 组合，支持 Slottable、懒加载与 Flight 引用，并合并事件、样式、类名和 ARIA 描述。',
'separator/src/separator.tsx':'在 Primitive.div 上提供水平或垂直分隔线语义，可切换为装饰性元素并回退非法方向。',
'switch/src/switch.tsx':'将受控开关状态拆为 Provider、Trigger、Thumb 和隐藏 checkbox，同步表单重置并区分用户点击与程序更新传播。',
 'tabs/src/tabs.tsx':'组合可控选中值、方向和焦点漫游，支持自动或手动激活选项卡，以稳定 id 关联 trigger 与 panel。',
 'toast/src/toast.tsx':'管理通知队列视口、计时暂停恢复、滑动关闭、快捷键焦点和屏幕阅读器播报，通过 Portal 与可关闭层组合通知。',
 'select/src/select.test.tsx':'覆盖 Select 清空值、禁用项、键盘后代边界、表单重置、各部件属性转发、滚动按钮和原生 change 冒泡的回归测试。',
 'slider/src/slider.test.tsx':'验证偏离步进网格、滑块交叉和保序、表单重置、引用稳定性及部件属性传递和隐藏输入事件。',
 'separator/src/separator.test.tsx':'验证 Separator 的属性、样式、事件和 ref 传递，以及 asChild 与纵向装饰模式的语义。',
 'slot/src/slot.test.tsx':'验证 Slot 事件与属性合并、Slottable 嵌套、懒加载和 Flight 引用、多版本标识互操作及 ref 稳定性。',
 'slot/src/__snapshots__/slot.test.tsx.snap':'保存 Slot 将按钮组合为链接或普通按钮时的 DOM 快照，覆盖左右图标、嵌套 Slottable 和懒加载子元素。',
 'switch/src/switch.test.tsx':'覆盖开关在普通、受控与外部关联表单中的重置、点击祖先传播以及各组合部件属性转发。',
 'tabs/src/tabs.test.tsx':'验证切换标签时的 blur 与焦点、可编辑或传送后代的键盘边界、各部件属性转发和回调窄参数类型。',
 'toast/src/toast.test.tsx':'验证 Toast ref 稳定性、Escape 仅移除目标通知、时长变化后暂停恢复、计时器清理与 Suspense 水合兼容。'};
for(const [p,s] of Object.entries(descriptions))file(root+p,s,p.includes('.test.')||p.endsWith('.snap')?['单元测试','回归验证',p.split('/')[0]]:['组合组件','可访问性',p.split('/')[0]]);
for(const p of ['scroll-area','select','separator','slider','slot','switch','tabs','toast','toggle-group'])file(`${root}${p}/src/index.ts`,`重新导出 ${p} 的公开组合部件、简短别名和属性类型，定义消费者的包级入口。`,['公共入口','模块边界',p]);
const components={
'roving-focus/src/roving-focus-group.tsx':[
['RovingFocusGroup',86,94,'以集合 Provider 和 Slot 包裹内部根，使焦点项能够按 DOM 顺序注册。'],
['RovingFocusGroupImpl',115,209,'管理当前 Tab 停靠点和可聚焦项数量，进入组时优先聚焦 active 或上次项目，并处理 Shift+Tab 离组。'],
['RovingFocusGroupItem',235,346,'注册可聚焦项，在水合前后采用不同 effect 时序，按导航意图移动焦点并暴露当前停靠状态。']],
 'select/src/select.tsx':[
['SelectTrigger',340,438,'创建 combobox 按钮，处理鼠标、触摸和键盘打开，关闭时支持输入搜索选择并同步有效 ARIA 控件引用。'],
['SelectValue',454,482,'记录值显示容器与自定义子内容，在空值时显示占位并阻止传送选中文本的事件回流。'],
['SelectIcon',493,500,'渲染对辅助技术隐藏的选择器图标，缺省为向下三角。'],
['SelectContent',553,580,'用 Presence 保留退出动画；关闭后将选项挂载到分离片段，持续收集文本与原生 option 数据。'],
['SelectContentFragment',595,606,'把未显示选项传送到 DocumentFragment，使集合和原生选项仍更新而不显示列表。'],
['SelectContentImpl',679,975,'组合滚动锁、焦点域和可关闭层，隐藏外部内容、定位并聚焦选中项，处理按键导航和外部释放指针。'],
['SelectItemAlignedPosition',988,1200,'测量触发器、值文本和选中项，将浮层与文本对齐并按可用窗口高度、滚动按钮及方向约束尺寸。'],
['SelectPopperPosition',1214,1244,'将 Select 内容交给 Popper 定位和碰撞检测，并把定位 CSS 变量映射为 Select 命名空间。'],
['SelectViewport',1271,1337,'建立可滚动选项容器，隐藏原生滚动条，并在 item-aligned 模式滚动时向可用窗口高度扩展内容。'],
['SelectGroup',1355,1363,'创建带共享标签 id 的 option 分组，以 aria-labelledby 关联组标签。'],
['SelectLabel',1376,1380,'读取组标签 id 并渲染分组的名称节点。'],
['SelectItem',1408,1532,'注册选项值、禁用和搜索文本，处理鼠标释放、触摸点击与键盘选择，并维护焦点和选中语义。'],
['SelectItemText',1545,1594,'收集选项文本生成原生 option，将选中项内容传送到触发器值容器并维护选项注册。'],
['SelectItemIndicator',1611,1617,'仅为已选项渲染对辅助技术隐藏的视觉选中指示。'],
['SelectScrollUpButton',1632,1662,'观察列表顶部滚动余量，按可滚动状态显示按钮并以选中项高度向上自动滚动。'],
['SelectScrollDownButton',1677,1710,'观察列表底部滚动余量并兼容缩放小数偏移，按选中项高度向下自动滚动。'],
['SelectScrollButtonImpl',1721,1768,'在指针按下或悬停时定时滚动，离开与卸载时清理计时器，并保持焦点项可见。'],
['SelectSeparator',1783,1786,'渲染对辅助技术隐藏的选项列表分隔元素。'],
['SelectArrow',1800,1807,'仅在 Popper 定位模式渲染定位箭头，转发作用域与箭头属性。'],
['SelectBubbleInput',1825,1946,'同步隐藏原生 select 的值与 options，支持表单自动填充，区分用户选择和程序更新的 change 冒泡。']],
'separator/src/separator.tsx':[['Separator',32,49,'验证方向后创建分隔线，按 decorative 决定 separator 或 none 角色并转发宿主属性。']],
'slider/src/slider.tsx':[
['Slider',112,302,'维护数值数组和活动 Thumb，按步进、边界与最小间距更新值，支持保序、表单重置及键盘和拖动提交。'],
['SliderHorizontal',347,413,'根据 LTR/RTL 与 inverted 把横向指针坐标转换为数值，并提供起止边、尺寸和导航方向。'],
['SliderVertical',424,486,'将纵向坐标映射为数值，按 inverted 确定由底或顶增长并转换键盘步进方向。'],
['SliderImpl',506,565,'统一宿主的键盘与指针捕获，调用方向层的移动回调并控制 Thumb 的焦点可见性。'],
['SliderTrack',577,588,'渲染滑轨并从 Slider 上下文暴露方向与禁用数据属性。'],
['SliderRange',600,626,'将滑块值换算为百分比，按方向起止边绘制已选区间。'],
['SliderThumbTrigger',727,777,'以滑块角色暴露最小最大和当前值，按尺寸补偿边缘位置并将焦点设置为活动 Thumb。'],
['SliderThumb',787,813,'组合 Thumb Provider、交互触发器及表单隐藏输入，保留消费者 ref 与自定义名字。'],
['SliderBubbleInput',831,913,'以隐藏 input 同步每个 Thumb 值，识别用户请求并阻止程序更新的 input 事件传播到祖先。']],
'slot/src/slot.tsx':[['Slot',24,89,'解包懒引用并选择 Slottable 目标，合并属性与 ref 后克隆唯一宿主元素，不合法多子元素明确报错。'],['Slottable',115,116,'标记要接收 Slot 属性的目标子元素，支持普通子元素与渲染函数两种形式。']],
'slot/src/slot.test.tsx':[['Button',679,687,'通过 asChild 和左右图标构造 Slottable 组合按钮，验证 Slot 的宿主替换与属性合并。'],['ButtonNested',697,705,'通过 Slottable 渲染函数包装子内容，构造嵌套替换及图标快照场景。'],['Input',713,726,'提供可受控输入的 asChild 测试载体，验证 Slot 对输入值和引用的合并。']],
'switch/src/switch.tsx':[
['SwitchTrigger',130,187,'渲染 switch 按钮并记录用户请求，重置时恢复初始值，表单场景把单次点击传播交给隐藏输入。'],
['Switch',205,249,'组合开关 Provider、Trigger 及表单场景的 BubbleInput，提供默认可重组部件结构。'],
['SwitchThumb',263,274,'读取开关状态并把 checked 和 disabled 映射为滑块指示器的数据属性。'],
['SwitchBubbleInput',291,411,'同步隐藏 checkbox 的 checked 与尺寸，以单次用户点击通知祖先，并抑制程序更新的重复点击传播。']],
 'tabs/src/tabs.tsx':[
['Tabs',73,110,'维护选中值、方向、激活模式与稳定基准 id，向选项卡列表和面板提供上下文。'],
['TabsList',126,146,'将 tablist 宿主纳入方向感知的焦点漫游组，支持循环键盘导航。'],
['TabsTrigger',162,229,'创建 ARIA tab 并关联面板，在鼠标、键盘与自动聚焦激活时更新选中值，同时隔离后代按键。'],
['TabsContent',250,286,'用 Presence 控制面板挂载和隐藏，以 ARIA 引用触发器并防止初始选中面板执行挂载动画。']],
 'toast/src/toast.tsx':[
['ToastViewport',189,369,'注册通知列表与快捷键，按最近通知优先管理 Tab 顺序，指针或焦点进入时暂停自动关闭并借助焦点代理进出文档。'],
['ToastFocusProxy',387,405,'创建视觉隐藏的焦点入口，仅当焦点由视口外进入时启动通知导航。'],
['Toast',432,477,'维护可控打开状态并通过 Presence 保留动画，更新滑动数据和位移变量，在滑动结束时关闭。'],
['ToastImpl',512,737,'管理自动关闭计时和暂停余量，将通知传送到视口并处理 Escape、滑动手势与可访问播报文本。'],
['ToastTitle',784,787,'将通知标题渲染为 Primitive.div 并转发属性和 ref。'],
['ToastDescription',802,805,'渲染通知描述宿主并透传消费者属性和引用。'],
['ToastAction',826,841,'要求非空替代说明，以该说明替换屏幕阅读器播报并复用关闭按钮完成通知操作。'],
['ToastClose',855,869,'组合消费者点击处理和上下文关闭操作，并将关闭按钮从默认播报文本中排除。'],
['ToastAnnounceExclude',882,892,'标记无需直接播报的子树，允许通过 altText 提供替代操作说明。']]
};
for(const [suffix,list] of Object.entries(components)){const p=root+suffix;supplement(p,list.map(([name,startLine,endLine])=>({name,startLine,endLine})));symbols(p,Object.fromEntries(list.map(([name,,,summary])=>[name,summary])));}
// 捆绑提取器已识别的核心函数与工具，按真实算法填写说明。
symbols(root+'roving-focus/src/roving-focus-group.tsx',{...Object.fromEntries(components['roving-focus/src/roving-focus-group.tsx'].map(([n,,,s])=>[n,s])),getFocusIntent:'将方向感知的按键映射为首项、末项、前项或后项意图，并按导航轴过滤无效方向键。'});
symbols(root+'select/src/select.tsx',{...Object.fromEntries(components['select/src/select.tsx'].map(([n,,,s])=>[n,s])),SelectProvider:'维护打开状态、选中值、触发器和原生选项集合，记录用户选择并恢复表单初值。',Select:'组合 SelectProvider 与默认隐藏输入，在表单场景自动添加 BubbleInput。',SelectPortal:'提供强制挂载上下文并将 Select 内容传送到消费者指定容器。',useTypeaheadSearch:'累积一秒内输入字符，通过稳定回调发布搜索变化并提供显式重置与卸载清理。',findNextItem:'规范化重复字符搜索，从当前项向后循环寻找文本前缀匹配的下一个选项。'});
symbols(root+'slider/src/slider.tsx',{...Object.fromEntries(components['slider/src/slider.tsx'].map(([n,,,s])=>[n,s])),SliderThumbProvider:'根据集合顺序识别 Thumb 索引，观察尺寸并共享数值、表单名称和百分比位置。',getDecimalCount:'识别普通或科学计数法数值的小数精度，避免极小步进在序列化后被误判。',getNextStepValue:'判断当前值是否对齐以 min 为基准的步进网格，按方向与倍率找到下一个合法步进值并舍入。'});
symbols(root+'slot/src/slot.tsx',{...Object.fromEntries(components['slot/src/slot.tsx'].map(([n,,,s])=>[n,s])),createSlot:'创建具有所有者名称的 Slot 组件工厂，支持子宿主替换、懒引用解包和明确使用错误。',createSlottable:'创建带共享 Symbol 标记的 Slottable 组件，使多份库副本能识别同一组合协议。',mergeProps:'以子元素属性为优先，组合事件、样式、className 和去重后的 aria-describedby。',getElementRef:'按 React 18 或 19 的 ref 警告 getter 差异选择安全读取路径。',isSlottable:'验证 React 元素类型上的共享 Symbol 标记以识别可投射子树。',isLazyComponent:'识别带 react.lazy 类型和 Promise 载荷的 Flight 或懒组件引用。',concatAriaDescribedby:'将多个 ARIA 描述引用规范化、拆分并去重为单个空格分隔列表。'});
symbols(root+'switch/src/switch.tsx',{...Object.fromEntries(components['switch/src/switch.tsx'].map(([n,,,s])=>[n,s])),SwitchProvider:'维护 checked、表单属性与 DOM 控制器，记录最后一次用户点击并向组合部件共享上下文。'});
symbols(root+'toast/src/toast.tsx',{...Object.fromEntries(components['toast/src/toast.tsx'].map(([n,,,s])=>[n,s])),ToastProvider:'共享通知配置、视口和数量，以 transition 调度上下文更新，减少对待水合 Suspense 边界的干扰。',ToastAnnounce:'下一帧在隐藏 live region 播报通知文字，一秒后清理，并允许指定播报容器。',getAnnounceTextContent:'递归收集通知可播报文本，跳过隐藏内容，并为被排除的操作子树采用替代说明。',handleAndDispatchCustomEvent:'创建可取消的滑动自定义事件，按是否离散选择普通分发或同步离散分发路径。',isDeltaInDirection:'比较横纵位移的主方向和阈值，判断手势是否符合配置的滑动关闭方向。',useNextFrame:'经双重 requestAnimationFrame 延后调用稳定回调，并在卸载时取消两帧调度。',getTabbableCandidates:'遍历通知 DOM 子树，过滤隐藏、禁用和不可 Tab 元素以构造近似键盘候选列表。'});
symbols(root+'select/src/select.test.tsx',{SelectTest:'构造带 apple 和 banana 的标准 Select，供 ARIA、表单和事件测试复用。',SelectClearableTest:'加入空值选项构造可清空 Select，验证取消选择和占位恢复。',fakeViewportScroll:'在 jsdom 中覆写视口滚动尺寸并分发 scroll，使滚动按钮能够进入测试状态。'});
symbols(root+'slider/src/slider.test.tsx',{shimBoundingClientRect:'覆写元素矩形测量结果，为滑块拖动测试提供确定的边界和尺寸。'});
const deps=[];
// 所有补充关系均来自已读源码，正式 imports 仍原样采用批次输入。
const dependencyMap={
'roving-focus/src/roving-focus-group.tsx':['collection/src/collection.tsx','compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','primitive/src/primitive.tsx','use-callback-ref/src/use-callback-ref.tsx','use-controllable-state/src/use-controllable-state.tsx','direction/src/direction.tsx','use-layout-effect/src/use-layout-effect.tsx','use-is-hydrated/src/use-is-hydrated.tsx'],
'select/src/select.tsx':['collection/src/collection.tsx','compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','direction/src/direction.tsx','dismissable-layer/src/dismissable-layer.tsx','focus-scope/src/focus-scope.tsx','popper/src/popper.tsx','portal/src/portal.tsx','presence/src/presence.tsx','primitive/src/primitive.tsx','slot/src/slot.tsx','use-callback-ref/src/use-callback-ref.tsx','use-controllable-state/src/use-controllable-state.tsx','use-layout-effect/src/use-layout-effect.tsx','visually-hidden/src/visually-hidden.tsx'],
'slider/src/slider.tsx':['compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','use-controllable-state/src/use-controllable-state.tsx','direction/src/direction.tsx','use-size/src/use-size.tsx','primitive/src/primitive.tsx','collection/src/collection.tsx'],
'slot/src/slot.tsx':['compose-refs/src/compose-refs.tsx'],
'separator/src/separator.tsx':['primitive/src/primitive.tsx'],
'switch/src/switch.tsx':['compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','use-controllable-state/src/use-controllable-state.tsx','use-size/src/use-size.tsx','primitive/src/primitive.tsx'],
 'tabs/src/tabs.tsx':['context/src/create-context.tsx','roving-focus/src/roving-focus-group.tsx','presence/src/presence.tsx','primitive/src/primitive.tsx','direction/src/direction.tsx','use-controllable-state/src/use-controllable-state.tsx'],
 'toast/src/toast.tsx':['compose-refs/src/compose-refs.tsx','collection/src/collection.tsx','context/src/create-context.tsx','dismissable-layer/src/dismissable-layer.tsx','portal/src/portal.tsx','presence/src/presence.tsx','primitive/src/primitive.tsx','use-callback-ref/src/use-callback-ref.tsx','use-controllable-state/src/use-controllable-state.tsx','use-layout-effect/src/use-layout-effect.tsx','visually-hidden/src/visually-hidden.tsx']
};
for(const [src,targets] of Object.entries(dependencyMap))for(const t of targets)deps.push([`file:${root}${src}`,`file:${root}${t}`]);
for(const pkg of ['select','separator','slider','slot','switch','tabs','toast'])deps.push([`file:${root}${pkg}/src/${pkg}.tsx`,`file:${root}${pkg}/src/${pkg}.test.tsx`,'tested_by']);
// 保留部件间的组合关系，让入口到交互实现的路径可探索。
for(const [suffix,pairs] of Object.entries({
'select/src/select.tsx':[['Select','SelectProvider'],['Select','SelectBubbleInput'],['SelectContent','SelectContentImpl'],['SelectContentImpl','SelectItemAlignedPosition'],['SelectContentImpl','SelectPopperPosition']],
'slider/src/slider.tsx':[['Slider','SliderHorizontal'],['Slider','SliderVertical'],['SliderThumb','SliderThumbProvider'],['SliderThumb','SliderThumbTrigger'],['SliderThumb','SliderBubbleInput']],
'switch/src/switch.tsx':[['Switch','SwitchProvider'],['Switch','SwitchTrigger'],['Switch','SwitchBubbleInput']],
 'toast/src/toast.tsx':[['Toast','ToastImpl'],['ToastImpl','ToastAnnounce'],['ToastAction','ToastClose']]
}))for(const [a,b] of pairs)deps.push([`function:${root}${suffix}:${a}`,`function:${root}${suffix}:${b}`,'depends_on']);
// 公共入口源码均明确重导出同名实现，因此用 exports 连接文件，避免增加未在正式输入中的 imports。
for(const pkg of ['scroll-area','select','separator','slider','slot','switch','tabs','toast','toggle-group'])deps.push([`file:${root}${pkg}/src/index.ts`,`file:${root}${pkg}/src/${pkg}.tsx`,'exports']);
for(const pkg of ['roving-focus/src/roving-focus-group.tsx','select/src/select.tsx','slider/src/slider.tsx','switch/src/switch.tsx','tabs/src/tabs.tsx','toast/src/toast.tsx'])deps.push([`file:${root}${pkg}`,'file:packages/core/primitive/src/primitive.tsx']);
for(const pkg of ['select','slider'])deps.push([`file:${root}${pkg}/src/${pkg}.tsx`,'file:packages/core/number/src/number.ts']);
edges(91,deps);
save([91]);
