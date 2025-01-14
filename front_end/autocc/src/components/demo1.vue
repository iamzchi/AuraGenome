<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用

const chartId = ref('chart');

function cal_for_layout(data) {
    // Create an object to store the counts of each Chromosome value
    const chromosomeCounts = {};

    // Iterate through the data to count the occurrences of each Chromosome
    data.forEach(item => {
        const chromosome = item["\uFEFFChromosome"] || item["Chromosome"];
        if (chromosome) {
            if (!chromosomeCounts[chromosome]) {
                chromosomeCounts[chromosome] = 0;
            }
            chromosomeCounts[chromosome]++;
        }
    });

    // Map the counts to the desired output format
    const result = Object.keys(chromosomeCounts).map(chromosome => {
        return {
            "id": chromosome,
            "len": chromosomeCounts[chromosome],
            "label": chromosome
        };
    });

    return result;
}


onMounted(async () => {
  try {
    // 发送请求到后端获取文件内容
    const filepath = 'id_001/file1.csv'; // 需要读取的文件路径
    const data = await readFile(filepath);
    console.log('Parsed CSV data:', data);

    // 在这里可以使用 Circos 或其他可视化逻辑处理数据
    const circos = new Circos({
      container: `#${chartId.value}`,
      width: 600,
      height: 600,
    });
    let layoutdata = cal_for_layout(data);
    let hg19 = await d3.json('/data/GRCh37.json')
    console.log(hg19);
    
    console.log(layoutdata);
    
    // 示例：初始化 Circos（需要根据具体数据定义图表结构）
    circos.layout(
      hg19,
      {
        innerRadius: 200,
        outerRadius: 250,
        labels: { display: false },
        ticks: { display: false },
      }
    );
    circos.render();
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});
</script>

<template>
  <div :id="chartId" style="width: 600px; height: 600px;"></div>
</template>

<style scoped>
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
