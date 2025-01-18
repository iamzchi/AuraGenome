<script setup>
import { onMounted } from 'vue';
import * as d3 from 'd3';

const data = [
    { id: "root", text: "root", parent: null },
    { id: "step1", text: "step1", parent: "root" },
    { id: "step2", text: "step2", parent: "root" },
    { id: "step3", text: "step3", parent: "step1" },
    { id: "step4", text: "step4", parent: "step2" },
    { id: "step5", text: "step5", parent: "step3" },
    { id: "step6", text: "step6", parent: "step4" },
    { id: "step7", text: "step7", parent: "step4" },
    { id: "step8", text: "step8", parent: "step3" },
];


onMounted(() => {
    const svgElement = document.getElementById('graph');
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const zoom = d3.zoom()
        .filter((event) => !event.type.includes("dblclick"))
        .on("zoom", (event) => {
            if (!isDragging) {
                container.attr("transform", event.transform);
            }
        });

    const svg = d3
        .select("#graph")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    const container = svg.append("g");

    const nodeMap = new Map();
    const levelSpacing = 200;
    const verticalSpacing = 100;
    const rootOffset = { x: 150, y: height / 2 };
    let levels = {};

    data.forEach((node) => {
        const parent = node.parent;
        if (!parent) {
            node.level = 0;
            node.position = 0;
            levels[0] = [node];
        } else {
            const parentNode = nodeMap.get(parent);
            node.level = parentNode.level + 1;
            if (!levels[node.level]) levels[node.level] = [];
            node.position = levels[node.level].length;
            levels[node.level].push(node);
        }
        nodeMap.set(node.id, node);
    });

    Object.values(levels).forEach((nodes) => {
        nodes.forEach((node) => {
            const parentNode = nodeMap.get(node.parent);
            if (!parentNode) {
                node.x = rootOffset.x;
                node.y = rootOffset.y;
            } else {
                node.x = rootOffset.x + node.level * levelSpacing;
                const siblings = levels[node.level].filter((n) => n.parent === parentNode.id);
                if (siblings.length === 1) {
                    node.y = parentNode.y;
                } else {
                    const siblingIndex = siblings.indexOf(node);
                    const totalSiblings = siblings.length;
                    const siblingOffset = (siblingIndex - (totalSiblings - 1) / 2) * verticalSpacing;
                    node.y = parentNode.y + siblingOffset;
                }
            }
        });
    });

    const verticalLine = container.append("line")
        .attr("stroke", "#999")
        .attr("stroke-dasharray", "4 2")
        .attr("visibility", "hidden");

    let isDragging = false;

    const drag = d3.drag()
        .on("start", (event, d) => {
            isDragging = true;
            svg.on(".zoom", null);
            d.startY = d.y;
        })
        .on("drag", (event, d) => {
            const transform = d3.zoomTransform(svg.node());
            const mouseY = (event.y - transform.y) / transform.k;

            d.y = Math.max(0, Math.min(height, mouseY));

            d3.select(`[data-id='${d.id}']`)
                .attr("transform", `translate(${d.x},${d.y})`);

            verticalLine
                .attr("x1", d.x)
                .attr("x2", d.x)
                .attr("y1", 0)
                .attr("y2", height)
                .attr("visibility", "visible");

            updateLinks();
        })
        .on("end", (event, d) => {
            isDragging = false;
            verticalLine.attr("visibility", "hidden");
            svg.call(zoom);
        });

    function updateLinks() {
        container
            .selectAll("path")
            .attr("d", (d) => {
                const parent = nodeMap.get(d.parent);
                const child = nodeMap.get(d.id);
                return `M${parent.x},${parent.y} C${(parent.x + child.x) / 2},${parent.y} ${(parent.x + child.x) / 2},${child.y} ${child.x},${child.y}`;
            });
    }

    container
        .selectAll("path")
        .data(data.filter((d) => d.parent))
        .enter()
        .append("path")
        .attr("d", (d) => {
            const parent = nodeMap.get(d.parent);
            const child = nodeMap.get(d.id);
            return `M${parent.x},${parent.y} C${(parent.x + child.x) / 2},${parent.y} ${(parent.x + child.x) / 2},${child.y} ${child.x},${child.y}`;
        })
        .attr("stroke", "#000")
        .attr("fill", "none")
        .attr("stroke-width", 4);

    const nodes = container
        .selectAll("g.node")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("data-id", (d) => d.id)
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .call(drag);

    nodes
        .append("circle")
        .attr("r", 25)
        .attr("fill", "white")
        .attr("stroke", "#0052d9")
        .attr("stroke-width", 12);

    nodes
        .append("text")
        .attr("dy", 5)
        .attr("text-anchor", "middle")
        .text((d) => d.text)
        .style("font-size", "12px");



    document.querySelectorAll('.node').forEach(node => {
        node.addEventListener('click', () => {
            console.log(node.getAttribute('data-id'));
        });
    });
    //给.node添加cursor: pointer;
    document.querySelectorAll('.node').forEach(node => {
        node.style.cursor = 'pointer';
    });
    //给.node添加hover效果
    document.querySelectorAll('.node').forEach(node => {
        node.addEventListener('mouseover', () => {
            node.style.backgroundColor = '#f0f0f0';
        });
        node.addEventListener('mouseout', () => {
            node.style.backgroundColor = 'white';
        });
    });
});
</script>

<template>
    <svg id="graph"></svg>
</template>

<style scoped lang="scss">
svg {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;
    border: 1px solid #ccc;
    border-radius: 20px;
    background-color: rgb(216, 255, 229);

}

.node {
    cursor: pointer;
}
</style>
