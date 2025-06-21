import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getQueryResult, getGenerateCode } from '@/utils/server'
// 全局变量
const project_id = "id_001"


export const useChatStore = defineStore('chat', () => {
  /**
   * @description 聊天窗口
   */
  // 使用 ref 来定义响应式状态
  // const messages = ref([
  //   { role: 'ai', content: "Hi! Let's create cool gene visualization charts together!" },
  //   { role: 'ai', content: "You can upload your files." },
  //   { role: 'user', content: '✔ uploaded: file1' },
  //   { role: 'ai', content: 'I got it!' },
  //   { role: 'ai', content: "What's your next plan?" },
  //   { role: 'user', content: 'Please display the gene mutation data in file1 for me with a bar chart.' },
  //   { role: 'ai', content: 'Here it is!' },
  //   { role: 'user', content: 'change the scatter track of the Synonymous Substitution to purple.'  },
  //   { role: 'ai', content: 'No problem! ' },
  //   { role: 'ai', content: 'I have turned track7 purple. anything else?' },
  //   { role: 'user', content: 'nice but I want the width of Track5 to be enlarged a bit, and Track4 to be reduced a bit.' },
  //   { role: 'ai', content: 'Done! Is this what you want? If not, you can click the track for finer adjustment.' },
  //   // { role: 'user', content: 'using file2.csv to generate a dark-green bar chart, and use the "Insertion" type column and Validation column should not be empty.' },
  //   {role:'ai',content:'OK, I will generate the chart for you according to the configuration of Proj1, please upload your data.'},
  //   {role:'user',content:'✔ uploaded: 📄file1,📄file2'},
  //   {role:'ai',content:"Got it. I noticed that there are multiple discrete values in file1. I've recommended two solutions for you. Is there any one you like?"},
  //   {role:'user',content:'To display heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation.'},
  //   {role:'ai',content:'All right! Here it is!'},
  //   {role:'user',content:'Using file5.csv to generate a blue line chart, plotting Copy number column values against their genomic position.'  },
  //   {role:'ai',content:'Here it is! I generated a blue line chart to show the changes in copy number. '},
  //   {role:'user',content:'OK, but add axes to the line chart. A simple light gray color.'  },
  //   {role:'ai',content:'Done! Is this what you want? If not, you can click the track for finer adjustment.'},
  //   {role:'user',content:"Not bad, but I can't clearly see the ups and downs of the blue line. It looks like this broken line is quite flat. " },
  //   {role:'ai',content:"How about we narrow down the Substitution track and expand the line chart track? "},
  //   {role:'user',content:"Why?"},
  //   {role:'ai',content:"Because the scatter point distribution isn't very sensitive to height. Do you want me to adjust the chart for you? "},
  // ])
//👮‍♂️代表左边的操作
//🈶️代表右边的操作
  const messages = ref([
    { role: 'ai', content: "Hi! Let's create cool gene visualization charts together!" },
    { role: 'ai', content: "You can upload your files." },
    { role: 'user', content: '✔ uploaded: 6 files' },
    { role: 'ai', content: "I got it! I have parsed the data for you to review and analyze. What's your next plan?" },
  ])
  const inputRecommendItems = ref([
    'What can you do?',
    'Save as png and download',
    'Modify the axes of Track9'
  ])
  // 可以提供一些 actions 来操作这些状态
  const addMessage = (role, content) => {
    messages.value.push({ role: role, content: content })
  }
  const updateInputRecommendItems = (newItems) => {
    inputRecommendItems.value = newItems
  }
  

  // 添加新的状态
  const lastQuery = ref('')
  const queryInfo = ref('')
  
  // 添加新的方法
  const sendVueFileToBackend = async (filePath, fileContent) => {
    const backendUrl = 'https://your-backend-api.com/upload'
    const payload = {
      filename: 'demo1.vue',
      content: fileContent
    }
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      console.log('成功上传文件内容:', data)
      return data
    } catch (error) {
      console.error('上传文件失败:', error)
      throw error
    }
  }

  const handleMessage = async (query) => {
    if (query === 'd' || query === 'D') {
      setTimeout(() => {
        addMessage('ai', "OK, I will use the default aggregation distance of 10Mb.")
      }, 1000)
      setTimeout(() => {
        addMessage('ai', "Generating, please wait a moment...")
      }, 2000)
      await generateCode(lastQuery.value, queryInfo.value)
      lastQuery.value = ''
    } else if (lastQuery.value === '') {
      let queryResult = await getQueryResult(query)
      queryResult = queryResult.query_info
      queryInfo.value = queryResult
      //打印queryResult
      console.log('11111',queryInfo.value)
      if (queryResult.query_type === "chat") {
        addMessage('ai', queryResult.reply);
        updateInputRecommendItems(queryResult.next)
      }
      if (queryResult.query_type === "a") {
        if (queryResult.chart_type === "histogram" || queryResult.chart_type === "highlight" || queryResult.chart_type === "heatmap") {
          addMessage('ai', `Generating a ${queryResult.chart_type} requires aggregating the chromosome data ${queryResult.file_name} you uploaded. What aggregation distance do you want? (Reply "d" to aggregate according to the distance of 10Mb by default)`)
          lastQuery.value = query
        } else if (queryResult.chart_type === "line" || queryResult.chart_type === "scatter") {
          addMessage('ai', `Generating ${queryResult.chart_type} using ${queryResult.file_name}, please wait a moment...`)
          await generateCode(query, queryInfo.value) //生成代码
          lastQuery.value='';
        }
      }
      if(queryResult.query_type === 'b'){//修改模式
        addMessage('ai', `${queryResult.reply},Modifying ${queryResult.chart_type} using ${queryResult.file_name}, please wait a moment...`)
        await generateCode(query, queryInfo.value) //生成代码
      }
    }
  }
  
  const loading = ref(false)
  const generateCode = async (query, query_info) => {
    loading.value = true
    
    console.log('开始生成代码')
    //后端接口要求：query, project_id, query_info, base_code
    const res = await getGenerateCode(query, project_id, query_info,allCodes.value[allCodes.value.length-1])
    loading.value = false
    if (res.code === 200) {
      allCodes.value.push(res.generated_code);
      currentCode.value = res.generated_code;
      addMessage('ai', "Done. what else?")
    }
  }
  const modifyCode = async(query, query_info)=>{
    loading.value = true
    console.log('开始修改代码')
    //后端接口要求：query, project_id, query_info, base_code
    const res = await getGenerateCode(query, project_id, query_info,allCodes.value[allCodes.value.length-1])
    loading.value = false
    if (res.code === 200) {
      allCodes.value.push(res.generated_code);
      currentCode.value = res.generated_code;
      addMessage('ai', "Done. what else?")
    }
  }

  /**
   * @description Log窗口
   *
   */
    const log = ref([
      { id: "0",  text: "", parent: null, status: 0, type: "root" },
      { id: "1",  text: "", parent: "0", status: 1, type: "chord" },
      { id: "2",  text: "", parent: "0", status: 1, type: "chord" },
      { id: "3",  text: "", parent: "2", status: 2, type: "radial" },
      { id: "4",  text: "", parent: "3", status: 3, type: "radial" },
      { id: "5",  text: "", parent: "4", status: 2, type: "chord" },
      { id: "6",  text: "", parent: "5", status: 2, type: "chord" },
      { id: "7",  text: "", parent: "6", status: 2, type: "chord" },
      { id: "8",  text: "", parent: "7", status: 3, type: "chord" },])

  const addLog = (id, text, parent, status, type) => {
    log.value.push({ id: id, text: text, parent: parent, status: status, type: type })
  }

  /**
   * @description step snapshots
   */
  const snapshots = ref([
    {
      title: "Import Existing Configs and Rearrangements Links",
      step: 1,
      note: "add your note",
      time:"2025-1-24",
      description: "Shows chromosomal rearrangements using green (intra) and purple (inter) connection lines.",
      img:"/assets/s1.png"
    },
    {
      title: "Zygosity Mutation Bar",
      step: 2,
      note: "add your note",
      time:"2025-1-23",
      description: "Displays heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation.",
      img:"/assets/s2.png"
    },
    {
      title: "Insertion and Deletion Bar",
      step: 3,
      note: "add your note",
      time:"2025-1-23",
      description: "Visualizes insertion (dark green) and deletion (red) events with validation status.",
      img:"/assets/s3.png"
    },
    {
      title: "Mutation Types",
      step: 4,
      note: "add your note",
      time:"2025-1-23",
      description: "Shows different mutation effects (Silent, Missense, Nonsense, Splice site) using colored scatter plots.",
      img:"/assets/s4.png"
  
    },
    {
      title: "Loss of Heterozygosity",
      step: 5,
      note: "add your note",
      time:"2025-1-23",
      description: "Represents LOH (Loss of Heterozygosity) regions in the genome with a red heatmap.",
      img:"/assets/s5.png"
  
    },
    {
      title: "Copy Number Changes",
      step: 6,
      note: "add your note",
      time:"2025-1-23",
      description: "Depicts copy number variations across the genome using a blue line chart.",
      img:"/assets/s6.png"
  
    },
  ]
  )
  const addSnapshot = (title, step, note, time, description, img) => {
    snapshots.value.push({ title: title, step: step, note: note, time: time, description: description, img: img })
  }

  /**
   * @description Track Infomation
   */
  const trackInfo = ref([
    {
      "id": "level2_1", 
      "file": "file2.csv",
      "title": "Insertion Bar (Validated)",
      "innerRadius": 0.95,
      "outerRadius": 0.96,
      "explanation": "Displays validated insertions (deep green) with 10Mb aggregation.",
      "color": "green",
      "type": "histogram",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.95,
        "outer": 0.96
      },
      "colorConfig": {
        "deepGreen": "#006400"
      },
      "aggregation": "10Mb"
    },
    {
      "id": "level2_2",
      "file": "file2.csv",
      "title": "Deletion Bar (Validated)",
      "innerRadius": 0.96,
      "outerRadius": 0.97,
      "explanation": "Displays validated deletions (light green) with 10Mb aggregation.",
      "color": "green",
      "type": "histogram",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.96,
        "outer": 0.97
      },
      "colorConfig": {
        "lightGreen": "#90EE90"
      },
      "aggregation": "10Mb"
    },
    {
      "id": "level3_1",
      "file": "file1.csv",
      "title": "Heterozygous Mutations",
      "innerRadius": 0.88,
      "outerRadius": 0.93,
      "explanation": "Displays heterozygous (light orange) mutations with 10Mb aggregation.",
      "color": "#faa95d",
      "type": "histogram",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.88,
        "outer": 0.93
      },
      "colorConfig": {
        "het": "#FFB74D"
      },
      "aggregation": "10Mb"
    },
    {
      "id": "level3_2",
      "file": "file1.csv",
      "title": "Homozygous Mutations",
      "innerRadius": 0.80,
      "outerRadius": 0.85,
      "explanation": "Displays homozygous (dark orange) mutations with 10Mb aggregation.",
      "color": "#f0761e",
      "type": "histogram",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.80,
        "outer": 0.85
      },
      "colorConfig": {
        "hom": "#FF8C00"
      },
      "aggregation": "10Mb"
    },
    {
      "id": "level4_1",
      "file": "file4.csv",
      "title": "Silent Mutations",
      "innerRadius": 0.77,
      "outerRadius": 0.80,
      "explanation": "Displays silent mutations (gray) in the genome.",
      "color": "gray",
      "type": "scatter",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.77,
        "outer": 0.80
      },
      "colorConfig": {
        "silent": "gray"
      }
    },
    {
      "id": "level4_2",
      "file": "file4.csv",
      "title": "Missense Mutations",
      "innerRadius": 0.74,
      "outerRadius": 0.77,
      "explanation": "Displays missense mutations (purple) in the genome.",
      "color": "purple",
      "type": "scatter",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.74,
        "outer": 0.77
      },
      "colorConfig": {
        "missense": "purple"
      }
    },
    {
      "id": "level4_3",
      "file": "file4.csv",
      "title": "Nonsense Mutations",
      "innerRadius": 0.71,
      "outerRadius": 0.74,
      "explanation": "Displays nonsense mutations (red) in the genome.",
      "color": "red",
      "type": "scatter",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.71,
        "outer": 0.74
      },
      "colorConfig": {
        "nonsense": "red"
      }
    },
    {
      "id": "level4_4",
      "file": "file4.csv",
      "title": "Splice Site Mutations",
      "innerRadius": 0.68,
      "outerRadius": 0.71,
      "explanation": "Displays splice site mutations (black) in the genome.",
      "color": "black",
      "type": "scatter",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.68,
        "outer": 0.71
      },
      "colorConfig": {
        "splice": "black"
      }
    },
    {
      "id": "level5",
      "file": "file5.csv",
      "title": "Copy Number Variations",
      "innerRadius": 0.50,
      "outerRadius": 0.68,
      "explanation": "Displays copy number variations (blue lines) across the genome.",
      "color": "#5979ae",
      "type": "line",
      "opacity": 0.8,
      "radiusConfig": {
        "inner": 0.50,
        "outer": 0.68
      },
      "colorConfig": {
        "copyNumber": "#5979ae"
      }
    },
    {
      "id": "level6",
      "file": "file6.csv",
      "title": "Loss of Heterozygosity",
      "innerRadius": 0.49,
      "outerRadius": 0.50,
      "explanation": "Displays regions of loss of heterozygosity (red heatmap).",
      "color": "red",
      "type": "heatmap",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.49,
        "outer": 0.50
      },
      "colorConfig": {
        "loh": "red"
      }
    },
    {
      "id": "level7_1",
      "file": "file3.csv",
      "title": "Intrachromosomal Rearrangements",
      "innerRadius": 0.48,
      "outerRadius": 0.50,
      "explanation": "Displays intrachromosomal rearrangements (green chords).",
      "color": "green",
      "type": "chords",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.48,
        "outer": 0.50
      },
      "colorConfig": {
        "rearrangements": "green"
      }
    },
    {
      "id": "level7_2",
      "file": "file3.csv",
      "title": "Interchromosomal Rearrangements",
      "innerRadius": 0.48,
      "outerRadius": 0.50,
      "explanation": "Displays interchromosomal rearrangements (purple chords).",
      "color": "purple",
      "type": "chords",
      "opacity": 1.0,
      "radiusConfig": {
        "inner": 0.48,
        "outer": 0.50
      },
      "colorConfig": {
        "rearrangements": "purple"
      }
    }
  ])

  const nowTrackInfo = ref({})
  const setNowTrackInfo = (track) =>{
    nowTrackInfo.value = track;
  }

  /**
   * @description 当前展示的代码和代码历史
   * 
   */
  const code=`
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
      container: \`#chart\`,
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
      innerRadius: .95,
      outerRadius: .96,
      color: "red",
      opacity: 1.0
    });

    addTrack(circos,tracks,'level2_2', level2_2, 'histogram', {
      innerRadius: .96,
      outerRadius: .97,
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
      innerRadius: 0.77,
      outerRadius: 0.80,
      color: "gray",
      // opacity: 1.0,
      fill: "gray",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_2', level4_2, 'scatter', {
      innerRadius: 0.74,
      outerRadius: 0.77,
      color: "purple",
      // opacity: 1.0,
      fill: "purple",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_3', level4_3, 'scatter', {
      innerRadius: 0.71,
      outerRadius: 0.74,
      color: "red",
      // opacity: 1.0,
      fill: "red",
      size: 3,
      strokeColor: "none"
    })
    addTrack(circos,tracks,'level4_4', level4_4, 'scatter', {
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
    addTrack(circos,tracks,'level5', level5, 'line', {
      innerRadius: 0.50,
      outerRadius: 0.68,
      color: "#5979ae",
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

  `
  //demo1的基础代码,默认会展示出来!
  const code1=`
<template>
    <div id="chart">Demo1 Component</div>
  </template>

  <script setup>
  import { ref, onMounted, inject } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server'; // 引入封装的 readFile API 调用
// console.log('测试一下',readFile)
import { reduceData, reduceData_Position, gieStainColor, transform_startend_position } from '@/components/Center/utils_circos.js';
import { add_hover_effect, addTrack, reverse } from '@/components/Center/utils_interact.js';
const bus = inject('bus');
// console.log('Injected bus:', bus);
// const tracks = ref({});//所有track的配置
let circos;

  onMounted(() => {
    console.log('Demo1 mounted')
  })
  </script>

  <style scoped>
  #chart {
    width: 100%;
    height: 100%;
    color: blue;
  }
  </style>
  `
  const allCodes = ref([code]);
  const currentCode = ref(code);


  return {
    messages,
    inputRecommendItems,
    addMessage,
    updateInputRecommendItems,
    log,
    addLog,
    snapshots,
    addSnapshot,
    lastQuery,
    queryInfo,
    sendVueFileToBackend,
    handleMessage,
    generateCode,
    trackInfo,
    nowTrackInfo,
    setNowTrackInfo,
    allCodes,
    currentCode,
    loading
  }
})
