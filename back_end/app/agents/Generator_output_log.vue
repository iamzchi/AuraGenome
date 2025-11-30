// 2025-11-30 20:01:12 | query: I would like to use this scheme: Using file3.csv to generate purple connection lines, linking regions where Chromosome and Chromosome.1 columns have different values.

<script setup>
import { ref, onMounted, inject } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server';
import { reduceData, reduceData_Position, gieStainColor, transform_startend_position } from '@/components/Center/utils_circos.js';
import { add_hover_effect, addTrack, reverse } from '@/components/Center/utils_interact.js';
const bus = inject('bus');
const tracks = ref({});
let circos;
onMounted(async () => {
  try {
    //获取参考基因组文件
    let hg19 = await d3.json('/data/hg19.json');
    let cytobands = await d3.csv('/data/cytobands.csv');

    //设置画布
    let chartWidth = document.getElementById('chart').clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth / 2 - 100;
    let outerRadius = chartWidth / 2 - 100 + 50;
    //初始化circos
    circos = new Circos({
      container: `#chart`,
      width: width,
      height: width,
    });
    circos.layout(
      hg19,
      {
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
      }
    );
    //绘制参考基因组染色体
    let highlightData = cytobands.map(function (d) {
      return {
        block_id: d.id,
        start: parseInt(d.start),
        end: parseInt(d.end),
        gieStain: d.gieStain
      }
    })

    let highlightConfig = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      opacity: .7,
      color: function (d) {
        return gieStainColor[d.gieStain]
      }
    }

    circos.highlight('highlight', highlightData, highlightConfig)
    // 以上都是一些基本配置
    // 下面才是真正需要llm生成的图表

    // 步骤1：读取file3.csv
    let file3 = await readFile('id_001/file3.csv');
    // 步骤2：只保留染色体间重排（Chromosome != Chromosome.1）
    let purpleLinks = file3.filter(d => d.Chromosome !== d["Chromosome.1"]);
    // 步骤3：构建chords格式
    let purpleChords = purpleLinks.map(d => ({
      source: {
        id: d.Chromosome,
        start: +d.Position,
        end: +d.Position + 10000000
      },
      target: {
        id: d["Chromosome.1"],
        start: +d["Position.1"],
        end: +d["Position.1"] + 10000000
      }
    }));
    // 步骤4：添加紫色chords连线
    addTrack(
      circos,
      tracks,
      'interchr_sv_purple',
      purpleChords,
      'chords',
      {
        color: 'purple',
        opacity: 0.7,
        radius: innerRadius * 0.80,
        tooltipContent: d => `From: ${d.source.id}:${d.source.start/1e6}-${d.source.end/1e6}Mb<br/>To: ${d.target.id}:${d.target.start/1e6}-${d.target.end/1e6}Mb`
      }
    );

    circos.render();
    add_hover_effect(bus);
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});
const reverse_track = (id1,id2) => {
  reverse(circos,tracks,id1,id2)
}
bus.on('go_exchange', (tracks) => {
  reverse_track(tracks[0],tracks[1]);
})
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
}
</style>
