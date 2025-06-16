// const rawData = [
//     [0, 0, 2, 0, 0, 1],  // Strongly Disagree (1)
//     [1, 0, 1, 0, 1, 1],  // Disagree (2)
//     [2, 2, 2, 2, 2, 3],  // Neutral (3)
//     [3, 1, 3, 3, 3, 2],  // Agree (4)
//     [6, 9, 4, 7, 6, 5],  // Strongly Agree (5)
//   ];
  
  const rawData = [ //circos
    [4, 2, 2, 3, 5, 3],  // Strongly Disagree (1)
    [5, 5, 3, 5, 4, 4],  // Disagree (2)
    [2, 3, 0, 3, 2, 2],  // Neutral (3)
    [1, 1, 4, 1, 1, 2],  // Agree (4)
    [0, 1, 3, 0, 0, 1],  // Strongly Agree (5)
  ];
  
  const totalData = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  
  const grid = {
    left: '5%',
    right: '25%',
    top: '30%',
    bottom: '30%',
    containLabel: true
  };
  
  const colors = ["#19547b", "#577783", "#949a8c", "#ccbb94", "#ffd89b"];
  
  const series = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    ' Agree',
    'Strongly Agree'
  ].flatMap((name, sid) => {
    const dataSeries = {
      name,
      type: 'bar',
      stack: 'total',
      barCategoryGap: '5%',
      itemStyle: { 
        color: colors[sid],
        // Adding border radius
        borderRadius: [5, 5, 5, 5] // [top-left, top-right, bottom-right, bottom-left]
      },
      label: {
        show: true,
        position: 'inside',
        formatter: (params) => {
          return rawData[sid][params.dataIndex];
        }
      },
      data: rawData[sid].map((d, did) => 
        totalData[did] <= 0 || d === 0 ? null : d / totalData[did]  // Exclude zero values
      )
    };
    
    if (sid < 4) {
      return [dataSeries, {
        name: `gap_${sid}`,
        type: 'bar',
        stack: 'total',
        itemStyle: { 
          color: 'transparent',
          borderRadius: [5, 5, 5, 5] // Maintain consistency in gap blocks with rounded corners
        },
        label: { show: false },
        data: rawData[sid].map((d, did) => 
          totalData[did] <= 0 || d === 0 ? null : 0.01  // Ensure gap bars only appear for non-zero values
        )
      }];
    }
    return [dataSeries];
  });
  
  option = {
    color: colors,
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'center',
      selectedMode: false,
      data: ['Strongly Disagree', 'Disagree', 'Neutral', ' Agree', 'Strongly Agree']
    },
    grid,
    yAxis: {
      type: 'category',
      data: ['Q6', 'Q5', 'Q4', 'Q3', 'Q2', 'Q1'],
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },  // Hides labels
    },
    xAxis: {
      type: 'value',
      axisLabel: { 
        formatter: function(value) {
          return Math.round(value * 100) + '%';
        }
      },
      min: 0,
      max: 1,
      interval: 0.5,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },  // Hides labels
    },
    series,
  };
  