from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# 文件读取与分段
def read_and_split_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    segments = content.split("\n\n")  # 按段落分割
    return segments

# 初始化检索模型和生成模型
retriever = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large")
generator = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large")

# 构建 FAISS 索引
def build_faiss_index(segments, retriever_model):
    embeddings = retriever_model.encode(segments)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings

# 检索相关片段
def retrieve_relevant_docs(query, retriever_model, index, segments, top_k=3):
    query_embedding = retriever_model.encode([query])
    D, I = index.search(np.array(query_embedding), k=top_k)
    return [segments[i] for i in I[0]]

# 生成答案
def generate_answer(context, query, tokenizer, model):
    input_text = f"Context: {context} Question: {query}"
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids
    output = model.generate(input_ids)
    return tokenizer.decode(output[0], skip_special_tokens=True)

# 主函数
file_path = "circosjsRM.md"
segments = read_and_split_file(file_path)
index, _ = build_faiss_index(segments, retriever)

query = "画一个环形柱状图的track，深绿色"
retrieved_docs = retrieve_relevant_docs(query, retriever, index, segments)
context = " ".join(retrieved_docs)
answer = generate_answer(context, query, tokenizer, generator)

print("检索到的内容：")
print(retrieved_docs)
print("\n生成的答案：")
print(answer)
