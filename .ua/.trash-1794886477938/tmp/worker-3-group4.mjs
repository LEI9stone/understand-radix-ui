// @ts-check
import {fragment,edge} from './worker-3-serialize.mjs';
// 依据各包清单描述键盘导航、通知及服务端兼容方面的依赖边界。
fragment(65,{
 'packages/react/tabs/CHANGELOG.md':['记录 Tabs 1.2.1 及此前版本的发布条目，供标签页组件升级时追溯兼容变化。',['版本记录','标签页','维护文档']],
 'packages/react/tabs/README.md':['提供 react-tabs 包标识及官方标签页文档入口。',['包说明','标签页','文档入口']],
 'packages/react/tabs/package.json':['配置标签页组件的源码与发布入口，组合 roving-focus、Direction、Presence、稳定 ID 和受控状态等基础能力。',['包配置','标签页','键盘导航']],
 'packages/react/tabs/tsconfig.json':['为标签页源码设置共享 React 编译规范、类型输入与独立 dist 输出。',['编译配置','标签页','类型检查']]
},{},[edge('config:packages/react/tabs/package.json','file:packages/react/tabs/src/index.ts','configures'),edge('document:packages/react/tabs/README.md','config:packages/react/tabs/package.json','documents')]);
fragment(66,{
 'packages/react/toast/CHANGELOG.md':['记录 Toast 1.3.1 及历史版本的发布变化，其中专门列出可访问性修复和其他更新。',['版本记录','通知','可访问性']],
 'packages/react/toast/README.md':['标识 react-toast 包并提供通知组件文档入口。',['包说明','通知','文档入口']],
 'packages/react/toast/package.json':['定义通知组件的模块与类型出口，声明集合管理、DismissableLayer、Portal、Presence 和 VisuallyHidden 等支撑依赖。',['包配置','通知','交互基础']],
 'packages/react/toast/tsconfig.json':['将 Toast 源码纳入共享 React 库检查设置，并避免对依赖和构建产物重复编译。',['编译配置','通知','类型检查']]
},{},[edge('config:packages/react/toast/package.json','file:packages/react/toast/src/index.ts','configures'),edge('document:packages/react/toast/CHANGELOG.md','config:packages/react/toast/package.json','documents')]);
fragment(69,{
 'packages/react/toolbar/CHANGELOG.md':['维护工具栏组件 1.2.1 及 1.1 系列发布历史，帮助判断组件与内部依赖升级影响。',['版本记录','工具栏','维护文档']],
 'packages/react/toolbar/README.md':['提供 react-toolbar 包的标识及使用文档入口。',['包说明','工具栏','文档入口']],
 'packages/react/toolbar/package.json':['配置工具栏包的发布出口与 React peer 范围，组合 roving-focus、Separator、ToggleGroup 和方向支持。',['包配置','工具栏','键盘导航']],
 'packages/react/toolbar/tsconfig.json':['为工具栏源码继承共享 React 库编译设置，指定 dist 输出并限制 src 输入。',['编译配置','工具栏','类型检查']]
},{},[edge('config:packages/react/toolbar/package.json','file:packages/react/toolbar/src/index.ts','configures'),edge('document:packages/react/toolbar/README.md','config:packages/react/toolbar/package.json','documents')]);
fragment(76,{
 'packages/react/use-layout-effect/CHANGELOG.md':['记录安全布局效应工具 1.1.4、1.1.3 和 1.1.2 的版本条目。',['版本记录','布局效应','维护文档']],
 'packages/react/use-layout-effect/README.md':['标识 react-use-layout-effect 工具包并提供文档入口。',['包说明','布局效应','文档入口']],
 'packages/react/use-layout-effect/package.json':['定义安全布局效应 Hook 的源码与双模块产物，仅依赖 React peer，供其他组件在服务端和浏览器共享使用。',['包配置','布局效应','服务端兼容']],
 'packages/react/use-layout-effect/tsconfig.json':['为安全布局效应源码应用共享 React 库类型配置与独立输出目录。',['编译配置','布局效应','类型检查']]
},{},[edge('config:packages/react/use-layout-effect/package.json','file:packages/react/use-layout-effect/src/use-layout-effect.tsx','configures'),edge('document:packages/react/use-layout-effect/README.md','config:packages/react/use-layout-effect/package.json','documents')]);
