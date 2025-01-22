<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用

/**
 * 根据与参考数组的比较条件过滤数据数组中的行。
 * 保留那些在指定的data_number列中的值小于对应参考数组中reference_number列值的行。
 *
 * @param {Array} data - 要过滤的数据对象数组。
 * @param {string} data_column - 在数据对象中用于匹配参考值的列的键名。
 * @param {string} data_number - 要与参考数组中数据进行比较的列的键名。
 * @param {Array} reference - 用于比较的参考数组，包含参考值。
 * @param {string} reference_column - 参考数组中用于匹配data_column的列的键名。
 * @param {string} reference_number - 参考数组中用于比较的列的键名。
 * @returns {Array} - 返回一个包含符合条件的行的新数组。
 */
 function delete_overflow(data, data_column, data_number, reference, reference_column, reference_number) {
  return data.filter(row => {
    const dataColumnValue = row[data_column];  // 获取当前行对应data_column的值
    const dataNumberValue = row[data_number];  // 获取当前行对应data_number的值

    const referenceRow = reference.find(ref => ref[reference_column] === dataColumnValue);  // 查找参考数组中与data_column匹配的行

    if (referenceRow && dataNumberValue < referenceRow[reference_number]) {  // 如果找到了匹配的参考行且data_number小于参考值
      return true;  // 保留该行
    }

    return false;  // 否则，删除该行
  });
}


/**
 * 函数说明：reduceData
 * 
 * 功能
 * 根据基因组数据和染色体信息，按染色体划分数据并统计每个区间内的数据数量。
 * 
 * 参数
 * 1. rawData
 *    - 类型：数组
 *    - 描述：基因组数据数组，每个对象包含：（注意首字母大小写）
 *      - id: 染色体 ID。
 *      - Start: 数据起始位置（数字）。
 *      - End: 数据结束位置（数字）。
 * 
 * 2. karyotype
 *    - 类型：数组
 *    - 描述：染色体信息数组，每个对象包含：
 *      - id: 染色体 ID。
 *      - len: 染色体长度。
 * 
 * 3. range (可选)
 *    - 类型：数字
 *    - 描述：区间长度，默认值为 10,000,000。
 * 
 * 返回值
 * - 类型：数组
 * - 描述：统计结果数组，每个对象包含：
 *   - block_id: 染色体 ID。
 *   - start: 区间起始位置。
 *   - end: 区间结束位置。
 *   - value: 区间内的数据数量。
 */
function reduceData(rawData, karyotype, range) {
  console.log('RawData:', rawData);

  // rawData.forEach(d => console.log('RawData ID:', d.id, typeof d.id));
  // karyotype.forEach(chr => console.log('Karyotype ID:', chr.id, typeof chr.id));

  const binLength = range || 10000000;
  const data = [];

  // 确保分组使用字符串类型的 id
  const rawDataByChr = d3.group(rawData, d => String(d.id));

  // 遍历每个染色体
  karyotype.forEach(chr => {
    const raw = rawDataByChr.get(chr.id) || []; // 获取染色体数据

    // console.log('Processing Chr:', chr.id, 'Data Count:', raw.length);

    // 遍历每个区间
    for (let position = 0; position < chr.len; position += binLength) {
      let counter = 0;

      // 遍历染色体数据，统计当前区间的数据数量
      raw.forEach(datum => {
        const start = parseInt(datum.Start, 10);
        const end = parseInt(datum.End, 10);

        // 检查数据是否落在当前区间内
        if (start < position + binLength && end > position) {
          counter++;
        }
      });

      data.push({
        block_id: chr.id,
        start: position,
        end: Math.min(position + binLength - 1, chr.len),
        value: counter
      });
    }
  });

  return data;
}
/**
 * 
 * @param rawData 参数不是Start/End,而是Position
 * @param karyotype 同上
 * @param range 同上
 */
function reduceData_Position(rawData, karyotype, range) {
  console.log('RawData:', rawData);

  // rawData.forEach(d => console.log('RawData ID:', d.id, typeof d.id));
  // karyotype.forEach(chr => console.log('Karyotype ID:', chr.id, typeof chr.id));

  const binLength = range || 10000000;
  const data = [];

  // 确保分组使用字符串类型的 id
  const rawDataByChr = d3.group(rawData, d => String(d.id));

  // 遍历每个染色体
  karyotype.forEach(chr => {
    const raw = rawDataByChr.get(chr.id) || []; // 获取染色体数据

    // console.log('Processing Chr:', chr.id, 'Data Count:', raw.length);

    // 遍历每个区间
    for (let position = 0; position < chr.len; position += binLength) {
      let counter = 0;

      // 遍历染色体数据，统计当前区间的数据数量
      raw.forEach(datum => {
        const pos = parseInt(datum.Position, 10);

        // 检查数据是否落在当前区间内
        if (pos >= position && pos < position + binLength) {
          counter++;
        }
      });

      data.push({
        block_id: chr.id,
        start: position,
        end: Math.min(position + binLength - 1, chr.len),
        value: counter
      });
    }
  });

  return data;
}
/**
 * 把输入json中的start/end 变成position
 * @param inputData json数组，必须包含id\Start\End
 */
function transform_startend_position(inputData, number_column) {
  // Initialize the output array
  const outputData = [];

  // Iterate over each record in the input array
  inputData.forEach(record => {
    // Parse required values from the input record
    const blockId = record.id;
    const copyNumber = number_column ? parseFloat(record[number_column]) : 1;
    const start = parseInt(record.Start, 10);
    const end = parseInt(record.End, 10);

    // Add two entries: one for Start position and one for End position
    outputData.push({
      block_id: blockId,
      position: start,
      value: copyNumber
    });

    outputData.push({
      block_id: blockId,
      position: end,
      value: copyNumber
    });
  });

  return outputData;
}

var gieStainColor = {
  gpos100: 'rgb(0,0,0)',
  gpos: 'rgb(0,0,0)',
  gpos75: 'rgb(130,130,130)',
  gpos66: 'rgb(160,160,160)',
  gpos50: 'rgb(200,200,200)',
  gpos33: 'rgb(210,210,210)',
  gpos25: 'rgb(200,200,200)',
  gvar: 'rgb(220,220,220)',
  gneg: 'rgb(255,255,255)',
  acen: 'rgb(217,47,39)',
  stalk: 'rgb(100,127,164)',
  select: 'rgb(135,177,255)'
}
onMounted(async () => {
  try {
    //获取参考基因组文件
    let hg19 = await d3.json('/data/hg19.json')
    let cytobands = await d3.csv('/data/cytobands.csv');

    //设置画布
    let chartWidth = document.getElementById('chart').clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth/2-100;
    let outerRadius = chartWidth/2-100+50;

    //初始化circos
    const circos = new Circos({
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
        prompt: 
        用file2，Insertion类型画一个环形柱状图的track，深绿色，Validation_status类型画一个环形柱状图的track，浅绿色
        
        ai：环形柱状图需要对染色体数据聚合，您想按照什么样的聚合距离？（回复a默认按照10Mb的距离进行聚合）
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
    circos.histogram('level2_1', level2_1, {
      innerRadius: .95,
      outerRadius: .96,
      color: "red",
      opacity: 1.0
    })
    circos.histogram('level2_2', level2_2, {
      innerRadius: .96,
      outerRadius: .97,
      color: "green",
      opacity: 1.0
    })

    /**
     * 橙色柱状图
     * 体细胞突变的密度（橙色条）：
        浅橙色条：异型合子的单核苷酸变异（heterozygous）。
        深橙色条：纯合子的单核苷酸变异（homozygous）。
        每10 Mb的密度计算来自附表1。
     */
    //第0步：拿文件
    let level3 = await readFile('id_001/file1.csv');
    level3 = delete_overflow(level3, 'id', "Position", hg19, "id", "len"); //这一步没想好怎么告诉大模型

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
    circos.histogram('level3_1', level3_1, {
      innerRadius: 0.88,
      outerRadius: 0.93,
      color: "#faa95d",
      opacity: 1.0
    })
    circos.histogram('level3_2', level3_2, {
      innerRadius: 0.80,
      outerRadius: 0.85,
      color: "#f0761e",
      opacity: 1.0
    })

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
    circos.scatter('level4_1', level4_1, {
      innerRadius: 0.77,
      outerRadius: 0.80,
      color: "gray",
      // opacity: 1.0,
      fill: "gray",
      size: 3,
      strokeColor: "none"
    })
    circos.scatter('level4_2', level4_2, {
      innerRadius: 0.74,
      outerRadius: 0.77,
      color: "purple",
      // opacity: 1.0,
      fill: "purple",
      size: 3,
      strokeColor: "none"
    })
    circos.scatter('level4_3', level4_3, {
      innerRadius: 0.71,
      outerRadius: 0.74,
      color: "red",
      // opacity: 1.0,
      fill: "red",
      size: 3,
      strokeColor: "none"
    })
    circos.scatter('level4_4', level4_4, {
      innerRadius: 0.68,
      outerRadius: 0.71,
      color: "black",
      // opacity: 1.0,
      fill: "black",
      size: 3,
      strokeColor: "none"
    })

    /**
     * 蓝色折线图
     * 拷贝数变化（蓝色线条）：
        表示在基因组中的拷贝数变化。
        数据来自附表5。
     * 
     */
    //第0步：获取文件
    let level5 = await readFile('id_001/file5.csv');
    //第一步：组合成绘图需要的格式
    level5 = transform_startend_position(level5, "Copy number")
    //第二步：画图
    circos.line('level5', level5, {
      innerRadius: 0.50,
      outerRadius: 0.68,
      color: "#5979ae",
      axes: [
        {
          spacing: 2,
          color: "gray",
          thickness: .3,
          opacity: .5
        }
      ],
      backgrounds: [
        {
          color: "#d6d6d6"
        }
      ]
    })

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
    circos.heatmap('level6', level6, {
      innerRadius: 0.49,
      outerRadius: 0.50,
      color: "red",
      opacity: 1.0,
    })

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
    circos.chords('level7_1', level7_1, {
      color: "green",
      radius: 0.48,
    })
    circos.chords('level7_2', level7_2, {
      color: "purple",
      radius: 0.48,
    })
    console.log(level7_2);


    circos.render();
  } catch (err) {
    console.error('Error fetching or processing data:', err);
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
