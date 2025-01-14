import os
import pandas as pd

# 获取当前工作目录
current_directory = os.getcwd()

# 遍历目录中的文件
for filename in os.listdir(current_directory):
    # 如果文件是 .xls 格式
    if filename.endswith('.xls'):
        # 构建完整文件路径
        file_path = os.path.join(current_directory, filename)
        
        # 读取 .xls 文件
        try:
            df = pd.read_excel(file_path, sheet_name=None)  # sheet_name=None 会读取所有的sheet
            # 遍历所有sheet，保存为多个CSV文件
            for sheet_name, sheet_df in df.items():
                # 构建新的文件名
                new_filename = f"{os.path.splitext(filename)[0]}_{sheet_name}.csv"
                new_file_path = os.path.join(current_directory, new_filename)
                
                # 保存为 CSV 文件
                sheet_df.to_csv(new_file_path, index=False)
                print(f"已将 {sheet_name} 转换为 CSV: {new_filename}")
        except Exception as e:
            print(f"转换文件 {filename} 时发生错误: {e}")
