<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from "vue";
import * as d3 from "d3";
import { useChatStore } from "@/stores/useChatStore.js";
import { storeToRefs } from "pinia";

const store = useChatStore();
const { sequence_log, current_clicked_node_info, customLinks, TrackIsReusing } = storeToRefs(store);
const data = sequence_log.value;

// 右键菜单相关状态
const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const clickedNodeData = ref(null);
// const customLinks = []; // Moved to store

const closeMenu = () => (showMenu.value = false);

const handleReuseNode = () => {
  if (!clickedNodeData.value) return;

  // 防止复用根节点，避免 d3.stratify 多根报错
  if (!clickedNodeData.value.parent) {
    showMenu.value = false;
    return;
  }

  // Update store state so handleMessage can use it
  current_clicked_node_info.value = clickedNodeData.value;
  TrackIsReusing.value = true;

  showMenu.value = false;
};

onMounted(() => {
  window.addEventListener("click", closeMenu);

  /***********************************************
   * 常量 & 全局变量
   ***********************************************/
  let customIdMap = new Map(); // node.id -> customId
  const runColorPanel = ["#ffffff", "#91e2c1", "#6da9ff", "#6458e3"];
  const colorPanel = ["#ffffff", "#8ea0cb", "#66c2a4", "#fc8d62"];
  const linkColorPanel = ["#2d2736", "#767171", "#afabab", "#d0cece", "#f4f4f4"];
  const circleRadius = 25;
  const defaultMargin = 5;
  const defaultFontSize = "14px";
  const spacingX = 50;

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

  const arrowRadialPath =
    "M8.0394 9.54416L6.60772 8.87655L5.10561 12.0978L2.78424 11.0154L4.52703 15.2075L8.85867 13.8479L6.5373 12.7654L8.0394 9.54416ZM9.26871 7.70887L8.59252 9.15897L11.9877 10.7421L10.8768 13.1244L15.2505 11.3809L13.7361 6.99262L12.6638 9.29205L9.26871 7.70887ZM6.54725 8.20524L7.22344 6.75515L6.67122 6.49764L3.8283 5.17197C4.89894 2.87599 5.00496 2.70649 4.90055 2.87254L0.749553 4.61903L2.04123 9.00436L3.15211 6.62206L6.54725 8.20524ZM7.77656 6.36996L9.20824 7.03757L10.7104 3.81629L13.0317 4.89876L11.2889 0.706594L6.95729 2.06621L9.27866 3.14868L7.77656 6.36996Z";

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

  /***********************************************
   * 几何工具
   ***********************************************/
  function getCubicPointAndAngle(x1, y1, cx1, cy1, cx2, cy2, x2, y2, t = 0.5) {
    const inv = 1 - t;
    const inv2 = inv * inv;
    const inv3 = inv2 * inv;
    const t2 = t * t;
    const t3 = t2 * t;

    const bx = inv3 * x1 + 3 * inv2 * t * cx1 + 3 * inv * t2 * cx2 + t3 * x2;
    const by = inv3 * y1 + 3 * inv2 * t * cy1 + 3 * inv * t2 * cy2 + t3 * y2;

    const bdx = 3 * inv2 * (cx1 - x1) + 6 * inv * t * (cx2 - cx1) + 3 * t2 * (x2 - cx2);
    const bdy = 3 * inv2 * (cy1 - y1) + 6 * inv * t * (cy2 - cy1) + 3 * t2 * (y2 - cy2);

    const angleDeg = (Math.atan2(bdy, bdx) * 180) / Math.PI;
    return { x: bx, y: by, angleDeg };
  }

  function lineSegmentDistance(px, py, x1, y1, x2, y2) {
    const ABx = x2 - x1;
    const ABy = y2 - y1;
    const APx = px - x1;
    const APy = py - y1;

    const ab2 = ABx * ABx + ABy * ABy;
    let t = ab2 === 0 ? 0 : (APx * ABx + APy * ABy) / ab2;
    t = Math.max(0, Math.min(1, t));

    const cx = x1 + t * ABx;
    const cy = y1 + t * ABy;
    const dx = px - cx;
    const dy = py - cy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getQuadraticPath(x1, y1, x2, y2, nodeList) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    let cx = midX,
      cy = midY;

    const threshold = 30;
    let needOffset = Math.abs(x1 - x2) < 5; // Force curve for vertical lines (reuse nodes)

    if (!needOffset) {
      for (const nd of nodeList) {
        if ((nd.x === x1 && nd.y === y1) || (nd.x === x2 && nd.y === y2)) continue;
        if (lineSegmentDistance(nd.x, nd.y, x1, y1, x2, y2) < threshold) {
          needOffset = true;
          break;
        }
      }
    }

    if (needOffset) {
      let dx = x2 - x1;
      let dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= len;
      dy /= len;

      // 法向量
      let nx = -dy,
        ny = dx;

      // 找最近节点决定翻转方向
      let minDist = Infinity,
        closest = null;
      for (const nd of nodeList) {
        if ((nd.x === x1 && nd.y === y1) || (nd.x === x2 && nd.y === y2)) continue;
        const dist = lineSegmentDistance(nd.x, nd.y, x1, y1, x2, y2);
        if (dist < minDist) {
          minDist = dist;
          closest = nd;
        }
      }

      if (closest) {
        const dot = (closest.x - midX) * nx + (closest.y - midY) * ny;
        if (dot < 0) {
          nx = -nx;
          ny = -ny;
        }
      }

      const offset = 70;
      cx = midX + nx * offset;
      cy = midY + ny * offset;
    }

    return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, cx, cy };
  }

  function getQuadraticPointAndAngle(x1, y1, cx, cy, x2, y2, t = 0.5) {
    const inv = 1 - t;
    const bx = inv * inv * x1 + 2 * inv * t * cx + t * t * x2;
    const by = inv * inv * y1 + 2 * inv * t * cy + t * t * y2;

    const dx = 2 * inv * (cx - x1) + 2 * t * (x2 - cx);
    const dy = 2 * inv * (cy - y1) + 2 * t * (y2 - cy);
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { x: bx, y: by, angleDeg };
  }

  /***********************************************
   * DOM / SVG 初始化
   ***********************************************/
  const containerDiv = document.getElementById("graphContainer");
  let { width, height } = containerDiv.getBoundingClientRect();

  const svg = d3.select("#mySvg").attr("viewBox", `0 0 ${width} ${height}`);

  const container = svg.append("g").attr("class", "container");
  const guideLineLayer = container.append("g").attr("class", "guideLineLayer");
  const linkLayer = container.append("g").attr("class", "linkLayer");
  const nodeLayer = container.append("g").attr("class", "nodeLayer");

  // 渐变
  const gradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "linkGradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");
  gradient.append("stop").attr("offset", "10%").attr("stop-color", "#6da9ff");
  gradient.append("stop").attr("offset", "100%").attr("stop-color", "#92e4c0");

  let isDragging = false;
  const zoom = d3
    .zoom()
    .filter((e) => !e.type.includes("dblclick"))
    .on("zoom", (evt) => {
      if (!isDragging) container.attr("transform", evt.transform);
    });
  svg.call(zoom);

  // 拖拽辅助线
  const verticalLine = nodeLayer
    .append("line")
    .attr("stroke", linkColorPanel[2])
    .attr("stroke-dasharray", "4,2")
    .attr("visibility", "hidden");

  /***********************************************
   * 状态：自定义二次连线 / 文本框
   ***********************************************/
  // const customLinks = []; // {id, sourceId, targetId} (Moved to top-level)
  let isLinking = false;
  let linkSource = null;
  let tempLine = null;

  let isEditing = false;
  let currentTextbox = null;

  /***********************************************
   * 布局：把 tree 计算 + 你的“分支均匀分布”逻辑封装
   ***********************************************/
  const stratify = d3.stratify().id((d) => d.id).parentId((d) => d.parent);

  function computeLayout(list) {
    const root = stratify(list);
    const treeLayout = d3.tree().size([height - 200, width - 200]);
    treeLayout(root);

    // 你原来的“第一条分支对齐”
    root.x = 0;
    if (root.children?.length) {
      const firstChild = root.children[0];
      firstChild.x = root.x;
      if (firstChild.children?.length) firstChild.children[0].x = firstChild.x;
    }

    // 你原来的“同层按分支均匀分布”
    const depthMap = new Map();
    root.descendants().forEach((node) => {
      if (!depthMap.has(node.depth)) depthMap.set(node.depth, []);
      depthMap.get(node.depth).push(node);
    });

    depthMap.forEach((nodes) => {
      nodes.sort((a, b) =>
        d3.ascending(a.parent ? a.parent.id : a.id, b.parent ? b.parent.id : b.id)
      );

      const branchMap = new Map();
      nodes.forEach((node) => {
        const pid = node.parent ? node.parent.id : "root";
        if (!branchMap.has(pid)) branchMap.set(pid, []);
        branchMap.get(pid).push(node);
      });

      const startX = nodes[0]?.x ?? 0;
      const branchSpacing = spacingX * 0.5;
      const localSpacing = spacingX * 0.8;

      let currentX = startX;
      branchMap.forEach((branchNodes) => {
        branchNodes.forEach((node, i) => (node.x = currentX + i * localSpacing));
        currentX += branchNodes.length * localSpacing + branchSpacing;
      });
    });

    // 应用到原始数据 list（你原来就是这么干的）
    root.descendants().forEach((node) => {
      const d = node.data;
      d.x = 100 + node.y;
      const computedY = 50 + node.x;
      d.y = typeof d.manualY === "number" ? d.manualY : computedY;
    });
  }

  function generateCustomDataId(list) {
    const childrenMap = new Map();
    list.forEach((d) => {
      if (d.parent) {
        if (!childrenMap.has(d.parent)) childrenMap.set(d.parent, []);
        childrenMap.get(d.parent).push(d);
      }
    });

    let rootCount = 0;
    const map = new Map();

    function assign(node, parentCustomId = null) {
      let cid;
      if (!parentCustomId) {
        rootCount += 1;
        cid = `root${rootCount}`;
      } else {
        const siblings = (childrenMap.get(node.parent) || []).slice().sort((a, b) => Number(a.id) - Number(b.id));
        const idx = siblings.findIndex((x) => x.id === node.id) + 1;
        cid = `${parentCustomId}-${idx}`;
      }
      map.set(node.id, cid);

      (childrenMap.get(node.id) || []).forEach((child) => assign(child, cid));
    }

    list.filter((d) => !d.parent).forEach((root) => assign(root));
    return map;
  }

  const nodeMap = new Map();
  function rebuildNodeMap(list) {
    nodeMap.clear();
    list.forEach((d) => nodeMap.set(d.id, d));
  }

  /***********************************************
   * 统一更新：参考线 / 树连线 / 自定义连线
   ***********************************************/
  function updateGuideLines(list) {
    // 每个节点一条垂直虚线（你原来的 node-guideline）
    const guide = guideLineLayer
      .selectAll("line.node-guideline")
      .data(list, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "node-guideline")
            .attr("stroke", "#cccccc")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "3,3"),
        (update) => update,
        (exit) => exit.remove()
      );

    guide
      .attr("x1", (d) => d.x)
      .attr("x2", (d) => d.x)
      .attr("y1", 0)
      .attr("y2", height * 3);

    // 你后面 addVerticalGuideLines 那套“参考线”（按 unique xPositions）
    const xPositions = [...new Set(list.map((d) => d.x))].sort((a, b) => a - b);

    guideLineLayer
      .selectAll("line.column-guideline")
      .data(xPositions, (d) => d)
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("class", "column-guideline")
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "4,4"),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr("x1", (d) => d)
      .attr("x2", (d) => d)
      .attr("y1", 0)
      .attr("y2", height * 3);
  }

  function updateLinks(list) {
    // 树形连线 group（带 path + arrow）
    const treeLinks = linkLayer
      .selectAll("g.treeLinkGroup")
      .data(list.filter((d) => d.parent), (d) => d.id)
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "treeLinkGroup");
          g.append("path").attr("class", "treeLink").attr("fill", "none");
          // 你原来有时注释掉，这里保持存在，方便显示
          g.append("polygon")
            .attr("class", "treeArrow")
            .attr("points", "0,-5 10,0 0,5 3,0")
            .attr("stroke", "url(#linkGradient)");
          return g;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    treeLinks.each(function (d) {
      const parent = nodeMap.get(d.parent);
      const child = nodeMap.get(d.id);
      if (!parent || !child) return;

      const x1 = parent.x,
        y1 = parent.y;
      const x2 = child.x,
        y2 = child.y;
      const midX = (x1 + x2) / 2;

      const cubicPath = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;

      d3.select(this)
        .select("path.treeLink")
        .attr("stroke", "url(#linkGradient)")
        .attr("stroke-width", 2)
        .attr("d", cubicPath);

      const { x: ax, y: ay, angleDeg } = getCubicPointAndAngle(
        x1,
        y1,
        midX,
        y1,
        midX,
        y2,
        x2,
        y2,
        0.5
      );

      d3.select(this)
        .select("polygon.treeArrow")
        .attr("fill", linkColorPanel[1])
        .attr("transform", `translate(${ax},${ay}) rotate(${angleDeg})`);
    });

    // 自定义连线（二次贝塞尔）
    const custom = linkLayer
      .selectAll("g.customLink")
      .data(customLinks.value, (l) => l.id)
      .join(
        (enter) => {
          const g = enter.append("g").attr("class", "customLink");
          g.append("path").attr("class", "finalLink").attr("stroke-dasharray", "5,2").attr("fill", "none");
          g.append("polygon")
            .attr("class", "arrowHead")
            .attr("points", "0,-5 10,0 0,5 3,0")
            .attr("fill", "url(#linkGradient)");
          return g;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    custom.select("path.finalLink").attr("stroke", "url(#linkGradient)").each(function (d) {
      const source = nodeMap.get(d.sourceId);
      const target = nodeMap.get(d.targetId);
      if (!source || !target) return;

      const { d: pathStr, cx, cy } = getQuadraticPath(source.x, source.y, target.x, target.y, list);
      d3.select(this).attr("d", pathStr);

      const { x: mx, y: my, angleDeg } = getQuadraticPointAndAngle(
        source.x,
        source.y,
        cx,
        cy,
        target.x,
        target.y,
        0.5
      );

      d3.select(this.parentNode)
        .select("polygon.arrowHead")
        .attr("fill", linkColorPanel[1])
        .attr("transform", `translate(${mx},${my}) rotate(${angleDeg})`);
    });
  }

  /***********************************************
   * 拖拽：仅允许 Y 方向（保持你原行为）
   ***********************************************/
  const drag = d3
    .drag()
    .on("start", (event) => {
      isDragging = true;
      svg.on(".zoom", null);
      event?.sourceEvent?.stopPropagation?.();
    })
    .on("drag", function (event, d) {
      const rect = containerDiv.getBoundingClientRect();
      height = rect.height;

      const [, my] = d3.pointer(event.sourceEvent ?? event, container.node());
      d.y = my;
      d.manualY = my;

      d3.select(this).attr("transform", `translate(${d.x},${d.y})`);

      const t = d3.zoomTransform(svg.node());
      const yMin = -t.y / t.k;
      const yMax = yMin + height / t.k;

      verticalLine
        .attr("x1", d.x)
        .attr("x2", d.x)
        .attr("y1", yMin)
        .attr("y2", yMax)
        .attr("visibility", "visible");

      updateLinks(sequence_log.value);
      updateGuideLines(sequence_log.value);
    })
    .on("end", () => {
      isDragging = false;
      verticalLine.attr("visibility", "hidden");
      svg.call(zoom);
    });

  /***********************************************
   * 节点渲染：统一一套（初次和后续更新共用）
   ***********************************************/
  function bindNodeEvents(sel) {
    sel.on("contextmenu", (event, d) => {
      event.preventDefault();
      clickedNodeData.value = d;
      menuX.value = event.clientX;
      menuY.value = event.clientY;
      showMenu.value = true;
    });

    sel.on("click", function (event, d) {
      nodeLayer.selectAll(".highlight-circle").style("display", "none");
      d3.select(this).select(".highlight-circle").style("display", "block");

      current_clicked_node_info.value = {
        id: d.id,
        text: d.text,
        parent: d.parent ?? null,
        status: d.status,
        type: d.type,
      };
    });

    sel.on("dblclick", function (event, d) {
      event.stopPropagation();

      if (!isLinking) {
        isLinking = true;
        linkSource = d;

        tempLine = linkLayer
          .append("path")
          .attr("class", "tempLink")
          .style("stroke-dasharray", "5,2")
          .style("stroke", linkColorPanel[0])
          .style("fill", "none")
          .attr("d", `M${d.x},${d.y} L${d.x},${d.y}`);

        svg.on("mousemove.linkMode", (evt) => {
          const [sx, sy] = d3.pointer(evt, svg.node());
          const tr = d3.zoomTransform(container.node());
          const mx = (sx - tr.x) / tr.k;
          const my = (sy - tr.y) / tr.k;
          tempLine.attr("d", `M${linkSource.x},${linkSource.y} L${mx},${my}`);
        });
      } else {
        isLinking = false;
        svg.on("mousemove.linkMode", null);

        if (d === linkSource) {
          tempLine?.remove();
        } else {
          const linkId = `L_${linkSource.id}_${d.id}`;
          customLinks.value.push({ id: linkId, sourceId: linkSource.id, targetId: d.id });
          tempLine?.remove();
          updateLinks(sequence_log.value);
        }

        tempLine = null;
        linkSource = null;
      }
    });
  }

  function renderNodes(list) {
    const nodes = nodeLayer
      .selectAll("g.node")
      .data(list, (d) => d.id)
      .join(
        (enter) => {
          const g = enter
            .append("g")
            .attr("class", "node")
            .call(drag);

          // 三层 circle
          g.append("circle")
            .attr("r", (circleRadius * 3) / 4)
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5);

          g.append("circle")
            .attr("id", "circle-padding")
            .attr("r", (circleRadius * 3) / 4 - defaultMargin)
            .attr("fill", colorPanel[0]);

          g.append("circle")
            .attr("r", (circleRadius * 3) / 4 - defaultMargin)
            .attr("stroke", linkColorPanel[1])
            .attr("fill", colorPanel[0]);

          // type icon
          g.filter((d) => d.type === "circular")
            .append("path")
            .attr("d", arrowClockwisePath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr(
              "transform",
              `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2} ) scale(1.3)`
            );

          g.filter((d) => d.type === "radial")
            .append("path")
            .attr("d", arrowRadialPath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.1)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);

          g.filter((d) => d.type === "chord")
            .append("path")
            .attr("d", arrowChordPath)
            .attr("fill", linkColorPanel[0])
            .attr("stroke", linkColorPanel[0])
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("transform", `translate(${-circleRadius / 2 + 2}, ${-circleRadius / 2 + 2}) scale(1.3)`);

          // 高亮圈
          g.append("circle")
            .attr("class", "highlight-circle")
            .attr("r", (circleRadius * 3) / 4 + 3)
            .attr("fill", "none")
            .attr("stroke", "#ff4d4f")
            .attr("stroke-width", 2)
            .style("display", "none");

          bindNodeEvents(g);
          return g;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    // 更新通用属性（enter + update 都要）
    nodes
      .attr("data-id", (d) => customIdMap.get(d.id))
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodes.select("circle").attr("fill", (d) => runColorPanel[d.status]); // 最外层根据 status 上色
  }

  /***********************************************
   * 图例（保持你原逻辑，但修正 resize 更新方式）
   ***********************************************/
  const legend = svg.append("g").attr("class", "legend");
  const legendData = [
    { color: "#91e2c1", text: "default" },
    { color: "#6da9ff", text: "modify" },
    { color: "#6458e3", text: "saved" },
  ];

  const legendItems = legend
    .selectAll("g.legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item");

  legendItems.append("circle").attr("r", 6).attr("fill", (d) => d.color);
  legendItems
    .append("text")
    .attr("x", 15)
    .attr("y", 5)
    .style("font-size", "12px")
    .style("fill", linkColorPanel[0])
    .text((d) => d.text);

  function updateLegend() {
    const itemHeight = 25;
    legendItems.attr("transform", (d, i) => `translate(${width - 100}, ${height - 100 + i * itemHeight})`);
  }

  /***********************************************
   * 双击空白创建文本框（保留）
   ***********************************************/
  svg.on("dblclick", (event) => {
    if (isLinking) return;

    if (isEditing) {
      finalizeTextbox();
      return;
    }

    const [sx, sy] = d3.pointer(event, svg.node());
    const tr = d3.zoomTransform(container.node());
    const x = (sx - tr.x) / tr.k;
    const y = (sy - tr.y) / tr.k;
    createTextbox(x, y);
  });

  function createTextbox(x, y) {
    isEditing = true;

    currentTextbox = nodeLayer
      .append("g")
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

    currentTextbox.append("rect").attr("width", 100).attr("height", 30).attr("x", -50).attr("y", -15).attr("class", "textbox");

    const fo = currentTextbox.append("foreignObject").attr("width", 100).attr("height", 30).attr("x", -50).attr("y", -15);

    const input = fo
      .append("xhtml:input")
      .attr("type", "text")
      .attr(
        "style",
        "width:100%;height:30px;font-size:14px;border:none;text-align:center;background-color:transparent;outline:none;padding:0 5px;"
      )
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
    const padding = 20,
      minW = 100;
    const newW = Math.max(minW, textWidth + padding);

    currentTextbox.select("rect").attr("width", newW).attr("x", -newW / 2);
    currentTextbox.select("foreignObject").attr("width", newW).attr("x", -newW / 2);
  }

  function finalizeTextbox() {
    if (!currentTextbox) return;
    const inp = currentTextbox.select("input").node();
    const text = inp.value.trim();

    if (!text) {
      currentTextbox.remove();
    } else {
      currentTextbox.select("foreignObject").remove();
      currentTextbox.select("rect").attr("fill", "none").attr("stroke-dasharray", "5,5");
      currentTextbox
        .append("text")
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

  // 点空白取消高亮（保留）
  svg.on("click", function (event) {
    if (event.target.tagName === "svg") nodeLayer.selectAll(".highlight-circle").style("display", "none");
  });

  /***********************************************
   * 总渲染：一次性完成 layout + map + id + nodes + lines + guide + legend
   ***********************************************/
  function render(list) {
    // 布局
    computeLayout(list);

    // 表
    rebuildNodeMap(list);

    // data-id
    customIdMap = generateCustomDataId(list);

    // 画
    renderNodes(list);
    updateGuideLines(list);
    updateLinks(list);
    updateLegend();
  }

  /***********************************************
   * Resize：统一入口（不再“重写 onResize”）
   ***********************************************/
  function handleResize() {
    const rect = containerDiv.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    // resize 后你希望连线/参考线/图例适配：直接 render（保持布局一致）
    render(sequence_log.value);
  }
  window.addEventListener("resize", handleResize);

  /***********************************************
   * 监听 store：节点高亮联动（保留）
   ***********************************************/
  watch(
    current_clicked_node_info,
    (info) => {
      if (!info?.id) return;
      nodeLayer.selectAll(".highlight-circle").style("display", "none");
      nodeLayer
        .selectAll("g.node")
        .filter((d) => d.id === info.id)
        .select(".highlight-circle")
        .style("display", "block");
    },
    { immediate: true }
  );

  /***********************************************
   * 监听 sequence_log：后续更新（保留）
   ***********************************************/
  watch(
    sequence_log,
    (newList) => {
      if (isDragging) return;
      render(newList);
    },
    { deep: true }
  );

  // 初次渲染
  render(sequence_log.value);

  /***********************************************
   * 卸载清理
   ***********************************************/
  onBeforeUnmount(() => {
    window.removeEventListener("click", closeMenu);
    window.removeEventListener("resize", handleResize);
  });
});
</script>


<template>
    <!-- 隐藏测量宽度用的 div -->
    <div id="hiddenMeasure"></div>

    <!-- 简化后的容器结构 -->
    <div id="graphContainer" class="border">
        <svg id="mySvg"></svg>
    </div>

    <!-- Context Menu -->
    <ul v-if="showMenu" :style="{ top: menuY + 'px', left: menuX + 'px' }" class="context-menu">
        <li @click.stop="handleReuseNode">Reuse</li>
    </ul>
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

.context-menu {
    position: fixed;
    z-index: 9999;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
    list-style: none;
    padding: 5px 0;
    margin: 0;
    border-radius: 4px;
    font-size: 14px;
    
    li {
        padding: 5px 15px;
        cursor: pointer;
        &:hover {
            background-color: #f0f0f0;
        }
    }
}
</style>
