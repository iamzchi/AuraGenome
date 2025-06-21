import os
import json
import requests
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从 .env 文件中获取 API 密钥和基础 URL
gener_api_key = os.getenv("GENER_apikey")
mod_api_key = os.getenv("MOD_apikey")# 代码修改
base_url = os.getenv("DS_URL")

#  生成代码🤖
def use_generator(query, project_id, query_info, base_code):
    # 打印query
    print(f"GENERATOR：当前的query是: {query}")
    # 获取基本参数
    file_name = query_info["file_name"]
    print()
    # 构建请求数据
    
    data = {
        "inputs": {
            "file_name": file_name if file_name else "no_filename",
            "project_id":project_id,
            "query":query,
            "base_code":base_code
        },
        "query": query+" and the base code is:"+base_code,
        "response_mode": "streaming",
        "conversation_id": "",
        "user": "abc-123",
    }

    # 打印请求数据和环境变量信息
    print(f"请求数据: {json.dumps(data, ensure_ascii=False, indent=2)}")
    print(f"API密钥: {gener_api_key[:5]}..." if gener_api_key else "API密钥未设置")
    print(f"基础URL: {base_url}")

    # 请求头
    headers = {
        "Authorization": f"Bearer {gener_api_key}",
        "Content-Type": "application/json"
    }

    try:
        # 发送请求
        response = requests.post(base_url, headers=headers, json=data, stream=True)

        result = {
            "status": "success" if response.status_code == 200 else "error",
            "code": response.status_code,
        }

        # 获取详细的错误信息
        if response.status_code != 200:
            print(f"Error: Unable to fetch data (status code {response.status_code})")
            try:
                error_content = response.content.decode('utf-8')
                print(f"错误详情: {error_content}")
                result["error_details"] = error_content
            except Exception as decode_err:
                print(f"无法解码错误内容: {decode_err}")
                result["error_details"] = str(response.content)
            return result

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
                            print(f"Response data: {json_data}")
                    except json.JSONDecodeError as json_err:
                        print(f"Error decoding JSON: {json_err}")
                        print(f"Raw data: {json_data}")

        # 清理输出并返回
        cleaned_output = output.replace('```javascript', '').replace('```vue', '').replace('```', '')
        result["generated_code"] = cleaned_output
        
        return result
    
    except requests.exceptions.RequestException as req_err:
        print(f"请求异常: {req_err}")
        return {
            "status": "error",
            "code": 500,
            "error_details": str(req_err)
        }
    except Exception as e:
        print(f"发生未知错误: {e}")
        return {
            "status": "error",
            "code": 500,
            "error_details": str(e)
        }

# 修改代码🤖
def use_modifier(query, project_id, query_info, base_code):
    # 打印query
    print(f"MODIFIER：当前的query是: {query}")
    # 获取基本参数
    file_name = query_info["file_name"]
    print(f'basecode:{base_code}')
    # 构建请求数据
    
    data = {
        "inputs": {
            "file_name": file_name if file_name else "no_filename",
            "project_id":project_id,
            "query":query,
            "base_code":base_code
        },
        "query": query+",and the base code is:"+base_code,
        "response_mode": "streaming",
        "conversation_id": "",
        "user": "abc-123",
    }

    # 打印请求数据和环境变量信息
    print(f"请求数据: {json.dumps(data, ensure_ascii=False, indent=2)}")
    print(f"API密钥: {mod_api_key[:5]}..." if mod_api_key else "API密钥未设置")
    print(f"基础URL: {base_url}")

    # 请求头
    headers = {
        "Authorization": f"Bearer {mod_api_key}",
        "Content-Type": "application/json"
    }

    try:
        # 发送请求
        response = requests.post(base_url, headers=headers, json=data, stream=True)

        result = {
            "status": "success" if response.status_code == 200 else "error",
            "code": response.status_code,
        }

        # 获取详细的错误信息
        if response.status_code != 200:
            print(f"Error: Unable to fetch data (status code {response.status_code})")
            try:
                error_content = response.content.decode('utf-8')
                print(f"错误详情: {error_content}")
                result["error_details"] = error_content
            except Exception as decode_err:
                print(f"无法解码错误内容: {decode_err}")
                result["error_details"] = str(response.content)
            return result

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
                            print(f"Response data: {json_data}")
                    except json.JSONDecodeError as json_err:
                        print(f"Error decoding JSON: {json_err}")
                        print(f"Raw data: {json_data}")

        # 清理输出并返回
        cleaned_output = output.replace('```javascript', '').replace('```vue', '').replace('```', '')
        result["generated_code"] = cleaned_output
        
        return result
    
    except requests.exceptions.RequestException as req_err:
        print(f"请求异常: {req_err}")
        return {
            "status": "error",
            "code": 500,
            "error_details": str(req_err)
        }
    except Exception as e:
        print(f"发生未知错误: {e}")
        return {
            "status": "error",
            "code": 500,
            "error_details": str(e)
        }
