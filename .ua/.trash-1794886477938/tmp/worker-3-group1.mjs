// @ts-check
import {fragment,edge,component} from './worker-3-serialize.mjs';
const scroll='packages/react/scroll-area/src/scroll-area.tsx';
const machine='packages/react/scroll-area/src/use-state-machine.ts';
// 基于已读取实现记录滚动区域、状态机与几何辅助函数的职责。
fragment(9,{
 'packages/react/scroll-area/src/scroll-area.test.tsx':['验证滚动区域各部件的属性与 ref 透传、asChild 组合、显式内容容器以及滚动条角落尺寸回归。测试通过模拟布局尺寸覆盖 jsdom 无真实布局的情形。',['测试','滚动区域','引用稳定性']],
 [scroll]:['实现可组合的自定义滚动区域，连接原生视口、内容测量、横纵滚动条、滑块和角落。按悬停、滚动、溢出或常显策略控制可见性，并处理 RTL、拖拽、滚轮和尺寸变化。',['组件','滚动区域','状态机','尺寸观察']],
 [machine]:['通过带状态与事件约束的 reducer 实现局部有限状态机，供滚动条可见性策略派发事件并选择下一状态。',['状态机','泛型','状态管理']]
},{
 [`${scroll}:getScrollPositionFromPointer`]:['将拖拽指针在滚动轨道上的位置映射为视口滚动距离，扣除轨道内边距和滑块抓取偏移，并调整 RTL 方向。',['几何计算','拖拽','方向支持']],
 [`${scroll}:getThumbOffsetFromScroll`]:['将视口滚动距离限制在合法范围，再映射为滑块在轨道上的位移，避免弹性滚动造成滑块越界。',['几何计算','滑块','边界处理']],
 [`${scroll}:addUnlinkedScrollListener`]:['用 requestAnimationFrame 比较前后滚动位置，仅在变化时通知滑块位置更新，并返回取消循环的清理函数。',['动画帧','滚动监听','清理机制']],
 [`${scroll}:useResizeObserver`]:['观察元素尺寸变化，将 ResizeObserver 通知合并到动画帧中执行，清理时取消帧任务并停止观察。',['尺寸观察','生命周期','动画帧']],
 [`${machine}:useStateMachine`]:['用 React.useReducer 根据当前状态查找事件转移，未定义转移时保留原状态，并返回状态及类型约束的派发函数。',['状态机','自定义钩子','泛型']]
},[
 ...component(scroll,'ScrollArea',89,147,'保存视口、内容和双轴滚动条引用及角落尺寸，在作用域 Context 中共享，并向根 DOM 暴露方向和角落 CSS 变量。'),
 ...component(scroll,'ScrollAreaViewport',170,264,'隐藏原生滚动条并按可用滚动轴设置 overflow；通过 Slottable 保持 asChild 的目标元素，同时兼容显式与隐式内容容器。'),
 ...component(scroll,'ScrollAreaContent',290,313,'渲染可测量内容容器并注册内容引用，以 display:table 让内容尺寸随子节点增长。'),
 ...component(scroll,'ScrollAreaScrollbar',326,354,'注册横轴或纵轴滚动能力，并按根组件的可见性策略选择悬停、滚动、溢出或常显实现。'),
 ...component(scroll,'ScrollAreaScrollbarScroll',411,479,'通过 hidden、scrolling、idle 和 interacting 状态处理滚动条显示时机，结合滚动结束防抖与延迟隐藏。',false),
 ...component(scroll,'ScrollAreaScrollbarImpl',772,871,'统一滚轮监听、指针捕获、轨道拖动与内容尺寸观察，并提供滑块上下文。',false),
 ...component(scroll,'ScrollAreaThumb',888,902,'依据滚动条上下文中的溢出比例决定是否挂载滑块，并支持 forceMount 交给动画库控制。'),
 ...component(scroll,'ScrollAreaCorner',982,993,'仅在双轴滚动条同时存在且非滚动显示策略时呈现角落填充区域。'),
 edge(`file:${scroll}`,`file:${machine}`),
 edge(`file:${scroll}`,'file:packages/core/number/src/number.ts'),
 edge(`file:${scroll}`,'file:packages/react/primitive/src/primitive.tsx'),
 edge(`file:${scroll}`,'file:packages/react/presence/src/presence.tsx'),
 edge(`file:${scroll}`,'file:packages/react/slot/src/slot.tsx'),
 edge(`file:${scroll}`,'file:packages/react/context/src/create-context.tsx'),
 edge(`file:${scroll}`,'file:packages/react/compose-refs/src/compose-refs.tsx'),
 edge(`file:${scroll}`,'file:packages/react/direction/src/direction.tsx'),
 edge(`file:${scroll}`,'file:packages/react/use-layout-effect/src/use-layout-effect.tsx'),
 edge(`file:${scroll}`,`file:packages/react/scroll-area/src/scroll-area.test.tsx`,'tested_by')
]);
// 根目录文件分别承担工程约束、项目说明与发布流程，不按文件类型套用统一摘要。
fragment(13,{
 '.oxfmtrc.json':['配置 oxfmt 的行宽、单引号、package.json 排序与忽略范围，统一仓库格式化结果。',['格式化','工程配置','代码风格']],
 '.oxlintrc.json':['配置 oxlint 的插件、运行环境、规则集和路径覆盖，集中管理 React 与 TypeScript 代码检查。',['静态检查','工程配置','质量约束']],
 'AGENTS.md':['说明 pnpm monorepo 架构、开发命令、新包结构、测试偏好和 PR 检查事项，为仓库协作提供约定。',['协作规范','开发指南','质量检查']],
 'CODE_OF_CONDUCT.md':['定义社区贡献者的行为标准、维护者责任、适用范围和违规处理方式。',['社区治理','行为准则','贡献规范']],
 'README.md':['介绍 Radix Primitives 的低层可访问组件定位，以及安装、文档、发布、贡献和社区入口。',['项目概览','入门指南','可访问性']],
 'context7.json':['配置项目的 Context7 文档来源 URL 与公开标识，供外部文档索引关联本仓库。',['文档索引','工程配置','外部集成']],
 'package.json':['定义 primitives 私有工作区根包及构建、测试、Storybook、版本发布和格式化脚本，并统一开发依赖与 pnpm 版本。',['工作区','构建系统','测试配置']],
 'philosophy.md':['阐述可访问、可组合、可定制的组件设计原则，以及 DOM 一对一映射、受控状态、国际化和 data-state 约定。',['设计原则','组合模式','可访问性']],
 'pnpm-workspace.yaml':['登记 apps、internal 与组件包工作区，限制可执行构建依赖，统一 React 版本并应用 changesets 补丁。',['工作区','依赖管理','发布补丁']],
 'release-process.md':['说明 changesets 驱动的版本追踪、稳定版和候选版发布，以及文档版本页维护流程。',['发布流程','版本管理','文档维护']]
},{},[
 edge('document:AGENTS.md','config:package.json','documents'),edge('document:release-process.md','config:package.json','documents'),edge('document:README.md','document:philosophy.md','related'),edge('config:pnpm-workspace.yaml','config:package.json','configures'),edge('config:.oxfmtrc.json','config:package.json','configures'),edge('config:.oxlintrc.json','config:package.json','configures')
]);
fragment(19,{
 'packages/core/number/CHANGELOG.md':['记录 @radix-ui/number 的版本历史，便于追踪基础数值工具的发布变化。',['版本记录','数值工具','维护文档']],
 'packages/core/number/README.md':['标识 number 工具包并提供组件库文档入口。',['包说明','数值工具','文档入口']],
 'packages/core/number/package.json':['配置 @radix-ui/number 的源码入口、双模块发布产物、类型声明和 radix-build 构建命令，声明无副作用。',['包配置','数值工具','构建发布']],
 'packages/core/number/tsconfig.json':['定义 number 包的 TypeScript 编译范围、输出目录和共享配置继承。',['类型检查','编译配置','数值工具']]
});
fragment(22,{
 'packages/react/accessible-icon/CHANGELOG.md':['记录 AccessibleIcon 包的历次版本发布和依赖更新，支持无障碍图标能力的版本追溯。',['版本记录','可访问性','图标']],
 'packages/react/accessible-icon/README.md':['标识 react-accessible-icon 包并链接其官方使用文档。',['包说明','图标','文档入口']],
 'packages/react/accessible-icon/package.json':['定义 AccessibleIcon 的源码与发布入口、React 兼容范围和构建命令，运行时依赖 visually-hidden 提供读屏标签。',['包配置','可访问性','依赖管理']],
 'packages/react/accessible-icon/tsconfig.json':['继承共享 React 库编译配置，检查 src 目录并把 dist 与 node_modules 排除在编译输入之外。',['类型检查','编译配置','React']]
});
