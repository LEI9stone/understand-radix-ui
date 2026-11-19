// @ts-check
import {fragment,edge} from './worker-3-serialize.mjs';
// 根据各包的实际依赖配置分别描述其发布边界与职责。
fragment(28,{
 'packages/react/avatar/CHANGELOG.md':['记录头像组件 1.3.1 及此前版本的发布变化，支持图片展示行为和依赖升级的版本追溯。',['版本记录','头像','维护文档']],
 'packages/react/avatar/README.md':['提供 react-avatar 包的名称与文档入口。',['包说明','头像','文档入口']],
 'packages/react/avatar/package.json':['配置 Avatar 的源码和双模块发布入口；声明 Context、Primitive、回调稳定化、水合状态与布局效应等内部依赖。',['包配置','头像','水合兼容']],
 'packages/react/avatar/tsconfig.json':['限定头像组件源码的 TypeScript 编译范围，并通过共享配置统一 React 库类型检查。',['编译配置','类型检查','头像']]
},{},[edge('config:packages/react/avatar/package.json','file:packages/react/avatar/src/index.ts','configures'),edge('document:packages/react/avatar/README.md','config:packages/react/avatar/package.json','documents')]);
fragment(34,{
 'packages/react/context/CHANGELOG.md':['记录 Context 包版本及重载类型、参数扩展带来的发布说明，并解释内部 API 对依赖包版本传播的影响。',['版本记录','上下文','内部接口']],
 'packages/react/context/README.md':['标识 react-context 内部工具包并给出文档入口。',['包说明','上下文','文档入口']],
 'packages/react/context/package.json':['定义作用域 Context 工具包的源码入口、ESM 与 CommonJS 类型出口以及 React peer 依赖，供复合组件共享上下文基础能力。',['包配置','上下文','构建发布']],
 'packages/react/context/tsconfig.json':['为上下文工具的 src 目录应用共享 React 库编译设置和独立输出目录。',['编译配置','类型检查','上下文']]
},{},[edge('config:packages/react/context/package.json','file:packages/react/context/src/index.ts','configures'),edge('document:packages/react/context/CHANGELOG.md','config:packages/react/context/package.json','documents')]);
fragment(38,{
 'packages/react/dropdown-menu/CHANGELOG.md':['记录 DropdownMenu 2.2.1 及此前版本的发布历史，用于追溯菜单组件与内部依赖变化。',['版本记录','下拉菜单','维护文档']],
 'packages/react/dropdown-menu/README.md':['标识 react-dropdown-menu 包并提供官方文档入口。',['包说明','下拉菜单','文档入口']],
 'packages/react/dropdown-menu/package.json':['定义下拉菜单的构建和模块出口，运行依赖 Menu、Context、稳定 ID、受控状态与 ref 组合等基础包。',['包配置','下拉菜单','依赖管理']],
 'packages/react/dropdown-menu/tsconfig.json':['约束下拉菜单 src 的编译输入并继承共享 React 库设置，隔离构建产物与依赖目录。',['编译配置','类型检查','下拉菜单']]
},{},[edge('config:packages/react/dropdown-menu/package.json','file:packages/react/dropdown-menu/src/index.ts','configures'),edge('document:packages/react/dropdown-menu/README.md','config:packages/react/dropdown-menu/package.json','documents')]);
fragment(39,{
 'packages/react/focus-guards/CHANGELOG.md':['记录焦点守卫工具 1.2.0 及先前版本的发布更新，支持焦点边界能力的维护追踪。',['版本记录','焦点管理','维护文档']],
 'packages/react/focus-guards/README.md':['提供 react-focus-guards 包的标识和文档入口。',['包说明','焦点守卫','文档入口']],
 'packages/react/focus-guards/package.json':['配置焦点守卫工具的源码和发布出口，仅声明 React peer 依赖，保持该基础交互包的轻量依赖边界。',['包配置','焦点守卫','构建发布']],
 'packages/react/focus-guards/tsconfig.json':['为焦点守卫源码启用共享 React 库类型配置，并指定独立构建输出与排除目录。',['编译配置','类型检查','焦点管理']]
},{},[edge('config:packages/react/focus-guards/package.json','file:packages/react/focus-guards/src/index.ts','configures'),edge('document:packages/react/focus-guards/README.md','config:packages/react/focus-guards/package.json','documents')]);
