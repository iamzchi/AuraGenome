import os
from dotenv import load_dotenv
import requests
import json
import sys
import time

# 加载 .env 文件中的环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("DS_apikey")
base_url = os.getenv("DS_URL")

# 全局变量 output 用于累加每次的 answer
output = ""

# 请求头
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 请求数据
data = {
    "inputs": {},
    "query": "hi",
    "response_mode": "streaming",
    "conversation_id": "",
    "user": "abc-123",
}
print("API Key:", api_key)
print("Base URL:", base_url)

# 清空控制台屏幕的函数
def clear_console():
    # 判断操作系统并调用合适的命令来清理控制台
    if sys.platform == "win32":
        os.system("cls")
    else:
        os.system("clear")

# 发送 POST 请求，启用流式传输
response = requests.post(base_url, headers=headers, json=data, stream=True)

# 检查响应状态
print("Response Status Code:", response.status_code)

# 确保响应内容是流式数据
if response.status_code == 200:
    # 使用 for 循环逐块读取流
    for chunk in response.iter_lines():
        if chunk:
            # 解码数据
            chunk_data = chunk.decode('utf-8')
            
            # 跳过不是有效数据的块（如无效的空块或非 JSON 数据）
            if not chunk_data.startswith("data:"):
                continue
            
            # 提取有效数据部分
            json_data = chunk_data[len("data:"):].strip()
            try:
                parsed_data = json.loads(json_data)
                
                # 打印返回的完整数据
                # print(f"Received data: {parsed_data}")
                
                # 尝试获取 'answer' 字段
                if 'answer' in parsed_data:
                    answer = parsed_data['answer']
                    output += answer  # 累加 answer
                    
                    # 清空控制台并打印当前输出
                    clear_console()
                    print(f"Current Output: {output}")  # 实时打印 output
                else:
                    print("No 'answer' or 'message' found in the response.")
                
            except json.JSONDecodeError:
                print("Error decoding JSON:", json_data)
    
    # 保存完整结果到 output.txt 文件
    with open("output.txt", "w") as f:
        f.write(output)
    print("Output has been saved to output.txt")

else:
    print(f"Error: Unable to fetch data (status code {response.status_code})")
