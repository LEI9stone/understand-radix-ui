// @ts-check
// 将源码审阅已确认但官方提取器漏掉的单选组forwardRef组件补入既有批次。
const fs = require('node:fs');
const graphPath = '.ua/intermediate/batch-8.json';
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const base = 'packages/react/radio-group/src/';
// 范围来自专项代理完整源码审阅；摘要据部件的真实状态、键盘和表单职责撰写。
const declarations = [
 ['radio-group.tsx','RadioGroup',65,135,'组织单选值、方向与游走焦点，并在关联表单重置时恢复初始选中项。'],
 ['radio-group.tsx','RadioGroupItemTrigger',187,244,'让方向键导致的聚焦触发点击选中，同时阻止 Enter 的默认激活行为。'],
 ['radio-group.tsx','RadioGroupItem',256,285,'将选项 Provider、触发器与表单隐藏输入组合成传统单选项 API。'],
 ['radio-group.tsx','RadioGroupItemBubbleInput',296,306,'将单选组作用域转换为底层 Radio 作用域，并转发表单隐藏输入属性。'],
 ['radio-group.tsx','RadioGroupIndicator',316,326,'把组级作用域和属性传给底层 RadioIndicator，复用其按选中状态挂载的行为。'],
 ['radio.tsx','RadioTrigger',118,168,'提供 ARIA radio 按钮，记录实际用户点击和消费者的传播阻止，避免表单重复收到点击。'],
 ['radio.tsx','Radio',182,218,'通过 Provider、Trigger 与隐藏输入组合整体单选按钮 API，并保持 ref 透传。'],
 ['radio.tsx','RadioIndicator',236,251,'使用 Presence 根据选中状态或强制挂载选项显示指示器。'],
 ['radio.tsx','RadioBubbleInput',262,380,'区分真实点击与程序更新，更新原生 checked 并协调表单 click/change 传播与尺寸。'],
];
for(const [filename,name,start,end,summary] of declarations) {
 const filePath=base+filename; const id=`function:${filePath}:${name}`;
 graph.nodes.push({id,type:'function',name,filePath,lineRange:[start,end],summary,tags:['单选部件','可访问性','表单协作'],complexity:end-start>100?'complex':end-start>=30?'moderate':'simple'});
 for(const [type,weight] of [['contains',1],['exports',0.8]]) graph.edges.push({source:`file:${filePath}`,target:id,type,direction:'forward',weight});
}
// 明确的源码依赖以语义关系补充，不修改官方预解析的imports映射。
for(const [filename,dependencies] of [['radio-group.tsx',['compose-refs','context','primitive','roving-focus','use-controllable-state','direction']],['radio.tsx',['compose-refs','context','use-size','presence','primitive']]]) {
 for(const dependency of dependencies) graph.edges.push({source:`file:${base}${filename}`,target:`file:packages/react/${dependency}/src/${dependency}.tsx`,type:'depends_on',direction:'forward',weight:0.6});
}
graph.nodes=[...new Map(graph.nodes.map(node=>[node.id,node])).values()];
graph.edges=[...new Map(graph.edges.map(edge=>[`${edge.source}|${edge.target}|${edge.type}`,edge])).values()];
fs.writeFileSync(graphPath,JSON.stringify(graph,null,2));
console.log(`Radio supplementation: ${graph.nodes.length} nodes, ${graph.edges.length} edges.`);
