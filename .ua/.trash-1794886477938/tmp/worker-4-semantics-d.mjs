// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
/** 为逐项阅读后的包文档和配置生成文件节点，避免重复序列化四文件结构。 */
export function savePackage(index,base,entries){
 const semantics={};
 for(const [file,summary,tags] of entries) semantics[`${base}/${file}`]={summary,tags};
 saveBatch(index,semantics,[relation(`document:${base}/README.md`,`config:${base}/package.json`,'documents'),relation(`document:${base}/CHANGELOG.md`,`config:${base}/package.json`,'documents'),relation(`config:${base}/tsconfig.json`,'config:internal/typescript-config/react-library.json')]);
}
savePackage(20,'packages/core/primitive',[
 ['CHANGELOG.md','记录核心 primitive 的 DOM 工具补充、事件参数兼容、开发警告条件导出及 exactOptionalPropertyTypes 类型适配。',['变更记录','事件组合','核心工具']],
 ['README.md','声明 primitive 是内部工具包，不面向公开使用。',['包文档','核心工具','内部接口']],
 ['package.json','配置 @radix-ui/primitive 的源码入口和 ESM/CJS 发布入口、radix-build 与 aria-hidden 基准测试，声明 env-check 工作区依赖。',['包清单','核心工具','发布配置']],
 ['tsconfig.json','将核心 DOM/事件工具纳入共享 React 库类型配置，输出至 dist 并排除构建产物与依赖目录。',['类型配置','核心工具','构建配置']]
]);
savePackage(24,'packages/react/alert-dialog',[
 ['CHANGELOG.md','记录 AlertDialog 的 Dialog 依赖升级、RSC 兼容回退、tree-shaking 改善、开发警告调整及可选类型兼容。',['变更记录','警告对话框','兼容性']],
 ['README.md','链接 AlertDialog 官方组件文档，作为警告确认对话框的使用说明入口。',['组件文档','警告对话框','文档入口']],
 ['package.json','声明 AlertDialog 的双模块发布与 React peer 范围，依赖 Dialog、Context、ComposeRefs、Primitive 和事件工具构建确认式对话框。',['包清单','警告对话框','依赖配置']],
 ['tsconfig.json','为 AlertDialog 源码继承统一 React 库类型检查并指定 dist 输出，隔离依赖与产物。',['类型配置','警告对话框','构建配置']]
]);
savePackage(26,'packages/react/arrow',[
 ['CHANGELOG.md','记录 Arrow 对 React Primitive 的依赖更新、RSC 回退、tree-shaking 与 ComponentRef 类型迁移。',['变更记录','浮层箭头','兼容性']],
 ['README.md','标明 React Arrow 为内部工具而非公开使用组件。',['包文档','浮层箭头','内部接口']],
 ['package.json','配置仅依赖 React Primitive 的内部 Arrow 包，提供 ESM/CJS 与声明发布入口、无副作用标记及统一构建命令。',['包清单','浮层箭头','发布配置']],
 ['tsconfig.json','为 Arrow SVG 组件启用共享 React 库编译约定，并将源码检查与 dist 产物隔离。',['类型配置','浮层箭头','构建配置']]
]);
savePackage(27,'packages/react/aspect-ratio',[
 ['CHANGELOG.md','记录 AspectRatio 的可选类型兼容改动、React Primitive 升级、RSC 回退和 tree-shaking 改善。',['变更记录','宽高比','兼容性']],
 ['README.md','链接 AspectRatio 官方文档，提供固定宽高比容器组件的使用入口。',['组件文档','宽高比','文档入口']],
 ['package.json','声明 AspectRatio 对 React Primitive 的依赖、React peer 兼容范围及 ESM/CJS 类型发布入口，使用统一 radix-build。',['包清单','宽高比','发布配置']],
 ['tsconfig.json','将 AspectRatio 的源码纳入共享 React 库类型检查，并配置 dist 输出与排除目录。',['类型配置','宽高比','构建配置']]
]);
