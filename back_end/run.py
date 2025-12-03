# 顶层脚本
from app import create_app
from flask_cors import CORS  # Import CORS
import os

app = create_app()

# Enable CORS for all routes and origins
CORS(app)

if __name__ == '__main__':
    port = int(os.getenv("PORT", "5001"))  # 默认改为 5001，可通过环境变量 PORT 覆盖
    app.run(debug=True, host='0.0.0.0', port=port)
