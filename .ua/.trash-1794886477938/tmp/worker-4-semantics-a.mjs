// @ts-check
import {saveBatch,relation} from './worker-4-save.mjs';
const e2e={
 'collection.spec.ts':['验证 Collection 在 ViewTransition 重排和删除动画的首帧就反映最新项目位置，防止 DOM 顺序更新滞后。',['测试','集合','视图过渡']],
 'context-menu.spec.ts':['回归右键菜单的指针意图区、长按、键盘子菜单和 RTL 行为，并验证外部覆盖层与 Dialog 内的分层关闭。',['测试','右键菜单','键盘导航']],
 'dialog.spec.ts':['覆盖模态与非模态对话框的鼠标、触控、键盘、焦点陷阱和嵌套菜单关闭，包含 Shadow DOM 与外部覆盖层回归。',['测试','对话框','焦点管理']],
 'dropdown-menu.spec.ts':['回归下拉菜单的子菜单指针路径、碰撞翻转、键盘查找和 RTL 导航，确保外部交互仅关闭适当的浮层。',['测试','下拉菜单','指针交互']],
 'form.spec.ts':['验证标签关联、原生有效性状态、同步与异步自定义校验及服务端错误，检查阻止提交和首个错误控件聚焦。',['测试','表单','校验']],
 'helpers.ts':['封装 Storybook 导航、定位框坐标、键盘和指针事件及 CDP 触摸手势，为组件端到端用例提供一致的输入模拟。',['测试','辅助函数','输入模拟']],
 'menubar.spec.ts':['验证菜单栏触发器切换、子菜单指针意图区、焦点与 typeahead，并覆盖 Portal、RTL 和扩展覆盖层的关闭行为。',['测试','菜单栏','键盘导航']],
 'popover.spec.ts':['检查 Popover 对外部覆盖层的交互容忍，以及嵌套在 Dialog 时模态与非模态浮层的关闭边界。',['测试','弹出层','层级关闭']],
 'popper.spec.ts':['检查锚点被滚动容器裁切时隐藏浮层，并验证带变换和溢出裁剪的 Portal 容器不会误改可用空间测量。',['测试','浮层定位','碰撞边界']],
 'scroll-area.spec.ts':['回归一条滚动条消失时角落宽高 CSS 变量归零，避免残留的滚动条交角占位。',['测试','滚动区域','尺寸测量']],
 'select.spec.ts':['验证 Select 的表单提交、空值占位和外部值更新定位，覆盖覆盖层、Dialog/Popover 嵌套关闭及 Shadow DOM 触摸滚动。',['测试','选择器','表单联动']],
 'toast.spec.ts':['验证多条 Toast 的焦点和倒序 Tab 遍历、无 Toast 时的自然顺序，以及默认和自定义播报容器与超时清理。',['测试','通知','辅助技术']],
 'toggle-group.spec.ts':['验证 ToggleGroup 位于 Dialog 首个可聚焦位置时，对话框打开能正确将焦点移入组内。',['测试','切换组','焦点管理']]
};
const semantics1={};
// 人工逐项描述测试意图；此循环只转换对象键。
for(const [name,[summary,tags]] of Object.entries(e2e)) semantics1[`e2e/${name}`]={summary,tags};
semantics1['e2e/collection.spec.ts'].functions={recordViewTransitions:'在页面初始化前包裹 startViewTransition，记录过渡就绪时和首个动画帧中的项目位置，供动画一致性断言使用。'};
semantics1['e2e/helpers.ts'].functions={
 visitStory:'把组件故事名称转换为默认 Cypress 故事的 iframe 地址并导航。',visitStoryById:'直接按 Storybook 故事 ID 导航到 iframe，支持非默认测试故事。',offsetFor:'根据元素边界与中心、上下左右等位置名称计算有效的相对指针坐标。',hoverAt:'取得元素边界后把指针移动到指定相对位置。',pointerOutAt:'根据目标位置合成带坐标的 pointerout 事件，模拟离开元素的具体方向。',keydown:'向定位器派发指定按键的 keydown，精确触发组件键盘处理。',pointerOver:'定位文本元素并确认可见，再将指针悬停其上。',pointerExitRightToLeft:'沿右侧到左侧的边界移动并发出 pointerout，测试菜单的离开意图判断。',pointerExitLeftToRight:'沿左侧到右侧的边界移动并发出 pointerout，测试反方向菜单指针路径。',longTouch:'派发触控 pointerdown 并等待长按阈值，用于打开触摸右键菜单。',touchSwipe:'以 CDP touchStart、touchMove、touchEnd 模拟指定方向和长度的真实触摸滑动。'};
saveBatch(1,semantics1);
const base='apps/ssr-testing/app/primitive-merge/';
saveBatch(3,{
 [base+'nodes.mjs']:{summary:'导出待验证的 Primitive HTML 标签清单，供 SSR 页面与构建产物断言共享同一组节点。',tags:['服务端渲染','标签清单','测试数据']},
 [base+'page.tsx']:{summary:'以服务端组件创建每一种 HTML 子节点，并穿过客户端 Providers 与 PrimitiveNode，回归 asChild 在 RSC 边界上的属性合并。',tags:['服务端渲染','组件组合','回归测试'],functions:{Page:'遍历 Primitive 节点清单，在服务端构造带测试标记的真实 HTML 子节点，再交给客户端 asChild 包装器渲染。'}},
 [base+'primitive-node.tsx']:{summary:'按标签名选取 radix-ui/internal 的 Primitive 组件，以 asChild 包裹服务端传来的子节点，并拒绝未知标签。',tags:['客户端边界','组件组合','回归测试'],functions:{PrimitiveNode:'查找指定标签对应的 Primitive；未知标签抛错，否则用 asChild 接收子元素。'}},
 [base+'providers.tsx']:{summary:'提供仅透传 children 的客户端组件边界，使服务端创建的节点经过客户端包装后仍可进行 SSR。',tags:['客户端边界','服务端渲染','测试夹具'],functions:{Providers:'在客户端边界中原样返回 children，用于隔离 RSC 跨界组合问题。'}},
 'apps/ssr-testing/scripts/assert-primitive-merge.mjs':{summary:'读取 Next.js 预渲染输出，按共享标签清单定位节点并检查合并结果，提前发现生产构建中的 Primitive asChild 回归。',tags:['构建断言','服务端渲染','回归测试'],functions:{readPrerenderedHtml:'优先读取标准路由 HTML，否则扫描可用预渲染路径并读取匹配文件，缺失时给出明确失败。'}}
});
const slot='apps/ssr-testing/app/slot/';
const slotFunctions={Link:'根据 asChild 选择 Slot.Root 或原生 a，并把属性和 ref 转发到实际节点。',LinkSlottable:'在链接左右插入辅助内容，并以 Slottable 指明应接收合并属性的子元素。',LinkButton:'把 Link 放入 asChild Button，验证两层可组合组件的属性与 ref 透传。',Button:'根据 asChild 使用 Slot.Root 或原生 button，并附加测试用的 flex 布局。',ButtonSlottable:'在按钮的左右内容之间指定 Slottable 子节点，验证多子元素结构下的插槽合并。',ButtonNestedSlottable:'用 Slottable 的 child 与渲染函数将目标嵌套在加粗内容中，验证深层插槽定位。',IconButtonNestedSlottable:'将图标与加粗目标放进嵌套 Slot，验证嵌套插槽与按钮包装的组合。'};
const extra={};
// forwardRef 包装声明未进入官方 functions 数组；行范围来自已逐行阅读的源文件。
for(const [file,shift] of [['client.tsx',0],['server.tsx',-1]]) extra[slot+file]=[['Link',6,12],['LinkSlottable',14,26],['LinkButton',28,37],['Button',39,45],['ButtonSlottable',47,59],['ButtonNestedSlottable',61,79],['IconButtonNestedSlottable',81,99]].map(([name,start,end])=>({name,startLine:start+shift,endLine:end+shift}));
saveBatch(6,{
 [slot+'client.tsx']:{summary:'在客户端边界定义 Link、Button 与多层 Slottable 测试组件，覆盖 asChild、ref 转发及渲染函数形式的插槽组合。',tags:['客户端组件','插槽','服务端渲染'],functions:slotFunctions},
 [slot+'server.tsx']:{summary:'提供服务器侧的对照版 Link/Button/Slottable 组合，并在图标按钮内部嵌入 Client.Button，检查跨客户端边界的嵌套插槽。',tags:['服务端组件','插槽','组件组合'],functions:slotFunctions},
 [slot+'page.tsx']:{summary:'并列渲染服务端与客户端的多种 Link/Button/Slottable 嵌套案例，展示 SSR 与水合边界上的插槽兼容性。',tags:['测试页面','插槽','服务端渲染'],functions:{Page:'组织服务端和客户端组件组合矩阵，比较 asChild、左右附属内容与深层 Slottable 的实际输出。'}}
},[],extra);
