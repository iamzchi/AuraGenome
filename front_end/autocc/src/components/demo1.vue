<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用

const chartId = ref('chart');

function generate_data_with_range(data) {
  return data.map((item) => {
    return {
      block_id: item["id"],
      start: item["Position"],
      end: String(Number(item["Position"]) + 100),
    }
  })
}
function generate_data_with_position(data) {
  return data.map((item) => {
    return {
      block_id: item["id"],
      position: item["Position"],
      value: 1,
    }
  })
}
function delete_overflow(data, data_column, data_number, reference, reference_column, reference_number) {
  // 遍历data，将data中每一行的data_column和data_number与reference的进行比较
  return data.filter(row => {
    // 获取data中的当前行对应的列值
    const dataColumnValue = row[data_column];
    const dataNumberValue = row[data_number];

    // 查找reference中，符合条件的行（参考值的column值与data_column匹配）
    const referenceRow = reference.find(ref => ref[reference_column] === dataColumnValue);

    // 如果找到了匹配的reference行且data_number小于reference_number，则保留该行
    if (referenceRow && dataNumberValue < referenceRow[reference_number]) {
      return true; // 保留该行
    }

    // 否则，删除该行
    return false;
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

  rawData.forEach(d => console.log('RawData ID:', d.id, typeof d.id));
  karyotype.forEach(chr => console.log('Karyotype ID:', chr.id, typeof chr.id));

  const binLength = range || 10000000;
  const data = [];

  // 确保分组使用字符串类型的 id
  const rawDataByChr = d3.group(rawData, d => String(d.id));

  // 遍历每个染色体
  karyotype.forEach(chr => {
    const raw = rawDataByChr.get(chr.id) || []; // 获取染色体数据

    console.log('Processing Chr:', chr.id, 'Data Count:', raw.length);

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
    //拿到文件
    const filepath = 'id_001/file1.csv';
    let data = await readFile(filepath);
    // console.log('Parsed CSV data:', data);

    let hg19 = await d3.json('/data/hg19.json')

    data = delete_overflow(data, 'id', "Position", hg19, "id", "len");
    // console.log("处理后的",data);

    let cytobands = await d3.csv('/data/cytobands.csv');
    let width = 600;
    const circos = new Circos({
      container: `#${chartId.value}`,
      width: 600,
      height: 600,
    });
    console.log('h19', hg19);

    circos.layout(
      hg19,
      {
        innerRadius: 200,
        outerRadius: 250,
        labels: { display: false },
        ticks: { display: false },
      }
    );
    // let highlightData = generate_data_with_range(data);
    // console.log(highlightData);
    let highlightData = cytobands.map(function (d) {
      return {
        block_id: d.id,
        start: parseInt(d.start),
        end: parseInt(d.end),
        gieStain: d.gieStain
      }
    })

    let highlightConfig = {
      innerRadius: width / 2 - 100,
      outerRadius: width / 2 - 50,
      opacity: 0.5,
      color: function (d) {
        return gieStainColor[d.gieStain]
      }
    }
    console.log(highlightData);

    circos.highlight('highlight', highlightData, highlightConfig)


    /**
     * 绿色柱状图
     * 插入和缺失（绿色矩形）：
        浅绿色矩形：验证的插入（来自附表2）。
        深绿色矩形：验证的缺失（来自附表2）。
     */
    let level2 = await readFile('id_001/file2.csv');
    //第一步：条件过滤
    let level2_1 = level2.filter((item) => {
      if (item["Type"] == "Insertion"&&item["Validation_status"]!="") {
        return true;
      } else {
        return false;
      }
    })
    let level2_2 = level2.filter((item) => {
      if (item["Type"] == "Deletion"&&item["Validation_status"]!="") {
        return true;
      } else {
        return false;
      }
    })
    console.log("过来看", level2_2);
    
    //第二步：组合成绘图需要的格式
    level2_1 = reduceData(level2_1, hg19, 10000000)
    level2_2 = reduceData(level2_2, hg19, 10000000)

    //第三步：绘图
    circos.histogram('level2_1', level2_1, {
      innerRadius: width / 2 - 112,
      outerRadius: width / 2 - 108,
      color: "red",
      opacity: 1.0
    })
    circos.histogram('level2_2', level2_2, {
      innerRadius: width / 2 - 107,
      outerRadius: width / 2 - 102,
      color: "green",
      opacity: 1.0
    })



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
