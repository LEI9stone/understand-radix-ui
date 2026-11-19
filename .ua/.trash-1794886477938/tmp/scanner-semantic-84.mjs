// 中文职责说明来自官方提取的符号、调用证据及构建器和测试工具源码；不重新提取结构或解析 imports。
export const semantics84 = {
  'radio-group': ['覆盖 RadioGroup 分部件及旧接口的选中、表单提交与重置、动画和方向布局，支持单选控件回归验证。', {
    Parts: '使用提供器、触发器和指示器分部件组装 RadioGroup，展示组合接口。',
    PartsWithinForm: '将分部件单选组接入表单，分别记录字段与表单变化并显示序列化结果。',
    WithinFormReset: '在表单中对比受控和非受控单选值，验证原生重置行为。',
    LegacyStyled: '使用旧版 RadioGroup 根节点和项目接口渲染带样式的单选组。',
    LegacyControlled: '用 React 状态控制旧版 RadioGroup 的当前选中值。',
    LegacyUnset: '演示旧版 RadioGroup 初始未选择项目时的行为。',
    LegacyWithinForm: '把旧版单选组放入表单，显示提交值并观察事件冒泡及阻止传播。',
    LegacyAnimated: '为旧版单选指示器应用动画，展示选中变化的视觉过渡。',
    LegacyChromatic: '集中渲染旧版单选组的视觉状态，并在副作用中设置指定焦点以覆盖聚焦外观。'
  }],
  'roving-focus-group': ['用可选择按钮组展示 RovingFocusGroup 的键盘焦点移动、嵌套作用域和动态禁用或隐藏条目。', {
    Basic: '切换文字方向并排列多组按钮，演示 roving focus 键盘导航。',
    Nested: '嵌套多个按钮焦点组，检验键盘移动在不同作用域中的行为。',
    EdgeCases: '动态添加、隐藏及禁用多个项目，检验可聚焦候选集合变化后的键盘行为。',
    ButtonGroup: '维护按钮组选择值并提供上下文，将组属性交给焦点管理根节点。',
    Button: '读取选择上下文，将选中状态与焦点条目关联，并合并键盘处理来触发按钮点击。'
  }],
  'scroll-area': ['展示 ScrollArea 滚动条策略、尺寸变化、动态内容、动画及溢出切换，并提供截图和端到端测试场景。', {
    Basic: '从表单收集滚动区属性配置，动态修改滚动策略并渲染溢出内容。',
    Resizable: '把滚动区放在可调整尺寸的容器中，观察滚动条随空间变化更新。',
    ContentChange: '分别增加纵向和横向内容数量，验证滚动范围及滚动条尺寸的动态计算。',
    ChromaticDynamicContentBeforeLoaded: '延迟加载滚动内容，验证空内容转为溢出内容时的滚动条布局。',
    ChromaticDynamicContentAfterLoaded: '复用动态内容故事并表示内容加载完成后的视觉回归状态。',
    Cypress: '切换横向溢出并渲染长列表，为滚动条交互自动化提供页面。',
    ScrollAreaStory: '组合视口、横纵滚动条和滑块，并按参数启用滑块动画。',
    Copy: '渲染用于制造滚动溢出的段落内容，并转发外部属性。'
  }],
  'separator': ['展示 Separator 在内容之间的分隔布局及带样式的分隔线。', {}],
  'slider': ['覆盖 Slider 方向、反转、多滑块间距、顺序保持、小步长、表单重置和分部件组合，并提供严格模式与视觉回归。', {
    WithOnValueCommit: '为 Slider 提供提交值回调，演示拖动过程与最终提交事件的区分。',
    RightToLeft: '在从右到左方向中渲染 Slider，展示数值与键盘操作方向。',
    Horizontal: '组合水平滑轨、范围与多个滑块，并记录数值交互。',
    Vertical: '设置垂直方向并渲染 Slider 轨道和滑块。',
    Inversions: '排列方向及反转属性组合，比较 Slider 数值增长方向。',
    WithMinimumStepsBetweenThumbs: '配置滑块间最小步数，展示多滑块不能过度靠近的约束。',
    WithPreserveThumbOrder: '展示保留滑块顺序时的交互，检验多滑块交叉情况下的顺序约束。',
    WithMultipleRanges: '渲染多段值范围，并允许动态调整滑块之间的最小步数。',
    SmallSteps: '以受控值演示小数步长，观察精细数值更新。',
    WithinForm: '组合多个 Slider 表单字段，序列化提交和变更结果，检验字段值与输入事件同步。',
    WithinFormReset: '对比受控与非受控 Slider 的表单重置效果。',
    BubbleInputWithinForm: '显式使用冒泡输入部件收集表单值，检验原生提交及变更事件。',
    Parts: '通过分部件接口组装 Slider 并输出表单序列化结果。',
    Strict: '在 React 严格模式中渲染 Slider，检验重复生命周期下的交互。',
    InScrollableContext: '在可滚动上下文中更新受控 Slider，观察拖动与滚动手势的配合。'
  }],
  'slot': ['演示 Slot 与 Slottable 的属性、事件和子元素合并，覆盖链接按钮、懒加载、非法子节点及错误边界。', {
    WithSlottable: '使用 Slottable 标记可被替换的子内容，展示额外兄弟节点的保留。',
    WithComposedEvents: '排列父子点击处理和 preventDefault 场景，验证插槽合并后的事件顺序。',
    ButtonAsLink: '将按钮外观通过 Slot 应用到链接，并组合左右图标。',
    WithLazyComponent: '在插槽中渲染懒加载组件，演示异步子元素与事件处理的组合。',
    SlotWithPreventableEvent: '先调用传入点击处理器，仅在事件未被取消时继续内部逻辑。',
    Button: '根据 asChild 选择原生按钮或 Slot，并使用 Slottable 将文本插入左右图标之间。',
    MockIcon: '渲染可设颜色的方形图标占位元素，用于验证图标与插槽子内容的排列。',
    MockTag: '渲染标签内容及可选删除按钮，作为含独立交互子节点的插槽组合示例。',
    ErrorBoundary: '捕获 Slot 无效子元素等渲染错误，在异常时显示红底错误提示并在正常时返回子内容。'
  }],
  'switch': ['覆盖 Switch 根节点及分部件接口的受控、表单提交和重置，以及选中事件传播和视觉状态。', {
    WithinForm: '收集多个 Switch 字段的选中变化及提交数据，展示表单级与字段级事件。',
    WithinFormReset: '将受控和非受控 Switch 放入表单，展示重置后选中状态的差异。',
    Parts: '使用提供器与触发器等分部件组装受控开关。',
    PartsWithinForm: '以分部件接口构造开关表单，展示提交数据与变化事件的传播。'
  }],
  'tabs': ['展示 Tabs 标签与面板切换、状态动画及多布局视觉回归场景。', {}],
  'toast': ['演示 Toast 多消息队列、异步保存、对话框联动、滑动动画及自定义播报容器，并覆盖计时暂停恢复。', {
    Controlled: '分别维护升级、订阅、错误和保存消息状态，通过按钮及定时器生成受控通知。',
    FromDialog: '从对话框操作中触发 Toast，展示模态交互与通知内容的协作。',
    Promise: '模拟异步保存任务，在等待期间控制通知状态并在任务完成后更新内容。',
    KeyChange: '更新通知的 React key，检验重建消息时的展示和计时行为。',
    PauseResumeProps: '动态增加通知数量，展示暂停及恢复回调属性的使用。',
    Animated: '切换滑动方向并使用定时器重开通知，展示 Toast 入场、离场与滑动动画。',
    Cypress: '提供可累积通知的测试页面，为消息关闭及队列行为的端到端验证服务。',
    CustomAnnouncerContainer: '通过引用指定无障碍播报容器，并以受控开关演示通知在自定义容器中的播报。',
    ToastUpgradeAvailable: '渲染升级可用通知及相关操作，供受控通知故事复用。',
    ToastSubscribeSuccess: '渲染订阅成功通知，并应用成功标题样式。',
    ToastWithProgress: '在 Toast 中显示进度，在暂停及恢复事件中同步动画暂停状态。'
  }],
  'toggle-group': ['演示 ToggleGroup 单选、多选、垂直排列和受控状态，并提供视觉与端到端回归场景。', {
    Single: '维护受控单选值并展示单选切换按钮组的使用。',
    Vertical: '设置垂直方向排列切换按钮组，演示纵向导航布局。',
    Multiple: '使用数组状态维护多个激活项目，演示受控多选切换组。',
    Cypress: '提供切换按钮组交互页面，供端到端测试验证项目选择。'
  }],
  'toggle': ['展示 Toggle 的基础样式、受控按下状态及视觉回归组合。', {}],
  'toolbar': ['组合 Toolbar 按钮、链接和切换组，展示方向与布局变化下的工具栏。', {
    ToolbarExample: '依据标题、文字方向和布局方向构造工具栏，组合切换项、链接及独立按钮。'
  }],
  'tooltip': ['覆盖 Tooltip 延迟、内容定制、定位、可访问名称、外部引用、卸载和悬停策略，以及对话框和滚动容器组合。', {
    CustomDurations: '排列多个 Provider 与提示实例，对比延迟配置和连续触发时的开启行为。',
    CustomContent: '在 Tooltip 中组合不同自定义内容，验证复杂内容的显示。',
    Positions: '排列多个方位和对齐方式，展示 Tooltip 相对触发器的位置。',
    AriaLabel: '使用独立的 aria-label 提供无障碍名称，展示播报文本与可见内容的区别。',
    WithText: '以文字元素作为触发内容，演示行内文字上的 Tooltip。',
    WithExternalRef: '创建外部引用并在副作用中访问触发元素，验证引用转发。',
    Unmount: '动态卸载提示相关元素，检验显示中的 Tooltip 随组件移除而清理。',
    SlottableContent: '以自定义子元素承载 Tooltip 内容，演示内容属性的插槽合并。',
    WithinDialog: '将 Tooltip 放入对话框，检验浮层嵌套和焦点交互。',
    KeepOpenOnActivation: '取消触发器激活事件的默认行为，展示点击后保持 Tooltip 打开的策略。',
    WithinScrollable: '在可滚动区域中展示 Tooltip，观察滚动与浮层定位的关系。',
    DisableHoverableContent: '比较禁用内容悬停与允许悬停的行为，检验指针进入提示区域时的关闭策略。',
    SimpleTooltip: '封装根节点、触发器和内容，并转发开关控制及无障碍名称，简化多个故事的提示构造。'
  }],
  'visually-hidden': ['展示 VisuallyHidden 内容在视觉隐藏后仍可由辅助技术访问的用法。', {Basic: '渲染包含视觉隐藏内容的基础示例，展示屏幕阅读器可访问的隐藏文字。'}],
  'apps/storybook/tsconfig.json': ['继承共享 React 库编译配置，将 stories 和 CSS 类型声明纳入 Storybook 的类型检查。', {}],
  'e2e/tsconfig.json': ['为端到端测试配置 ES2022、DOM 与 Node 类型、Bundler 模块解析和严格检查，并关闭代码输出。', {}],
  'internal/builder/builder.js': ['并行生成 CJS、ESM 与类型声明产物，并清理类型文件中的 React 模块扩展，避免发布类型向使用方泄漏全局声明。', {
    build: '读取包清单并选择入口，以 esbuild 并行输出 CJS 和 ESM、以 tsup 生成声明，最后清理 React 模块扩展；对 radix-ui 子路径和 env-check 额外入口作专门处理。',
    stripLeakedReactModuleAugmentations: '递归收集输出目录中的 .d.ts 与 .d.mts 声明文件，并并行执行 React 模块扩展清理。',
    stripReactModuleAugmentationsFromDeclarationFile: '读取单个类型声明文件，删除 React 模块扩展，并只在内容发生变化时写回。',
    removeReactModuleAugmentations: '定位 declare module react 块，查找匹配结束括号并移除扩展及尾部分隔符，保留其余声明；不闭合的块会抛错。',
    getMatchingClosingBraceIndex: '按括号深度查找指定起始花括号的结束位置，并跳过字符串、行注释和块注释中的括号。',
    skipStringLiteral: '跳过带单引号、双引号或反引号的字符串，跨过反斜杠转义以避免误判结束引号。',
    skipLineComment: '从行注释起始位置扫描到换行符，返回括号匹配器可继续扫描的位置。',
    skipBlockComment: '扫描到块注释结束符并返回其后位置；未找到结束符时返回文本末尾。'
  }],
  'internal/builder/package.json': ['声明内部构建器的模块导出及 radix-build 命令入口，并固定 esbuild 和 tsup 构建依赖。', {}],
  'internal/builder/radix-build.js': ['读取命令行指定包目录并调用 build，处理未捕获异步错误以及进程中断和终止信号。', {}],
  'internal/builder/tsconfig.json': ['继承共享基础配置，允许检查构建器 JavaScript，设置根目录并关闭编译输出。', {}],
  'internal/test-data/foods.ts': ['导出带可选分组标签、项目值与禁用标记的食品数据，为菜单和选择类组件故事提供一致测试内容。', {}],
  'internal/test-data/package.json': ['以通配子路径导出内部 TypeScript 测试数据，并声明检查脚本和共享编译配置依赖。', {}],
  'internal/test-data/tsconfig.json': ['为内部测试数据继承基础 TypeScript 配置，指定当前根目录与 dist 输出目录，并排除依赖及构建产物。', {}],
  'internal/test-utils/package.json': ['将内部测试工具按通配子路径导出为 TSX，并声明 React、Testing Library 与 Vitest 的开发及宿主依赖。', {}],
  'internal/test-utils/ref-stability.tsx': ['提供组合 ref 稳定性回归断言，通过稳定引用触发重新渲染并限制渲染次数，检测引用反复拆装导致的循环更新。', {
    assertStableComposedRef: '用具有稳定回调 ref 的 Probe 渲染被测组件，断言渲染不抛错且次数少于阈值，定位组合 ref 在 React 19 中反复拆装导致的循环。'
  }]
};
