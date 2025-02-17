```js


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
      data: ['Functionality', 'Domain Adapt. ', 'Efficiency', 'Multi-lang.', 'Interpret.']
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
      data: [8.21, 9, 6.11, 9.1, 1],
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
      data: [5.234, 4, 9, 7.78, 1.3],
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
      data: [9.3, 8,4.23,9,7],
                  itemStyle: {
        color: '#4d6bfe' // Red color for this series
      }
    }
  ]
};
```