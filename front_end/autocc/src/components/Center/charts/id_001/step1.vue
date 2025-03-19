:src/components/CircosChart.vue
<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server';
import { reduceData, reduceData_Position, transform_startend_position, gieStainColor } from '@/components/Center/utils_circos.js';

const chart = ref(null);

onMounted(async () => {
  try {
    let hg19 = await d3.json('/data/hg19.json');
    let cytobands = await d3.csv('/data/cytobands.csv');

    let chartWidth = chart.value.clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth / 2 - 100;
    let outerRadius = chartWidth / 2 - 100 + 50;

    const circos = new Circos({
      container: chart.value,
      width: width,
      height: width,
    });

    circos.layout(hg19, {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      labels: {
        display: true,
        radialOffset: 60,
        color: "black",
        size: 10
      },
      ticks: {
        display: true,
        color: 'grey',
        labels: false,
        labelSuffix: 'Mb',
        labelDenominator: 5000000,
        spacing: 5000000,
        labelSize: 5,
        labelColor: 'grey',
      },
    });

    let highlightData = cytobands.map(d => ({
      block_id: d.id,
      start: parseInt(d.start),
      end: parseInt(d.end),
      gieStain: d.gieStain
    }));

    let highlightConfig = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      opacity: .7,
      color: d => gieStainColor[d.gieStain]
    };

    circos.highlight('highlight', highlightData, highlightConfig);

    // 新增深绿色柱状图
    let level2 = await readFile('id_001/file2.csv');

    let level2_1 = level2.filter(item => item["Type"] === "Insertion" && item["Validation_status"] !== "");

    level2_1 = reduceData(level2_1, hg19, 10000000);

    circos.histogram('level2_1', level2_1, {
      innerRadius: 0.80,
      outerRadius: 0.85,
      color: "darkgreen",
      opacity: 1.0
    });

    circos.render();
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});
</script>

<template>
  <div ref="chart"></div>
</template>

<style scoped>
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
