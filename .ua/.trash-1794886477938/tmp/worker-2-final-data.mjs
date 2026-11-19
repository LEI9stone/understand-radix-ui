// @ts-check
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('.ua/tmp/worker-2-semantics.json','utf8'));
const {files,symbols}=data;
/** 保存人工阅读得到的文件解释，不执行语义推断。 */
function file(p,summary,tags,extra={}){files[p]={summary,tags,...extra};}
/** 保存重要函数的人工语义解释。 */
function symbol(p,name,summary){symbols[`${p}:${name}`]=summary;}
/** 附加源码中已经确认的依赖，目标使用已发现的实际包入口。 */
function deps(p,names){files[p].edges??=[];for(const name of names)files[p].edges.push({target:`file:packages/react/${name}/src/index.ts`,type:'depends_on'});}
/** 登记 HOC 包装而被提取器遗漏的真实组件，位置来自源码阅读。 */
function extras(p,rows){files[p].extraSymbols=rows.map(([name,start,end,summary,exported=true])=>({name,range:[start,end],summary,exported,tags:['组件','组合模式','可访问性']}));}
file('.changeset/changelog.cjs','实现 Changesets 的依赖变更行、版本条目和更新日志格式化，优先排列 Overview 并将其他变更归入单独小节。',['发布工具','更新日志','格式化']);
for(const [n,s] of Object.entries({getDependencyReleaseLine:'把更新的依赖名称和新版本格式化为发布日志条目，没有更新时返回空文本。',getReleaseLine:'将 Changeset 首行转换成项目符号或三级标题，并保留后续多行说明。',getChangelogText:'等待异步日志文本，排序 Overview 和其他标题，并合并普通变更为 Other updates 小节。',getChangelogEntry:'汇总当前发布版本的全部级别变更，生成以新版本号开头的 Markdown 条目。'}))symbol('.changeset/changelog.cjs',n,s);
files['.changeset/changelog.cjs'].extraSymbols=[['getDependencyReleaseLine',5,11],['getReleaseLine',14,20],['getChangelogEntry',58,66]].map(([name,a,b])=>({name,range:[a,b],summary:symbols[`.changeset/changelog.cjs:${name}`],exported:true,tags:['发布工具','日志生成','导出函数']}));
file('.github/CODEOWNERS','声明希望为新拉取请求添加的审阅者，用于代码所有权与评审协作。',['仓库治理','评审','所有权']);
file('.nvmrc','将本地及 CI Node.js 主版本固定为 24，统一开发运行时。',['运行时','版本固定','开发环境']);
file('.ua/config.json','保存本项目知识图谱的中文输出语言偏好，供后续增量分析保持语言一致。',['分析配置','中文输出','知识图谱']);
file('.github/CONTRIBUTING.md','介绍 Radix 贡献原则、问题反馈和拉取请求准备流程，并提供本地开发说明。',['文档','贡献指南','开发流程']);
file('.github/PULL_REQUEST_TEMPLATE.md','为拉取请求提供提交前检查清单和变更描述位置，帮助维护者进行一致评审。',['文档','拉取请求','评审规范']);
file('.github/actions/ci-setup/action.yml','组合式 CI 初始化动作，从 packageManager 读取 pnpm 版本并按 .nvmrc 安装 Node.js；可选安装支持 OIDC 的 npm 后执行冻结锁文件安装。',['配置','持续集成','依赖安装'],{edges:[{target:'file:.nvmrc',type:'depends_on'}]});
file('.github/actions/detect-snapshot-changes/action.yml','读取 npm next 快照版本与发布时间，按 UTC 日期避免同日重复发布，并比较上次发布前的提交以过滤文档、测试及应用等非发布变更。',['配置','快照发布','变更检测']);
file('.github/actions/publish-snapshot/action.yml','复用 CI 初始化后构建全部包、生成 next 快照版本并以 provenance 发布到 npm。',['配置','快照发布','持续集成'],{edges:[{target:'config:.github/actions/ci-setup/action.yml',type:'depends_on'}]});
file('.github/actions/publish-stable/action.yml','复用 CI 初始化和包构建，通过 Changesets 创建版本 PR 或发布稳定包，并强制附带 provenance 证明。',['配置','稳定发布','持续集成'],{edges:[{target:'config:.github/actions/ci-setup/action.yml',type:'depends_on'}]});
const pages={
 'accessible-icon':'在按钮内为图标提供 Close 可访问名称，检查服务端渲染后的图标语义。',
 accordion:'渲染可同时展开多项的折叠面板，包含禁用项和内容内按钮，检查 SSR 下的结构与交互。',
 'alert-dialog':'组合触发器、Portal、遮罩、标题、描述和确认取消按钮，提供警告对话框 SSR 样例。',
 avatar:'组合头像图片与回退字符，检查服务端初始状态与客户端图片加载的兼容性。',
 checkbox:'渲染复选框根组件与勾选指示器，提供最小 SSR 交互入口。',
 collapsible:'组合折叠触发器与内容，检查 SSR 输出和水合后的展开行为。',
 'context-menu':'组合右键触发区、Portal、菜单项与禁用项，检查上下文菜单在 SSR 应用中的使用。',
 dialog:'组合默认展开的对话框、遮罩、标题描述和关闭按钮，观察 Portal 与水合行为。',
 'dropdown-menu':'组合下拉触发器、带偏移的内容、禁用项和箭头，提供 SSR 菜单使用样例。',
 form:'组合必填 email 字段及缺值、格式不符提示，检查 SSR 下的表单验证语义。',
 'hover-card':'组合悬停触发器、Portal 内容和箭头，提供悬停卡片的 SSR 样例。',
 label:'渲染 Label.Root，作为标签组件在 SSR 页面中的最小检查入口。',
 menubar:'组合菜单栏、触发器、Portal、菜单标签、项目和箭头，展示 SSR 场景下的菜单栏结构。',
 'navigation-menu':'组合可展开导航项和直接链接，展示导航菜单在 SSR 应用中的两种项目结构。'
};
for(const [name,summary] of Object.entries(pages)){
 const p=`apps/ssr-testing/app/${name}/page.tsx`;
 file(p,summary,['服务端渲染','组件样例','水合验证'],{edges:[{target:'file:packages/react/radix-ui/src/index.ts',type:'depends_on'}]});
 symbol(p,'Page',summary);
}
file('apps/ssr-testing/app/layout.tsx','在 React.StrictMode 下提供 SSR/RSC 测试应用的 HTML 外壳、组件路由导航和页面内容区域。',['服务端渲染','应用布局','组件导航']);
symbol('apps/ssr-testing/app/layout.tsx','Layout','构建包含所有组件测试链接的双栏页面，将子路由内容包裹在严格模式和统一 HTML 文档内。');
const rp='packages/react/';
const sourceSummaries={
 'id/src/id.tsx':'优先采用 React.useId，为旧 React 在布局阶段生成客户端回退 ID，同时允许调用方提供确定性 ID。',
 'label/src/label.tsx':'以可替换 DOM 的 label 基元实现标签，仅阻止标签本身双击造成的文本选择，同时保留内部表单控件行为。',
 'menu/src/menu.tsx':'提供基础菜单和子菜单的复合组件，统一键盘导航、前缀搜索、选择事件、焦点管理、指针宽容区与浮层关闭行为。',
 'menubar/src/menubar.tsx':'在基础 Menu 上增加横向菜单切换、当前激活值和漫游焦点，协调鼠标与键盘操作以及子菜单边界。',
 'navigation-menu/src/navigation-menu.tsx':'实现支持自动或手动激活的导航菜单，管理延迟切换、嵌套导航、共享视口、移动方向动画及内容焦点顺序。',
 'one-time-password-field/src/one-time-password-field.tsx':'组合有序输入集合和漫游焦点，实现验证码字符校验、粘贴分发、删除、自动补全、表单重置及填满后提交。',
 'password-toggle-field/src/password-toggle-field.tsx':'协调密码可见状态、输入框、切换按钮和图标，恢复选择区及焦点，并在表单提交或重置时隐藏密码。',
 'popover/src/popover.tsx':'基于定位和焦点原语构建可控弹出层，区分模态与非模态外部交互，并维护标题描述的 ARIA 关联和嵌套 Portal 分支。'
};
for(const [p,summary]of Object.entries(sourceSummaries))file(rp+p,summary,['组件实现','可访问性','复合组件']);
const tests={
 label:'检查 Label 的额外属性透传及 asChild 模式下属性和引用的组合。',
 menubar:'检查菜单栏各部件的属性透传和 asChild 组合，并验证关闭时不产生悬空 aria-controls 引用。',
 'navigation-menu':'验证自动和手动激活、子菜单继承与禁用切换、引用稳定性、真实焦点离开时关闭以及各部件的 asChild 透传。',
 'one-time-password-field':'验证验证码输入的可访问性、密码遮蔽、禁用、数字输入和焦点前进、方向键导航、粘贴截断与属性透传。',
 'password-toggle-field':'验证密码可见性切换、图标替换、输入值和选择区保留、重新聚焦及提交后的隐藏，并检查属性透传。',
 popover:'验证弹出层开关时 ARIA 引用、标题描述关联、模态及非模态属性透传和 asChild 组合，并包含回调类型约束检查。',
 popper:'验证虚拟锚点引用更新、挂载后注册、内容引用稳定性以及锚点、浮层和箭头的属性透传。'
};
for(const [pkg,summary]of Object.entries(tests)){
 const p=`${rp}${pkg}/src/${pkg}.test.tsx`;
 file(p,summary,['测试','可访问性','属性透传']);
 files[p].edges=[{source:`file:${rp}${pkg}/src/${pkg}.tsx`,target:`file:${p}`,type:'tested_by'}];
}
const barrelNames={
 'hover-card':['悬停卡片','createHoverCardScope 与 Root、Trigger、Portal、Content、Arrow 及其类型'],
 id:['标识符 Hook','useId'],
 label:['标签','Label、Root 和 LabelProps'],
 menu:['基础菜单','Menu、各类菜单项、子菜单、作用域工厂及类型'],
 menubar:['菜单栏','Menubar、触发器、内容、项目与子菜单及类型'],
 'navigation-menu':['导航菜单','Root、Sub、List、Item、Trigger、Link、Indicator、Content、Viewport 及类型'],
 'one-time-password-field':['验证码输入','Root、Input、HiddenInput、校验类型及属性类型'],
 'password-toggle-field':['密码显示切换','Root、Input、Toggle、Icon、Slot 及属性类型'],
 popover:['弹出层','Root、Anchor、Trigger、Portal、Content、Title、Description、Close、Arrow 及类型'],
 popper:['浮层定位','定位作用域、锚点、内容、箭头、方向和对齐选项及类型'],
 'roving-focus':['漫游焦点','Root、Item、作用域工厂及属性类型']
};
for(const [pkg,[domain,exports]]of Object.entries(barrelNames))file(`${rp}${pkg}/src/index.ts`,`集中导出${domain}模块的 ${exports}，为包消费者提供公开入口。`,['公开入口','重新导出',domain],{languageNotes:'通过 barrel 统一暴露组件、短名和类型，保持实现文件与消费入口分离。'});
symbol(rp+'id/src/id.tsx','useId','优先返回显式 ID，否则使用 React 原生 ID，并为旧版本 React 在布局阶段提供递增回退标识。');
for(const [p,map]of Object.entries({
 'menu/src/menu.tsx':{Menu:'持有菜单开关和输入方式状态，在窗口失焦时关闭菜单，并为定位与方向性提供上下文。',MenuPortal:'将菜单内容传送到指定容器，结合 Presence 支持按开关状态挂载或强制挂载。',MenuSub:'维护子菜单的触发器、内容与 ARIA 标识，并在父菜单关闭或卸载时同步关闭。',getNextMatch:'根据累积搜索串和当前匹配项循环查找下一条文本，支持连续同字符的快速导航。',isPointInPolygon:'以射线交叉规则判断指针坐标是否位于子菜单宽容多边形内。'},
 'menubar/src/menubar.tsx':{MenubarMenu:'为单个菜单分配稳定值和标识，关联当前菜单栏激活项并以非模态 Menu 呈现。',MenubarPortal:'携带菜单作用域将内容委托给基础 Menu 的 Portal。',MenubarSub:'用受控状态 Hook 管理菜单栏子菜单的展开值，交给 Menu.Sub 处理底层交互。'},
 'menubar/src/menubar.test.tsx':{MenubarTest:'构建包含触发器和内容的菜单栏测试夹具，用于检查 ARIA 关联和开关行为。'},
 'navigation-menu/src/navigation-menu.tsx':{NavigationMenuProvider:'维护共享视口、指示器轨道及内容注册表，提供上次激活值、稳定回调和项目集合上下文。',NavigationMenuViewportItem:'合并内容引用并只在当前激活项存在真实节点时更新视口测量目标，保持切换平滑。',getTabbableCandidates:'遍历内容子树，跳过禁用、隐藏及隐藏输入，收集可进入 Tab 顺序的元素。',removeFromTabOrder:'暂存候选元素原有 tabindex 并全部设为 -1，返回恢复焦点顺序的清理函数。',useResizeObserver:'通过稳定回调和动画帧合并 ResizeObserver 通知，避免尺寸观察循环并在卸载时清理。'},
 'navigation-menu/src/navigation-menu.test.tsx':{NavigationMenuTest:'构建最小导航根、项目、触发器和内容，支撑激活模式与 ARIA 关系测试。',NavigationMenuSubTest:'在子导航中组合触发器和内容，验证激活模式继承与 disableToggle 行为。'},
 'one-time-password-field/src/one-time-password-field.tsx':{focusInput:'聚焦目标输入；若已经聚焦，则在下一动画帧选择其内容以便覆盖输入。'},
 'password-toggle-field/src/password-toggle-field.tsx':{PasswordToggleField:'提供密码可见状态、输入 ID 和引用以及选择区记录，兼容旧拼写回调并在开发时提示迁移。',PasswordToggleFieldSlot:'根据可见状态选择声明式内容或调用 render 属性，让消费者定制可见性提示。',requestIdleCallback:'优先调用窗口空闲回调，不支持时以定时器模拟剩余时间，并返回取消函数。'},
 'password-toggle-field/src/password-toggle-field.test.tsx':{EyeClosedIcon:'提供闭眼 SVG 测试图标，用于验证隐藏状态图标的选择与属性组合。',EyeOpenIcon:'提供睁眼 SVG 测试图标，用于验证密码显示状态时的图标替换。'},
 'popover/src/popover.tsx':{Popover:'维护可控开关、触发器引用、自定义锚点和标题描述计数，为浮层内容提供定位及语义上下文。',PopoverPortal:'将 Presence 管理的弹出内容传送到指定容器，并向后代共享强制挂载选项。',concatAriaDescribedby:'拆分并去重多个 ARIA 描述标识串，以单个空格合并，空集合返回 undefined。'}
}))for(const [n,s]of Object.entries(map))symbol(rp+p,n,s);
// 以下组件在 forwardRef 调用中定义，结构提取器未返回其函数节点，依据已阅读源码补齐。
extras(rp+'label/src/label.tsx',[
 ['Label',12,30,'渲染可组合的原生标签，透传引用并避免标签本身双击选中文本，不干扰嵌套控制项。']
]);
extras(rp+'menu/src/menu.tsx',[
 ['MenuAnchor',166,172,'将菜单作用域传给 Popper.Anchor，关联定位锚点并透传引用。'],
 ['MenuContent',244,265,'按开关和强制挂载状态呈现内容，并选择模态或非模态实现，建立菜单项目集合。'],
 ['MenuRootContentModal',275,316,'隐藏外部 ARIA 内容、锁滚动和指针，并在菜单打开时约束焦点。',false],
 ['MenuRootContentNonModal',318,333,'呈现不锁焦点、不锁滚动的菜单内容，并在外部关闭事件中更新开关状态。',false],
 ['MenuContentImpl',382,627,'组合焦点范围、可关闭层、漫游焦点与 Popper，处理前缀搜索、首尾导航、嵌套 Portal 分支和子菜单宽容区。',false],
 ['MenuGroup',637,642,'用 role=group 的 DOM 基元对菜单项分组。'],
 ['MenuLabel',651,656,'提供不参与选择的菜单文字标签并透传 DOM 属性和引用。'],
 ['MenuItem',670,740,'将键盘与指针选择统一为可取消的自定义选择事件，并在未阻止时关闭菜单。'],
 ['MenuItemImpl',750,818,'将项目加入集合和漫游焦点，维护可搜索文本、禁用和高亮状态，并协调鼠标移动聚焦。',false],
 ['MenuCheckboxItem',834,858,'将菜单项目组合为支持混合状态的复选项，选择时更新 checked 状态并共享指示器信息。'],
 ['MenuRadioGroup',877,887,'通过上下文提供菜单单选值与稳定变更回调，并渲染语义分组。'],
 ['MenuRadioItem',900,922,'将选项值与组值比较，暴露 aria-checked 并在选择时通知单选组。'],
 ['MenuItemIndicator',947,971,'依据复选或单选状态挂载指示器，支持混合状态与强制挂载动画。'],
 ['MenuSeparator',980,992,'渲染带水平方向语义的菜单分隔线。'],
 ['MenuArrow',1002,1008,'通过共享定位作用域呈现 Popper 菜单箭头。'],
 ['MenuSubTrigger',1077,1209,'处理子菜单延迟展开、方向键打开与鼠标宽容多边形，避免指针前往子菜单时误关闭。'],
 ['MenuSubContent',1237,1296,'按书写方向定位子菜单，管理键盘打开聚焦、Escape 及返回父菜单的方向键行为。']
]);
extras(rp+'menubar/src/menubar.tsx',[
 ['Menubar',68,136,'用受控状态保存激活菜单值，并结合集合和横向漫游焦点维护当前 Tab 停靠点。'],
 ['MenubarTrigger',211,281,'注册菜单触发器并处理点击、悬停切换和键盘开关，保持 ARIA 关联及高亮状态。'],
 ['MenubarContent',306,393,'组合基础菜单内容，按左右方向键跨菜单导航，并根据关闭来源决定是否还原触发器焦点。'],
 ['MenubarGroup',403,409,'携带菜单作用域复用基础 Menu.Group 的分组语义。'],
 ['MenubarLabel',419,425,'携带菜单作用域复用基础菜单标签。'],
 ['MenubarItem',435,441,'携带菜单作用域复用基础菜单选择项目。'],
 ['MenubarCheckboxItem',451,461,'复用基础复选菜单项，并桥接菜单栏的作用域与引用。'],
 ['MenubarRadioGroup',471,481,'复用基础菜单单选组，保留消费者属性与引用。'],
 ['MenubarRadioItem',491,501,'复用基础菜单单选项目并传递菜单栏作用域。'],
 ['MenubarItemIndicator',511,518,'复用基础菜单选中状态指示器。'],
 ['MenubarSeparator',528,538,'复用基础菜单分隔线并透传作用域。'],
 ['MenubarArrow',548,554,'复用基础菜单定位箭头。'],
 ['MenubarSubTrigger',594,611,'标记菜单栏子菜单触发器，供内容方向键处理区分跨菜单与子菜单打开行为。'],
 ['MenubarSubContent',621,650,'复用基础子菜单内容，并将定位 CSS 变量转换到菜单栏命名空间。']
]);
extras(rp+'navigation-menu/src/navigation-menu.tsx',[
 ['NavigationMenu',130,262,'维护受控激活项目和自动/手动模式，协调悬停延迟、关闭计时及连续项目切换的跳过延迟。'],
 ['NavigationMenuSub',300,348,'继承激活模式并管理子导航当前值，支持 disableToggle 控制再次点击是否关闭。'],
 ['NavigationMenuList',448,469,'建立导航列表和指示器轨道，根菜单额外使用键盘焦点组。'],
 ['NavigationMenuItem',500,549,'持有项目值、内容和触发器引用，协调内容进入聚焦及退出时的 Tab 顺序恢复。'],
 ['NavigationMenuTrigger',561,659,'注册触发器并处理悬停与点击开关，使用隐藏焦点代理桥接触发器与共享视口内容的 Tab 顺序。'],
 ['NavigationMenuLink',673,713,'渲染可标识当前页的链接，发出可取消选择事件，并在普通选择后请求关闭根内容。'],
 ['NavigationMenuIndicator',730,746,'将激活状态指示器传送到列表轨道，并使用 Presence 支持出入动画。'],
 ['NavigationMenuIndicatorImpl',751,816,'观察激活触发器和轨道尺寸，计算指示器长度及偏移并暴露 CSS 变量。',false],
 ['NavigationMenuContent',836,883,'根据是否存在共享视口决定就地呈现内容或登记到视口，保留开关动画和指针进入离开行为。'],
 ['ViewportContentMounter',896,916,'在布局阶段登记共享视口中的内容及引用，卸载时移除注册项，本身不渲染 DOM。',false],
 ['NavigationMenuContentImpl',939,1080,'组合可关闭层和焦点组，计算切换方向，处理真正离开菜单的焦点、外部点击和内容 Tab 边界。',false],
 ['NavigationMenuViewport',1101,1114,'按菜单开关状态挂载共享视口，支持强制保留以配合动画。'],
 ['NavigationMenuViewportImpl',1121,1193,'呈现注册的活跃内容并测量其真实尺寸，保留上次内容支持关闭动画，兼容 asChild 插槽。',false],
 ['FocusGroup',1230,1243,'建立导航内部可聚焦项目集合并继承书写方向。',false],
 ['FocusGroupItem',1253,1289,'注册焦点项目并处理方向键与 Home/End，按方向和当前项决定下一聚焦候选。',false]
]);
extras(rp+'one-time-password-field/src/one-time-password-field.tsx',[
 ['OneTimePasswordField',215,518,'管理有序字符值与校验规则，将输入、删除、粘贴动作转换为状态和焦点更新，并对接自动提交及表单重置。'],
 ['OneTimePasswordFieldHiddenInput',536,564,'输出汇总字符值的只读隐藏输入，以单一名称参与原生表单提交。'],
 ['OneTimePasswordFieldInput',595,921,'登记单个字符输入，协调校验、输入选择、剪切删除、自动补全和漫游焦点，处理水合前的索引与占位符。']
]);
extras(rp+'password-toggle-field/src/password-toggle-field.tsx',[
 ['PasswordToggleFieldInput',150,231,'根据共享可见状态切换输入类型，记录光标选择并在表单重置或提交时恢复隐藏。'],
 ['PasswordToggleFieldToggle',243,399,'以可访问按钮切换密码显示，水合前暂时移出交互与辅助技术，鼠标操作后恢复输入焦点及选择区。'],
 ['PasswordToggleFieldIcon',450,475,'根据密码可见状态选择 SVG 图标，通过 asChild 透传属性并对辅助技术隐藏装饰图形。']
]);
extras(rp+'popover/src/popover.tsx',[
 ['PopoverAnchor',126,140,'登记自定义定位锚点的存在状态并连接 Popper.Anchor，卸载时恢复默认锚点逻辑。'],
 ['PopoverTrigger',152,180,'为按钮设置动态 ARIA 控制关系和展开状态，若没有自定义锚点则同时作为定位锚点。'],
 ['PopoverContent',235,254,'由 Presence 管理挂载时机，并按 modal 配置选择内容行为。'],
 ['PopoverContentModal',266,335,'锁定滚动和外部指针、隐藏外部 ARIA 内容，并支持嵌套 Portal 分支与右键关闭后的焦点策略。',false],
 ['PopoverContentNonModal',337,393,'允许外部交互并按交互来源恢复焦点，避免点击触发器或 Safari 后续焦点事件导致重复关闭。',false],
 ['PopoverContentImpl',437,526,'组合焦点范围、外部关闭层及 Popper 定位，关联标题描述并登记嵌套浮层焦点分支。',false],
 ['PopoverTitle',536,548,'登记标题存在计数并渲染固定 ID 标题，使内容只在标题实际挂载时引用它。'],
 ['PopoverDescription',558,571,'登记描述存在计数并渲染描述 ID，支持动态 ARIA 描述组合。'],
 ['PopoverClose',582,595,'组合消费者点击回调与关闭动作，保留原生按钮语义。'],
 ['PopoverArrow',605,611,'共享弹出层定位作用域并渲染对应箭头。']
]);
// 已读源码中的实际跨包组合关系，单列依赖边而不篡改正式 importMap。
deps(rp+'id/src/id.tsx',['use-layout-effect']);
deps(rp+'label/src/label.tsx',['primitive']);
deps(rp+'menu/src/menu.tsx',['collection','compose-refs','context','direction','dismissable-layer','focus-guards','focus-scope','id','popper','portal','presence','primitive','roving-focus','slot','use-callback-ref']);
deps(rp+'menubar/src/menubar.tsx',['collection','direction','compose-refs','context','id','menu','roving-focus','primitive','use-controllable-state']);
deps(rp+'navigation-menu/src/navigation-menu.tsx',['context','primitive','use-controllable-state','compose-refs','direction','presence','slot','id','collection','dismissable-layer','use-previous','use-layout-effect','use-callback-ref','visually-hidden']);
deps(rp+'one-time-password-field/src/one-time-password-field.tsx',['primitive','compose-refs','use-controllable-state','collection','roving-focus','use-is-hydrated','context','direction']);
deps(rp+'password-toggle-field/src/password-toggle-field.tsx',['use-controllable-state','primitive','compose-refs','id','use-is-hydrated','use-effect-event','context']);
deps(rp+'popover/src/popover.tsx',['use-layout-effect','compose-refs','context','dismissable-layer','focus-guards','focus-scope','id','popper','portal','presence','primitive','slot','use-controllable-state']);
// 汇总包的公开与内部入口由已读出的显式导出列表确定。
const publicPackages=['accessible-icon','accordion','alert-dialog','aspect-ratio','avatar','checkbox','collapsible','context-menu','dialog','direction','dropdown-menu','form','hover-card','label','menubar','navigation-menu','one-time-password-field','password-toggle-field','popover','portal','progress','radio-group','scroll-area','select','separator','slider','slot','switch','tabs','toast','toggle','toggle-group','toolbar','tooltip','visually-hidden'];
file(rp+'radix-ui/src/index.ts','将独立 React 组件包集中为命名空间导出，提供 radix-ui 总入口，并用 unstable 前缀暴露验证码和密码切换实验组件。',['总入口','命名空间导出','组件聚合']);
deps(rp+'radix-ui/src/index.ts',publicPackages);
file(rp+'radix-ui/src/internal.ts','聚合内部交互原语和共享 Hook，并在 BasePrimitive 上附加 Root 与离散自定义事件派发方法，供组合实现使用。',['内部入口','共享原语','重新导出']);
deps(rp+'radix-ui/src/internal.ts',['primitive','arrow','collection','compose-refs','context','dismissable-layer','focus-guards','focus-scope','menu','popper','presence','roving-focus','use-callback-ref','use-controllable-state','use-effect-event','use-escape-keydown','use-is-hydrated','use-layout-effect','use-size']);
const assignedSubpaths=['label','menubar','navigation-menu','popover','portal','progress','radio-group','scroll-area','select','separator','slider','slot','switch','tabs','toast','toggle-group','toggle','toolbar','tooltip','visually-hidden'];
for(const pkg of assignedSubpaths){
 const p=rp+`radix-ui/src/${pkg}.ts`;
 file(p,`为 radix-ui/${pkg} 子路径转发 @radix-ui/react-${pkg} 的公开导出，使消费者可以直接使用独立组件入口。`,['子路径入口','重新导出','组件聚合']);deps(p,[pkg]);
}
for(const pkg of ['one-time-password-field','password-toggle-field']){
 const p=rp+`radix-ui/src/unstable/${pkg}.ts`;
 file(p,`为 radix-ui/unstable/${pkg} 转发实验性 ${pkg} 包的公开组件和类型。`,['实验接口','子路径入口','重新导出']);deps(p,[pkg]);
}
// 对所有新增依赖验证文件存在；这仅检查人工指定目标，绝不扫描或解析 imports。
for(const s of Object.values(files))for(const e of s.edges||[]){const m=/^file:(.+)$/.exec(e.target);if(m&&!fs.existsSync(m[1]))throw new Error(`依赖路径不存在: ${m[1]}`);}
fs.writeFileSync('.ua/tmp/worker-2-semantics.json',JSON.stringify(data,null,2));
