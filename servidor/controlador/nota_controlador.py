from flask import jsonify, request, abort
from modelo.nota import Nota

def listar_notas():
    return jsonify([vars(n) for n in Nota.listar()]), 200


def sincronizar_notas():
    notas_cliente = request.json
    if not isinstance(notas_cliente, list):
        abort(400)
# Obtener IDs del cliente
    ids_cliente = {n["id"] for n in notas_cliente}
    # Eliminar notas que el cliente eliminó
    notas_servidor = Nota.listar()
    for nota in notas_servidor[:]:  
            Nota.eliminar(nota.id)
    # Guardar/actualizar notas del cliente
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
 
