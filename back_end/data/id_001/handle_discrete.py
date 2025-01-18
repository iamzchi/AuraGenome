import os
import pandas as pd
import json

# 创建输出目录
output_dir = './discrete'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

colors = {
    "reds": [
        "#ff2918", "#ff4652", "#ff0f4b", "#d4334f", "#d53c25", 
        "#9b0000", "#ff354a", "#ff2f2d", "#ff5289", "#eb0b74"
    ],
    "purples": [
        "#9e4adc", "#6632ff", "#b357ff", "#6e24ff", "#6051ff", 
        "#7823ff", "#9133ff", "#7d21ff", "#b32dff", "#6756d5"
    ],
    "blues": [
        "#5c2df0", "#462efd", "#3336ff", "#0d64cf", "#1d57ff", 
        "#4721f8", "#275ad3", "#3e53ff", "#3326fd", "#324aff"
    ],
    "greens": [
        "#57ff50", "#5eff64", "#25ff63", "#2fd952", "#37e261", 
        "#63ff39", "#18ce1d", "#5eff41", "#28d20d", "#31ff09"
    ],
    "yellows": [
        "#ffff09", "#ffe766", "#f1e82f", "#d4ff11", "#cdd828", 
        "#ffe04e", "#cdff4d", "#ffff54", "#dedd14", "#ffff46"
    ],
    "oranges": [
        "#ff7845", "#ff7546", "#e4c53f", "#d3c241", "#f86965", 
        "#ff984c", "#d99435", "#e9a852", "#ff8e54", "#f6960d"
    ]
}

# 排除的列名
exclude_columns = ['Sequence', 'Gene', 'Transcript', 'From', 'To', 'Reference', 
                   'Mutant','id','Annotation','Read name','Chromosome','Chromosome.1','Dinuc',
                   'Validation_comment','Gene effect','Non-templated sequence','Microhomology sequence']

# 获取颜色方案
def get_color_for_column(column_name):
    # 通过字段名选择颜色
    if 'effect' in column_name.lower():
        return colors["reds"]  # 如果列名包含 "effect"，使用 reds 色系
    # 可以根据其他字段名称选择不同的色系，例如:
    # elif 'some_other_field' in column_name.lower():
    #    return colors["blues"]
    return colors["reds"]  # 默认使用 reds 色系

# 处理单个CSV文件的函数
def analyze_discrete_values(csv_file):
    # 读取CSV文件
    df = pd.read_csv(csv_file)
    
    # 存储输出结果
    result = []
    
    # 遍历所有列
    for column in df.columns:
        # 如果该列是需要排除的列或者该列值全为空，则跳过
        if column in exclude_columns or df[column].isnull().all():
            continue
        
        # 如果该列的值是数字类型，则跳过
        if pd.api.types.is_numeric_dtype(df[column]):
            continue
        
        # 获取该列的离散值及其计数
        value_counts = df[column].dropna().value_counts()
        
        # 获取颜色色系
        column_colors = get_color_for_column(column)
        
        # 遍历统计结果并构造json格式
        for idx, (value, count) in enumerate(value_counts.items()):
            result.append({
                "name": f"{column}: {value}",
                "value": count,
                "color": column_colors[idx % len(column_colors)],  # 按顺序循环色系
                "class": value
            })
    
    # 输出JSON格式
    return json.dumps(result, ensure_ascii=False, indent=4)

# 获取当前文件夹下所有的CSV文件
csv_files = [f for f in os.listdir() if f.endswith('.csv')]

# 对每个CSV文件进行处理并输出JSON文件
for csv_file in csv_files:
    print(f"Processing {csv_file}...")
    json_result = analyze_discrete_values(csv_file)
    
    # 构建输出文件路径
    json_file = os.path.join(output_dir, f"{os.path.splitext(csv_file)[0]}.json")
    
    # 将结果写入到JSON文件
    with open(json_file, 'w', encoding='utf-8') as f:
        f.write(json_result)

    print(f"Output saved to {json_file}")

print("Processing complete for all CSV files.")
