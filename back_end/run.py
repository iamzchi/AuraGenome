from app import create_app
from flask_cors import CORS  # Import CORS

app = create_app()

# Enable CORS for all routes and origins
CORS(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
