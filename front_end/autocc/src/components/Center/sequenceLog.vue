<script setup>
import { onMounted, watch } from 'vue';
import * as d3 from 'd3';
import { useChatStore } from '@/stores/useChatStore.js';
import { storeToRefs } from 'pinia';
// 树结构数据

const store = useChatStore();
const { sequence_log, current_clicked_node_info } = storeToRefs(store);
const data = sequence_log.value; //正式开发的时候用这个代码，下面的代码为演示用

onMounted(() => {

    let customIdMap = new Map(); // 全局唯一，存储自定义 ID
    /***********************************************
     * 全局颜色面板 & 其他全局变量
     ***********************************************/
    // const runColorPanel = ["#66c2a4", "#fc8d62", "#5d5cce"];
    const runColorPanel = ["#ffffff","#91e2c1", "#6da9ff", "#6458e3"];//修改节点颜色：绿、蓝、紫
    const colorPanel = ["#ffffff", "#8ea0cb", "#66c2a4", "#fc8d62"];
    const linkColorPanel = ["#2d2736", "#767171", "#afabab", "#d0cece", "#f4f4f4"]
    const circleRadius = 25; // 节点半径
    const defaultMargin = 5;
    const defaultFontSize = "14px";

    const arrowClockwisePath = `
    M 8 3
    A 5 5 0 1 0 12.546 5.914
    A 0.5 0.5 0 0 1 13.454 5.497
    A 6 6 0 1 1 8 2
    M 8 4.466
    V 0.534
    A 0.25 0.25 0 0 1 8.41 0.342
    L 10.77 2.308
    C 10.89 2.408 10.89 2.592 10.77 2.692
    L 8.41 4.658
    A 0.25 0.25 0 0 1 8 4.466
`;

    const arrowRadialPath = "M8.0394 9.54416L6.60772 8.87655L5.10561 12.0978L2.78424 11.0154L4.52703 15.2075L8.85867 13.8479L6.5373 12.7654L8.0394 9.54416ZM9.26871 7.70887L8.59252 9.15897L11.9877 10.7421L10.8768 13.1244L15.2505 11.3809L13.7361 6.99262L12.6638 9.29205L9.26871 7.70887ZM6.54725 8.20524L7.22344 6.75515L6.67122 6.49764L3.8283 5.17197C4.89894 2.87599 5.00496 2.70649 4.90055 2.87254L0.749553 4.61903L2.04123 9.00436L3.15211 6.62206L6.54725 8.20524ZM7.77656 6.36996L9.20824 7.03757L10.7104 3.81629L13.0317 4.89876L11.2889 0.706594L6.95729 2.06621L9.27866 3.14868L7.77656 6.36996Z"

    const arrowChordPath = `
    M 8.75 0.997 Q 8.754 2.238 8.661 3.851
    Q 8.474 7.105 7.976 9.037
    Q 7.463 11.03 6.452 12.472
    Q 6.127 12.936 5.784 13.291
    Q 5.598 13.484 5.465 13.588
    L 4.535 12.412
    Q 4.588 12.369 4.704 12.249
    Q 4.966 11.978 5.224 11.611
    Q 6.079 10.392 6.524 8.663
    Q 6.985 6.873 7.164 3.765
    Q 7.254 2.198 7.25 1.003
    L 8.75 0.997 Z

    M 8 1.75
    C 7.586 1.75 7.25 1.414 7.25 1
    C 7.25 0.586 7.586 0.25 8 0.25
    C 8.414 0.25 8.75 0.586 8.75 1
    C 8.75 1.414 8.414 1.75 8 1.75 Z

    M 3.994 14.947
    L 3.336 10.999
    L 7.940 14.239
    L 3.994 14.947 Z

    M 8.713 0.767
    Q 8.972 1.56 9.418 2.558
    Q 10.291 4.509 11.157 5.43
    Q 12.012 6.34 13.198 6.902
    Q 13.567 7.077 13.921 7.195
    Q 14.087 7.25 14.17 7.27
    L 13.83 8.73
    Q 13.68 8.695 13.448 8.618
    Q 13.007 8.472 12.555 8.258
    Q 11.113 7.574 10.063 6.457
    Q 9.025 5.352 8.049 3.17
    Q 7.571 2.101 7.287 1.233
    L 8.713 0.767 Z

    M 8 1.75
    C 7.586 1.75 7.25 1.414 7.25 1
    C 7.25 0.586 7.586 0.25 8 0.25
    C 8.414 0.25 8.75 0.586 8.75 1
    C 8.75 1.414 8.414 1.75 8 1.75 Z

    M 15.973 8.57
    L 12.39 10.354
    L 14.141 5.004
    L 15.973 8.57 Z
`;


    const spacingX = 50;  // 纵向间距 (控制垂直方向)
    const spacingY = 50;  // 横向间距 (控制水平方向)

    function generateRandomStatus() {
        return Math.floor(Math.random() * 3);
    }
    function generateRandomType() {
        const types = ["chord", "circular", "radial"];
        return types[Math.floor(Math.random() * types.length)];
    }

    function getCubicPointAndAngle(x1, y1, cx1, cy1, cx2, cy2, x2, y2, t = 0.5) {
        const inv = 1 - t;
        const inv2 = inv * inv;
        const inv3 = inv2 * inv;
        const t2 = t * t;
        const t3 = t2 * t;
        // B(t)
        const bx = inv3 * x1
            + 3 * inv2 * t * cx1
            + 3 * inv * t2 * cx2
            + t3 * x2;
        const by = inv3 * y1
            + 3 * inv2 * t * cy1
            + 3 * inv * t2 * cy2
            + t3 * y2;
        // B'(t)
        const bdx = 3 * inv2 * (cx1 - x1)
            + 6 * inv * t * (cx2 - cx1)
            + 3 * t2 * (x2 - cx2);
        const bdy = 3 * inv2 * (cy1 - y1)
            + 6 * inv * t * (cy2 - cy1)
            + 3 * t2 * (y2 - cy2);

        const angleRad = Math.atan2(bdy, bdx);
        const angleDeg = angleRad * 180 / Math.PI;
        return { x: bx, y: by, angleDeg };
    }

    /***********************************************
     * 自定义连线 (二次贝塞尔) 帮助函数
     ***********************************************/
    function lineSegmentDistance(px, py, x1, y1, x2, y2) {
        const A = { x: x1, y: y1 };
        const B = { x: x2, y: y2 };
        const P = { x: px, y: py };

        const AB = { x: B.x - A.x, y: B.y - A.y };
        const AP = { x: P.x - A.x, y: P.y - A.y };

        const ab2 = AB.x * AB.x + AB.y * AB.y;
        const ap_dot_ab = AP.x * AB.x + AP.y * AB.y;
        let t = ap_dot_ab / ab2;
        t = Math.max(0, Math.min(1, t));
        const C = { x: A.x + t * AB.x, y: A.y + t * AB.y };
        const dx = P.x - C.x;
        const dy = P.y - C.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getQuadraticPath(x1, y1, x2, y2, nodeList) {
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        let cx = midX, cy = midY;

        const threshold = 30;
        let needOffset = false;

        // 判断是否需要偏移 (检测是否有节点靠近线段)
        for (const nd of nodeList) {
            if ((nd.x === x1 && nd.y === y1) || (nd.x === x2 && nd.y === y2)) continue;
            const dist = lineSegmentDistance(nd.x, nd.y, x1, y1, x2, y2);
            if (dist < threshold) {
                needOffset = true;
                break;
            }
        }

        if (needOffset) {
            let dxLine = x2 - x1;
            let dyLine = y2 - y1;
            const lenLine = Math.sqrt(dxLine * dxLine + dyLine * dyLine);
            dxLine /= lenLine;
            dyLine /= lenLine;

            // 法向量
            let nx = -dyLine;
            let ny = dxLine;

            // 找最近节点, 判断是否翻转
            let minDist = Infinity, closestNode = null;
            for (const nd of nodeList) {
                if ((nd.x === x1 && nd.y === y1) || (nd.x === x2 && nd.y === y2)) continue;
                const dist = lineSegmentDistance(nd.x, nd.y, x1, y1, x2, y2);
                if (dist < minDist) {
                    minDist = dist;
                    closestNode = nd;
                }
            }
            if (closestNode) {
                const dxMid = closestNode.x - midX;
                const dyMid = closestNode.y - midY;
                const dot = dxMid * nx + dyMid * ny;
                if (dot < 0) {
                    nx = -nx;
                    ny = -ny;
                }
            }
            const offset = 70;
            cx = midX + nx * offset;
            cy = midY + ny * offset;
        }

        return {
            d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`,
            cx, cy
        };
    }

    function getQuadraticPointAndAngle(x1, y1, cx, cy, x2, y2, t = 0.5) {
        const inv = 1 - t, inv2 = inv * inv, t2 = t * t;
        const bx = inv2 * x1 + 2 * inv * t * cx + t2 * x2;
        const by = inv2 * y1 + 2 * inv * t * cy + t2 * y2;

        const dx = 2 * inv * (cx - x1) + 2 * t * (x2 - cx);
        const dy = 2 * inv * (cy - y1) + 2 * t * (y2 - cy);

        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * 180 / Math.PI;
        return { x: bx, y: by, angleDeg };
    }

    /***********************************************
     * 动态获取容器宽高
     ***********************************************/
    const containerDiv = document.getElementById('graphContainer');

    // 先读一次当前容器大小
    let { width, height } = containerDiv.getBoundingClientRect();

    // 选择SVG
    const svg = d3.select("#mySvg").attr("viewBox", `0 0 ${width} ${height}`);

    // 添加渐变定义
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "linkGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "10%")
        .attr("stop-color", "#6da9ff");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#92e4c0");

    // 缩放
    const zoom = d3.zoom()
        .filter(e => !e.type.includes("dblclick"))
        .on("zoom", (evt) => {
            if (!isDragging) container.attr("transform", evt.transform);
        });

    // 响应画布缩放
    svg.call(zoom);
    // 当窗口（或容器）大小改变时，更新宽高和 viewBox：
    window.addEventListener('resize', onResize);

    function onResize() {
        // 重新获取容器的大小
        const rect = containerDiv.getBoundingClientRect();
        width = rect.width;
        height = rect.height;

        // 更新 SVG 的 viewBox
        svg.attr("viewBox", `0 0 ${width} ${height}`);

        // 如果想让节点重新布局，或者辅助线等都要重新适配，
        // 这里可以视需求调用 updateLinks() 等方法
        updateLinks();
    }

    // 在 svg 中添加一个 <g> 作为容器
    const container = svg.append("g").attr("class", "container");
    
    // 修改层级顺序：先添加参考线层，然后是连线层，最后是节点层
    // 1. 首先添加参考线层
    const guideLineLayer = container.append("g").attr("class", "guideLineLayer");
    // 2. 然后是连线层
    const linkLayer = container.append("g").attr("class", "linkLayer");
    // 3. 最后是节点层
    const nodeLayer = container.append("g").attr("class", "nodeLayer");

    // 把添加参考线的函数调用移到这里，紧接着层级定义之后
    // 添加垂直参考线
    const xPositions = [...new Set(data.map(d => d.x))].sort((a, b) => a - b);
    // guideLineLayer.selectAll("line")
    //     .data(xPositions)
    //     .enter()
    //     .append("line")
    //     .attr("x1", d => d)
    //     .attr("x2", d => d)
    //     .attr("y1", 0)
    //     .attr("y2", height * 3)
    //     .attr("stroke", "#e0e0e0")
    //     .attr("stroke-width", 3)
    //     .attr("stroke-dasharray", "4,4");

    /***********************************************
     * 用 d3.stratify + d3.tree() 来优化节点布局
     ***********************************************/
    const stratify = d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parent);

    const rootHierarchy = stratify(data);
    console.log(rootHierarchy)

    // 定义 d3.tree 布局: size([height-100, width-200]) 保留一些边距
    const treeLayout = d3.tree().size([height - 200, width - 200]);

    // 应用布局
    treeLayout(rootHierarchy);

    // 2. 调整根节点，使其对齐左侧
    rootHierarchy.x = 0; // 根节点 `y` 设为 0，左对齐

    // 3. 让第一条分支水平对齐
    if (rootHierarchy.children) {
        let firstChild = rootHierarchy.children[0]; // 取第一个子节点
        firstChild.x = rootHierarchy.x; // 让它和根节点 `x` 坐标一致

        if (firstChild.children) {
            let firstGrandChild = firstChild.children[0]; // 取第一个子节点的第一个子节点
            firstGrandChild.x = firstChild.x;  // 让它的 `x` 也与上一级一致
        }
    }

    // 4. 让同级兄弟节点在 `x` 方向上均匀分布
    const depthMap = new Map(); // 记录每层的节点

    rootHierarchy.descendants().forEach(node => {
        if (!depthMap.has(node.depth)) {
            depthMap.set(node.depth, []);
        }
        depthMap.get(node.depth).push(node);
    });

    // 5. 遍历每层节点，区分分支，均匀调整 `x` 位置，避免重叠
    depthMap.forEach(nodes => {
        nodes.sort((a, b) => d3.ascending(a.parent ? a.parent.id : a.id, b.parent ? b.parent.id : b.id)); // 先按分支排序

        let branchMap = new Map(); // 记录每个分支的子节点
        nodes.forEach(node => {
            let parentId = node.parent ? node.parent.id : "root";
            if (!branchMap.has(parentId)) {
                branchMap.set(parentId, []);
            }
            branchMap.get(parentId).push(node);
        });

        let startX = nodes[0].x; // 最左侧起点
        let branchSpacing = spacingX * 0.5; // 不同分支之间的间距
        let localSpacing = spacingX * 0.8; // 同一分支子节点间距

        let currentX = startX;

        branchMap.forEach((branchNodes, parentId) => {
            branchNodes.forEach((node, i) => {
                node.x = currentX + i * localSpacing; // 同一分支的节点间隔小
            });
            currentX += branchNodes.length * localSpacing + branchSpacing; // 移动到下一个分支
        });
    });

    // 6. 应用新的 `x, y` 位置
    rootHierarchy.descendants().forEach(node => {
        const d = node.data;
        d.x = 100 + node.y; // y 变 x, 控制水平方向
        d.y = 50 + node.x;  // x 变 y, 控制垂直方向
    });



    // 建立节点查表
    const nodeMap = new Map(data.map(d => [d.id, d]));

    let isDragging = false;
    const verticalLine = nodeLayer.append("line")
        .attr("stroke", linkColorPanel[2])
        .attr("stroke-dasharray", "4,2")
        .attr("visibility", "hidden");

    // 建立节点id
    function generateCustomDataId(data) {
        const nodeMap = new Map();
        const childrenMap = new Map();

        data.forEach(d => {
            nodeMap.set(d.id, d);
            if (d.parent) {
                if (!childrenMap.has(d.parent)) {
                    childrenMap.set(d.parent, []);
                }
                childrenMap.get(d.parent).push(d);
            }
        });

        let rootCount = 0;


        function assignCustomId(node, parentId = null) {
            let customId;
            if (!parentId) {
                rootCount++;
                customId = `root${rootCount}`;
            } else {
                const siblings = (childrenMap.get(node.parent) || []).sort((a, b) => a.id - b.id);
                const index = siblings.indexOf(node) + 1;
                customId = `${parentId}-${index}`;
            }

            customIdMap.set(node.id, customId);

            if (childrenMap.has(node.id)) {
                childrenMap.get(node.id).forEach(child => assignCustomId(child, customId));
            }
        }

        data.forEach(d => {
            if (!d.parent) {
                assignCustomId(d);
            }
        });

        return customIdMap;
    }

    // 用户自定义(二次)连线
    const customLinks = [];

    // 只允许 Y方向拖拽
    const drag = d3.drag()
        .on("start", (event, d) => {
            isDragging = true;
            svg.on(".zoom", null); // 取消缩放
        })
        .on("drag", (event, d) => {
            // 1. 获取当前容器的实际高度
            const rect = containerDiv.getBoundingClientRect();
            height = rect.height; // 动态更新容器高度

            // 2. 获取当前缩放比例和偏移量
            const t = d3.zoomTransform(svg.node());
            const k = t.k; // 缩放比例

            // 3. 计算鼠标在 SVG 里的位置，并转换到 nodeLayer 坐标系
            const [mx, my] = d3.pointer(event, svg.node());
            const newY = (my - t.y) / k;

            // 4. 计算当前可视区域的最小和最大 Y 坐标
            const yMin = -t.y / k;            // 视图顶部在 nodeLayer 坐标
            const yMax = yMin + (height / k); // 视图底部在 nodeLayer 坐标

            // 5. 限制拖拽范围，防止超出可视区域
            d.y = Math.max(yMin, Math.min(yMax, newY));

            // 6. 更新节点位置
            d3.select(`[data-id='${customIdMap.get(d.id)}']`)
                .attr("transform", `translate(${d.x},${d.y})`);

            // 7. 更新辅助线
            verticalLine
                .attr("x1", d.x)
                .attr("x2", d.x)
                .attr("y1", yMin) // 限制辅助线在当前视图内
                .attr("y2", yMax)
                .attr("visibility", "visible");

            // 8. 更新连线
            updateLinks();
        })
        .on("end", () => {
            isDragging = false;
            verticalLine.attr("visibility", "hidden");
            svg.call(zoom); // 重新启用缩放
        });


    /***********************************************
     * 树形连线(三次贝塞尔) + 中点箭头
     ***********************************************/
    // 生成 <g> 存放 path + polygon
    const treeLinkGroups = linkLayer.selectAll("g.treeLinkGroup")
        .data(data.filter(d => d.parent), d => d.id)
        .enter()
        .append("g")
        .attr("class", "treeLinkGroup");

    // 三次贝塞尔曲线 path
    treeLinkGroups.append("path").attr("class", "treeLink").attr("fill", "none");
    // 箭头 polygon
    // treeLinkGroups.append("polygon")
    //     .attr("class", "treeArrow")
    //     .attr("points", "0,-5 10,0 0,5 3,0")
    //     .attr("stroke", "url(#linkGradient)")

    function updateLinks() {
        // a) 树形连线(三次贝塞尔)
        linkLayer.selectAll("g.treeLinkGroup").each(function (d) {
            const parent = nodeMap.get(d.parent);
            const child = nodeMap.get(d.id);

            const x1 = parent.x, y1 = parent.y;
            const x2 = child.x, y2 = child.y;
            const midX = (x1 + x2) / 2;

            const cubicPath = `
        M${x1},${y1}
        C${midX},${y1}
         ${midX},${y2}
         ${x2},${y2}
      `.trim();

            d3.select(this).select("path.treeLink")
                .attr("stroke", "url(#linkGradient)")
                .attr("stroke-width", 2)
                .attr("d", cubicPath);

            // 箭头放在三次贝塞尔曲线中点(t=0.5)
            const { x: arrowX, y: arrowY, angleDeg } = getCubicPointAndAngle(
                x1, y1, midX, y1, midX, y2, x2, y2, 0.5
            );
            d3.select(this).select("polygon.treeArrow")
                .attr("fill", linkColorPanel[1])
                .attr("transform", `translate(${arrowX},${arrowY}) rotate(${angleDeg})`);
        });

        // b) 自定义连线(二次贝塞尔)
        const customLinkGroupsSel = linkLayer.selectAll("g.customLink")
            .data(customLinks, l => l.id);

        customLinkGroupsSel.select("path.finalLink")
            .attr("stroke", "url(#linkGradient)")
            .each(function (d) {
                const source = nodeMap.get(d.sourceId);
                const target = nodeMap.get(d.targetId);

                const { d: pathStr, cx, cy } = getQuadraticPath(
                    source.x, source.y,
                    target.x, target.y,
                    data
                );
                d3.select(this).attr("d", pathStr);

                // 箭头在二次曲线中点
                const { x: midX, y: midY, angleDeg } =
                    getQuadraticPointAndAngle(source.x, source.y, cx, cy, target.x, target.y, 0.5);

                d3.select(this.parentNode).select("polygon.arrowHead")
                    .attr("fill", linkColorPanel[1])
                    .attr("transform", `translate(${midX},${midY}) rotate(${angleDeg})`);
            });
    }

    // 初次更新
    updateLinks();

    customIdMap = generateCustomDataId(data); // 计算 data-id
    /***********************************************
     * 绘制节点
     ***********************************************/
    const nodes = nodeLayer.selectAll("g.node")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("data-id", d => customIdMap.get(d.id)) // 初始化保证规则化id
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .call(drag);
    
    // 为每个节点添加垂直虚线（y轴）
    guideLineLayer.selectAll("line.node-guideline")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "node-guideline")
        .attr("x1", d => d.x)
        .attr("x2", d => d.x)
        .attr("y1", 0)
        .attr("y2", height * 3) // 足够长以覆盖整个视图区域
        .attr("stroke", "#cccccc") // 灰色
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,3"); // 虚线样式
    
    // 更新连线函数中添加对垂直虚线的更新
    function updateLinks() {
        // a) 树形连线(三次贝塞尔)
        linkLayer.selectAll("g.treeLinkGroup").each(function (d) {
            const parent = nodeMap.get(d.parent);
            const child = nodeMap.get(d.id);

            const x1 = parent.x, y1 = parent.y;
            const x2 = child.x, y2 = child.y;
            const midX = (x1 + x2) / 2;

            const cubicPath = `
        M${x1},${y1}
        C${midX},${y1}
         ${midX},${y2}
         ${x2},${y2}
      `.trim();

            d3.select(this).select("path.treeLink")
                .attr("stroke", "url(#linkGradient)")
                .attr("stroke-width", 2)
                .attr("d", cubicPath);

            // 箭头放在三次贝塞尔曲线中点(t=0.5)
            const { x: arrowX, y: arrowY, angleDeg } = getCubicPointAndAngle(
                x1, y1, midX, y1, midX, y2, x2, y2, 0.5
            );
            d3.select(this).select("polygon.treeArrow")
                .attr("fill", linkColorPanel[1])
                .attr("transform", `translate(${arrowX},${arrowY}) rotate(${angleDeg})`);
        });

        // b) 自定义连线(二次贝塞尔)
        const customLinkGroupsSel = linkLayer.selectAll("g.customLink")
            .data(customLinks, l => l.id);

        customLinkGroupsSel.select("path.finalLink")
            .attr("stroke", "url(#linkGradient)")
            .each(function (d) {
                const source = nodeMap.get(d.sourceId);
                const target = nodeMap.get(d.targetId);

                const { d: pathStr, cx, cy } = getQuadraticPath(
                    source.x, source.y,
                    target.x, target.y,
                    data
                );
                d3.select(this).attr("d", pathStr);

                // 箭头在二次曲线中点
                const { x: midX, y: midY, angleDeg } =
                    getQuadraticPointAndAngle(source.x, source.y, cx, cy, target.x, target.y, 0.5);

                d3.select(this.parentNode).select("polygon.arrowHead")
                    .attr("fill", linkColorPanel[1])
                    .attr("transform", `translate(${midX},${midY}) rotate(${angleDeg})`);
            });
    }

    // 更新节点垂直虚线位置
    guideLineLayer.selectAll("line.node-guideline")
        .attr("x1", d => d.x)
        .attr("x2", d => d.x)
        .attr("y1", 0)
        .attr("y2", height * 3);
    nodes.append("circle")
        .attr("r", circleRadius * 3/4)
        .attr("fill", d => runColorPanel[d.status])
        .attr("stroke", linkColorPanel[0])
        .attr("stroke-width", 0.5);
    nodes.append("circle")
        .attr("id", 'circle-padding')
        .attr("r", circleRadius * 3 / 4 - defaultMargin)
        .attr("fill", colorPanel[0]);

    nodes.append("circle")
        .attr("r", circleRadius * 3 / 4 - defaultMargin)
        .attr("stroke", linkColorPanel[1])
        .attr("fill", colorPanel[0]);

    // **增加 SVG 图形（仅适用于 type === "radial"）**
    nodes.filter(d => d.type === "root")
          .append("path")
          .attr("fill", linkColorPanel[0])
          .attr("stroke", linkColorPanel[0])

    nodes.filter(d => d.type === "circular")
        .append("path")
        .attr("d", arrowClockwisePath)
        .attr("fill", linkColorPanel[0])
        .attr("stroke", linkColorPanel[0])
        .attr("stroke-width", 0.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2} ) scale(1.3)`);
    nodes.filter(d => d.type === "radial")
        .append("path")
        .attr("d", arrowRadialPath)
        .attr("fill", linkColorPanel[0])
        .attr("stroke", linkColorPanel[0])
        .attr("stroke-width", 0.1)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);

    nodes.filter(d => d.type === "chord")
        .append("path")
        .attr("d", arrowChordPath)
        .attr("fill", linkColorPanel[0])
        .attr("stroke", linkColorPanel[0])
        .attr("stroke-width", 0.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);

    // 在绘制节点的部分后添加以下代码
    nodes.append("circle") 
        .attr("class", "highlight-circle")
        .attr("r", circleRadius * 3/4 + 3) // 比原始圆稍大一些
        .attr("fill", "none")
        .attr("stroke", "#ff4d4f") // 红色描边
        .attr("stroke-width", 2)
        .style("display", "none"); // 初始时隐藏

    // 修改 nodes 的点击事件
    nodes.on("click", function(event, d) {
        //初次渲染出来的节点选
        nodeLayer.selectAll(".highlight-circle")
            .style("display", "none");
        d3.select(this).select(".highlight-circle")
            .style("display", "block");
        const info = { id: d.id, text: d.text, parent: d.parent ?? null, status: d.status, type: d.type };
        console.log('click_sequence info:', info);
        current_clicked_node_info.value = info;
        console.log('初次渲染current_clicked_node_info:', current_clicked_node_info.value);
    });

    // 在 svg 空白处点击时取消高亮
    svg.on("click", function(event) {
        if (event.target.tagName === "svg") {
            nodeLayer.selectAll(".highlight-circle")
                .style("display", "none");
        }
    });

    watch(current_clicked_node_info, (info) => {
        if (!info || !info.id) return;
        nodeLayer.selectAll(".highlight-circle").style("display", "none");
        nodeLayer.selectAll("g.node")
            .filter(d => d.id === info.id)
            .select(".highlight-circle")
            .style("display", "block");
    }, { immediate: true });

    /***********************************************
     * 文本框功能
     ***********************************************/
    let isEditing = false;
    let currentTextbox = null;

    // 监听 svg dblclick
    svg.on("dblclick", (event) => {
        if (isLinking) return;
        if (isEditing) {
            finalizeTextbox(); 
            return;
        }

        const [sx, sy] = d3.pointer(event, svg.node());
        const tr = d3.zoomTransform(container.node());
        const x = (sx - tr.x) / tr.k, y = (sy - tr.y) / tr.k;
        createTextbox(x, y);
    });

    function createTextbox(x, y) {
        isEditing = true;

        currentTextbox = nodeLayer.append("g")
            .attr("class", "textbox")
            .style("fill", "white")
            .style("stroke", linkColorPanel[0])
            .style("stroke-dasharray", "5,5")
            .style("cursor", "move")
            .attr("transform", `translate(${x},${y})`)
            .call(
                d3.drag().on("drag", function (event) {
                    const transform = d3.zoomTransform(container.node());
                    const [sx, sy] = d3.pointer(event, svg.node());
                    const nx = (sx - transform.x) / transform.k;
                    const ny = (sy - transform.y) / transform.k;
                    d3.select(this).attr("transform", `translate(${nx},${ny})`);
                })
            );

        currentTextbox.append("rect")
            .attr("width", 100)
            .attr("height", 30)
            .attr("x", -50)
            .attr("y", -15)
            .attr("class", "textbox");

        const fo = currentTextbox.append("foreignObject")
            .attr("width", 100)
            .attr("height", 30)
            .attr("x", -50)
            .attr("y", -15);

        const input = fo.append("xhtml:input")
            .attr("type", "text")
            .attr("style", "width:100%;height:30px;font-size:14px;border:none;text-align:center;background-color:transparent;outline:none;padding:0 5px;")
            .on("blur", finalizeTextbox)
            .on("keydown", function (event) {
                if (event.key === "Enter") finalizeTextbox();
            })
            .on("input", function () {
                autoResizeInput(d3.select(this));
            });

        input.node().focus();
    }

    function autoResizeInput(inputSel) {
        const val = inputSel.property("value") || "";
        const measureDiv = document.getElementById("hiddenMeasure");
        measureDiv.style.fontSize = "14px";
        measureDiv.textContent = val === "" ? " " : val;

        const textWidth = measureDiv.getBoundingClientRect().width;
        const padding = 20, minW = 100;
        const newW = Math.max(minW, textWidth + padding);

        currentTextbox.select("rect")
            .attr("width", newW).attr("x", -newW / 2);
        currentTextbox.select("foreignObject")
            .attr("width", newW).attr("x", -newW / 2);
    }

    function finalizeTextbox() {
        if (!currentTextbox) return;
        const inp = currentTextbox.select("input").node();
        const text = inp.value.trim();
        if (text === "") {
            currentTextbox.remove();
        } else {
            currentTextbox.select("foreignObject").remove();
            currentTextbox.select("rect")
                .attr("fill", "none")
                .attr("stroke-dasharray", "5,5");
            currentTextbox.append("text")
                .attr("class", "textbox-text")
                .style("font-size", defaultFontSize)
                .style("text-anchor", "middle")
                .style("fill", linkColorPanel[0])
                .style("stroke", "none")
                .attr("dy", "5")
                .text(text);
        }
        isEditing = false;
        currentTextbox = null;
    }

    /***********************************************
     * 双击节点 -> 自定义连线(二次贝塞尔)
     ***********************************************/
    let isLinking = false;
    let linkSource = null;
    let tempLine = null;

    nodes.on("dblclick", function (event, d) {
        event.stopPropagation();
        if (!isLinking) {
            isLinking = true;
            linkSource = d;
            tempLine = linkLayer.append("path")
                .attr("class", "tempLink")
                .style("stroke-dasharray", "5,2")
                .style("stroke", linkColorPanel[0])
                .style("fill", "none")
                .attr("d", `M${d.x},${d.y} L${d.x},${d.y}`);

            svg.on("mousemove.linkMode", (evt) => {
                const [sx, sy] = d3.pointer(evt, svg.node());
                const tr = d3.zoomTransform(container.node());
                const mx = (sx - tr.x) / tr.k, my = (sy - tr.y) / tr.k;
                tempLine.attr("d", `M${linkSource.x},${linkSource.y} L${mx},${my}`);
            });
        } else {
            isLinking = false;
            svg.on("mousemove.linkMode", null);
            if (d === linkSource) {
                tempLine.remove();
            } else {
                const linkId = `L_${linkSource.id}_${d.id}`;
                customLinks.push({
                    id: linkId,
                    sourceId: linkSource.id,
                    targetId: d.id
                });
                tempLine.remove();

                const customLinkGroups = linkLayer.selectAll("g.customLink").data(customLinks, l => l.id);
                const linkEnter = customLinkGroups.enter().append("g")
                    .attr("class", "customLink");

                linkEnter.append("path")
                    .attr("class", "finalLink")
                    .attr("stroke-dasharray", "5,2")
                    .attr("fill", "none");
                linkEnter.append("polygon")
                    .attr("class", "arrowHead")
                    .attr("points", "0,-5 10,0 0,5 3,0")
                    .attr("fill", "url(#linkGradient)"); // 使用相同的渐变

                updateLinks();
            }
            tempLine = null;
            linkSource = null;
        }
    });
    

    watch(sequence_log, (newList) => {
        const root = stratify(newList);
        const tree = d3.tree().size([height - 200, width - 200]);
        tree(root);

        if (root.children && root.children.length > 0) {
            const firstChild = root.children[0];
            firstChild.x = root.x;
            if (firstChild.children && firstChild.children.length > 0) {
                const firstGrandChild = firstChild.children[0];
                firstGrandChild.x = firstChild.x;
            }
        }

        const depthMap2 = new Map();
        root.descendants().forEach(node => {
            if (!depthMap2.has(node.depth)) depthMap2.set(node.depth, []);
            depthMap2.get(node.depth).push(node);
        });
        depthMap2.forEach(nodesArr => {
            nodesArr.sort((a, b) => d3.ascending(a.parent ? a.parent.id : a.id, b.parent ? b.parent.id : b.id));
            let branchMap2 = new Map();
            nodesArr.forEach(node => {
                let parentId = node.parent ? node.parent.id : "root";
                if (!branchMap2.has(parentId)) branchMap2.set(parentId, []);
                branchMap2.get(parentId).push(node);
            });
            let startX = nodesArr[0].x;
            let branchSpacing = spacingX * 0.5;
            let localSpacing = spacingX * 0.8;
            let currentX = startX;
            branchMap2.forEach((branchNodes) => {
                branchNodes.forEach((node, i) => { node.x = currentX + i * localSpacing; });
                currentX += branchNodes.length * localSpacing + branchSpacing;
            });
        });

        root.descendants().forEach(node => {
            const d = node.data;
            d.x = 100 + node.y;
            d.y = 50 + node.x;
        });

        nodeMap.clear();
        newList.forEach(d => nodeMap.set(d.id, d));

        customIdMap = generateCustomDataId(newList);

        const nodesSel = nodeLayer.selectAll("g.node").data(newList, d => d.id);
        nodesSel.exit().remove();
        const nodesEnter = nodesSel.enter()
            .append("g")
            .attr("class", "node")
            .attr("data-id", d => customIdMap.get(d.id))
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .call(drag);

        nodesEnter.append("circle")
            .attr("r", circleRadius * 3/4)
            .attr("fill", d => runColorPanel[d.status])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5);
        nodesEnter.append("circle")
            .attr("id", 'circle-padding')
            .attr("r", circleRadius * 3 / 4 - defaultMargin)
            .attr("fill", colorPanel[0]);
        nodesEnter.append("circle")
            .attr("r", circleRadius * 3 / 4 - defaultMargin)
            .attr("stroke", linkColorPanel[1])
            .attr("fill", colorPanel[0]);
        nodesEnter.filter(d => d.type === "root")
            .append("path")
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0]);
        nodesEnter.filter(d => d.type === "circular")
            .append("path")
            .attr("d", arrowClockwisePath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2} ) scale(1.3)`);
        nodesEnter.filter(d => d.type === "radial")
            .append("path")
            .attr("d", arrowRadialPath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.1)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);
        nodesEnter.filter(d => d.type === "chord")
            .append("path")
            .attr("d", arrowChordPath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);
        nodesEnter.append("circle")
            .attr("class", "highlight-circle")
            .attr("r", circleRadius * 3/4 + 3)
            .attr("fill", "none")
            .attr("stroke", "#ff4d4f")
            .attr("stroke-width", 2)
            .style("display", "none");

        //后续变化的
        nodesEnter.on("click", function(event, d) {
            nodeLayer.selectAll(".highlight-circle").style("display", "none");
            d3.select(this).select(".highlight-circle").style("display", "block");
            const info = { id: d.id, text: d.text, parent: d.parent ?? null, status: d.status, type: d.type };
            console.log('click_sequence info:', info);
            current_clicked_node_info.value = info;
            console.log('后续变化的-已经更新-current_clicked_node_info:', current_clicked_node_info.value);
        });
        nodesEnter.on("dblclick", function (event, d) {
            event.stopPropagation();
            if (!isLinking) {
                isLinking = true;
                linkSource = d;
                tempLine = linkLayer.append("path")
                    .attr("class", "tempLink")
                    .style("stroke-dasharray", "5,2")
                    .style("stroke", linkColorPanel[0])
                    .style("fill", "none")
                    .attr("d", `M${d.x},${d.y} L${d.x},${d.y}`);
                svg.on("mousemove.linkMode", (evt) => {
                    const [sx, sy] = d3.pointer(evt, svg.node());
                    const tr = d3.zoomTransform(container.node());
                    const mx = (sx - tr.x) / tr.k, my = (sy - tr.y) / tr.k;
                    tempLine.attr("d", `M${linkSource.x},${linkSource.y} L${mx},${my}`);
                });
            } else {
                isLinking = false;
                svg.on("mousemove.linkMode", null);
                if (d === linkSource) {
                    tempLine.remove();
                } else {
                    const linkId = `L_${linkSource.id}_${d.id}`;
                    customLinks.push({ id: linkId, sourceId: linkSource.id, targetId: d.id });
                    tempLine.remove();
                    const customLinkGroups = linkLayer.selectAll("g.customLink").data(customLinks, l => l.id);
                    const linkEnter = customLinkGroups.enter().append("g").attr("class", "customLink");
                    linkEnter.append("path").attr("class", "finalLink").attr("stroke-dasharray", "5,2").attr("fill", "none");
                    linkEnter.append("polygon").attr("class", "arrowHead").attr("points", "0,-5 10,0 0,5 3,0").attr("fill", "url(#linkGradient)");
                    updateLinks();
                }
                tempLine = null;
                linkSource = null;
            }
        });

        nodesSel.merge(nodesEnter)
            .attr("data-id", d => customIdMap.get(d.id))
            .attr("transform", d => `translate(${d.x},${d.y})`);

        const guideSel = guideLineLayer.selectAll("line.node-guideline").data(newList, d => d.id);
        guideSel.exit().remove();
        const guideEnter = guideSel.enter().append("line")
            .attr("class", "node-guideline")
            .attr("stroke", "#cccccc")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3");
        guideSel.merge(guideEnter)
            .attr("x1", d => d.x)
            .attr("x2", d => d.x)
            .attr("y1", 0)
            .attr("y2", height * 3);

        const linkGroups = linkLayer.selectAll("g.treeLinkGroup").data(newList.filter(d => d.parent), d => d.id);
        linkGroups.exit().remove();
        const linksEnter = linkGroups.enter().append("g").attr("class", "treeLinkGroup");
        linksEnter.append("path").attr("class", "treeLink").attr("fill", "none");
        linksEnter.append("polygon").attr("class", "treeArrow").attr("points", "0,-5 10,0 0,5 3,0").attr("stroke", "url(#linkGradient)");

        updateLinks();
    }, { deep: true });
    // 修改添加垂直参考线的函数实现
    const addVerticalGuideLines = () => {
        const xPositions = [...new Set(data.map(d => d.x))].sort((a, b) => a - b);

        // 使用已经创建的 guideLineLayer 而不是创建新的 g 元素
        guideLineLayer.selectAll("line")
            .data(xPositions)
            .enter()
            .append("line")
            .attr("x1", d => d)
            .attr("x2", d => d)
            .attr("y1", 0)
            .attr("y2", height * 3)
            .attr("stroke", "#fff") // 浅灰色#e0e0e0 纵向参考线
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "4,4");
    };

    // 调用添加参考线函数
    addVerticalGuideLines();

    // 在创建完所有其他元素后，添加图例
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0, 0)"); // 位置会在updateLegend中更新

    // 添加图例项
    const legendData = [
        { color: "#91e2c1", text: "default" },
        { color: "#6da9ff", text: "modify" },
        { color: "#6458e3", text: "saved" }
    ];

    const legendItems = legend.selectAll("g")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item");

    // 添加颜色圆点
    legendItems.append("circle")
        .attr("r", 6)
        .attr("fill", d => d.color);

    // 添加文本
    legendItems.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .style("font-size", "12px")
        .style("fill", linkColorPanel[0])
        .text(d => d.text);

    // 更新图例位置的函数
    function updateLegend() {
        const padding = 20;
        const itemHeight = 25;
        
        // 更新每个图例项的位置
        legendItems.attr("transform", (d, i) => 
            `translate(${width - 100}, ${height - 100 + i * itemHeight})`
        );
    }

    // 初始更新图例位置
    updateLegend();

    // 在窗口调整大小时更新图例位置
    const originalOnResize = onResize;
    onResize = () => {
        originalOnResize();
        updateLegend();
    };
});
</script>

<template>
    <!-- 隐藏测量宽度用的 div -->
    <div id="hiddenMeasure"></div>

    <!-- 简化后的容器结构 -->
    <div id="graphContainer" class="border">
        <svg id="mySvg"></svg>
    </div>
</template>

<style scoped lang="scss">
#graphContainer {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
}

svg {
    width: 100%;
    height: 100%;
    cursor: grab;
}

#hiddenMeasure {
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-family: Arial, sans-serif;
}

.treeLink {
    fill: none;
}
</style>
