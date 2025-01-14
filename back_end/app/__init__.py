from flask import Flask
from flask_cors import CORS  # 导入 CORS

def create_app():
    app = Flask(__name__)
    
    # 可添加更多的配置
    app.config['UPLOAD_FOLDER'] = './data'

    # 启用 CORS
    CORS(app, resources={r"/*": {"origins": "*"}})  # 允许所有来源跨域访问

    with app.app_context():
        from .routes import bp
        app.register_blueprint(bp)

    return app
