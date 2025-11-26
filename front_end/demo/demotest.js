<script setup>
import { ref, onMounted, inject } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用
console.log('测试一下', readFile)
import { reduceData, reduceData_Position, gieStainColor, transform_startend_position } from '@/components/Center/utils_circos.js';
import { add_hover_effect, addTrack, reverse } from '@/components/Center/utils_interact.js';
const bus = inject('bus');
console.log('Injected bus:', bus);
const tracks = ref({}); //所有track的配置
let circos;
onMounted(async () => {
  try {
    console.log('测试一下', add_hover_effect)
    // 获取参考基因组文件
    console.log('Fetching hg19...');
    let hg19 = await d3.json('/data/hg19.json');
    console.log('hg19 loaded:', hg19);
    console.log('Fetching cytobands...');
    let cytobands = await d3.csv('/data/cytobands.csv');
    console.log('cytobands loaded:', cytobands);

    // 设置画布
    let chartWidth = document.getElementById('chart').clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth / 2 - 100;
    let outerRadius = chartWidth / 2 - 100 + 50;
    // 初始化circos
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
          labelSuffix: 'Mb', // 百万级别
          labelDenominator: 5000000,
          spacing: 5000000,
          labelSize: 5,
          labelColor: 'grey',
        },
      }
    );
    // 绘制参考基因组染色体
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

    circos.highlight('highlight', highlightData, highlightConfig);

    // LL-generated chart code starts here
    // Read data from file3.csv
    let data = await readFile('id_001/file3.csv');
    
    // Filter and format data where Chromosome equals Chromosome.1
    let filtered_data = data.filter((item) => item["Chromosome"] == item["Chromosome.1"]).map((d) => ({
      source: {
        id: d.Chromosome,
        start: +d.Position,
        end: +d.Position + 10000000
      },
      target: {
        id: d["Chromosome.1"],
        start: +d["Position.1"],
        end: +d["Position.1"] + 10000000
      },
      color: 'green'
    }));
    
    // Add connection lines (chords)
    addTrack(circos, tracks, 'green_connections', filtered_data, 'chords', {
      color: 'green',
      thickness: 1,
      opacity: 0.7,
    });

    // 显示圆形图
    circos.render();
    add_hover_effect(bus);
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});
const reverse_track = (id1, id2) => {
  console.log('circos:', circos);
  console.log('tracks:', tracks);
  console.log('tracks.value:', tracks.value);
  reverse(circos, tracks, id1, id2)
}
bus.on('go_exchange', (tracks) => {
  console.log("go_exchange", tracks);

  reverse_track(tracks[0], tracks[1]);
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