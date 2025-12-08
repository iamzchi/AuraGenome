#解析用户意图

import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# 加载 .env 文件中的环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("API_KEY")
base_url = os.getenv("BASE_URL")

# 初始化 OpenAI 客户端
client = OpenAI(          
    api_key=api_key,  # 从环境变量中加载 API 密钥
    base_url=base_url,  # 从环境变量中加载自定义 API 地址
)

prompt = f"""
You are a master at identifying the user's intent before drawing a circular chart. Analyze a query from the user to determine whether it is a "chart generation request" or a "chart modification request." "Chart generation" means adding new tracks based on the existing structure, which will lead to changes in the layout of all tracks (such as innerRadius and outerRadius). "Chart modification" means adjusting certain parameters based on the original code without changing the overall layout.
Please return a JSON like this:
{{
    "file_name": "",
    "chart_type": "",
    "query_type": "",
    "track_id": "",
    "reply":"",
    "column_name":"",
    "next":[],
}}
If it is a "chart generation request," set `query_type` to "a",
If it is a "chart modification request," set `query_type` to "b". 
If it is neither a chart generation requirement nor a modification requirement, then it is considered to be in the "chat mode", with the query_type being "chat"
When answering, your name is Aura, an artificial intelligence AI responsible for generating bioinformatics visualization charts. 
All other fields are allowed to be set as null. 
Then you should fill in "reply" and give the user a short response in the same language with user's query. This response should be full of affirmation and encouragement for the user, lively yet rigorous.

the options for chart_type are: histogram, scatter, heatmap, line, highlight, chords,stack
You should fill in the next array every time. The next array represents "suggestions for the user's next input". Fill in three items to guess what the user might input next.less than 7 words.
Just return this JSON; no other explanation is needed.
        """

# 调用 API 的方法
def use_judge(query,model="openai/gpt-4o-mini"):
    try:

        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"and the user query is: '{query}'"},
            ],
            model=model,
            temperature=0.7,
        )
        # 返回生成的内容
        reply = chat_completion.choices[0].message.content
        # 将返回的内容转换为json
        reply = json.loads(reply.replace("```json","").replace("```",""))
        return reply
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        return None


# 测试代码
if __name__ == "__main__":
    
    # 设置测试参数
    query = "把level3_1的柱状图变成折线图"
    # 调用use_modifier函数
    result = use_judge(query)
    # 打印结果
    print(f"结果: {result}")
