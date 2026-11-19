// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
const p='packages/react/';
const s={
 [p+'alert-dialog/src/index.ts']:{summary:'导出 AlertDialog 的根、触发器、Portal、遮罩、内容、确认/取消操作及标题描述，并统一导出各部件属性类型。',tags:['公开入口','警告对话框','聚合导出']},
 [p+'announce/src/announce.test.tsx']:{summary:'验证 Announce.Root 的普通属性、样式、事件和 ref 透传，以及 asChild 时属性落在消费者子元素上。',tags:['单元测试','播报区域','插槽组合']},
 [p+'announce/src/announce.tsx']:{summary:'把可见内容镜像到共享 ARIA live region，按优先级和标识复用播报区域，并在文档隐藏时停用播报；通过引用计数管理 visibilitychange 监听。',tags:['可访问性','播报区域','共享状态'],languageNotes:'通过 Portal 复用 live region，并用 Map 对共享事件监听进行引用计数，避免每个播报组件重复绑定。',functions:{
 Announce:'保留可见内容并 Portal 镜像到匹配的播报区域，合并 ref 获取正确 ownerDocument，并在页面隐藏时停用 live region。',
 buildLiveRegionElement:'在指定文档 body 创建视觉隐藏的播报区域，设置 aria-live、aria-atomic、role 和可选 aria-relevant。',
 buildSelector:'根据播报优先级、原子更新、相关变化、角色与标识构建匹配选择器，以复用相同配置的 live region。'}},
 [p+'announce/src/index.ts']:{summary:'提供客户端 Announce/Root 与 AnnounceProps 的公共导出入口。',tags:['公开入口','播报区域','聚合导出']},
 [p+'arrow/src/arrow.test.tsx']:{summary:'检查 Arrow 的默认宽高和可访问性，并验证 SVG 属性、事件、ref 和 asChild 子元素透传。',tags:['单元测试','浮层箭头','属性透传']},
 [p+'arrow/src/arrow.tsx']:{summary:'在 Primitive.svg 上渲染可调尺寸的三角箭头，asChild 模式允许消费者替换完整 SVG 并保留 ref 与属性合并。',tags:['基础组件','浮层箭头','插槽组合'],functions:{Arrow:'默认绘制三角形 SVG，支持尺寸参数；asChild 时使用消费者提供的子元素以替换整个图形。'}},
 [p+'arrow/src/index.ts']:{summary:'导出内部 Arrow 组件、Root 别名及 SVG 属性类型。',tags:['内部入口','浮层箭头','聚合导出']},
 [p+'aspect-ratio/src/aspect-ratio.test.tsx']:{summary:'验证宽高比容器的可访问性，以及 DOM 属性、样式、事件和 ref 在普通与 asChild 模式下的透传。',tags:['单元测试','宽高比','属性透传']},
 [p+'aspect-ratio/src/aspect-ratio.tsx']:{summary:'以百分比底部内边距建立响应式宽高比包裹容器，再用绝对定位的 Primitive.div 填满区域并转发消费者属性与 ref。',tags:['布局组件','宽高比','响应式'],functions:{AspectRatio:'根据 ratio 计算外层百分比占位高度，并将内部 Primitive.div 绝对定位铺满，保持内容在响应式宽度下的比例。'}},
 [p+'aspect-ratio/src/index.ts']:{summary:'公开 AspectRatio 及 Root 别名，并导出包含 ratio 的属性契约。',tags:['公开入口','宽高比','聚合导出']},
 [p+'avatar/src/avatar.test.tsx']:{summary:'回归 Avatar 的图片加载/缓存/错误与 fallback 延迟、SSR、请求策略和监听清理，并覆盖多个图片告警及全部部件的 asChild/ref 透传。',tags:['单元测试','头像','图片生命周期'],classes:{MockImage:'基于 EventTarget 模拟 Image 的 src、complete、naturalWidth 和异步 load 事件，通过缓存还原图片完成后再发事件的浏览器行为。'}},
 [p+'avatar/src/avatar.tsx']:{summary:'以共享上下文协调头像图片加载状态和 fallback 显示，支持延迟占位、referrerPolicy/crossOrigin、状态回调以及仅开发环境的重复图片告警。',tags:['头像组件','图片加载','可访问性'],functions:{
 Avatar:'建立图片加载状态和开发环境图片数量上下文，渲染可组合的根 span。',
 AvatarImage:'注册头像图片实例，预加载并监听加载状态，只在图片完成时渲染 img，并以稳定回调通知消费者状态变化。',
 AvatarFallback:'在可选延迟后显示备用内容，图片加载完成时隐藏占位，并清理定时器。',
 useImageLoadingStatus:'创建离屏 Image 预加载指定 src，设置跨域与请求来源策略，监听 load/error 并在变化或卸载时清理。',
 useImageCount:'仅在开发环境追踪图片数量并对一个头像中多张 Image 发出一次告警，生产环境返回静态状态。',
 useUpdateImageCount:'仅开发环境在图片挂载时增加根计数、卸载时减少，用于检测不支持的多图片结构。'}},
 [p+'avatar/src/index.ts']:{summary:'公开 Avatar、Image、Fallback 部件及别名、作用域工厂和对应属性类型。',tags:['公开入口','头像组件','聚合导出']},
 [p+'checkbox/src/checkbox.test.tsx']:{summary:'验证新分部件与旧整体 Checkbox 的选中/禁用/不确定状态、受控回调和表单行为，重点回归用户点击与程序更新的冒泡去重及延迟状态提交。',tags:['单元测试','复选框','表单冒泡'],functions:{LegacyCheckbox:'包装旧整体 Checkbox 与 Indicator，并给隐藏原生 input 补 aria-hidden，以避免 axe 对测试环境隐藏内容的误判。'}},
 [p+'checkbox/src/checkbox.tsx']:{summary:'将复选框拆成状态 Provider、可访问 Trigger、Presence 指示器与原生 BubbleInput；精确区分用户点击、延迟受控提交及程序更新，兼容表单校验和事件传播。',tags:['复选框','受控状态','表单联动'],languageNotes:'用 boolean | indeterminate 表示三态；隐藏原生 input 保留浏览器表单行为，单独记录用户请求以免把程序同步误当成新点击。',functions:{
 CheckboxProvider:'统一受控/非受控 checked、表单关联、触发器与隐藏 input 引用，并记录最近一次用户点击请求供后续事件同步。',
 CheckboxTrigger:'渲染带 checkbox 角色的按钮，维护表单重置、mixed 状态和属性，组合点击处理并阻止按钮与隐藏 input 重复冒泡。',
 Checkbox:'组合 Provider、Trigger 和必要的 BubbleInput，保留传统单个组件 API 与原生表单兼容。',
 CheckboxIndicator:'根据选中或不确定状态通过 Presence 控制指示器挂载，提供状态/禁用属性并支持强制挂载。',
 CheckboxBubbleInput:'同步隐藏原生 checkbox 的状态与控件尺寸，区分新用户点击、延迟受控变化和程序更新，使 change 通知表单同时避免祖先 onClick 重复触发。'}},
 [p+'checkbox/src/index.ts']:{summary:'导出稳定 Checkbox/Indicator，同时以 unstable 前缀暴露 Provider、Trigger 与 BubbleInput 分部件及类型。',tags:['公开入口','复选框','实验接口']},
 [p+'collapsible/src/collapsible.test.tsx']:{summary:'验证折叠内容的默认/受控开关与回调、关闭时移除无效 aria-controls，并检查 Root/Trigger/Content 的属性和 asChild/ref 透传。',tags:['单元测试','折叠容器','可访问性']},
 [p+'collapsible/src/collapsible.tsx']:{summary:'以可控状态与 Context 实现折叠根、触发器和内容，结合 Presence 延迟卸载；在开关前测量内容尺寸并暴露 CSS 变量以支持展开收起动画。',tags:['折叠容器','受控状态','挂载动画'],functions:{
 Collapsible:'管理受控或默认展开状态，提供内容 ID、禁用态和切换方法，根节点以 data-state 暴露当前状态。',
 CollapsibleTrigger:'渲染关联内容的按钮，按打开状态设置 aria-controls/expanded 并组合消费者点击与内部状态切换。',
 CollapsibleContent:'用 Presence 根据展开或 forceMount 决定挂载，将动画期间存在状态传给内部实现。',
 CollapsibleContentImpl:'在展开和收起前暂停动画测量完整宽高，暴露尺寸 CSS 变量并保留动画所需内容直到退出完成。'}},
 [p+'collapsible/src/index.ts']:{summary:'提供 Collapsible 根、Trigger、Content、简短别名及作用域与属性类型的客户端导出入口。',tags:['公开入口','折叠容器','聚合导出']},
 [p+'collection/src/collection-legacy.tsx']:{summary:'为旧版交互组件创建作用域隔离的条目集合，通过 Slot 注册条目 ref 和元数据，并在读取时按当前 DOM 顺序排序。',tags:['集合工厂','作用域上下文','DOM顺序'],functions:{
 createCollection:'生成 Provider、容器 Slot、条目 ItemSlot、读取 Hook 与独立作用域工厂，使菜单等组件可维护带元数据的有序集合。',
 CollectionProvider:'为每个集合实例创建稳定的容器 ref 与条目 Map，放入作用域上下文供 Slot 和读取器共享。',
 CollectionItemSlot:'合并条目 ref，并随渲染注册元数据、卸载清除条目，向真实子节点标记集合属性。',
 useCollection:'返回按需读取条目的回调，查询容器中条目的当前 DOM 顺序，再据此排序已注册的元数据。'}},
 [p+'collection/src/index.ts']:{summary:'同时导出稳定旧版 createCollection 与实验新版集合工厂、SlotProps 和 Dict 类型，维持两套集合 API 的兼容入口。',tags:['内部入口','集合工厂','实验接口']},
 [p+'compose-refs/src/compose-refs.tsx']:{summary:'把回调 ref 与对象 ref 合为一个引用回调，兼容 React 19 的清理返回值，并提供记忆化 Hook 以供可组合组件共享真实 DOM 引用。',tags:['引用合并','共享Hook','React兼容'],functions:{
 composeRefs:'将节点同步至所有回调/对象 ref；任一回调提供清理函数时，返回统一清理器，分别执行清理或将相应引用置空。',
 useComposedRefs:'按输入 refs 记忆化 composeRefs 的结果，使调用方得到稳定的合并引用回调。'}},
 [p+'compose-refs/src/index.ts']:{summary:'导出 composeRefs 工具与 useComposedRefs Hook，作为全库引用合并的共享入口。',tags:['内部入口','引用合并','共享Hook']},
 [p+'context-menu/src/context-menu.test.tsx']:{summary:'系统验证右键菜单的打开、重定位、可控状态、禁用和层级选项，并覆盖全部部件属性透传、模态外部交互和嵌套触发器长按只打开最内层菜单。',tags:['单元测试','右键菜单','长按交互'],functions:{ContextMenuTest:'构造 Root、右键触发区、Portal 和单个菜单项的最小可操作夹具，供打开关闭和定位测试复用。'}},
 [p+'context-menu/src/context-menu.tsx']:{summary:'在共享 Menu 原语之上添加右键/长按触发和虚拟坐标锚点，提供受控根与子菜单及选择部件；通过事件认领避免嵌套触发器同时长按打开。',tags:['右键菜单','触摸长按','浮层组合'],functions:{
 ContextMenu:'维护受控或非受控打开状态、模态和交互标记，为底层 Menu 注入共享作用域；开发时警告尚无锚点位置的程序打开。',
 ContextMenuPortal:'继承 ContextMenu 的 Menu 作用域，将菜单内容通过底层 Portal 挂载。',
 ContextMenuTrigger:'维护最近交互坐标的虚拟 Anchor，处理右键与触摸/笔700ms长按，取消移动手势并只允许最内层触发器认领同一原生事件。',
 ContextMenuContent:'包装底层 Menu.Content，配置默认右侧定位及可覆盖属性，避免非模态外部交互后的错误自动聚焦，并重命名 Popper CSS 变量。',
 ContextMenuGroup:'在当前作用域下包装 Menu.Group，提供相关菜单项的分组容器并转发 ref。',
 ContextMenuLabel:'将菜单分组标签属性和 ref 转交相同作用域的 Menu.Label。',
 ContextMenuItem:'将选择、禁用与焦点交互交给共享 Menu.Item，保持 ContextMenu 的作用域和引用透传。',
 ContextMenuCheckboxItem:'包装带 checked 状态的共享复选菜单项，保留 ContextMenu 作用域与消费者 ref。',
 ContextMenuRadioGroup:'包装共享单选菜单组，提供当前右键菜单作用域下的互斥选择状态。',
 ContextMenuRadioItem:'将值、选中与交互属性转交共享 Menu.RadioItem，复用互斥选择行为。',
 ContextMenuItemIndicator:'包装共享菜单选中指示器，在正确作用域下呈现复选或单选项状态。',
 ContextMenuSeparator:'将分隔线属性和 ref 转交共享菜单分隔部件。',
 ContextMenuArrow:'包装共享菜单箭头，在 ContextMenu 作用域中复用底层浮层定位关联。',
 ContextMenuSub:'为子菜单管理受控或默认打开值，并通过共享 Menu.Sub 参与父菜单层级。',
 ContextMenuSubTrigger:'将子菜单打开与键盘导航交给共享 Menu.SubTrigger，同时转发右键菜单作用域和 ref。',
 ContextMenuSubContent:'包装共享子菜单内容，保留 ref 和定位属性，并将 Popper 可用尺寸、变换原点与锚点尺寸变量重命名到 ContextMenu 命名空间。'}}
};
const extra={
 [p+'announce/src/announce.tsx']:[['Announce',96,190]],
 [p+'arrow/src/arrow.tsx']:[['Arrow',12,29]],
 [p+'aspect-ratio/src/aspect-ratio.tsx']:[['AspectRatio',14,44]],
 [p+'avatar/src/avatar.tsx']:[['Avatar',46,67],['AvatarImage',83,114],['AvatarFallback',127,144]],
 [p+'checkbox/src/checkbox.tsx']:[['CheckboxTrigger',139,203],['Checkbox',218,265],['CheckboxIndicator',283,305],['CheckboxBubbleInput',316,441]],
 [p+'collapsible/src/collapsible.tsx']:[['Collapsible',41,76],['CollapsibleTrigger',88,110],['CollapsibleContent',127,143],['CollapsibleContentImpl',152,225]],
 [p+'collection/src/collection-legacy.tsx']:[['CollectionProvider',41,52],['CollectionItemSlot',87,105],['useCollection',113,128]],
 [p+'context-menu/src/context-menu.tsx']:[['ContextMenuTrigger',117,213],['ContextMenuContent',240,287],['ContextMenuGroup',297,307],['ContextMenuLabel',317,327],['ContextMenuItem',337,347],['ContextMenuCheckboxItem',357,364],['ContextMenuRadioGroup',374,381],['ContextMenuRadioItem',391,398],['ContextMenuItemIndicator',408,418],['ContextMenuSeparator',428,435],['ContextMenuArrow',445,455],['ContextMenuSubTrigger',495,502],['ContextMenuSubContent',512,537]]
};
// forwardRef 与工厂内部重要部件未被解析器列入函数数组；这些精确范围均来自逐行阅读。
for(const file of Object.keys(extra)) extra[file]=extra[file].map(([name,startLine,endLine])=>({name,startLine,endLine}));
const edges=[];
const deps={
 'announce/src/announce.tsx':['compose-refs/src/compose-refs.tsx','primitive/src/primitive.tsx','use-layout-effect/src/use-layout-effect.tsx'],
 'arrow/src/arrow.tsx':['primitive/src/primitive.tsx'],
 'aspect-ratio/src/aspect-ratio.tsx':['primitive/src/primitive.tsx'],
 'avatar/src/avatar.tsx':['context/src/create-context.tsx','use-callback-ref/src/use-callback-ref.tsx','use-layout-effect/src/use-layout-effect.tsx','primitive/src/primitive.tsx'],
 'checkbox/src/checkbox.tsx':['compose-refs/src/compose-refs.tsx','context/src/create-context.tsx','use-controllable-state/src/use-controllable-state.tsx','use-size/src/use-size.tsx','presence/src/presence.tsx','primitive/src/primitive.tsx'],
 'collapsible/src/collapsible.tsx':['context/src/create-context.tsx','use-controllable-state/src/use-controllable-state.tsx','use-layout-effect/src/use-layout-effect.tsx','compose-refs/src/compose-refs.tsx','primitive/src/primitive.tsx','presence/src/presence.tsx','id/src/id.tsx'],
 'collection/src/collection-legacy.tsx':['context/src/create-context.tsx','compose-refs/src/compose-refs.tsx','slot/src/slot.tsx'],
 'context-menu/src/context-menu.tsx':['context/src/create-context.tsx','primitive/src/primitive.tsx','menu/src/menu.tsx','use-controllable-state/src/use-controllable-state.tsx']
};
// 手工确认的跨包使用关系写为 depends_on，不更改扫描器 imports 闭集。
for(const [source,targets] of Object.entries(deps)) for(const target of targets) edges.push(relation(`file:${p}${source}`,`file:${p}${target}`));
for(const file of ['checkbox/src/checkbox.tsx','collapsible/src/collapsible.tsx','context-menu/src/context-menu.tsx']) edges.push(relation(`file:${p}${file}`,'file:packages/core/primitive/src/primitive.tsx'));
for(const name of ['avatar','context-menu']) edges.push(relation(`file:${p}${name}/src/${name}.tsx`,'file:packages/core/env-check/src/internal/is-development.true.ts'));
for(const name of ['announce','arrow','aspect-ratio','avatar','checkbox','collapsible','context-menu']) edges.push(relation(`file:${p}${name}/src/${name}.tsx`,`file:${p}${name}/src/${name}.test.tsx`,'tested_by'));
const indexTargets={
 'alert-dialog':'alert-dialog.tsx','announce':'announce.tsx','arrow':'arrow.tsx','aspect-ratio':'aspect-ratio.tsx','avatar':'avatar.tsx','checkbox':'checkbox.tsx','collapsible':'collapsible.tsx','collection':'collection-legacy.tsx','compose-refs':'compose-refs.tsx'
};
for(const [name,target] of Object.entries(indexTargets)) edges.push(relation(`file:${p}${name}/src/index.ts`,`file:${p}${name}/src/${target}`));
edges.push(relation(`file:${p}collection/src/index.ts`,`file:${p}collection/src/collection.tsx`));
const calls=[
 ['announce/src/announce.tsx','Announce','buildLiveRegionElement'],['announce/src/announce.tsx','Announce','buildSelector'],
 ['avatar/src/avatar.tsx','Avatar','useImageCount'],['avatar/src/avatar.tsx','AvatarImage','useImageLoadingStatus'],['avatar/src/avatar.tsx','AvatarImage','useUpdateImageCount'],
 ['compose-refs/src/compose-refs.tsx','useComposedRefs','composeRefs'],
 ['collapsible/src/collapsible.tsx','CollapsibleContent','CollapsibleContentImpl']
];
for(const [file,source,target] of calls) edges.push(relation(`function:${p}${file}:${source}`,`function:${p}${file}:${target}`,'calls'));
saveBatch(86,s,edges,extra);
