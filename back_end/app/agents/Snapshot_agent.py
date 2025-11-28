#输出console面板里面的信息

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

LOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'snapshot_log.json'))



# 调用 API 的方法
def use_snapshot_agent(current_code, formerSteps, model="openai/gpt-4o-mini"):
    prompt = """你是一个快照变更总结 Agent。根据用户提供的上下文，只用 JSON 对象回答，格式为：{"title": "...", "description": "..."}。不要包含额外解释或代码块。"""
    try:
        #打印调试信息
        print("开始生成快照描述：use_snapshot_agent")
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"""之前做的事情：
{formerSteps}
现在的代码：
{current_code}
请仅返回包含 title 和 description 的 JSON 对象"""},
            ],
            model=model,
            temperature=0,
        )
        reply = chat_completion.choices[0].message.content
        reply = reply.replace("```", "")
        with open(LOG_PATH, 'w', encoding='utf-8') as f:
            f.write(reply) 
        return reply
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        try:
            with open(LOG_PATH, 'w', encoding='utf-8') as f:
                f.write('')
        except Exception:
            pass
        return None


# 测试代码
if __name__ == "__main__":
    current_code = ""
    former_steps = ""
    result = use_snapshot_agent(current_code, former_steps)
    print(f"结果: {result}")
