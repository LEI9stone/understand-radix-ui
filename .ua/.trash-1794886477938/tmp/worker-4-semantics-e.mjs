// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
const packages=[
 [30,'collapsible',[
 ['CHANGELOG.md','记录 Collapsible 的回调参数类型回归修复、可选类型兼容、内容卸载后的 aria-controls 修复及 RSC/tree-shaking 调整。',['变更记录','折叠内容','可访问性']],
 ['README.md','将 Collapsible 使用者引导至官方折叠容器组件文档。',['组件文档','折叠内容','文档入口']],
 ['package.json','配置 Collapsible 的双模块发布，声明 Context、Presence、可控状态、ID 与布局效应依赖，支持状态与动画驱动的折叠内容。',['包清单','折叠内容','依赖配置']],
 ['tsconfig.json','为 Collapsible 的 src 启用共享 React 库编译配置，并将输出设为 dist。',['类型配置','折叠内容','构建配置']]
 ]],
 [31,'collection',[
 ['CHANGELOG.md','记录 Collection 新增 useGetCollection、实验类型重命名、上下文显示名修正及不重新挂载的 DOM 重排顺序修复。',['变更记录','集合顺序','实验接口']],
 ['README.md','明确 Collection 是内部集合管理工具，不作为面向应用的公开组件。',['包文档','集合管理','内部接口']],
 ['package.json','配置内部 Collection 包发布，声明 Context、Slot、Primitive、ComposeRefs 与布局效应依赖，以支撑条目注册和 DOM 顺序管理。',['包清单','集合管理','依赖配置']],
 ['tsconfig.json','将 Collection 源码纳入共享 React 库类型检查并排除 dist 与依赖目录。',['类型配置','集合管理','构建配置']]
 ]],
 [35,'dialog',[
 ['CHANGELOG.md','记录 Dialog 多 aria-describedby 支持、模态内嵌 Portal 浮层的焦点和滚动修复、外部扩展覆盖层事件与回调类型兼容修复。',['变更记录','对话框','浮层兼容']],
 ['README.md','提供 Dialog 官方文档链接，作为可访问对话框组件使用入口。',['组件文档','对话框','文档入口']],
 ['package.json','声明 Dialog 的 Context、DismissableLayer、FocusScope/Guards、Portal、Presence、Slot 和 react-remove-scroll 依赖，配置 React peer 与模块发布入口。',['包清单','对话框','交互依赖']],
 ['tsconfig.json','为 Dialog 组件继承共享 React 库类型配置，检查 src 并指定 dist 产物目录。',['类型配置','对话框','构建配置']]
 ]],
 [49,'password-toggle-field',[
 ['CHANGELOG.md','介绍实验性密码显隐字段及指针焦点归还、键盘焦点保留、提交后隐藏与图标可访问命名，记录属性拼写和 asChild 类型修复。',['变更记录','密码显隐','实验组件']],
 ['README.md','说明通过 radix-ui 安装密码显隐字段，并链接官方使用文档。',['安装说明','密码显隐','组件文档']],
 ['package.json','配置实验性密码显隐字段的源码/ESM/CJS 入口，声明可控状态、ID、水合检测和 effect-event 等协作依赖。',['包清单','密码显隐','依赖配置']],
 ['tsconfig.json','为 PasswordToggleField 的源码指定共享 React 库类型规则及 dist 输出目录。',['类型配置','密码显隐','构建配置']]
 ]]
];
// 内容来自逐文件阅读，循环仅负责写出各自原始批次。
for(const [i,name,entries] of packages){
 const base=`packages/react/${name}`,s={};
 for(const [file,summary,tags] of entries) s[`${base}/${file}`]={summary,tags};
 saveBatch(i,s,[relation(`document:${base}/README.md`,`config:${base}/package.json`,'documents'),relation(`document:${base}/CHANGELOG.md`,`config:${base}/package.json`,'documents'),relation(`config:${base}/tsconfig.json`,'config:internal/typescript-config/react-library.json')]);
}
