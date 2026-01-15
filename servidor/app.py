from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../cliente', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('../cliente', 'index.html')

# Endpoint para verificar conexión
@app.route("/status")
def status():
    return jsonify({"online": True}), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
"""(devulve "GET / HTTP/1.1" 200 - funcionando correctamente)"""