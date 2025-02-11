<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用
import { reduceData_Position,gieStainColor } from './utils_circos.js';

onMounted(async () => {
  try {
    // 获取参考基因组文件
    let hg19 = await d3.json('/data/hg19.json');
    let cytobands = await d3.csv('/data/cytobands.csv');
    // 设置画布
    let chartWidth = document.getElementById('chart').clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth / 2 - 100;
    let outerRadius = chartWidth / 2 - 100 + 50;
    
    // 初始化 Circos 实例
    const circos = new Circos({
      container: `#chart`,
      width: width,
      height: width,
    });

    // 配置基因组布局
    circos.layout(hg19, {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      labels: {
        display: true,
        radialOffset: 60,
        color: "black",
        size: 10,
      },
      ticks: {
        display: true,
        color: 'grey',
        labels: false,
        labelSuffix: 'Mb', // 百万级别
        labelDenominator: 5000000,
        spacing: 5000000,
        labelSize: 5,
        labelColor: 'grey',
      },
    });

    // 绘制参考基因组染色体
    let highlightData = cytobands.map(function (d) {
      return {
        block_id: d.id,
        start: parseInt(d.start),
        end: parseInt(d.end),
        gieStain: d.gieStain
      }
    });

    let highlightConfig = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      opacity: 0.7,
      color: function (d) {
        return gieStainColor[d.gieStain];
      }
    };

    circos.highlight('highlight', highlightData, highlightConfig);

    // 以下代码生成深蓝色柱状图
    /** Dark Blue Histogram */
    // 第一步：加载数据文件
    let file1 = await readFile('id_001/file1.csv');

    // 第二步：按 Position 聚合数据，使用 reduceData_Position 函数（默认 10Mb 间隔）
    let darkBlueData = reduceData_Position(file1, hg19, 10000000);

    // 第三步：绘制柱状图 (dark blue histogram)
    circos.histogram('dark-blue-histogram', darkBlueData, {
      innerRadius: 0.6, // 自定义半径
      outerRadius: 0.8,
      color: '#00008b', // 深蓝色
      opacity: 1.0,
    });

    // 渲染图表
    circos.render();
  } catch (err) {
    console.error('Error loading or processing data:', err);
  }
});
</script>

<template>
  <div id="chart"></div>
</template>

<style scoped>
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  /* background-color: rgb(239, 239, 239); */
}
</style>