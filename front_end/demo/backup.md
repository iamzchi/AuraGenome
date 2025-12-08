  console_info里面的信息
  
  // const trackInfo = ref([
  //   {
  //     id: "level2_1",
  //     file: "file2.csv",
  //     title: "Insertion Bar (Validated)",
  //     innerRadius: 0.95,
  //     outerRadius: 0.96,
  //     explanation:
  //       "Displays validated insertions (deep green) with 10Mb aggregation.",
  //     color: "green",
  //     type: "histogram",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.95,
  //       outer: 0.96,
  //     },
  //     colorConfig: {
  //       deepGreen: "#006400",
  //     },
  //     aggregation: "10Mb",
  //   },
  //   {
  //     id: "level2_2",
  //     file: "file2.csv",
  //     title: "Deletion Bar (Validated)",
  //     innerRadius: 0.96,
  //     outerRadius: 0.97,
  //     explanation:
  //       "Displays validated deletions (light green) with 10Mb aggregation.",
  //     color: "green",
  //     type: "histogram",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.96,
  //       outer: 0.97,
  //     },
  //     colorConfig: {
  //       lightGreen: "#90EE90",
  //     },
  //     aggregation: "10Mb",
  //   },
  //   {
  //     id: "level3_1",
  //     file: "file1.csv",
  //     title: "Heterozygous Mutations",
  //     innerRadius: 0.88,
  //     outerRadius: 0.93,
  //     explanation:
  //       "Displays heterozygous (light orange) mutations with 10Mb aggregation.",
  //     color: "#faa95d",
  //     type: "histogram",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.88,
  //       outer: 0.93,
  //     },
  //     colorConfig: {
  //       het: "#FFB74D",
  //     },
  //     aggregation: "10Mb",
  //   },
  //   {
  //     id: "level3_2",
  //     file: "file1.csv",
  //     title: "Homozygous Mutations",
  //     innerRadius: 0.8,
  //     outerRadius: 0.85,
  //     explanation:
  //       "Displays homozygous (dark orange) mutations with 10Mb aggregation.",
  //     color: "#f0761e",
  //     type: "histogram",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.8,
  //       outer: 0.85,
  //     },
  //     colorConfig: {
  //       hom: "#FF8C00",
  //     },
  //     aggregation: "10Mb",
  //   },
  //   {
  //     id: "level4_1",
  //     file: "file4.csv",
  //     title: "Silent Mutations",
  //     innerRadius: 0.77,
  //     outerRadius: 0.8,
  //     explanation: "Displays silent mutations (gray) in the genome.",
  //     color: "gray",
  //     type: "scatter",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.77,
  //       outer: 0.8,
  //     },
  //     colorConfig: {
  //       silent: "gray",
  //     },
  //   },
  //   {
  //     id: "level4_2",
  //     file: "file4.csv",
  //     title: "Missense Mutations",
  //     innerRadius: 0.74,
  //     outerRadius: 0.77,
  //     explanation: "Displays missense mutations (purple) in the genome.",
  //     color: "purple",
  //     type: "scatter",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.74,
  //       outer: 0.77,
  //     },
  //     colorConfig: {
  //       missense: "purple",
  //     },
  //   },
  //   {
  //     id: "level4_3",
  //     file: "file4.csv",
  //     title: "Nonsense Mutations",
  //     innerRadius: 0.71,
  //     outerRadius: 0.74,
  //     explanation: "Displays nonsense mutations (red) in the genome.",
  //     color: "red",
  //     type: "scatter",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.71,
  //       outer: 0.74,
  //     },
  //     colorConfig: {
  //       nonsense: "red",
  //     },
  //   },
  //   {
  //     id: "level4_4",
  //     file: "file4.csv",
  //     title: "Splice Site Mutations",
  //     innerRadius: 0.68,
  //     outerRadius: 0.71,
  //     explanation: "Displays splice site mutations (black) in the genome.",
  //     color: "black",
  //     type: "scatter",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.68,
  //       outer: 0.71,
  //     },
  //     colorConfig: {
  //       splice: "black",
  //     },
  //   },
  //   {
  //     id: "level5",
  //     file: "file5.csv",
  //     title: "Copy Number Variations",
  //     innerRadius: 0.5,
  //     outerRadius: 0.68,
  //     explanation:
  //       "Displays copy number variations (blue lines) across the genome.",
  //     color: "#5979ae",
  //     type: "line",
  //     opacity: 0.8,
  //     radiusConfig: {
  //       inner: 0.5,
  //       outer: 0.68,
  //     },
  //     colorConfig: {
  //       copyNumber: "#5979ae",
  //     },
  //   },
  //   {
  //     id: "level6",
  //     file: "file6.csv",
  //     title: "Loss of Heterozygosity",
  //     innerRadius: 0.49,
  //     outerRadius: 0.5,
  //     explanation: "Displays regions of loss of heterozygosity (red heatmap).",
  //     color: "red",
  //     type: "heatmap",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.49,
  //       outer: 0.5,
  //     },
  //     colorConfig: {
  //       loh: "red",
  //     },
  //   },
  //   {
  //     id: "level7_1",
  //     file: "file3.csv",
  //     title: "Intrachromosomal Rearrangements",
  //     innerRadius: 0.48,
  //     outerRadius: 0.5,
  //     explanation: "Displays intrachromosomal rearrangements (green chords).",
  //     color: "green",
  //     type: "chords",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.48,
  //       outer: 0.5,
  //     },
  //     colorConfig: {
  //       rearrangements: "green",
  //     },
  //   },
  //   {
  //     id: "level7_2",
  //     file: "file3.csv",
  //     title: "Interchromosomal Rearrangements",
  //     innerRadius: 0.48,
  //     outerRadius: 0.5,
  //     explanation: "Displays interchromosomal rearrangements (purple chords).",
  //     color: "purple",
  //     type: "chords",
  //     opacity: 1.0,
  //     radiusConfig: {
  //       inner: 0.48,
  //       outer: 0.5,
  //     },
  //     colorConfig: {
  //       rearrangements: "purple",
  //     },
  //   },
  // ]);


  # sequence_log里面的一些信息
  let data0 = [
      { id: "0",  text: "", parent: null, status: 0, type: "root" },
      { id: "1",  text: "", parent: "0", status: 1, type: "chord" },
      { id: "2",  text: "", parent: "0", status: 1, type: "chord" },
      { id: "3",  text: "", parent: "2", status: 2, type: "radial" },
      { id: "4",  text: "", parent: "3", status: 3, type: "radial" },
      { id: "5",  text: "", parent: "4", status: 2, type: "chord" },
      { id: "6",  text: "", parent: "5", status: 2, type: "chord" },
      { id: "7",  text: "", parent: "6", status: 2, type: "chord" },
      { id: "8",  text: "", parent: "7", status: 3, type: "chord" },]
let data2 = [
      { id: "0",  text: "", parent: null, status: 0, type: "root" },
      { id: "1",  text: "", parent: "0", status: 1, type: "chord" },
      { id: "2",  text: "", parent: "1", status: 1, type: "chord" },
      { id: "3",  text: "", parent: "2", status: 2, type: "radial" },
      { id: "4",  text: "", parent: "3", status: 3, type: "radial" },
      { id: "5",  text: "", parent: "10", status: 2, type: "chord" },
      { id: "6",  text: "", parent: "5", status: 2, type: "chord" },
      { id: "7",  text: "", parent: "6", status: 1, type: "radial" },
      { id: "8",  text: "", parent: "7", status: 3, type: "radial" },
      { id: "9",  text: "", parent: "0", status: 1, type: "radial" },
      { id: "10", text: "", parent: "9", status: 1, type: "radial" },
    ]


let data1 = [
      { id: "0",  text: "", parent: null, status: 0, type: "root" },
      { id: "1",  text: "", parent: "0", status: 3, type: "radial" },
      { id: "2",  text: "", parent: "0", status: 3, type: "circular" },
      { id: "3",  text: "", parent: "1", status: 2, type: "radial" },
      { id: "4",  text: "", parent: "2", status: 2, type: "circular" },
      { id: "5",  text: "", parent: "4", status: 1, type: "circular" },
      { id: "6",  text: "", parent: "5", status: 1, type: "radial" },
      { id: "7",  text: "", parent: "6", status: 3, type: "circular" },
      { id: "8",  text: "", parent: "7", status: 2, type: "circular" },
      { id: "9",  text: "", parent: "8", status: 1, type: "circular" },
      { id: "10", text: "", parent: "9", status: 3, type: "radial" },
      { id: "11", text: "", parent: "10", status: 2, type: "radial" },
      { id: "12", text: "", parent: "11", status: 1, type: "radial" },
      { id: "13", text: "", parent: "10", status: 1, type: "circular" },
      { id: "14", text: "", parent: "13", status: 1, type: "chord" },
      { id: "15", text: "", parent: "14", status: 2, type: "chord" },
      { id: "16", text: "", parent: "15", status: 2, type: "chord" },
      { id: "17", text: "", parent: "15", status: 2, type: "chord" },
      { id: "18", text: "", parent: "16", status: 2, type: "chord" },
      { id: "19", text: "", parent: "18", status: 3, type: "chord" },
]