// @ts-check
import {fragment,edge} from './worker-3-serialize.mjs';
// 表单、标识、Portal 和 Slot 的配置与文档语义由各自清单及提取结果确定。
fragment(41,{
 'packages/react/form/CHANGELOG.md':['记录表单包 0.3.0 及先前版本变更，并说明内部 Context 更新与公共 API 版本规则的关系。',['版本记录','表单','内部接口']],
 'packages/react/form/README.md':['标识 react-form 包并提供其组件文档入口。',['包说明','表单','文档入口']],
 'packages/react/form/package.json':['为表单组件配置源码、双模块出口与 React 兼容范围，声明 Label、稳定 ID、Context 和 Primitive 等组成依赖。',['包配置','表单','依赖管理']],
 'packages/react/form/tsconfig.json':['为表单组件源码设置共享 React 类型检查、输出位置和构建目录排除规则。',['编译配置','表单','类型检查']]
},{},[edge('config:packages/react/form/package.json','file:packages/react/form/src/index.ts','configures'),edge('document:packages/react/form/CHANGELOG.md','config:packages/react/form/package.json','documents')]);
fragment(43,{
 'packages/react/id/CHANGELOG.md':['记录稳定 ID 工具 1.1.4、1.1.3 与 1.1.2 的发布条目，帮助定位标识生成能力的版本变化。',['版本记录','标识生成','维护文档']],
 'packages/react/id/README.md':['提供 react-id 包的标识和文档入口。',['包说明','标识生成','文档入口']],
 'packages/react/id/package.json':['定义稳定 ID 工具的构建及双模块类型入口，声明 React peer 范围与 use-layout-effect 运行依赖。',['包配置','标识生成','服务端兼容']],
 'packages/react/id/tsconfig.json':['为 ID Hook 源码继承共享 React 库配置，限定 src 输入与 dist 输出。',['编译配置','标识生成','类型检查']]
},{},[edge('config:packages/react/id/package.json','file:packages/react/id/src/index.ts','configures'),edge('document:packages/react/id/README.md','config:packages/react/id/package.json','documents')]);
fragment(52,{
 'packages/react/portal/CHANGELOG.md':['维护 Portal 包 1.2.0 及 1.1 系列的发布记录，支持传送节点能力与依赖变化的追溯。',['版本记录','传送节点','维护文档']],
 'packages/react/portal/README.md':['标识 react-portal 包并给出其官方文档入口。',['包说明','传送节点','文档入口']],
 'packages/react/portal/package.json':['配置 Portal 的源码与模块出口、React 和 ReactDOM peer 兼容范围，声明 Primitive 与安全布局效应依赖。',['包配置','传送节点','依赖管理']],
 'packages/react/portal/tsconfig.json':['将 Portal 源码纳入共享 React 库编译设置，并排除 node_modules 和 dist 避免重复检查。',['编译配置','传送节点','类型检查']]
},{},[edge('config:packages/react/portal/package.json','file:packages/react/portal/src/index.ts','configures'),edge('document:packages/react/portal/README.md','config:packages/react/portal/package.json','documents')]);
fragment(63,{
 'packages/react/slot/CHANGELOG.md':['记录 Slot 的版本历史，包括 SlotProps 与 createSlot 泛型能力的扩展，帮助评估组合 API 的兼容性。',['版本记录','插槽组合','泛型']],
 'packages/react/slot/README.md':['提供 react-slot 包标识与文档入口，定位组件属性转交的组合基础包。',['包说明','插槽组合','文档入口']],
 'packages/react/slot/package.json':['为 Slot 包定义源码、ESM/CommonJS 类型出口和 React peer 范围，运行依赖 compose-refs 保持组合引用行为。',['包配置','插槽组合','引用组合']],
 'packages/react/slot/tsconfig.json':['对 Slot 源码应用共享 React 库类型设置，限定输入范围和独立输出目录。',['编译配置','插槽组合','类型检查']]
},{},[edge('config:packages/react/slot/package.json','file:packages/react/slot/src/index.ts','configures'),edge('document:packages/react/slot/CHANGELOG.md','config:packages/react/slot/package.json','documents')]);
