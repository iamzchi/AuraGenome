<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  }
});

const chartRef = ref(null);
let chart = null;

const setChartOption = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.name),
      axisLabel: {
        show: false,  // Hide the original X-axis labels
      },
      axisTick: {
        alignWithLabel: true,
      }
    },
    yAxis: {
      type: 'value',
      show: false,  // Hide Y-axis (as per your previous request)
      axisLine: {
        show: false,  // Hide the Y-axis line
      },
      axisTick: {
        show: false,  // Hide the Y-axis ticks
      },
      axisLabel: {
        show: false,  // Hide the Y-axis labels
      },
      splitLine: {
        show: false,  // Hide the grid lines
      },
    },
    grid: {
      left: '5%',   // Optional: adjust the position of the grid
      right: '5%',  // Optional: adjust the position of the grid
      bottom: '10%',// Optional: adjust the position of the grid
      top: '10%',   // Optional: adjust the position of the grid
    },
    backgroundColor: 'transparent',  // Make the background transparent
    series: [
      {
        data: props.data.map(item => item.value),
        type: 'bar',
        barWidth: '80%', // Make bars wider to fill the space
        itemStyle: {
          color: function (params) {
            return props.data[params.dataIndex].color;
          }
        },
        label: {
          show: true, // Show the labels on top of the bars
          position: 'insideTop', // Position the labels at the top of the bars
          formatter: function (params) {
            return props.data[params.dataIndex].class; // Display the 'name' on top of the bars
          }
        }
      }
    ]
  };

  if (chart) {
    chart.setOption(option);
  }
};

watch(props.data, () => {
  console.log("发生改变了，用新的数据重新渲染echarts");
  setChartOption(); // Update the chart with new data
}, { deep: true });

onMounted(() => {
  chart = echarts.init(chartRef.value);
  setChartOption(); // Set initial chart option
  
  window.addEventListener('resize', () => {
    chart.resize(); // Resize chart on window resize
  });
});
</script>

<template>
  <div ref="chartRef" style="width: 100%; height:100%;"></div>
</template>

<style scoped lang="scss"></style>
