// @ts-check
// 使用已读取的官方结构和源码证据完成定位、Portal、进度与聚合子入口批次。
const {file, symbols, edge, supplement, save} = require('./serialize-worker-5.cjs');
const base = 'packages/react/';
const popper = `${base}popper/src/popper.tsx`;
file(popper, '为浮层提供锚点、固定定位内容与箭头，以 Floating UI 中间件处理偏移、碰撞、可用尺寸、锚点遮蔽和动画变换原点。定位状态通过作用域上下文在部件间同步。', ['浮层定位','碰撞处理','复合组件']);
symbols(popper, {Popper:'为锚点与最终 placement 建立共享状态和作用域 Provider。', transformOrigin:'结合放置方向、箭头尺寸与偏移计算浮层 CSS 动画原点的 Floating UI 中间件。', PopperAnchor:'在提交阶段通过稳定引用回调登记 DOM 锚点，并支持虚拟测量对象和实际放置方向属性。', PopperContent:'协调固定定位、偏移、碰撞翻转、尺寸测量、箭头数据和隐藏策略，向内容暴露定位结果及 CSS 变量。', PopperArrow:'按内容放置方向旋转和偏移箭头，在箭头无法居中时隐藏，并用包裹元素测量尺寸。'});
supplement(popper, [{name:'PopperAnchor',startLine:93,endLine:144},{name:'PopperContent',startLine:182,endLine:367},{name:'PopperArrow',startLine:386,endLine:430}]);
for (const dependency of ['arrow','compose-refs','context','primitive','use-callback-ref','use-layout-effect','use-size']) edge(89, `file:${popper}`, `file:${base}${dependency}/src/${dependency}.tsx`);
edge(89,`function:${popper}:PopperContent`,`function:${popper}:transformOrigin`,'calls',0.8);
const portal = `${base}portal/src/portal.tsx`;
file(portal,'将组件渲染到指定容器或挂载后的 document.body；通过布局 Effect 推迟默认容器选择，保留 asChild、属性和 ref 透传。',['Portal','挂载时序','DOM组合']);
symbols(portal,{Portal:'支持自定义容器与 DOM 组合的 Portal 部件；默认 body 容器仅在客户端挂载后启用。'});
supplement(portal,[{name:'Portal',startLine:19,endLine:29}]);
for (const dependency of ['primitive','use-layout-effect']) edge(89,`file:${portal}`,`file:${base}${dependency}/src/${dependency}.tsx`);
file(`${base}portal/src/portal.test.tsx`,'验证 Portal 默认与自定义容器、属性与事件透传、引用绑定及 asChild 元素替换。',['测试','Portal','属性透传']);
file(`${base}primitive/src/primitive.tsx`,'基于预定义 DOM 标签生成统一 Primitive 映射，借助 Slot 实现 asChild；另提供通过 flushSync 保证离散自定义事件更新顺序的工具。',['DOM原语','asChild','离散事件']);
symbols(`${base}primitive/src/primitive.tsx`,{dispatchDiscreteCustomEvent:'在 ReactDOM.flushSync 中同步派发自定义事件，避免离散事件处理中的更新被意外批处理。'});
edge(89,`file:${base}primitive/src/primitive.tsx`,`file:${base}slot/src/slot.tsx`);
file(`${base}primitive/src/primitive.test.tsx`,'覆盖 Primitive 标签及 asChild 子元素的未消费属性、样式、事件处理和 DOM ref 透传契约。',['测试','DOM原语','组件组合']);
const progress = `${base}progress/src/progress.tsx`;
file(progress,'实现可访问的进度条及指示器，校验最大值与进度值并规范化无效输入，将 loading、complete、indeterminate 状态暴露为 ARIA 和 data 属性。',['进度条','可访问性','值校验']);
symbols(progress,{Progress:'校验 max/value、生成读屏进度标签并提供 progressbar 语义和共享进度上下文。',ProgressIndicator:'从进度上下文读取当前值与最大值，向指示器透传 DOM 属性和显式 data-state。'});
supplement(progress,[{name:'Progress',startLine:32,endLine:73},{name:'ProgressIndicator',startLine:84,endLine:102}]);
for(const dependency of ['context','primitive']) edge(89,`file:${progress}`,`file:${base}${dependency}/src/${dependency}.tsx`);
file(`${base}progress/src/progress.test.tsx`,'验证进度条 Root 和 Indicator 的 DOM 属性、引用、事件与 asChild 透传，以及渲染后的 ARIA 和状态属性。',['测试','进度条','属性透传']);
// 这些索引的职责已经由官方exports列表确认，不创建重复的函数声明节点。
for(const [pkg,summary] of [['portal','公开 Portal/Root 与属性类型，连接传送门部件实现和消费方。'],['presence','公开 Presence 挂载存在性组件及其 Root 别名与属性类型。'],['primitive','公开 Primitive DOM 映射、Root 别名、自定义事件派发函数及相关泛型属性。'],['progress','公开进度作用域、Root/Indicator 部件、别名与属性类型。'],['radio-group','公开单选组根与选项、指示器，并暴露不稳定的 Provider/Trigger/BubbleInput 细粒度部件。']]) {
  const p=`${base}${pkg}/src/index.ts`;file(p,summary,['公共入口','barrel','类型导出']);
  edge(89,`file:${p}`,`file:${base}${pkg}/src/${pkg}.tsx`,'exports',0.8);
}
// 每个单行子入口均从读取到的原始re-export声明映射到真实独立包入口。
for(const [pkg,label] of [['accessible-icon','可访问图标'],['accordion','手风琴'],['alert-dialog','警示对话框'],['aspect-ratio','宽高比容器'],['avatar','头像'],['checkbox','复选框'],['collapsible','折叠容器'],['context-menu','上下文菜单'],['dialog','对话框'],['direction','文字方向'],['dropdown-menu','下拉菜单'],['form','表单'],['hover-card','悬停卡片']]) {
  const p=`${base}radix-ui/src/${pkg}.ts`;
  file(p,`为 radix-ui 的 ${pkg} 子路径转发独立${label}包的全部公共导出。`,['聚合子入口','barrel',label]);
  edge(89,`file:${p}`,`file:${base}${pkg}/src/index.ts`,'exports',0.8);
}
save([89]);
