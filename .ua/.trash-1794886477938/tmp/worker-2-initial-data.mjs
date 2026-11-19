// @ts-check
import fs from 'node:fs';
const files={},symbols={};
/** 登记人工逐文件阅读得到的摘要和语义关系。 */
function file(p,summary,tags,extra={}){files[p]={summary,tags,...extra};}
/** 登记提取出的重要符号对应的人工解释。 */
function symbol(p,name,summary){symbols[`${p}:${name}`]=summary;}
const cp='packages/react/collection/src/';
file(cp+'collection.test.tsx','验证集合初始化、作用域隔离、稳定读取器、DOM 重排、并发渲染及卸载后的注册表一致性。',['测试','集合','并发渲染']);
file(cp+'collection.tsx','创建按 DOM 文档顺序登记的复合组件集合，区分提交期可同步读取的注册表与驱动渲染的状态快照。通过浅比较、元素引用回调和子节点观察器协调数据更新与排序。',['集合','上下文','文档顺序'],{languageNotes:'工厂函数以泛型保留集合元素和附加数据类型，并返回组件插槽与专用 Hook。',edges:[{target:'class:'+cp+'ordered-dictionary.ts:OrderedDict',type:'depends_on'}]});
file(cp+'ordered-dictionary.test.ts','验证 OrderedDict 的索引插入、相邻访问、负索引、映射过滤、归约和保持顺序的可变及不可变操作。',['测试','有序字典','边界条件']);
file(cp+'ordered-dictionary.ts','在 Map 之上维护独立键序列，提供按索引和相邻位置访问、重排、排序及数组式不可变转换，供组件集合保持稳定顺序。',['有序字典','数据结构','泛型']);
for(const [name,summary] of Object.entries({createCollection:'创建具有独立上下文作用域的集合组件和 Hook，利用提交阶段注册、状态快照及 DOM 变化观察维持有序项目数据。',shallowEqual:'逐键比较项目数据对象，避免引用等价的数据在每次渲染中触发重新登记。',isInDocumentOrder:'比较相邻已登记元素的 DOM 位置，在元素连通时检测集合是否偏离文档顺序。',sortByDocumentPosition:'按条目中真实元素的文档先后关系生成排序比较值。',getChildListObserver:'创建仅对子节点增删记录触发回调的 MutationObserver，以刷新集合顺序。'}))symbol(cp+'collection.tsx',name,summary);
symbol(cp+'ordered-dictionary.ts','OrderedDict','扩展 Map 并同步维护私有键序列，提供索引与相邻访问、位置插入和保留键顺序的数组式操作。');
// 方法结构由提取器仅给出名称；以下位置和解释来自对类实现的逐行阅读。
files[cp+'ordered-dictionary.ts'].extraSymbols=[
 ['insert',30,55,'插入或移动键值到指定位置，支持负索引和越界夹取，重建 Map 迭代顺序。'],
 ['setAfter',96,104,'计算目标键之后的位置并调整已有键移动造成的索引偏移。'],
 ['from',157,166,'按已有键及偏移量获取值，并将越界目标限制到字典边缘。'],
 ['keyFrom',168,177,'按起始键和相对偏移返回目标键，保持边界访问稳定。'],
 ['find',179,191,'按有序条目依次执行谓词并返回首个匹配项。'],
 ['findIndex',193,205,'按有序条目执行谓词并返回首个匹配条目的索引。'],
 ['filter',217,230,'筛选符合谓词的条目并返回保持原始顺序的新 OrderedDict。'],
 ['map',232,243,'保持键和顺序不变，对每个值应用转换并创建新的泛型字典。'],
 ['reduce',272,299,'按字典正向顺序归约条目，处理无初值和空字典错误。'],
 ['reduceRight',328,354,'从末端按索引逆向归约条目，并检测无初值空集合。'],
 ['sort',364,374,'校验比较函数后就地排序条目，并同步 Map 和键序列。'],
 ['every',418,430,'顺序测试所有条目，在首个不匹配结果处终止遍历。'],
 ['some',432,444,'顺序测试条目，在首个匹配结果处提前返回。']
].map(([name,start,end,summary])=>({name:'OrderedDict.'+name,range:[start,end],summary,tags:['类方法','有序字典','集合操作']}));
files[cp+'collection.tsx'].edges.push({target:'file:'+cp+'collection.test.tsx',type:'tested_by'});
files[cp+'ordered-dictionary.ts'].edges=[{target:'file:'+cp+'ordered-dictionary.test.ts',type:'tested_by'}];
const css={
 accordion:'定义横向与纵向折叠面板、禁用和展开状态的示例外观，使用内容宽高变量演示一维及二维展开动画。',
 'alert-dialog':'定义全屏遮罩、居中警告对话框及取消和确认按钮，提供状态属性可视化与截图布局。',
 'aspect-ratio':'用弹性居中和彩色背景展示固定宽高比容器中的内容。',
 avatar:'定义圆形头像裁剪、图像填充及居中回退内容，避免图像溢出和内容选择。',
 checkbox:'以 checked、unchecked 和 indeterminate 属性显示复选框状态，并为指示器提供淡入淡出动画和禁用样式。',
 collapsible:'设置折叠触发器和内容外观，使用内容尺寸变量演示高度及宽度展开与关闭动画。',
 'context-menu':'定义右键触发区、菜单项、标签和子菜单高亮外观，并按定位原点播放缩放旋转动画。',
 dialog:'提供居中对话框、侧边面板和可滚动遮罩布局，并定义内容与遮罩的挂载和卸载动画。',
 'dropdown-menu':'定义下拉菜单高亮与禁用项、选中指示器动画、嵌套对话框和 Chromatic 定位测试网格。',
 form:'通过 data-invalid 与 data-valid 将表单字段分别显示为红色和绿色，突出原生验证状态。',
 'hover-card':'设置悬停卡片与箭头外观，按内容变换原点缩放并演示开关动画和定位截图网格。',
 label:'设置标签和对应控制项的行内对齐、边框、间距及悬停状态，用于观察关联点击区域。',
 menu:'定义基础菜单项、高亮和禁用状态、子菜单及滚动菜单外观，包含内容与指示器出入动画。',
 menubar:'定义菜单栏触发器和弹出菜单样式，区分键盘高亮与展开状态并演示内容和选中项动画。',
 'navigation-menu':'定义横纵导航、共享视口、指示器和嵌套子导航的布局，结合 motion 属性与视口尺寸变量实现方向切换动画。',
 'one-time-password-field':'为分段验证码输入、分隔符和输出区提供布局，通过有效和无效状态改变边框与焦点颜色。',
 'password-toggle-field':'把密码输入和显示切换按钮排成统一字段，使用 :has 和 :focus-visible 展示输入与按钮焦点。',
 popover:'定义弹出层与箭头样式、开关淡入淡出动画和 Chromatic 定位测试网格，使用组件提供的变换原点。',
 popper:'设置大小不同的锚点与浮层，通过定位方向和对齐属性着色，并演示方向相关的旋转入场。',
 presence:'定义单个及多个挂载卸载动画，以不同持续时间验证 Presence 对动画生命周期的等待。'
};
for(const [name,summary] of Object.entries(css))file(`apps/storybook/stories/${name}.stories.module.css`,summary,['样式','示例展示','状态可视化']);
const domains={
 announce:['实时播报','0.3.0'], 'focus-scope':['焦点范围','1.3.1'], 'hover-card':['悬停卡片','1.2.1'], menu:['基础菜单','2.2.1'], menubar:['菜单栏','1.2.1'], 'one-time-password-field':['分段验证码输入','0.2.1'], primitive:['多态 DOM 基元','2.2.0'], slider:['滑块','1.6.1'], switch:['开关','1.4.1'], 'use-controllable-state':['受控与非受控状态 Hook','1.3.0'], 'visually-hidden':['视觉隐藏内容','1.2.13']
};
// 同构的包文档仍以各自提取出的版本、章节和包职责生成独立说明。
for(const [name,[domain,version]] of Object.entries(domains)){
 const p=`packages/react/${name}/`;
 file(p+'CHANGELOG.md',`按版本记录${domain}包的发布变更与依赖更新，最新章节为 ${version}。`,['文档','发布历史',domain]);
 file(p+'README.md',name==='one-time-password-field'?'介绍分段验证码输入包，包含安装与使用章节。':`标识 ${name} 包并提供进一步文档入口，作为${domain}模块的简短说明。`,['文档','包入口',domain]);
 file(p+'package.json',`定义 @radix-ui/react-${name} 的源入口、发布导出、构建脚本和 React 对等依赖，配置${domain}包的工作区依赖与发布边界。`,['配置','包发布',domain],{edges:[{target:`document:${p}README.md`,type:'related'}]});
 file(p+'tsconfig.json',`配置${domain}包的 TypeScript 继承关系、编译选项及源码包含和排除范围。`,['配置','类型检查',domain],{edges:[{target:`config:${p}package.json`,type:'related'}]});
 files[p+'README.md'].edges=[{target:`config:${p}package.json`,type:'documents'}];
 files[p+'CHANGELOG.md'].edges=[{target:`config:${p}package.json`,type:'documents'}];
}
fs.writeFileSync('.ua/tmp/worker-2-semantics.json',JSON.stringify({files,symbols},null,2));
