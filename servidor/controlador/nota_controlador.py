from flask import jsonify, request, abort
from modelo.nota import Nota

def listar_notas():
    return jsonify([vars(n) for n in Nota.listar()]), 200

def sincronizar_notas():
    data = request.json
    notas_cliente = data.get("notas", [])
    eliminadas = data.get("eliminadas", [])

    if not isinstance(notas_cliente, list) or not isinstance(eliminadas, list):
        abort(400, description="Formato inválido: se espera 'notas' y 'eliminadas' como listas.")

    for nota_id in eliminadas:
        Nota.eliminar(nota_id)
   
    for n in notas_cliente:
        Nota.guardar(
            Nota(
                contenido=n["contenido"],
                updated_at=n["updated_at"],
                _id=n["id"]
            )
        )

    return jsonify([vars(n) for n in Nota.listar()]), 200
def eliminar_nota(nota_id):
    Nota.eliminar(nota_id)
    return "", 204

def estado():
    return jsonify({"online": True}), 200
