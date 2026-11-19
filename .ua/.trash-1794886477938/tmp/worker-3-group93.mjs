// @ts-check
import {fragment,edge,component} from './worker-3-serialize.mjs';
const previous='packages/react/use-previous/src/use-previous.tsx',rect='packages/react/use-rect/src/use-rect.tsx',size='packages/react/use-size/src/use-size.tsx',sizetest='packages/react/use-size/src/use-size.test.tsx',hidden='packages/react/visually-hidden/src/visually-hidden.tsx',stub='scripts/rsc-client-boundary-stub.mts',rsctest='scripts/rsc-compatibility.rsc.test.ts';
// 对未注册的mts与patch直接依据已读源码补充，不对提取器伪造成功记录。
fragment(93,{
 'packages/react/use-layout-effect/src/use-layout-effect.tsx':['在浏览器导出 React.useLayoutEffect，在无 document 的服务端替换为空操作，避免服务端布局效应警告。',['自定义钩子','布局效应','服务端兼容']],
 'packages/react/use-previous/src/index.ts':['公开 usePrevious Hook，为组件状态转换提供前值查询入口。',['入口点','自定义钩子','导出聚合']],
 [previous]:['保存当前值与上一个不同值，仅在输入实际改变时推进记录，保持重复渲染期间的前值稳定。',['自定义钩子','状态历史','泛型']],
 'packages/react/use-rect/src/index.ts':['公开 useRect Hook，向组件提供矩形持续测量入口。',['入口点','布局测量','导出聚合']],
 [rect]:['把核心 observeElementRect 订阅转换为 React 状态，跟踪可测对象矩形并在目标替换或卸载时清理。',['自定义钩子','布局测量','订阅管理']],
 'packages/react/use-size/src/index.ts':['公开 useSize Hook，向组件提供元素边框盒尺寸观察入口。',['入口点','尺寸观察','导出聚合']],
 [sizetest]:['通过可控 ResizeObserver 和 offset 尺寸模拟验证 useSize 的初值、边框盒兼容、动画帧更新、目标替换及置空清理。',['测试','尺寸观察','浏览器模拟']],
 [size]:['在布局阶段立即读取目标尺寸，再用 ResizeObserver 观察边框盒并合并到动画帧更新；兼容不同 borderBoxSize 形态及缺失场景。',['自定义钩子','尺寸观察','浏览器兼容']],
 'packages/react/visually-hidden/src/index.ts':['公开 VisuallyHidden、Root、冻结样式常量及属性类型，作为可访问文本隐藏工具入口。',['入口点','可访问性','导出聚合']],
 'packages/react/visually-hidden/src/visually-hidden.test.tsx':['验证视觉隐藏组件的 DOM 属性、样式合并与 asChild/ref 透传，确保组合时保留读屏文本。',['测试','视觉隐藏','属性透传']],
 [hidden]:['提供视觉隐藏但保留可访问内容的 span 组件和冻结样式常量，支持消费者样式覆盖与 asChild 组合。',['组件','视觉隐藏','可访问性']],
 'patches/@changesets__apply-release-plan.patch':['为 changesets 的 CommonJS 与 ESM 实现加入自定义 getChangelogEntry 扩展点，使仓库能够统一定制版本日志输出。',['依赖补丁','版本发布','变更日志']],
 'playwright.config.ts':['配置基于本地 9009 Storybook 的 Chromium E2E 测试，指定触摸支持、超时、CI 重试与报告，并自动复用或启动开发服务。',['测试配置','端到端测试','Storybook']],
 'scripts/check-composed-refs.mjs':['使用 TypeScript AST 扫描组件源码，拦截内联 useComposedRefs 回调和 JSX 中直接 composeRefs 导致的引用身份不稳定，防止 React 19 无限更新回归。',['静态检查','引用稳定性','持续集成']],
 [stub]:['为 RSC 测试提供 Vite 转换插件，识别 use client 模块并以不可在服务端调用的代理导出替换其模块体，模拟真实客户端边界。',['测试基础','客户端边界','Vite插件']],
 [rsctest]:['在 react-server 条件下枚举可发布包，确认客户端入口显式声明边界，其他入口能在服务端安全导入，并验证确实使用 React 服务端构建。',['测试','服务端组件','模块边界']],
 'scripts/setup-tests.ts':['为 Vitest 加载 DOM 与 axe 断言，补齐 jsdom 缺少的 ResizeObserver 和 scrollIntoView，统一组件测试运行环境。',['测试初始化','浏览器模拟','可访问性']],
 'types/global.d.ts':['声明 CSS Modules 类名映射，并提供 requestIdleCallback 相关句柄、选项和 deadline 类型。',['类型定义','样式模块','空闲回调']],
 'types/index.d.ts':['声明 CSS Modules 导入的类名到字符串映射，为样式模块提供共享类型入口。',['类型定义','样式模块','声明文件']],
 'vitest.config.mts':['将测试划分为 jsdom 单元测试与 node RSC 项目；后者启用客户端边界替身和 react-server 解析条件，以检测服务端导入兼容性。',['测试配置','服务端组件','单元测试']]
},{
 [`${previous}:usePrevious`]:['通过 ref 和 memo 保存输入前后值，仅在引用不同时更新，使调用者能够比较最新值与上一个不同值。',['自定义钩子','状态历史','稳定引用']],
 [`${rect}:useRect`]:['订阅可测对象矩形并写入状态，清理时注销订阅且清空旧矩形。',['自定义钩子','布局测量','清理机制']],
 [`${size}:useSize`]:['立即提供 offset 尺寸并观察 border-box，统一浏览器返回格式且用动画帧延迟提交，目标置空时重置结果。',['自定义钩子','尺寸观察','动画帧']],
 [`${rsctest}:collectPackages`]:['枚举 core 与 react 目录中具有 manifest 和源码入口的非私有包，读取入口客户端指令并按包名排序。',['测试发现','模块边界','工作区']]
},[
 ...component(hidden,'VisuallyHidden',26,36,'把固定视觉隐藏样式与用户样式合并到 Primitive.span，保持 DOM 引用和其余属性透传。'),
 {id:`class:${sizetest}:MockResizeObserver`,type:'class',name:'MockResizeObserver',filePath:sizetest,lineRange:[9,44],summary:'记录观察目标和实例，允许测试手动派发边框盒尺寸通知，并提供最近实例和重置接口。',tags:['测试模拟','尺寸观察','可控通知'],complexity:'moderate'},edge(`file:${sizetest}`,`class:${sizetest}:MockResizeObserver`,'contains'),
 {id:`function:${stub}:hasUseClientDirective`,type:'function',name:'hasUseClientDirective',filePath:stub,lineRange:[7,12],summary:'去除 BOM、前导空白与注释后识别首条 use client 指令，判断模块是否构成客户端边界。',tags:['指令识别','客户端边界','测试工具'],complexity:'simple'},edge(`file:${stub}`,`function:${stub}:hasUseClientDirective`,'contains'),edge(`file:${stub}`,`function:${stub}:hasUseClientDirective`,'exports'),
 {id:`function:${stub}:rscClientBoundaryStub`,type:'function',name:'rscClientBoundaryStub',filePath:stub,lineRange:[23,100],summary:'创建前置 Vite 插件，为客户端模块移除 TypeScript 类型并分析运行时导出，生成可引用但不可在服务端调用或构造的代理。',tags:['Vite插件','客户端边界','服务端组件'],complexity:'moderate'},edge(`file:${stub}`,`function:${stub}:rscClientBoundaryStub`,'contains'),edge(`file:${stub}`,`function:${stub}:rscClientBoundaryStub`,'exports'),
 edge(`file:${rect}`,'file:packages/core/rect/src/observe-element-rect.ts'),edge(`file:${size}`,'file:packages/react/use-layout-effect/src/use-layout-effect.tsx'),edge(`file:${hidden}`,'file:packages/react/primitive/src/primitive.tsx'),
 edge(`file:${size}`,`file:${sizetest}`,'tested_by'),edge(`file:${hidden}`,'file:packages/react/visually-hidden/src/visually-hidden.test.tsx','tested_by'),
 edge('file:vitest.config.mts','file:scripts/setup-tests.ts','configures'),edge('file:vitest.config.mts',`file:${rsctest}`,'configures'),edge('file:vitest.config.mts',`file:${stub}`),
 edge('file:patches/@changesets__apply-release-plan.patch','config:pnpm-workspace.yaml','configures'),
 edge('file:packages/react/use-previous/src/index.ts',`file:${previous}`,'exports'),edge('file:packages/react/use-rect/src/index.ts',`file:${rect}`,'exports'),edge('file:packages/react/use-size/src/index.ts',`file:${size}`,'exports'),edge('file:packages/react/visually-hidden/src/index.ts',`file:${hidden}`,'exports')
]);
