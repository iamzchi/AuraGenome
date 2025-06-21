import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# 加载环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("BASE_URL")

# 初始化 OpenAI 客户端
client = OpenAI(          
    api_key=api_key,  # 从环境变量中加载 API 密钥
    base_url=base_url,  # 从环境变量中加载自定义 API 地址
)

# 生成代码的 prompt
generator_prompt = f"""
# 在这里填写生成代码的 prompt
"""

# 修改代码的 prompt
modifier_prompt = f"""
角色：Aura
 一个专业的d3.js可视化编程专家
目标：
 请你在base_code的基础上，根据用户的需求进行代码修改
工作流：
    1. 理解用户的要求和提供的base_code，找到对应的需要改动的代码块
    2. 参考其他的代码的写法
    3. 重写需要修改的地方
输出格式：
    <script setup> </script> 
    <template> </template> 
    <style scoped> </style>
限制：
    - 只需要给我代码，不要给我任何其他信息或评论。[!important]
    - 注意代码的换行和格式
    - 应该给我完整的代码，而不仅仅是需要添加的代码。
    - 不要添加类似```html```或者```vue```的表示markdown格式的代码，只需要给我代码本身。
"""

# 生成代码🤖
def use_generator(query, project_id, query_info, base_code):
    # 打印query
    print(f"GENERATOR：当前的query是: {query}")
    # 获取基本参数
    file_name = query_info["file_name"]
    
    try:
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": f"{generator_prompt}  and the base code is:{base_code}"},
                {"role": "user", "content": query},
            ],
            model="gpt-4o",  # 可以根据需要修改模型
            temperature=0.7,
        )
        
        # 获取生成的内容
        output = chat_completion.choices[0].message.content
        
        # 清理输出
        cleaned_output = output.replace('```javascript', '').replace('```vue', '').replace('```', '')
        
        return {
            "status": "success",
            "generated_code": cleaned_output
        }
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
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
    
    try:
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": modifier_prompt},
                {"role": "user", "content": f"{query}, and the base code is:{base_code}"},
            ],
            model="gpt-4o",  # 可以根据需要修改模型
            temperature=0.7,
        )
        
        # 获取生成的内容
        output = chat_completion.choices[0].message.content
        
        # 清理输出
        cleaned_output = output.replace('```javascript', '').replace('```vue', '').replace('```', '')
        
        return {
            "status": "success",
            "generated_code": cleaned_output
        }
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        return {
            "status": "error",
            "code": 500,
            "error_details": str(e)
        }


# 测试代码
if __name__ == "__main__":
    # 读取base_code.vue文件内容作为base_code参数
    try:
        with open("./base_code.vue", "r", encoding="utf-8") as f:
            base_code = f.read()
            print("成功读取base_code.vue文件")
    except Exception as e:
        print(f"读取base_code.vue文件失败: {e}")
        base_code = ""
    
    # 设置测试参数
    query = "把level3_1的柱状图变成折线图"
    project_id = "id_001"
    query_info = {"file_name": "test.vue"}
    
    # 调用use_modifier函数
    result = use_modifier(query, project_id, query_info, base_code)
    
    # 打印结果状态
    print(f"\n结果状态: {result['status']}")
    
    # 将generated_code输出到output.vue文件
    if result["status"] == "success" and "generated_code" in result:
        try:
            with open("./output.vue", "w", encoding="utf-8") as f:
                f.write(result["generated_code"])
            print("成功将生成的代码写入output.vue文件")
        except Exception as e:
            print(f"写入output.vue文件失败: {e}")
    else:
        print("未能获取生成的代码")


