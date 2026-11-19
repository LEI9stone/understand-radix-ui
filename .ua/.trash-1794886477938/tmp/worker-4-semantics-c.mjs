// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
const issue='.github/ISSUE_TEMPLATE/';
saveBatch(12,{
 [issue+'Bug_report.md']:{summary:'规范缺陷报告收集当前行为、期望行为、复现、建议方案和运行环境，帮助定位跨浏览器组件问题。',tags:['文档','问题模板','缺陷反馈']},
 [issue+'Documentation.md']:{summary:'引导文档改进反馈指出相关 Radix 组件并提供其他文档网站的参考示例。',tags:['文档','问题模板','文档改进']},
 [issue+'Feature_request.md']:{summary:'引导功能建议说明需求概览、其他库的例子、目标使用者与补充背景。',tags:['文档','问题模板','功能建议']},
 [issue+'Question.md']:{summary:'提供 GitHub 问题咨询的统一模板入口。',tags:['文档','问题模板','社区支持']}
});
const css={
 progress:'定义进度轨道、指示条及加载/不确定/完成状态颜色，并通过伪元素显示 data-value 和 data-max 以检验状态属性。',
 'radio-group':'为圆形单选项、焦点边框、禁用态和选中指示器提供示例样式，使用 checked/unchecked 状态驱动淡入淡出动画。',
 'scroll-area':'定义滚动视口、横纵滚动条、圆角拇指与交角样式；扩展拇指的44px触摸命中区并禁用默认触摸平移。',
 select:'为触发器、内容、分组、选项与滚动按钮提供示例样式，消费触发器宽度/内容可用高度 CSS 变量并处理 RTL 与开关动画。',
 separator:'根据 data-orientation 将分隔线设置为横向全宽细线或纵向固定高度细线。',
 slider:'定义横纵滑轨、范围和滑块样式，扩展44px触摸命中区并用 aria-valuenow 显示数值，展示焦点与禁用状态。',
 switch:'以 CSS 变量描述轨道、拇指和间距；checked 状态改变颜色与拇指位移，同时提供焦点、禁用和属性验证样式。',
 tabs:'为横纵标签列表、活动触发器、内容和焦点边框提供示例样式，并配置状态动画与 data-state 属性验证。',
 toast:'定义通知视口、标题、按钮和进度条样式；根据 data-swipe 状态及位移 CSS 变量处理四向滑动退出和恢复动画。',
 'toggle-group':'定义单/多选切换组的排列、项目边框、焦点环和 on/off 状态样式，用于示例与属性视觉验证。',
 toggle:'以红绿背景区分开关按钮 off/on 状态，并为焦点、禁用和属性回归提供视觉样式。',
 toolbar:'定义横纵工具栏、分隔符、链接、切换按钮和组，同时为内嵌下拉菜单提供高亮、禁用及进入退出动画。',
 tooltip:'消费 Tooltip 变换原点变量，按 delayed-open、instant-open 和 closed 配置不同动画，并提供定位网格与箭头视觉回归样式。'
};
const cssSemantics={},cssEdges=[];
// 人工确认每份 CSS 的用途后，用对应已知故事建立配置关系。
for(const [name,summary] of Object.entries(css)){
 const file=`apps/storybook/stories/${name}.stories.module.css`;
 cssSemantics[file]={summary,tags:['示例样式','状态属性','视觉回归']};
 cssEdges.push(relation(`file:${file}`,`file:apps/storybook/stories/${name}.stories.tsx`,'configures'));
}
saveBatch(16,cssSemantics,cssEdges);
const ts='internal/typescript-config/';
const configSemantics={
 [ts+'base.json']:{summary:'提供共享严格 TypeScript 基线，启用声明与声明映射、索引访问检查、DOM/ES2023 库，默认使用 NodeNext 与 ES2022 输出目标。',tags:['类型配置','严格检查','工作区共享']},
 [ts+'react-library.json']:{summary:'继承共享基线并切换至 react-jsx、ESNext 与 Bundler 解析，为 React 库源码提供统一编译语义。',tags:['类型配置','React库','模块解析']},
 [ts+'nextjs.json']:{summary:'继承共享基线，启用 Next.js 类型插件、JS 输入和 JSX 保留，以 Bundler 解析且禁止输出，用于 SSR 测试应用。',tags:['类型配置','Next.js','服务端渲染']},
 [ts+'vite-app.json']:{summary:'为 Vite 浏览器应用设置 Bundler 解析、react-jsx 与 TS 扩展导入，关闭输出并使用标准类字段语义。',tags:['类型配置','Vite应用','模块解析']},
 [ts+'vite-node.json']:{summary:'为 Vite 的 Node 配置文件设置 ES2023 库、ESNext/Bundler 解析和 TS 扩展导入，不生成编译产物。',tags:['类型配置','Node环境','Vite配置']},
 [ts+'package.json']:{summary:'声明私有 @repo/typescript-config 工作区包，让各库与应用通过共享包路径继承统一编译配置。',tags:['工作区清单','类型配置','内部包']}
};
const tsEdges=[];
for(const file of ['react-library.json','nextjs.json','vite-app.json','vite-node.json']) tsEdges.push(relation(`config:${ts}${file}`,`config:${ts}base.json`));
saveBatch(17,configSemantics,tsEdges);
const env='packages/core/env-check/';
saveBatch(18,{
 [env+'CHANGELOG.md']:{summary:'记录 env-check 0.0.1 的首次发布。',tags:['变更记录','环境检查','内部工具']},
 [env+'README.md']:{summary:'标明 env-check 仅供 Radix 内部使用，不作为公开使用接口。',tags:['文档','环境检查','内部工具']},
 [env+'package.json']:{summary:'将 is-development 子路径按 development/production 条件分别导出 true/false 实现，同时配置 ESM/CJS 类型入口、无副作用发布与 radix-build。',tags:['包清单','条件导出','构建配置']},
 [env+'tsconfig.json']:{summary:'继承共享 React 库配置，将 env-check 的 src 设为根目录、dist 设为输出目录，并排除依赖和构建产物。',tags:['类型配置','环境检查','构建配置']}
},[relation(`config:${env}tsconfig.json`,`config:${ts}react-library.json`)]);
