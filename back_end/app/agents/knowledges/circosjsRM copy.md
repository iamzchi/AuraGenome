## Introduction

This is a javascript library to easily build interactive graphs in a circular layout. It's based on [d3.js](https://d3js.org/). It aims to be a javascript version of the [Circos](http://circos.ca) software.

## Tracks

A track is a series of data points.

To add a track to your graph you should write something like this:

```javascript
myCircos.heatmap(
    'my-heatmap',
    data,
    {
        // your heatmap configuration (optional)
    },
);
```

This pattern is similar to all track types:

```javascript
myCircos.trackType('track-id', data, configuration);
```

**Note**: The track name is used as a HTML class name so here are the format limitations.

* Must be unique.
* Should be slug style for simplicity, consistency and compatibility. Example: `my-heatmap`
* Lowercase, a-z, can contain digits, 0-9, can contain dash or dot but not start/end with them.
* Consecutive dashes or dots not allowed.
* 50 characters or less.


### Chords

Chords tracks connect layout regions.

<p align="center">
  <img src="doc/chords.png" width="60%" alt="chords">
  <br/>
  <i>Some gene fusions in human karyotype (<a href="demo/chords.js">source</a>)</i>
</p>

Data should looks like this:

```javascript
var data = [
  {
    source: {
      id: 'january',
      start: 1,
      end: 12
    },
    target: {
      id: 'april',
      start: 18,
      end: 20
    }
  },
  {
    source: {
      id: 'february',
      start: 20,
      end: 28
    },
    target: {
      id: 'december',
      start: 1,
      end: 13
    }
  },
  ...
];
```

Optionally each datum can define a `value` attribute to draw colored ribbons with palettes or a color function.

The available configuration fields are:
- [color](#color)
- [events](#events)
- [opacity](#opacity)
- [zIndex](#zIndex)
- [tooltipContent](#tooltipContent)
- [min](#minmax)
- [max](#minmax)
- [radius](#radius)
- [logScale](#logScale)
- [logScaleBase](#logScaleBase)

### Heatmap

<p align="center">
  <img src="doc/heatmap.png" width="60%" alt="heatmap">
  <br/>
  <i>Electrical comsumption in France in 2014</i>
</p>

To add a heatmap to your circos instance:

```javascript
myCircos.heatmap('electrical-consumption', data, configuration);
```

Configuration:

```javascript
{
  innerRadius: null,
  outerRadius: null,
  min: null,
  max: null,
  color: 'YlGnBu',
  logScale: false,
  tooltipContent: null,
  events: {}
}
```

Data format:

```javascript
var data = [
  {
    block_id: 'january',
    start: 0,
    end: 1,
    value: 1368001
  },
  {
    block_id: 'january',
    start: 1,
    end: 2,
    value: 1458583
  },
  ...
]
```

### Highlight

<p align="center">
  <img src="doc/highlight.png" width="60%" alt="highlight">
  <br/>
  <i>Human karyotype with cytobands highlighted (<a href="demo/highlight.js">source</a>)</i>
</p>

To add a highlight to your circos instance:

```javascript
myCircos.highlight('cytobands', data, configuration);
```

The minimal datum should have `block_id`, `start` and `end` attributes.

Configuration:

```javascript
{
  innerRadius: null,
  outerRadius: null,
  min: null,
  max: null,
  color: 'd3d3d3',
  strokeColor: null,
  strokeWidth: 0,
  opacity: 1,
  logScale: false,
  tooltipContent: null,
  events: {}
}
```

### Histogram
Data should looks like this:

```javascript
var data = [
    {
      block_id: 'january',
      start: 1,
      end: 10,
      value: 5
    }
];
```

The available configuration fields are:
- [innerRadius](#innerRadiusOuterRadius)
- [outerRadius](#innerRadiusOuterRadius)
- [color](#color)
- [opacity](#opacity)
- [zIndex](#zIndex)
- [tooltipContent](#tooltipContent)
- [min](#minmax)
- [max](#minmax)
- [logScale](#logScale)
- [logScaleBase](#logScaleBase)
- [axes](#axes)
- [events](#events)

### Line

<p align="center">
  <img src="doc/line.png" width="60%" alt="line">
  <br/>
  <i>Some single nucleotide polymorphism on chromosomes 1, 2 and 3 (<a href="demo/line.js">source</a>)</i>
</p>

```javascript
myCircos.line('line1', data, configuration);
```

The minimal datum should have `block_id`, `position` and `value` attributes (see above tracks for more details).

The available configuration fields are:
- [innerRadius](#innerRadiusOuterRadius)
- [outerRadius](#innerRadiusOuterRadius)
- [color](#color)
- [strokeColor](#strokeColor)
- [strokeWidth](#strokeWidth)
- [direction](#direction)
- [fill](#fill)
- [fillColor](#fillColor)
- [maxGap](#maxGap)
- [opacity](#opacity)
- [zIndex](#zIndex)
- [min](#minmax)
- [max](#minmax)
- [logScale](#logScale)
- [logScaleBase](#logScaleBase)
- [axes](#axes)
- [backgrounds](#backgrounds)
- [events](#events)

**Note**: The tooltip option is not available for line track. To display a tooltip, you should superimpose an invisble `scatter` track (`fill: false` and `strokeWidth: 0`) and set a tooltip for this track.

### Scatter

<p align="center">
  <img src="doc/scatter.png" width="60%" alt="scatter">
  <br/>
  <i><a href="demo/line.js">source</a></i>
</p>

```javascript
myCircos.scatter('scatter1', data, configuration);
```

The minimal datum should have `block_id`, `position` and `value` attributes (see above tracks for more details).

The available configuration fields are:
- [innerRadius](#innerRadiusOuterRadius)
- [outerRadius](#innerRadiusOuterRadius)
- [color](#color)
- [strokeColor](#strokeColor)
- [strokeWidth](#strokeWidth)
- [direction](#direction)
- [fill](#fill)
- [size](#size)
- [shape](#shape)
- [opacity](#opacity)
- [zIndex](#zIndex)
- [min](#minmax)
- [max](#minmax)
- [logScale](#logScale)
- [logScaleBase](#logScaleBase)
- [axes](#axes)
- [backgrounds](#backgrounds)
- [events](#events)

### Stack

<p align="center">
  <img src="doc/stack.png" width="60%" alt="stack">
  <br/>
  <i><a href="demo/stack.js">source</a></i>
</p>

```javascript
myCircos.stack('stack', data, configuration);
```

The minimal datum should have `block_id`, `start` and `end` attributes (see above tracks for more details).

Configuration:

```javascript
{
  innerRadius: null,
  outerRadius: null,
  min: null,
  max: null,
  color: '#fd6a62',
  strokeColor: '#d3d3d3',
  strokeWidth: 1,
  direction: 'out',
  thickness: 10,
  radialMargin: 2,
  margin: 2,
  opacity: 1,
  logScale: false,
  tooltipContent: null,
  events: {}
}
```

### Text

<p align="center">
  <img src="doc/text.png" width="60%" alt="text">
  <br/>
  <i><a href="demo/text.js">source</a></i>
</p>

```javascript
myCircos.text('text', data, configuration);
```

The minimal datum should have `block_id`, `position` and `value` attributes (see above tracks for more details).

Configuration:

```javascript
{
  innerRadius: null,
  outerRadius: null,
  style: {
    'font-size': 12,
    fill: 'black',
    opacity: 1,
  },
  events: {}
}
```

## Configuration Attributes

### backgrounds

You can add a list of backgrounds:

```javascript
{
  backgrounds: [
    {
      start: 0.006,
      color: '#4caf50',
      opacity: 0.1
    },
    {
      start: 0.002,
      end: 0.006,
      color: '#d3d3d3',
      opacity: 0.1
    },
    {
      end: 0.002,
      color: '#f44336',
      opacity: 0.1
    }
  ]
}
```

The `start` and `end` fields are interpreted as values on the same scale than the track values.
- If `start` is not specified, default is the `min` value of the track.
- If `end` is not specified, default is the `max` value of the track.

You can also specify a `color` and an `opacity`.

### events

All tracks and the layout configurations can receive an events attribute. This attribute must be an object where keys are event names and values are event callbacks. For example:

```javascript
{
  events: {
    'click.alert': function (datum, index, nodes, event) {
      window.alert(datum)
    }
  }
}
```

The documentation about d3 events is [here](https://github.com/d3/d3-selection/blob/master/README.md#selection_on). You can add all events described in this documentation. I recommend using event namespaces (`click.alert` instead of `click`) to avoid possible conflicts with internal circosjs events.

### innerRadius/outerRadius

For the layout, the innerRadius and outerRadius values are always interpreted as a number of pixel.

For tracks:

If innerRadius and outerRadius are between `0` and `1`, the value is interpreted as a fraction of the innerRadius of the layout.

eg:
```
{
  innerRadius: 0.5,
  outerRadius: 0.8
}
```

If innerRadius and outerRadius are between `1` and `10`, the value is interpreted as a fraction of the outerRadius of the layout.

eg:
```
{
  innerRadius: 1,
  outerRadius: 1.2
}
```

Otherwise it is interpreted as a number of pixels.

### min/max

The default min and max values are computed according to the dataset. You can override these values by specifying a `min` or `max` attribute in the configuration.

### color

The color attribute can be either:

#### CSS color code

e.g `#d3d3d3`, `blue`, `rgb(0, 0, 0)`

#### Palette name from [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic)

The color will be computed dynamically according to the track data `value` field.

If you prefix the palette name with a `-` (e.g `-BrBG`), the palette will be reversed.

The list of palette names are:

**BrBG**:
<img src="doc/palettes/BrBG.png" width="100%" height="10">
**PRGn**:
<img src="doc/palettes/PRGn.png" width="100%" height="10">
**PiYG**:
<img src="doc/palettes/PiYG.png" width="100%" height="10">
**PuOr**:
<img src="doc/palettes/PuOr.png" width="100%" height="10">
**RdBu**:
<img src="doc/palettes/RdBu.png" width="100%" height="10">
**RdGy**:
<img src="doc/palettes/RdGy.png" width="100%" height="10">
**RdYlBu**:
<img src="doc/palettes/RdYlBu.png" width="100%" height="10">
**RdYlGn**:
<img src="doc/palettes/RdYlGn.png" width="100%" height="10">
**Spectral**:
<img src="doc/palettes/Spectral.png" width="100%" height="10">
**Blues**:
<img src="doc/palettes/Blues.png" width="100%" height="10">
**Greens**:
<img src="doc/palettes/Greens.png" width="100%" height="10">
**Greys**:
<img src="doc/palettes/Greys.png" width="100%" height="10">
**Oranges**:
<img src="doc/palettes/Oranges.png" width="100%" height="10">
**Purples**:
<img src="doc/palettes/Purples.png" width="100%" height="10">
**Reds**:
<img src="doc/palettes/Reds.png" width="100%" height="10">
**BuGn**:
<img src="doc/palettes/BuGn.png" width="100%" height="10">
**BuPu**:
<img src="doc/palettes/BuPu.png" width="100%" height="10">
**GnBu**:
<img src="doc/palettes/GnBu.png" width="100%" height="10">
**OrRd**:
<img src="doc/palettes/OrRd.png" width="100%" height="10">
**PuBuGn**:
<img src="doc/palettes/PuBuGn.png" width="100%" height="10">
**PuBu**:
<img src="doc/palettes/PuBu.png" width="100%" height="10">
**PuRd**:
<img src="doc/palettes/PuRd.png" width="100%" height="10">
**RdPu**:
<img src="doc/palettes/RdPu.png" width="100%" height="10">
**YlGnBu**:
<img src="doc/palettes/YlGnBu.png" width="100%" height="10">
**YlGn**:
<img src="doc/palettes/YlGn.png" width="100%" height="10">
**YlOrBr**:
<img src="doc/palettes/YlOrBr.png" width="100%" height="10">
**YlOrRd**:
<img src="doc/palettes/YlOrRd.png" width="100%" height="10">

#### Custom function

You can specify a function that compute the color code given the track data and the datum index. For example:

```javascript
{
  color: function(datum, index) {
    return datum.value < 5 ? 'red' : 'green'
  }
}

```

### axes

The default value is an empty array:

```javascript
{
  axes: []
}
```

You can add items to this array to render an axis or a group of axes. You can give axes a `color` (default: '#d3d3d3'), `thickness` (default: 1) and `opacity` (default: track opacity):

```javascript
{
  axes: [
    {
      color: 'black',
      thickness: 2, // in pixel
      opacity: 0.3 // between 0 and 1
    }
  ]
}
```

Then you should specify where to place the axes.

You can either define a single axis by defining a `position` attribute with a value between the min and max value of the track:

```javascript
{
  axes: [
    {
      color: 'red',
      position: 4
    },
    {
      color: 'green',
      position: 15
    }
  ]
}
```

<p align="center">
  <img src="doc/axes-1.png" width="60%" alt="axes-1">
  <br/>
  <i><a href="demo/axes">source</a></i>
</p>


Or define a range of axes with a `spacing` attribute and optionnally a `start` and `end` attributes:

```javascript
{
  axes: [
    {
      spacing: 2
    }
  ]
}
```

<p align="center">
  <img src="doc/axes-2.png" width="60%" alt="axes-2">
  <br/>
  <i><a href="demo/axes">source</a></i>
</p>

Here is an advanced example:

```javascript
{
  axes: [
    {
      color: 'red',
      spacing: 2,
      end: 4
    },
    {
      color: 'green',
      spacing: 2,
      start: 16
    },
    {
      spacing: 2,
      start: 4,
      end: 16,
      thickness: 2
    },
    {
      spacing: 1,
      start: 4,
      end: 16,
      thickness: 1
    }
  ]
}
```

<p align="center">
  <img src="doc/axes-3.png" width="60%" alt="axes-3">
  <br/>
  <i><a href="demo/axes">source</a></i>
</p>

The values that you set for `position`, `spacing`, `start` and `end` are in the unit of the track values.

### tooltipContent

A function that receive the datum and the index as a value and return a string displayed in the tooltip (HTML is accepted):

```javascript
{
  tooltipContent: function (datum, index) {
    return `<h5>${datum.block_id}:${datum.start}-${datum.end} ➤ ${datum.value}</h5> <i>(CTRL+C to copy to clipboard)</i>`
  }
}
```

Then when you mouseover the datum, a tooltip will be displayed.
Note that you can use the keyboard shortcut CTRL+C to copy the content to clipboard.

### showAxesTooltip

Show or not a tooltip with the value of the axis. Default is `true`.

### direction

It should be either `in` or `out`. Default is `out`. For stack you can also use `center`.

### fill

`true` or `false`.

### fillColor

A color such as `#d3d3d3`, `red`, `rgb(112, 255, 1)`.

### logScale

`true` or `false`. Default is `false`.

### logScaleBase

The log base if logScale is `true`. Default is `Math.E`.

### radius

In the chords configuration you can specify a radius parameter. Default is `null`.

Examples:

```javascript
// when there is no value, default is null:
// the radius will be the one of the innerRadius of the layout
{}

// when the value is a number greater than 1, it is interpreted as
// a number of pixel from the center
{
  radius: 200
}

// when the value is a number lower than 1, it is interpreted as
// a fraction of the layout inner radius
{
  radius: 0.8
}

// you can also specify a function that return a number that
// will be interpreted as explained above. The function takes
// a datum as parameter
{
  radius: function (d) {
    if (d.source.id === 'chr1') {
      return 0.8
    }
    if (d.source.id === 'chr2') {
      return 0.7
    }
  }
}
```

### shape

It should be one of:
  - `circle`
  - `cross`
  - `diamond`
  - `square`
  - `triangle`
  - `star`
  - `wye`

### zIndex

This should be an integer. The higher it is the more above the track will appear.


----
上面是关于这个函数库的使用文档
接下来我将指导如何加载数据、处理数据以及如何使用这些数据绘制图表。以下是详细的步骤。
1. 读取数据
你可以通过 readFile 函数从指定路径加载数据。这通常用于加载 CSV 或 JSON 格式的文件。读取的数据将用于后续的图表生成。
例如：
let level2 = await readFile('id_001/file2.csv'); 

2. 处理数据
加载数据后，需要按照目标图表的要求对数据进行一些预处理。
比如按染色体区间聚合数据、过滤某些条件、或者转换数据格式。这些操作由以下的工具函数完成：
- 聚合数据
  - 当绘制Heatmap、Highlight、Histogram时，需要使用reduceData 和 reduceData_Position，用于按照染色体区间或位置区间聚合数据。
- 转换数据
   当文件列名中包含start和end，但是绘图需要position时，需要使用transform_startend_position，这个函数会自动将start和end转换为position，并返回新的数据。

3. 绘制图形
按照circos.{charttype}('track-id',data,configuration)的格式
其中trackid由你来定义，但是必须是唯一值

---
下面是关于处理数据的时候的工具函数的详细说明：
# 函数说明文档

本文档详细描述了三个函数的功能、参数和返回值。这些函数主要用于处理基因组数据，并进行数据聚合和转换操作。具体如下：

---

## 1. `reduceData`

### 功能
该函数根据基因组数据和染色体信息，将数据按染色体划分并统计每个区间内的数据数量。适用于数据由起始位置和结束位置（`Start` 和 `End`）表示的情况。

### 参数

- **rawData**  
  - **类型**：数组  
  - **描述**：基因组数据数组，每个对象包含以下字段：
    - `id`: 染色体 ID（字符串类型）。
    - `Start`: 数据起始位置（数字类型）。
    - `End`: 数据结束位置（数字类型）。
  
- **karyotype**  
  - **类型**：数组  
  - **描述**：染色体信息数组，每个对象包含以下字段：
    - `id`: 染色体 ID（字符串类型）。
    - `len`: 染色体长度（数字类型）。
  
- **range**  
  - **类型**：数字（可选）  
  - **描述**：区间长度，默认为 `10,000,000`。

### 返回值
- **类型**：数组  
- **描述**：统计结果数组，每个对象包含以下字段：
  - `block_id`: 染色体 ID。
  - `start`: 区间起始位置。
  - `end`: 区间结束位置。
  - `value`: 区间内的数据数量。

### 示例代码
```js
const result = reduceData(rawData, karyotype, 5000000);
```

---

## 2. `reduceData_Position`

### 功能
该函数与 `reduceData` 类似，但输入的数据中使用的是单一的 `Position` 字段，而非 `Start` 和 `End`。此函数适用于仅包含位置（`Position`）的数据。

### 参数

- **rawData**  
  - **类型**：数组  
  - **描述**：基因组数据数组，每个对象包含以下字段：
    - `id`: 染色体 ID（字符串类型）。
    - `Position`: 数据的位置（数字类型）。
  
- **karyotype**  
  - **类型**：数组  
  - **描述**：染色体信息数组，每个对象包含以下字段：
    - `id`: 染色体 ID（字符串类型）。
    - `len`: 染色体长度（数字类型）。
  
- **range**  
  - **类型**：数字（可选）  
  - **描述**：区间长度，默认为 `10,000,000`。

### 返回值
- **类型**：数组  
- **描述**：统计结果数组，每个对象包含以下字段：
  - `block_id`: 染色体 ID。
  - `start`: 区间起始位置。
  - `end`: 区间结束位置。
  - `value`: 区间内的数据数量。

### 示例代码
```js
const result = reduceData_Position(rawData, karyotype, 5000000);
```

---

## 3. `transform_startend_position`

### 功能
该函数将输入的基因组数据中的 `Start` 和 `End` 转换为对应的 `Position`，并生成每个位置的数据条目。适用于需要将区间转换为具体位置的数据格式。

### 参数

- **inputData**  
  - **类型**：数组（JSON 格式）  
  - **描述**：包含 `id`、`Start` 和 `End` 的基因组数据数组。
  
- **number_column**  
  - **类型**：字符串（可选）  
  - **描述**：指定用于转换为 `value` 的列名。如果提供该参数，将把该列的数值解析为浮动数值；否则，`value` 将默认为 1。

### 返回值
- **类型**：数组  
- **描述**：转换后的数据数组，每个对象包含以下字段：
  - `block_id`: 染色体 ID。
  - `position`: 转换后的位置（从 `Start` 或 `End` 获取）。
  - `value`: 对应位置的数据值（如果 `number_column` 被提供，则为该列的数值，否则默认为 1）。

### 示例代码
```js
const result = transform_startend_position(inputData, "ValueColumn");
```


