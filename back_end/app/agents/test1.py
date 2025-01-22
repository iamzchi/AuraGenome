import os
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain import hub

# 加载 .env 文件中的环境变量
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("BASE_URL")

# 文件路径和索引路径
file_path = "circosjsRM.md"
index_path = "circosjs_index"

# 创建或加载向量索引
def create_or_load_vectorstore():
    with open(file_path, "r", encoding="utf-8") as file:
        markdown_text = file.read()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    all_splits = text_splitter.split_text(markdown_text)

    if os.path.exists(index_path):
        print("加载已有的向量索引...")
        return FAISS.load_local(index_path, OpenAIEmbeddings(api_key=api_key, base_url=base_url),allow_dangerous_deserialization=True)
    else:
        print("创建新的向量索引...")
        vectorstore = FAISS.from_texts(all_splits, OpenAIEmbeddings(api_key=api_key, base_url=base_url))
        vectorstore.save_local(index_path)
        return vectorstore

# 初始化向量索引
vectorstore = create_or_load_vectorstore()

# 初始化 LLM 和 QA 链
llm = ChatOpenAI(api_key=api_key, base_url=base_url, model="gpt-4o-mini")
prompt = hub.pull("langchain-ai/retrieval-qa-chat")

# 定义文档格式化函数
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 构建 RAG 链
qa_chain = (
    {
        "context": vectorstore.as_retriever() | format_docs,
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

# 定义问题生成代码的函数
def generate_code_from_query(query):
    try:
        # 调用 RAG 链
        response = qa_chain.invoke({"context": query})
        print("\n生成的代码:")
        print(response)
        return response
    except Exception as e:
        print(f"代码生成时出错: {e}")
        return None

# 主程序
if __name__ == "__main__":
    # 示例查询
    user_query = "画一个环形柱状图的track，深绿色"
    generated_code = generate_code_from_query(user_query)
