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

    /**
     * 绿色柱状图
     * 插入和缺失（绿色矩形）：
        浅绿色矩形：验证的插入（来自附表2）。
        深绿色矩形：验证的缺失（来自附表2）。  
        用file2，Insertion类型画一个环形柱状图的track，深绿色，Validation_status类型画一个环形柱状图的track，浅绿色
        
        ai：环形柱状图需要对染色体数据聚合，您想按照什么样的聚合距离？（回复"d"默认按照10Mb的距离进行聚合）
        user：a
        ai：好的，正在绘图马上就好！
           
     */
    let level2 = await readFile('id_001/file2.csv');
    //第一步：条件过滤
    let level2_1 = level2.filter((item) => {
      if (item["Type"] == "Insertion" && item["Validation_status"] != "") {
        return true;
      } else {
        return false;
      }
    })
    let level2_2 = level2.filter((item) => {
      if (item["Type"] == "Deletion" && item["Validation_status"] != "") {
        return true;
      } else {
        return false;
      }
    })

    //第二步：组合成绘图需要的格式
    level2_1 = reduceData(level2_1, hg19, 10000000)
    level2_2 = reduceData(level2_2, hg19, 10000000)

    //第三步：绘图
    addTrack(circos,tracks,'level2_1', level2_1, 'histogram', {
      innerRadius: 0.95,
      outerRadius: 0.96,
      color: "red",
      opacity: 1.0
    });

    addTrack(circos,tracks,'level2_2', level2_2, 'histogram', {
      innerRadius: 0.96,
      outerRadius: 0.97,
      color: "green",
      opacity: 1.0
    });

    /**
     * 橙色柱状图
     * 体细胞突变的密度（橙色条）：
        浅橙色条：异型合子的单核苷酸变异（heterozygous）。
        深橙色条：纯合子的单核苷酸变异（homozygous）。
        每10 Mb的密度计算来自附表1。
     */
    //第0步：拿文件
    let level3 = await readFile('id_001/file1.csv');

    //第一步：条件过滤
    let level3_1 = level3.filter((item) => {
      if (item["Zygosity"] == "het") {
        return true;
      } else {
        return false;
      }
    })
    let level3_2 = level3.filter((item) => {
      if (item["Zygosity"] == "hom") {
        return true;
      } else {
        return false;
      }
    })
    //第二步：组合成绘图需要的格式
    level3_1 = reduceData_Position(level3_1, hg19, 10000000)
    level3_2 = reduceData_Position(level3_2, hg19, 10000000)

    //画图
    addTrack(circos,tracks,'level3_1', level3_1, 'histogram', {
      innerRadius: 0.88,
      outerRadius: 0.93,
      color: "#faa95d",
      opacity: 1.0
    });

    addTrack(circos,tracks,'level3_2', level3_2, 'histogram', {
      innerRadius: 0.80,
      outerRadius: 0.85,
      color: "#f0761e",
      opacity: 1.0
    });

    /**
     * 编码突变（彩色方块）：
        不同颜色表示不同类型的突变：
          灰色：沉默突变（Silent）。
          紫色：错义突变（Missense）。
          红色：无义突变（Nonsense）。
          黑色：剪接位点突变（Splice site）。
        数据来源为附表4。
     */
    let level4 = await readFile('id_001/file4.csv');
    //第一步：条件过滤
    let level4_1 = level4.filter((item) => {
      if (item["Effect"] == "Silent") {
        return true;
      } else {
        return false;
      }
    })
    let level4_2 = level4.filter((item) => {
      if (item["Effect"] == "Missense") {
        return true;
      } else {
        return false;
      }
    })
    let level4_3 = level4.filter((item) => {
      if (item["Effect"] == "Nonsense") {
        return true;
      } else {
        return false;
      }
    })
    let level4_4 = level4.filter((item) => {
      if (item["Effect"] == "Splice") {
        return true;
      } else {
        return false;
      }
    })
    //第二步：组合成绘图需要的格式
    level4_1 = level4_1.map((item) => {
      return {
        block_id: item["Chromosome"],
        position: item["Position"],
        value: 1
      }
    })
    level4_2 = level4_2.map((item) => {
      return {
        block_id: item["Chromosome"],
        position: item["Position"],
        value: 1
      }
    })
    level4_3 = level4_3.map((item) => {
      return {
        block_id: item["Chromosome"],
        position: item["Position"],
        value: 1
      }
    })
    level4_4 = level4_4.map((item) => {
      return {
        block_id: item["Chromosome"],
        position: item["Position"],
        value: 1
      }
    })
    addTrack(circos,tracks,'level4_1', level4_1, 'scatter', {
      innerRadius: 0.74,
      outerRadius: 0.77,
      color: "gray",
      // opacity: 1.0,
      fill: "gray",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_2', level4_2, 'scatter', {
      innerRadius: 0.71,
      outerRadius: 0.74,
      color: "purple",
      // opacity: 1.0,
      fill: "purple",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_3', level4_3, 'scatter', {
      innerRadius: 0.68,
      outerRadius: 0.71,
      color: "red",
      // opacity: 1.0,
      fill: "red",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_4', level4_4, 'scatter', {
      innerRadius: 0.65,
      outerRadius: 0.68,
      color: "black",
      // opacity: 1.0,
      fill: "black",
      size: 3,
      strokeColor: "none"
    })

    /**
     * 粉色折线图
     * 拷贝数变化（粉色线条）：
        表示在基因组中的拷贝数变化。
        数据来自附表5。
     * 
     */
    //第0步：获取文件
    let level5 = await readFile('id_001/file5.csv');
    //第一步：组合成绘图需要的格式
    level5 = transform_startend_position(level5, "Copy number")
    //第二步：画图
    addTrack(circos,tracks,'level5', level5, 'line', {
      innerRadius: 0.50,
      outerRadius: 0.65,
      color: "pink",
      axes: [{ spacing: 2, color: "gray", thickness: .3, opacity: .5 }],
      backgrounds: [{ color: "#d6d6d6" }]
    });

    /**
     * 红色线
     * 杂合性丢失区域（LOH）（红色线条）：
          显示了在基因组中出现的杂合性丢失区域。
          数据来源于附表6。
     */
    let level6 = await readFile('id_001/file6.csv');
    //第一步：组合成绘图需要的格式
    level6 = level6.map((item) => {
      return {
        'block_id': item["id"],
        'start': Number(item["Start"]),
        'end': Number(item["End"]),
        'value': 1
      }
    })
    // console.log("6666666666", level6);

    //第二步：画图
    addTrack(circos,tracks,'level6', level6, 'heatmap', {
      innerRadius: 0.49,
      outerRadius: 0.50,
      color: "red",
      opacity: 1.0
    });

    /**
     * 连线
     * 重排（绿色和紫色线条）：
        绿色线条：验证的染色体内重排（intrachromosomal rearrangements）。
        紫色线条：验证的染色体间重排（interchromosomal rearrangements）。
        数据来源为附表3。
     */
    let level7 = await readFile('id_001/file3.csv');
    let level7_1 = level7.filter((item) => {
      if (item["Chromosome"] == item["Chromosome.1"]) {
        return true;
      } else {
        return false;
      }
    })
    let level7_2 = level7.filter((item) => {
      if (item["Chromosome"] != item["Chromosome.1"]) {
        return true;
      } else {
        return false;
      }
    })
    level7_1 = level7_1.map((item) => {
      return {
        source: {
          id: item["Chromosome"],
          start: Number(item["Position"]),
          end: Number(item["Position"]) + 10000000
        },
        target: {
          id: item["Chromosome.1"],
          start: Number(item["Position.1"]),
          end: Number(item["Position.1"]) + 10000000
        }
      }
    })
    level7_2 = level7_2.map((item) => {
      return {
        source: {
          id: item["Chromosome"],
          start: Number(item["Position"]),
          end: Number(item["Position"]) + 10000000
        },
        target: {
          id: item["Chromosome.1"],
          start: Number(item["Position.1"]),
          end: Number(item["Position.1"]) + 10000000
        }
      }
    })
    addTrack(circos,tracks,'level7_1', level7_1, 'chords', {
      color: "green",
      radius: 0.48
    });

    addTrack(circos,tracks,'level7_2', level7_2, 'chords', {
      color: "purple",
      radius: 0.48
    });
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
  <!-- <t-button @click="reverse_track('level3_1', 'level5')">reverse</t-button> -->
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