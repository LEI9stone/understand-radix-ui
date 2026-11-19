// @ts-check
import {file,symbols,edges,save} from './worker-1-serialize.mjs';
// SSR 页面说明由实际组合部件逐项记录，避免将演示误作组件实现。
const pages={
'one-time-password-field':'展示六位验证码输入的自动排序与显式 index 两种组合，并包含隐藏输入以验证服务端初始输出。',
'password-toggle-field':'展示文字和眼睛图标两种密码显隐切换按钮，覆盖 PasswordToggleField 各部件的服务端输出。',
'popover':'组合弹出层触发器、Portal、内容、关闭按钮与箭头，验证基础服务端渲染。',
'progress':'渲染 value 为 20 的进度根节点与指示器，用于检查进度语义的服务端输出。',
'radio-group':'在标签中组合三个宠物单选项与选中指示器，验证默认选中项及标签关联。',
'roving-focus-group':'排列横向、纵向、双向、循环与嵌套按钮组，配合客户端方向切换验证焦点漫游示例。',
'rsc':'作为有意保留的 Server Component，在模块作用域创建 Slot 工厂并渲染 Primitive 组件，以拦截导入阶段的 RSC 回归。',
'scroll-area':'以超宽重复内容组合双向滚动条、Thumb、Viewport 和 Corner，验证滚动区域服务端布局。',
'select':'分别在普通容器和表单中组合 Select 内容、选项、选中指示和滚动按钮，验证默认值与占位展示。',
'separator':'渲染包含内容的 Separator 根节点，验证分隔线的服务端宿主元素。',
'slider':'渲染初值为 20 和 50 的双滑块滑动条，组合 Track、Range 与两个 Thumb 以检查区间布局。',
'switch':'组合 Switch 根节点与 Thumb，验证开关初始状态的服务端输出。',
'tabs':'展示默认选中 one 的纵向选项卡，组合三个触发器及对应面板验证初始可见内容。',
'toast':'组合通知 Provider、Root、标题、描述、操作、关闭按钮和 Viewport，验证通知部件的服务端兼容。',
'toggle-group':'展示默认选中第一项的单选 ToggleGroup，验证两个切换项的初始按压语义。',
'toolbar':'展示纵向工具栏的按钮、分隔线与链接部件，用于验证方向和角色在服务端的输出。',
'tooltip':'组合 Tooltip 提供器、触发器、Portal、内容及箭头，验证悬停和焦点提示的服务端结构。',
'visually-hidden':'渲染视觉隐藏内容的演示，验证该内容仍存在于服务端文档结构。'};
for(const [name,summary] of Object.entries(pages)){const p=`apps/ssr-testing/app/${name}/page.tsx`;file(p,summary,['服务端验证','演示页面',name]);symbols(p,{Page:summary});}
file('apps/ssr-testing/app/page.tsx','测试应用空首页，仅输出空 Fragment，为各组件独立路由提供根入口。',['服务端验证','路由入口','Next.js']);symbols('apps/ssr-testing/app/page.tsx',{Page:'返回空 Fragment，保持测试应用首页不引入组件行为。'});
symbols('apps/ssr-testing/app/password-toggle-field/page.tsx',{Page:pages['password-toggle-field'],EyeClosedIcon:'绘制闭眼图标，用作密码隐藏状态的自定义图形。',EyeOpenIcon:'绘制睁眼图标，用作密码可见状态的自定义图形。'});
symbols('apps/ssr-testing/app/scroll-area/page.tsx',{Page:pages['scroll-area'],LongContent:'提供段落与列表形式的长内容，制造横纵溢出以演示滚动行为。'});
const p='apps/ssr-testing/app/roving-focus-group/roving-focus.client.tsx';
file(p,'为焦点漫游示例维护文字方向和按钮组选中状态，将普通按钮组合为 RovingFocus 项并让聚焦联动选择。',['客户端演示','焦点漫游','方向切换']);
symbols(p,{RovingFocusProvider:'在上下文中保存 ltr/rtl 方向并更新包裹容器的 dir。',RovingFocusToggle:'提供切换 ltr/rtl 的按钮，驱动所有示例的方向变化。',ButtonGroup:'保存按钮组当前值，并以共享方向、方向轴和循环选项创建 RovingFocus 根。',Button:'将普通按钮包裹为焦点漫游项，以选中状态标记 active，并在有选中值时让焦点触发选择。'});
file('apps/ssr-testing/next.config.js','允许 Next.js 访问工作区外目录，并在该服务端验证应用构建时忽略 TypeScript 错误。',['应用配置','Next.js','工作区']);
file('apps/storybook/.storybook/main.ts','配置 Storybook 的 MDX 与组件故事发现、React Webpack5、实验 RSC 和严格模式，并用 SWC 自动 JSX 运行时构建。',['Storybook','构建配置','组件文档']);
file('apps/storybook/.storybook/manager.ts','为 Storybook 管理界面采用浅色主题并禁用全局快捷键，避免影响交互示例。',['Storybook','界面配置','快捷键']);
file('apps/storybook/.storybook/manager-head.html','为 Storybook 管理页添加 PNG 与 SVG 站点图标声明。',['Storybook','页面头部','图标']);
file('apps/storybook/.storybook/preview.css','导入 Radix 明暗色板，统一盒模型、hidden 行为与系统字体，为组件演示提供基础样式。',['Storybook','样式','颜色']);
// 这些示例直接组合已读实现，为图谱保留验证应用到组件实现的关系。
const relations=['select','separator','slider','switch','tabs','toast','toggle-group','toolbar','tooltip'].map(pkg=>[`file:apps/ssr-testing/app/${pkg}/page.tsx`,`file:packages/react/${pkg}/src/${pkg}.tsx`,'depends_on']);
relations.push(['file:apps/ssr-testing/app/roving-focus-group/roving-focus.client.tsx','file:packages/react/roving-focus/src/roving-focus-group.tsx','depends_on']);
relations.push(['file:apps/ssr-testing/app/rsc/page.tsx','file:packages/react/slot/src/slot.tsx','depends_on']);
relations.push(['file:apps/ssr-testing/app/scroll-area/page.tsx','file:packages/react/scroll-area/src/scroll-area.tsx','depends_on']);
edges(82,relations);
save([82]);
