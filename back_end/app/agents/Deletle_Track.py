#输出console面板里面的信息

import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# 加载 .env 文件中的环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("API_KEY")
base_url = os.getenv("BASE_URL")

# 初始化 OpenAI 客户端
client = OpenAI(          
    api_key=api_key,  # 从环境变量中加载 API 密钥
    base_url=base_url,  # 从环境变量中加载自定义 API 地址
)

LOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'Deletle_Track_log.vue'))

prompt = """
接下来我会给你一段代码，这个代码会绘制一些环形轨道
请你删掉对应的轨道，返回新的代码

## 注意事项
- 不要修改已有代码上的其他轨道！只删除这个轨道相关的代码即可，一般情况下是关于addTrack这个方法。
- 给我完整的代码，不要任何解释说明的文字。
- 不要使用任何代码块标记（例如```），只输出完整的 .vue 文件代码文本。
"""

# 调用 API 的方法
def use_delete_track(current_code,trackId,model="openai/gpt-4o-mini"):
    try:
        #打印调试信息
        print("开始生成删除轨道的数据：use_delete_track")
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"and the code is: '{current_code}',I want you to delete the track that is {trackId}"},
            ],
            model=model,
            temperature=0.7,
        )
        reply = chat_completion.choices[0].message.content
        reply = reply.replace("```", "")
        with open(LOG_PATH, 'w', encoding='utf-8') as f:
            f.write(reply)
        return reply
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        try:
            with open(LOG_PATH, 'w', encoding='utf-8') as f:
                f.write('')
        except Exception:
            pass
        return None


# 测试代码
if __name__ == "__main__":
    
    # 设置测试参数
    current_code = '''
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

    // 步骤1：读取数据
    let level2 = await readFile('id_001/file2.csv');
    // 步骤2：条件过滤
    let deletion_data = level2.filter((item) => item["Type"] == "Deletion" && item["Validation_status"] != "");
    // 步骤3：数据聚合（直方图，默认10Mb）
    let deletion_hist = reduceData(deletion_data, hg19, 10000000);
    // 步骤4：可视化轨道
    addTrack(circos, tracks, 'deletion_histogram', deletion_hist, 'histogram', {
      innerRadius: 0.65,
      outerRadius: 0.8,
      color: 'red',
      strokeWidth: 0,
      opacity: 0.85,
    });

    // ==== 新增轨道 ====
    // 步骤1：读取数据
    let file1 = await readFile('id_001/file1.csv');
    // 步骤2：条件过滤
    let file1_hom = file1.filter(item => item["Zygosity"] == "hom");
    // 步骤3：数据聚合（每10Mb一个bin）
    let hom_hist = reduceData_Position(file1_hom, hg19, 10000000);
    // 步骤4：添加直方图轨道
    addTrack(circos, tracks, 'hom_histogram', hom_hist, 'histogram', {
      innerRadius: 0.5,
      outerRadius: 0.64,
      color: '#FF8C00', // dark-orange
      strokeWidth: 0,
      opacity: 0.85,
    });

    // ==== 新增轨道：蓝色line图，Copy number ====
    // 步骤1：读取数据
    let file5 = await readFile('id_001/file5.csv');
    // 步骤2：数据格式转换
    let file5_line_data = transform_startend_position(file5, "Copy number");
    // 步骤3：添加line轨道
    addTrack(circos, tracks, 'copy_number_line', file5_line_data, 'line', {
      innerRadius: 0.35,
      outerRadius: 0.48,
      color: 'blue',
      strokeWidth: 2,
      opacity: 1,
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
    '''
    result = use_delete_track(current_code, 'hom_histogram')
    print(f"结果: {result}")
