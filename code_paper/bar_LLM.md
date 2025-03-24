

app.config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
  onChange: function () {
    const labelOption = {
      rotate: app.config.rotate,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      position: app.config.position,
      distance: app.config.distance
    };
    myChart.setOption({
      series: [
        {
          label: labelOption
        },
        {
          label: labelOption
        },
        {
          label: labelOption
        },
        {
          label: labelOption
        }
      ]
    });
  }
};
const labelOption = {
  show: false,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {}
  }
};
option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['gpt-4o-2024-11-20', 'o1-2024-12-27', 'DeepSeek r1-671b', 'Wetland']
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['SemUnderstand', 'CodeAccuracy ', 'InstrFollow', 'RespEfficiency', 'OutputInterpret']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'gpt-4o-2024-11-20',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [9, 7.43, 9, 8.5, 2.123],
      itemStyle: {
        color: '#19c37d' // Red color for this series
      }
    },
    {
      name: 'o1-2024-12-27',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [6, 8.2, 7.5, 5.34, 3.32],
            itemStyle: {
        color: '#191b1c' // Red color for this series
      }
    },
    {
      name: 'DeepSeek r1-671b',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: [8.5, 9.32,8.5,4.43,8.43],
                  itemStyle: {
        color: '#4d6bfe' // Red color for this series
      }
    }
  ]
};