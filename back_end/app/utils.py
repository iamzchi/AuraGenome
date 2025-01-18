import os

def get_file_path(filepath):
    """
    构建文件的完整路径。
    """
    base_path = './data'
    full_path = os.path.join(base_path, filepath)
    return os.path.abspath(full_path)

def get_discrete_file_path(project_name,file_name):
    base_path = './data'
    full_path = os.path.join(base_path, f'{project_name}/discrete/{file_name}.json')
    return os.path.abspath(full_path)

def file_exists(full_path):
    """
    检查文件是否存在。
    """
    return os.path.isfile(full_path)
