from datetime import datetime
import uuid
from almacenamiento import cargar_notas, guardar_notas

class Nota:
    _notas = []
    _cargado = False

    def __init__(self, contenido, updated_at=None, _id=None):
        self.id = _id or str(uuid.uuid4())
        self.contenido = contenido
        self.updated_at = updated_at or datetime.now().timestamp()

    @classmethod
    def _asegurar_cargado(cls):
        if not cls._cargado:
            notas_data = cargar_notas()
            cls._notas = [
                Nota(
                    contenido=n["contenido"],
                    updated_at=n["updated_at"],
                    _id=n["id"]
                ) for n in notas_data
            ]
            cls._cargado = True

    @classmethod
    def listar(cls):
        cls._asegurar_cargado()
        return cls._notas

    @classmethod
    def obtener(cls, nota_id):
        cls._asegurar_cargado()
        for nota in cls._notas:
            if nota.id == nota_id:
                return nota
        return None

    @classmethod
    def guardar(cls, nueva_nota):
        cls._asegurar_cargado()
        nota_existente = cls.obtener(nueva_nota.id)
        if nota_existente:
            if nueva_nota.updated_at > nota_existente.updated_at:
                nota_existente.contenido = nueva_nota.contenido
                nota_existente.updated_at = nueva_nota.updated_at
        else:
            cls._notas.append(nueva_nota)
        cls._guardar_en_disco()

    @classmethod
    def eliminar(cls, nota_id):
        cls._asegurar_cargado()
        cls._notas = [n for n in cls._notas if n.id != nota_id]
        cls._guardar_en_disco()

    @classmethod
    def _guardar_en_disco(cls):
        notas_data = [{"id": n.id, "contenido": n.contenido, "updated_at": n.updated_at} for n in cls._notas]
        guardar_notas(notas_data)
