import os
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# 加载 .env 文件中的环境变量
load_dotenv()

# 从 .env 文件中获取密钥和 API 基础地址
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("BASE_URL")

# 验证 API 密钥
if not api_key:
    raise ValueError("API 密钥未正确加载，请检查 .env 文件中的 OPENAI_API_KEY")

# 初始化 OpenAI LLM
llm = OpenAI(
    openai_api_key=api_key,
    openai_api_base=base_url,
    model="gpt-4",  # 可改为 "gpt-3.5-turbo"
)

# 创建一个简单的提示模板
prompt = PromptTemplate(
    input_variables=["question"],
    template="You are a helpful assistant. Answer the question: {question}"
)

# 创建 LLMChain
llm_chain = LLMChain(llm=llm, prompt=prompt)

# 测试 API 的连接性
def test_api_connection():
    question = "What is the capital of France?"
    try:
        response = llm_chain.run(question)
        print("API 连接成功，返回结果如下：")
        print(response)
    except Exception as e:
        print(f"API 调用失败：{e}")

if __name__ == "__main__":
    test_api_connection()
