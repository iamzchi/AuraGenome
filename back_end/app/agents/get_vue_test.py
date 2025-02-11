import os
#这个文件的作用是获取前端现有的代码给generator.py用

# 获取当前文件所在路径
current_dir = os.path.dirname(os.path.abspath(__file__))

# 定义 demo1.vue 文件的相对路径
vue_file_path = os.path.join(current_dir, '../../..', 'front_end', 'autocc', 'src', 'components', 'Center', 'demo1.vue')

# 确保文件路径正确
vue_file_path = os.path.abspath(vue_file_path)

# 读取文件内容
try:
    with open(vue_file_path, 'r', encoding='utf-8') as file:
        file_content = file.read()
        print(file_content)  # 或者返回 file_content 以供后续使用
except FileNotFoundError:
    print(f"Error: {vue_file_path} not found.")
except Exception as e:
    print(f"Error reading file: {str(e)}")
