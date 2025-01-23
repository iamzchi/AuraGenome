from Retriever import call_openai_api
from generator import call_openai_api

def workflow(query):
    retriever = call_openai_api(query)
    # generator = call_openai_api(retriever)
    print(retriever)
    # return generator

if __name__ == "__main__":
    workflow("draw a histogram chart with color deep green, using file1.csv")
