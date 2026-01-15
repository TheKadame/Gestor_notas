from flask import Flask, send_from_directory
from controlador import nota_controlador
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../cliente', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('../cliente', 'index.html')


app.add_url_rule('/notas', 'listar_notas', nota_controlador.listar_notas)
app.add_url_rule('/sync', 'sincronizar', nota_controlador.sincronizar_notas, methods=['POST'])
app.add_url_rule('/notas/<nota_id>', 'eliminar', nota_controlador.eliminar_nota, methods=['DELETE'])
app.add_url_rule('/status', 'estado', nota_controlador.estado)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
