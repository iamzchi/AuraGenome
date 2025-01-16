from flask import Blueprint, request, jsonify, send_file
from .utils import get_file_path, file_exists
import csv

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


## 给出文件详情
# 使用  modelRequest中的接口 请求大模型 组合成答案发给前端