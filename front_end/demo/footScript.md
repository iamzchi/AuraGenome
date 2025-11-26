第二步：绿色柱状图

1. 插入（深绿色）
   Prompt: "Using file2.csv to generate a dark-green bar chart, using rows where Type column is Insertion and Validation_status column is not empty."
2. 缺失（红色）
   Prompt: "Using file2.csv to generate a red bar chart, using rows where Type column is Deletion and Validation_status column is not empty."

第三步：橙色柱状图✅

1. 异型合子（浅橙色）
   Prompt: "Using file1.csv to generate a light-orange bar chart, using rows where Zygosity column is het. Aggregate data per 10Mb."
2. 纯合子（深橙色）
   Prompt: "Using file1.csv to generate a dark-orange bar chart, using rows where Zygosity column is hom. Aggregate data per 10Mb."

第四步：编码突变（彩色方块）

1. 沉默突变（灰色）
   Prompt: "Using file4.csv to generate a gray scatter plot, using rows where Effect column is Silent."
2. 错义突变（紫色）
   Prompt: "Using file4.csv to generate a purple scatter plot, using rows where Effect column is Missense."
3. 无义突变（红色）
   Prompt: "Using file4.csv to generate a red scatter plot, using rows where Effect column is Nonsense."
4. 剪接位点突变（黑色）
   Prompt: "Using file4.csv to generate a black scatter plot, using rows where Effect column is Splice site."

第五步：蓝色折线图

1. 拷贝数变化
   Prompt: "Using file5.csv to generate a blue line chart, plotting Copy number column values against their genomic position."

第六步：红色线

1. 杂合性丢失区域（LOH）
   Prompt: "Using file6.csv to generate a red heatmap, representing genomic regions where LOH (Loss of Heterozygosity) occurs."

第七步：连线✅

1. 染色体内重排（绿色）
   Prompt: "Using file3.csv to generate green connection lines, linking regions where Chromosome and Chromosome.1 columns have the same values."
1. 染色体间重排（紫色）
   Prompt: "Using file3.csv to generate purple connection lines, linking regions where Chromosome and Chromosome.1 columns have different values."
