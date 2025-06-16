import os
from dotenv import load_dotenv
from openai import OpenAI

# 加载 .env 文件中的环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("BASE_URL")

# 初始化 OpenAI 客户端
client = OpenAI(
    api_key=api_key,  # 从环境变量中加载 API 密钥
    base_url=base_url,  # 从环境变量中加载自定义 API 地址
)

# 调用 API 的方法
def call_openai_api(prompt, model="gpt-4"):
    try:
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            model=model,
            
            temperature=0.7,
        )

        # 返回生成的内容
        reply = chat_completion.choices[0].message.content
        return reply
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        return None

# 示例调用
if __name__ == "__main__":
    # 用户输入
    user_prompt = "什么是乘风破浪会有时？"
    
    # 调用 OpenAI 接口
    response = call_openai_api(user_prompt, model="gpt-4",)

    # 输出结果
    print("AI 的回复：")
    print(response)
