// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
const packages=[
 [57,'radix-ui',[
 ['CHANGELOG.md','汇总 radix-ui 组件集合的版本演进，按组件记录浮层嵌套、Slot、表单冒泡、集合顺序、水合和可访问性等修复及新增 API。',['发布记录','组件聚合','兼容性']],
 ['README.md','介绍 Radix Primitives 可访问、可定制的底层组件定位，列出文档、发布、社区和许可证入口。',['项目介绍','组件聚合','文档入口']],
 ['package.json','定义 radix-ui 聚合包与子路径导出，汇集公共组件、内部交互工具和共享 Hook 的 workspace 依赖，并配置 ESM/CJS 类型发布。',['包清单','统一入口','工作区聚合']],
 ['tsconfig.json','为 radix-ui 的聚合导出源码启用共享 React 库类型配置，输出至 dist。',['类型配置','统一入口','构建配置']]
 ]],
 [58,'roving-focus',[
 ['CHANGELOG.md','记录 RovingFocusGroup 在 FocusScope 中挂载自动聚焦的修复、render props 支持、类型回归与 RSC/tree-shaking 兼容调整。',['变更记录','游走焦点','键盘导航']],
 ['README.md','声明 roving-focus 为内部焦点导航工具，不面向公开使用。',['包文档','游走焦点','内部接口']],
 ['package.json','声明游走焦点组对 Collection、Direction、ID、可控状态、水合和布局 Hook 的依赖，并配置 React peer 与双模块发布。',['包清单','游走焦点','交互依赖']],
 ['tsconfig.json','为 RovingFocus 的源码继承共享 React 库类型规则并指定 dist 产物目录。',['类型配置','游走焦点','构建配置']]
 ]],
 [70,'tooltip',[
 ['CHANGELOG.md','记录 Tooltip 的模态 Popover 内 Tab 焦点修复、多 aria-describedby 支持、重复挂载修复及跳过延迟时长与事件目标兼容调整。',['变更记录','工具提示','焦点管理']],
 ['README.md','链接 Tooltip 官方组件文档，提供工具提示的使用说明入口。',['组件文档','工具提示','文档入口']],
 ['package.json','配置 Tooltip 的发布入口，并声明 Popper、Portal、DismissableLayer、FocusScope、Presence、VisuallyHidden 与可控状态等交互依赖。',['包清单','工具提示','浮层依赖']],
 ['tsconfig.json','为 Tooltip 组件指定共享 React 库编译配置，包含 src 并排除构建产物。',['类型配置','工具提示','构建配置']]
 ]],
 [79,'use-size',[
 ['CHANGELOG.md','记录 use-size 将 ResizeObserver 回调放入 requestAnimationFrame 以避免重负载下的观察循环告警，以及 RSC 兼容回退。',['变更记录','尺寸观察','性能修复']],
 ['README.md','声明 use-size 为内部尺寸观察 Hook，不面向公开使用。',['包文档','尺寸观察','内部接口']],
 ['package.json','声明 use-size 仅依赖共享 use-layout-effect，配置 React peer 兼容范围与 ESM/CJS 类型发布入口。',['包清单','尺寸观察','共享Hook']],
 ['tsconfig.json','将 use-size 的 src 纳入共享 React 库类型检查，并将 dist 与依赖目录排除。',['类型配置','尺寸观察','构建配置']]
 ]]
];
// 只序列化已人工确定的逐文件语义和文档/共享配置关系。
for(const [i,name,entries] of packages){
 const base=`packages/react/${name}`,s={};
 for(const [file,summary,tags] of entries) s[`${base}/${file}`]={summary,tags};
 saveBatch(i,s,[relation(`document:${base}/README.md`,`config:${base}/package.json`,'documents'),relation(`document:${base}/CHANGELOG.md`,`config:${base}/package.json`,'documents'),relation(`config:${base}/tsconfig.json`,'config:internal/typescript-config/react-library.json')]);
}
