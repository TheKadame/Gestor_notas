import json
import os

ARCHIVO_NOTAS = "notas.json"

def cargar_notas():
    if os.path.exists(ARCHIVO_NOTAS):
        try:
            with open(ARCHIVO_NOTAS, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error cargando notas: {e}")
            return []
    return []

def guardar_notas(notas):
    try:
        with open(ARCHIVO_NOTAS, 'w', encoding='utf-8') as f:
            json.dump(notas, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error guardando notas: {e}")
        return False
