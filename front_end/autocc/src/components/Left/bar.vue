<script setup>
// 引入 nextTick
import { ref, defineProps, onMounted, watch, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { color } from 'd3';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const chartRefs = ref({});
let charts = ref({});

// 添加设置 ref 的方法
const setChartRef = (el, key) => {
  if (el) {
    chartRefs.value[key] = el;
  }
};
const setChartOption = (key) => {
  const option = {
    color: ['#91e2c3', '#83ccd9'], // 设置全局调色盘
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      position: (point) => {
        return [point[0] + 10, point[1]];
      },
      formatter: function (params) {
        // params 是一个数组，我们取第一个元素
        const item = params[0];
        return `${item.name}: ${item.value}`;
      }
    },
    yAxis: {
      type: 'category',
      data: props.data[key].map(item => item.name),
      axisLabel: {
        show: false,  // Display the Y-axis labels
      },
      axisTick: {
        alignWithLabel: true,
      }
    },
    xAxis: {
      type: 'value',
      show: true,  // Hide X-axis (as per your previous request)
      axisLine: {
        show: false,  // Hide the X-axis line
      },
      axisTick: {
        show: false,  // Hide the X-axis ticks
      },
      axisLabel: {
        show: false,  // Hide the X-axis labels
      },
      splitLine: {
        show: false,  // Hide the grid lines
      },
    },
    grid: {
      left: '5%',   // Optional: adjust the position of the grid
      right: '0%',  // Optional: adjust the position of the grid
      bottom: '0%',// Optional: adjust the position of the grid
      top: '0%',   // Optional: adjust the position of the grid
    },
    backgroundColor: 'transparent',  // Make the background transparent
    series: [
      {
        data: props.data[key].map(item => item.value),
        type: 'bar',
        showBackground: true,
        barWidth: '15px',
        itemStyle: {
          // color: function (params) {
          //   return props.data[key][params.dataIndex].color; // 使用正确的数据类型
          // }
          color: function (params) {
            // if (params.dataIndex % 3 === 0) {
            //   return '#6da9ff';
            // } else if (params.dataIndex % 3 === 1) {
            //   return '#83ccd9';
            // } else {
            //   return '#6eaffd';
            // }
            return '#c5c6c8'
            // return params.dataIndex % 2 === 0 ? '#91e2c3' : '#83ccd9';
          }

        },
        label: {
          show: true, // Show the labels on top of the bars
          position: 'insideLeft', // Position the labels at the right of the bars
          formatter: function (params) {
            return `${props.data[key][params.dataIndex].name}: ${props.data[key][params.dataIndex].value}`; // Display the 'name' on the right side of the bars
          },
          color: '#000', // 文字颜色设为白色
          fontSize: 10
        }
      }
    ]
  };

  if (charts.value[key]) {
    charts.value[key].setOption(option);
  }
};

// 添加一个方法来动态计算图表高度
const updateChartHeight = (key) => {
  if (chartRefs.value[key]) {
    // 根据数据条数计算合适的高度，每条数据至少30px
    const height = Math.max(props.data[key].length * 17, 40);
    chartRefs.value[key].style.height = `${height}px`;
    // 重新调整图表大小
    if (charts.value[key]) {
      charts.value[key].resize();
    }
  }
};

// // 修改初始化图表的方法
// const initCharts = () => {
//   Object.keys(props.data).forEach(key => {
//     if (!charts.value[key] && chartRefs.value[key]) {
//       updateChartHeight(key); // 先设置高度
//       charts.value[key] = echarts.init(chartRefs.value[key]);
//       setChartOption(key);
//     }
//   });
// };

// 修改 watch 函数部分
watch(() => props.data, () => {
  console.log("数据发生改变，重新渲染echarts");
  
  // 先销毁所有现有图表
  Object.keys(charts.value).forEach(key => {
    if (charts.value[key]) {
      charts.value[key].dispose();
      charts.value[key] = null;
    }
  });
  
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    // 使用新数据重新创建所有图表
    Object.keys(props.data).forEach(key => {
      if (chartRefs.value[key]) {
        // 设置高度
        const height = Math.max(props.data[key].length * 17, 40);
        chartRefs.value[key].style.height = `${height}px`;
        
        // 确保容器可见且有尺寸
        if (chartRefs.value[key].clientWidth > 0 && chartRefs.value[key].clientHeight > 0) {
          // 创建新图表
          charts.value[key] = echarts.init(chartRefs.value[key]);
          setChartOption(key);
        } else {
          // 如果容器尺寸仍为0，使用setTimeout再次尝试
          setTimeout(() => {
            if (chartRefs.value[key] && chartRefs.value[key].clientWidth > 0 && chartRefs.value[key].clientHeight > 0) {
              charts.value[key] = echarts.init(chartRefs.value[key]);
              setChartOption(key);
            }
          }, 100); // 延迟100ms再次尝试
        }
      }
    });
  });
}, { deep: true });

// 同样修改 initCharts 方法
const initCharts = () => {
  nextTick(() => {
    Object.keys(props.data).forEach(key => {
      if (!charts.value[key] && chartRefs.value[key]) {
        updateChartHeight(key); // 先设置高度
        
        // 确保容器可见且有尺寸
        if (chartRefs.value[key].clientWidth > 0 && chartRefs.value[key].clientHeight > 0) {
          charts.value[key] = echarts.init(chartRefs.value[key]);
          setChartOption(key);
        } else {
          // 如果容器尺寸仍为0，使用setTimeout再次尝试
          setTimeout(() => {
            if (chartRefs.value[key] && chartRefs.value[key].clientWidth > 0 && chartRefs.value[key].clientHeight > 0) {
              charts.value[key] = echarts.init(chartRefs.value[key]);
              setChartOption(key);
            }
          }, 100); // 延迟100ms再次尝试
        }
      }
    });
  });
};

onMounted(() => {
  initCharts();

  window.addEventListener('resize', () => {
    Object.values(charts.value).forEach(chart => {
      chart?.resize();
    });
  });
});

// 组件卸载时销毁图表????????????????????
onUnmounted(() => {
  Object.values(charts.value).forEach(chart => {
    chart?.dispose();
  });
});
</script>

<template>
  <div class="charts-container">
    <div v-for="(data, key) in props.data" :key="key" class="chart-item">
      <h3 style="font-size: 0.8rem;">{{ key }}</h3>
      <div :ref="el => setChartRef(el, key)" class="chart"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.charts-container {
  width: 100%;
  height: 95%;
  overflow-y: auto;
  //隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;
  // padding: 10px;
}

.chart-item {
  margin-bottom: 10px;
  background-color: rgb(243, 243, 243);
  border-radius: 10px;
  padding: 10px;

  h3 {
    margin: 0;
    margin-bottom: 3px;
    font-size: 16px;
    color: #333;
  }
}

.chart {
  width: 100%;
  // height: 400px;
  // min-height: 50px;
  background-color: transparent;
}
</style>
