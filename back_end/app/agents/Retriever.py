##包装openai的方法，将大模型返回的内容return出去
# 参考 autoCircos\back_end\test.py 文件

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

# 读取当前目录下的文件
file_path = "circosjsRM.md"
with open(file_path, "r", encoding="utf-8") as file:
    markdown_text = file.read()

prompt = f"""
Here is a JavaScript library in the field of biology designed for creating circular visualizations in genomics. I will provide detailed documentation that includes the seven basic graphical elements this library can create, their required data structures, and configurable attribute options. Next, I will input a user query. You need to extract relevant reference code and documentation snippets from the materials to address the query. The extracted content will serve as input for the next "code generation agent." 
just provide the extracted content directly without adding any explanations or comments.

the documentation is:
{markdown_text}
"""


# 调用 API 的方法
def use_retriever(query,model="gpt-3.5-turbo"):
    try:
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"{prompt} \n and the user query is:{query}"},
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