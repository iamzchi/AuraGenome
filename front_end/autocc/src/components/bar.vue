<script setup>
import { ref, defineProps, onMounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  }
});

const chartRef = ref(null);

onMounted(() => {
  const chart = echarts.init(chartRef.value);
  const option = {
    tooltip: {
      trigger: 'item',
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.name),
      axisLabel: {
        interval: 0,  // Ensure all labels are visible
      },
      axisTick: {
        alignWithLabel: true,
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: props.data.map(item => item.value),
        type: 'bar',
        barWidth: '80%', // Make bars wider to fill the space
        itemStyle: {
          color: function (params) {
            const colors = ['#ff7f50', '#87cefa', '#32cd32', '#ff69b4', '#8a2be2', '#20b2aa'];
            return colors[params.dataIndex % colors.length];
          }
        }
      }
    ]
  };

  chart.setOption(option);

  window.addEventListener('resize', () => {
    chart.resize();
  });
});
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100px;"></div>
</template>

<style scoped lang="scss">
</style>
