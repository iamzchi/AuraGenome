from flask import Blueprint, request, jsonify, send_file
from .utils import get_file_path, file_exists,get_discrete_file_path
import csv
import pandas as pd
import json
import os
from .agents.Judge import use_judge
from .agents.Generator import use_generator,use_modifier
from .agents.Gene_Console_Info import use_gene_console_info

bp = Blueprint('main', __name__)

def transform_json(csv_file):
    """
    Convert CSV content into a list of JSON objects.
    :param csv_file: File object of the CSV file.
    :return: List of dictionaries representing the JSON format.
    """
    try:
        csv_reader = csv.DictReader(csv_file)
        json_data = [] 
        for row in csv_reader:
            # 清理列名中的特殊字符（比如 BOM）
            clean_row = {key.strip().lstrip("\ufeff"): value.strip() for key, value in row.items()}
            json_data.append(clean_row)
        return json_data
    except Exception as e:
        raise ValueError(f"Error transforming CSV to JSON: {str(e)}")


@bp.route('/read-file', methods=['POST'])
def read_file():
    try:
        # 获取参数
        data = request.get_json()
        filepath = data.get('filepath')
        
        if not filepath:
            return jsonify({"error": "Missing 'filepath' parameter"}), 400

        # 构建文件路径
        full_path = get_file_path(filepath)
        
        # 检查文件是否存在
        if not file_exists(full_path):
            return jsonify({"error": f"File not found: {filepath}"}), 404

        # 读取 CSV 文件并转换为 JSON
        with open(full_path, 'r', encoding='utf-8') as csv_file:
            json_data = transform_json(csv_file)

        # 返回 JSON 数据给前端
        return jsonify(json_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 将csv文件转换为json，用于前端表格的展示
def convert_csv_to_json(csv_file_path):
    # 读取csv文件的前20行
    df = pd.read_csv(csv_file_path,nrows=20)
    columns = [{"colKey": col, "title": col} for col in df.columns]
    data = df.to_dict(orient='records')
    result = {
        "columns": columns,
        "data": data
    }
    return result

## 给出文件详情
# 使用  modelRequest中的接口 组合成答案发给前端
# 参数：project_name,file_name(文件名需要包含后缀！)
# 示例：
# 输入：
    # {
    #     "project_name": "id_001",
    #     "file_name": "file1.csv"
    # }
@bp.route('/get-single-file-detail', methods=['POST'])
def get_single_file_detail():
    data = request.get_json()
    project_name = data.get('project_name')
    file_name = data.get('file_name')
    # 构建文件路径
    full_path = get_file_path(f'{project_name}/{file_name}')
    # 检查文件是否存在
    if not file_exists(full_path):
        return jsonify({"error": f"File not found:{project_name}/{file_name}"}), 404

    # 获取文件的前20行并转换为json
    data_for_table = convert_csv_to_json(full_path)

    # 获取离散值的统计值用于画柱状图,把filename中的.csv换成.json
    discrete_file_path = get_discrete_file_path(project_name,file_name.replace('.csv',''))
    # 读取离散值的统计值
    with open(discrete_file_path, 'r', encoding='utf-8') as discrete_file:
        discrete_data = json.load(discrete_file) 

    # 获取文件详情
    file_info_path = get_file_path(f'{project_name}/file_info.json')
    with open(file_info_path, 'r', encoding='utf-8') as file_info_file:
        data_info = json.load(file_info_file)

    data_to_return = {"data_for_table": data_for_table, "discrete_data": discrete_data
    ,"data_info":data_info
    }
    # 打印data_to_return
    # print(data_to_return)
    # 返回数据给前端
    return jsonify(data_to_return)


# 给出用户query的解析结果 ✅
@bp.route('/get-query-result', methods=['POST'])
def get_query_result():
    data = request.get_json()
    query = data.get('query')
    query_info = use_judge(query)
    return jsonify({"query_info": query_info})


# 生成代码
@bp.route('/generate-code', methods=['POST'])
def generate_code():
    data = request.get_json()
    query = data.get('query')
    query_info = data.get('query_info')
    project_id = data.get('project_id')
    base_code = data.get('base_code')
    # print(f"generate_code的参数：{query, project_id, query_info,base_code}")
    res = use_generator(query, project_id, query_info,base_code)
    # print(f"generate_code返回的内容：{res}")

    return jsonify(res)

@bp.route('/modify-code', methods=['POST'])
def modify_code():
    data = request.get_json()
    query = data.get('query')
    query_info = data.get('query_info')
    project_id = data.get('project_id')
    base_code = data.get('base_code')
    # print(f" modify_code的参数：{query, project_id, query_info,base_code}")
    res = use_modifier(query, project_id, query_info,base_code)
    # print(f" modify_code返回的内容：{res}")

    return jsonify(res)


@bp.route('/get-console-info', methods=['POST'])
def get_console_info():
    data = request.get_json()
    current_code = data.get('current_code')
    if not current_code:
        return jsonify({"error": "Missing 'current_code' parameter"}), 400
    res = use_gene_console_info(current_code)
    if res is None:
        return jsonify({"error": "Failed to generate console info"}), 500
    return jsonify(res)







