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

LOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..', 'Gene_Console_Info_log.json'))

prompt = """
我会输入一段代码，这段代码里面会生成若干个轨道，请你解读这些轨道信息，然后按照一个json数组的格式返回给我
输出格式必须严格遵循以下JSON结构：
[{
  "id": "",
  "file": "",
  "title": "",
  "explanation": "",
  "type": "",
  "innerRadius": null,
  "outerRadius": null,
  "color": "",
  "radiusConfig": {
    "inner": null,
    "outer": null
  },
},...]

其中，id和type你可以从addTrack函数的参数中获取，例如：
addTrack(circos,tracks, id, filtered_data,type, configs);
file字段是这个轨道对应的文件名，你也可以在代码中找到。
title和explanation需要你根据代码的内容去写对应的解释，一句话解释即可。例如：
    title: Zygosity Mutation Bar
    Explanation: To display heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation.

处理要求：
   - 每个轨道对应一个JSON对象
   - 所有字段必须完整
   - 保持原始代码中的轨道生成顺序
   - 确保JSON格式有效性，无语法错误
   - id必须与addTrack函数中的id参数一致
直接给我这个数组即可，不需要任何解释说明的文字。
"""

# 调用 API 的方法
def use_gene_console_info(current_code,model="openai/gpt-4o-mini"):
    try:
        #打印调试信息
        print("开始生成console的数据：use_gene_console_info")
        # 调用 Chat Completion 接口
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"and the code is: '{current_code}'"},
            ],
            model=model,
            temperature=0.7,
        )
        # 返回生成的内容
        reply = chat_completion.choices[0].message.content
        # 将返回的内容转换为json
        reply = json.loads(reply.replace("```json","").replace("```",""))
        with open(LOG_PATH, 'w', encoding='utf-8') as f:
            json.dump(reply, f, ensure_ascii=False, indent=2)
        return reply
    except Exception as e:
        print(f"调用 OpenAI API 时出错：{e}")
        try:
            with open(LOG_PATH, 'w', encoding='utf-8') as f:
                json.dump([], f, ensure_ascii=False, indent=2)
        except Exception:
            pass
        return None


# 测试代码
if __name__ == "__main__":
    
    # 设置测试参数
    current_code = "把level3_1的柱状图变成折线图"
    # 调用use_modifier函数
    result = use_gene_console_info(current_code)
    # 打印结果
    print(f"结果: {result}")
