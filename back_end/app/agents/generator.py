import os
import json
import requests
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从 .env 文件中获取 API 密钥和基础 URL
api_key = os.getenv("GENER_apikey")
base_url = os.getenv("DS_URL")

# 获取父文件内容
def get_parent_file(project_id, current_step):
    # 获取文件路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    vue_file_path = os.path.join(current_dir, '../../..', 'front_end', 'autocc', 'src', 'components', 'Center', 'charts', project_id, f'{current_step}.vue')

    try:
        with open(vue_file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: {vue_file_path} not found.")
    except Exception as e:
        print(f"Error reading file: {str(e)}")
    return ""

# 使用大模型生成代码
def use_generator(query, current_step, project_id, query_info):
    # 获取基本参数
    file_name = query_info["file_name"]
    base_code = get_parent_file(project_id, current_step)
    print()
    # 构建请求数据
    data = {
        "inputs": {
            "file_name":file_name,
            "project_id":project_id,
            "query":query,
            "base_code":base_code
        },
        "query": "go",
        "response_mode": "streaming",
        "conversation_id": "",
        "user": "abc-123",
    }

    # 请求头
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # 发送请求
    response = requests.post(base_url, headers=headers, json=data, stream=True)

    if response.status_code != 200:
        print(f"Error: Unable to fetch data (status code {response.status_code})")
        return 500

    # 处理流式响应
    output = ""
    for chunk in response.iter_lines():
        if chunk:
            chunk_data = chunk.decode('utf-8')
            if chunk_data.startswith("data:"):
                json_data = chunk_data[len("data:"):].strip()
                try:
                    parsed_data = json.loads(json_data)
                    if 'answer' in parsed_data:
                        answer = parsed_data['answer']
                        output += answer
                        print(f"Current Output: {output}")
                    else:
                        print("No 'answer' found in the response.")
                except json.JSONDecodeError:
                    print("Error decoding JSON:", json_data)

    # 保存生成的内容到前端文件夹
    next_step = f"step{int(''.join(filter(str.isdigit, current_step))) + 1}" if current_step != "root" else "step1"
    output_vue_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../..', 'front_end', 'autocc', 'src', 'components', 'Center', 'charts', project_id, f'{next_step}.vue')
    try:
        with open(output_vue_file_path, "w", encoding="utf-8") as file:
            file.write(output.replace('```javascript', '').replace('```vue', '').replace('```', ''))
        print(f"Generated code saved to {output_vue_file_path}")
    except Exception as e:
        print(f"Error saving file: {e}")
        return 500

    return 200
