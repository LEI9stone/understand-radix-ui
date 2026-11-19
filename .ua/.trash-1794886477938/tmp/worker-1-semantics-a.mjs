// @ts-check
import {file,symbols,edges,save} from './worker-1-serialize.mjs';
// 根据 Portal 服务端演示与客户端容器实现记录语义。
file('apps/ssr-testing/app/portal/conditional-portal.tsx','以按钮控制自定义容器中的 Portal 挂载，验证客户端状态更新后条件传送内容的行为。',['服务端验证','条件渲染','Portal']);
symbols('apps/ssr-testing/app/portal/conditional-portal.tsx',{ConditionalPortal:'保存容器引用和展开状态，通过按钮条件挂载 Portal 内容。'});
file('apps/ssr-testing/app/portal/custom-portal-container.tsx','通过 ref 将 Portal 内容传送到自定义 em 容器，覆盖水合后容器就绪的情形。',['服务端验证','容器引用','Portal']);
symbols('apps/ssr-testing/app/portal/custom-portal-container.tsx',{CustomPortalContainer:'捕获目标 DOM 容器并将 Portal 内容渲染到该容器内。'});
file('apps/ssr-testing/app/portal/page.tsx','汇集默认 body Portal、自定义容器和条件 Portal，用于比较 React 树与 DOM 树在服务端页面中的分离。',['服务端验证','演示页面','Portal']);
symbols('apps/ssr-testing/app/portal/page.tsx',{Page:'展示滚动区域外的默认 Portal，并组合两种客户端自定义容器示例。'});
file('.github/workflows/build.yml','在 main/stable 的提交及拉取请求中并行执行构建、单元测试和 Playwright 端到端测试，构建任务还检查 composed refs。',['持续集成','构建','测试']);
file('.github/workflows/chromatic.yml','在 main 提交或拉取请求时通过 Chromatic 上传 Storybook，取消同一分支的过期任务以支持视觉回归审查。',['持续集成','视觉回归','Storybook']);
file('.github/workflows/publish.yml','区分 main 快照发布与 stable 正式发布，检测快照变更并在正式发布成功后自动创建 stable 回流 main 的待审查 PR。',['持续集成','版本发布','变更检测']);
file('.github/workflows/ssr.yml','为 main/stable 拉取请求构建 Next.js 测试应用并断言 Primitive 跨 RSC 边界渲染，拦截模块导入阶段的服务端兼容性回归。',['持续集成','服务端渲染','兼容性']);
const change={
'README.md':'介绍 Changesets 在多包仓库中的版本管理和发布用途，并链接上游使用文档。',
'calm-taps-close.md':'记录 Dialog 与 DismissableLayer 修复 iOS Safari 点击遮罩无法稳定关闭模态框的问题。',
'closing-menu-pointer-focus.md':'记录菜单退出动画期间指针经过已关闭菜单仍移动焦点的修复。',
'deep-breads-push.md':'记录将开发环境检查移至独立包的内部重构，涉及状态 Hook、交互组件与底层 primitive。',
'five-zoos-smash.md':'记录 Select 内组合 ScrollArea 时内联 overflow 样式冲突触发 React 警告的修复。',
'fix-nested-context-menu-long-press.md':'记录嵌套上下文菜单触发器长按时只启动最内层计时器的修复。',
'hot-areas-teach.md':'记录为 RadioGroup 根元素增加 aria-disabled 的可访问性变更。',
'lazy-scripts-skip.md':'记录模态组件外部内容隐藏性能优化，避免标记从不渲染的元素并允许隐藏 script 祖先。',
'lemon-experts-vanish.md':'记录移除启用状态 Slider 上多余 aria-disabled 属性的修复。',
'ninety-roses-remain.md':'记录以内部实现替换 aria-hidden 依赖，保持模态组件外部内容隐藏行为。',
'quiet-bats-defer.md':'记录延迟分发程序化点击的外部交互事件，等待 React 被动 effect 提交结束。',
'quiet-kanji-wait.md':'记录输入法组合期间避免处理 Escape 与 Tab 的修复，覆盖焦点域、可关闭层及 Escape Hook。',
'slick-breads-tap.md':'记录为 ScrollArea.Content 显式添加 presentation role，避免浏览器由 display 样式推断表格语义。',
'smart-games-stick.md':'记录修复第三方库重新导出 Radix context hooks 时的类型引用。',
'sweet-tigers-wink.md':'记录可关闭层禁止外部指针时首帧无法点击的回归修复。',
 'tame-bears-call.md':'记录 Dialog 子部件显式 id 导致标题、描述和内容 ARIA 引用断裂的修复。',
'warm-menus-stay.md':'记录 React 19 中碰撞翻转的子菜单在指针点击落下之前提前关闭的修复。'};
for(const [name,summary] of Object.entries(change))file(`.changeset/${name}`,summary,['发布记录','补丁版本','变更说明']);
file('.changeset/config.json','配置公开发布、main 基线、内部依赖补丁更新与 rc 时间戳快照，排除开发应用和内部工具包。',['发布配置','版本策略','工作区']);
file('apps/ssr-testing/README.md','说明 Next.js 服务端渲染测试 playground 的目的，以及从仓库根目录通过 dev:ssr 启动的方法。',['文档','服务端渲染','开发入口']);
file('apps/ssr-testing/package.json','声明私有 Next.js 测试应用，依赖 workspace radix-ui，并提供生产构建与 Primitive 跨边界断言命令。',['应用配置','服务端渲染','构建']);
file('apps/ssr-testing/tsconfig.json','继承内部 Next.js TypeScript 配置，启用增量编译并纳入 Next 自动生成的类型文件。',['编译配置','TypeScript','Next.js']);
edges(14,[['document:apps/ssr-testing/README.md','config:apps/ssr-testing/package.json','documents'],['config:apps/ssr-testing/tsconfig.json','file:apps/ssr-testing/app/portal/page.tsx','configures']]);
edges(10,[['pipeline:.github/workflows/build.yml','config:package.json','triggers'],['pipeline:.github/workflows/chromatic.yml','file:apps/storybook/.storybook/main.ts','deploys'],['pipeline:.github/workflows/publish.yml','config:.changeset/config.json','depends_on'],['pipeline:.github/workflows/ssr.yml','config:apps/ssr-testing/package.json','triggers']]);
edges(5,['conditional-portal','custom-portal-container','page'].map(name=>[`file:apps/ssr-testing/app/portal/${name}.tsx`,'file:packages/react/portal/src/portal.tsx']));
save([5,10,11,14]);
