// @ts-check
import fs from 'node:fs';
import {component,edge} from './worker-3-serialize.mjs';
const scroll='packages/react/scroll-area/src/scroll-area.tsx';
// 补齐已读取源码中未被结构解析器枚举的内部forwardRef组件。
const scrollExtras=[
 ...component(scroll,'ScrollAreaViewportStyle',266,279,'渲染隐藏各浏览器原生滚动条的样式，并按 nonce 缓存样式节点。',false),
 ...component(scroll,'ScrollAreaScrollbarHover',363,404,'监听根区域指针进入和离开，取消或安排隐藏定时器，并结合溢出检测与 Presence 显示滚动条。',false),
 ...component(scroll,'ScrollAreaScrollbarAuto',486,514,'观察视口和内容尺寸，只在对应轴溢出时显示滚动条，并用防抖合并尺寸变化。',false),
 ...component(scroll,'ScrollAreaScrollbarVisible',526,606,'维护滑块引用与尺寸快照，选择横轴或纵轴实现并把拖动和滚动距离映射为滑块位移。',false),
 ...component(scroll,'ScrollAreaScrollbarX',628,682,'为横向轨道计算 RTL 位置、宽度和边距，连接水平滚轮及拖动行为。',false),
 ...component(scroll,'ScrollAreaScrollbarY',684,739,'为纵向轨道计算上下边界与滑块高度，连接垂直滚轮及拖动行为。',false),
 ...component(scroll,'ScrollAreaThumbImpl',907,971,'在原生滚动开始后启动动画帧位置同步，记录滑块内抓取偏移并在滚动结束时清理监听。',false),
 ...component(scroll,'ScrollAreaCornerImpl',1000,1049,'观察双轴滚动条尺寸以填充交点，并在卸载时清零共享角落变量，避免残留空隙。',false)
];
const b9=JSON.parse(fs.readFileSync('.ua/intermediate/batch-9.json','utf8'));for(const x of scrollExtras){if(x.id)b9.nodes.push(x);else b9.edges.push(x);}fs.writeFileSync('.ua/intermediate/batch-9.json',JSON.stringify(b9,null,2)+'\n');
// 全局测试环境中的显式类表达式有多个方法，补入其模拟器角色。
const b93=JSON.parse(fs.readFileSync('.ua/intermediate/batch-93.json','utf8'));const p='scripts/setup-tests.ts',id=`class:${p}:ResizeObserver`;
b93.nodes.push({id,type:'class',name:'ResizeObserver',filePath:p,lineRange:[7,17],summary:'为 jsdom 提供最小 ResizeObserver 模拟，在 observe 时向回调返回零尺寸边框盒，并暴露取消观察和断开接口。',tags:['测试模拟','尺寸观察','环境补齐'],complexity:'simple'});b93.edges.push(edge(`file:${p}`,id,'contains'));fs.writeFileSync('.ua/intermediate/batch-93.json',JSON.stringify(b93,null,2)+'\n');
console.log('Patched scroll-area internal components and setup ResizeObserver class.');
