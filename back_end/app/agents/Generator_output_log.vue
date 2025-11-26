// 2025-11-26 14:25:43 | query: Using file3.csv to generate purple connection lines, linking regions where Chromosome and Chromosome.1 columns have different values."

<script setup>
import { ref, onMounted, inject } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用
console.log('测试一下',readFile)
import { reduceData, reduceData_Position, gieStainColor, transform_startend_position } from '@/components/Center/utils_circos.js';
import { add_hover_effect, addTrack, reverse } from '@/components/Center/utils_interact.js';
const bus = inject('bus');
console.log('Injected bus:', bus);
const tracks = ref({});//所有track的配置
let circos;
onMounted(async () => {
  try {
  console.log('测试一下',add_hover_effect)
    //获取参考基因组文件
    console.log('Fetching hg19...');
    let hg19 = await d3.json('/data/hg19.json');
    console.log('hg19 loaded:', hg19);
    console.log('Fetching cytobands...');
    let cytobands = await d3.csv('/data/cytobands.csv');
    console.log('cytobands loaded:', cytobands);

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
          labelSuffix: 'Mb',//百万级别
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

    // === 新增 dark-green bar chart ===
    let data = await readFile('id_001/file2.csv');
    let filtered_data = data.filter((item) => item["Type"] == "Insertion" && item["Validation_status"] != "");
    let bar_data = reduceData(filtered_data, hg19, 10000000);
    addTrack(
      circos,
      tracks,
      'insertion_bar',
      bar_data,
      'histogram',
      {
        innerRadius: 0.80,
        outerRadius: 0.95,
        color: 'darkgreen',
        tooltipContent: d => `Chr: ${d.block_id}<br>Start: ${d.start}<br>End: ${d.end}<br>Count: ${d.value}`
      }
    );

    // === 新增 blue line chart for Copy number (添加坐标系和背景色) ===
    let file5_data = await readFile('id_001/file5.csv');
    let line_data = transform_startend_position(file5_data, "Copy number");
    addTrack(
      circos,
      tracks,
      'copynumber_line',
      line_data,
      'line',
      {
        innerRadius: 0.65,
        outerRadius: 0.78,
        color: 'blue',
        axes: [
          { spacing: 2, color: "gray", thickness: 0.3, opacity: 0.5 }
        ],
        backgrounds: [
          { color: "#e8f0fe" }
        ],
        tooltipContent: d => 
          `Chr: ${d.block_id}<br>Start: ${d.start}<br>End: ${d.end}<br>Copy number: ${d.value}`
      }
    );

    // === 新增 purple chords track from file3.csv ===
    let file3_data = await readFile('id_001/file3.csv');
    let chords_data = file3_data
      .filter(d => d["Chromosome"] && d["Chromosome.1"] && d["Chromosome"] !== d["Chromosome.1"])
      .map(d => ({
        source: {
          id: d["Chromosome"],
          start: +d["Position"],
          end: +d["Position"] + 10000000
        },
        target: {
          id: d["Chromosome.1"],
          start: +d["Position.1"],
          end: +d["Position.1"] + 10000000
        }
      }));
    addTrack(
      circos,
      tracks,
      'sv_chords_purple',
      chords_data,
      'chords',
      {
        innerRadius: 0.55,
        color: 'purple',
        tooltipContent: d =>
          `From: ${d.source.id}:${d.source.start}-${d.source.end}<br>
           To: ${d.target.id}:${d.target.start}-${d.target.end}`
      }
    );

    circos.render();
    add_hover_effect(bus);
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});
const reverse_track = (id1,id2) => {
  console.log('circos:', circos);
  console.log('tracks:', tracks);
  console.log('tracks.value:', tracks.value);
  reverse(circos,tracks,id1,id2)
}
bus.on('go_exchange', (tracks) => {
  console.log("go_exchange", tracks);
  
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
  /* background-color: rgb(239, 239, 239); */

}
</style>
