*Notas Personales Offline - Guía Completa*

Una aplicación de notas que funciona **offline y online**,que permite una sincronización automática entre múltiples dispositivos/navegadores.

*Características*

-Crear notas: Escribe y guarda tus notas  
-Editar notas: Modifica el contenido de tus notas  
-Eliminar notas: Borra las notas que no necesites  
-Funciona Offline:Las notas se guardan localmente en tu navegador  
-Sincronización automática: Los cambios se sincronizan cuando hay conexión  
-Multi-dispositivo: Accede desde diferentes navegadores/dispositivos  
-Persistencia: Los datos se guardan en el servidor y se recuperan al reiniciar  


*Instalación y Ejecución*

-Paso 1: Instalar Dependencias

Abre PowerShell o (terminal en caso mio) y ejecuta:

pip install -r requirements.txt

Esto instalara las Dependencias requeridas:
- Flask 2.3.3
- flask-cors 4.0.0

-Paso 2: Ejecutar el Servidor

-Llega a la carpeta servidor

cd servidor

- y ahora ejecuta:
python app.py


Deberías ver:

 -Running on http://127.0.0.1:5000
 -Press CTRL+C to quit


-Paso 3: Abrir la Aplicación

Abre tu navegador en o puedes sobre el link de :

(control mas click)
http://localhost:5000



Y ahora se puede dar paso a guia de uso.


*Guía de Uso*

-Primera parte: Crear una Nota

1. Escribe el contenido en el textarea
2. Presiona el botón "Guardar"
3. La nota aparecerá en la lista

-Segunda parte: Editar una Nota

1. Presiona el botón "Editar" en la nota que deseas modificar
2. El contenido se cargará en el textarea
3. El botón cambiará a "Actualizar"
4. Modifica el contenido
5. Presiona "Actualizar" o "Cancelar"

-Tercera parte: Eliminar una Nota

1. Presiona el botón "Eliminar" en la nota
2. Confirma la eliminación en el cuadro de diálogo
3. La nota se eliminará

*Funcionamiento Offline/Online*

-Sin Conexión (Offline)
-- Puedes crear, editar y eliminar notas normalmente
-- Todo se guarda en tu navegador (localStorage)
-- El estado muestra: "(esfera roja)Sin conexión"

-Con Conexión (Online)
--El estado muestra: "(esfera verde) Conectado"
--Los cambios se sincronizan automáticamente
--Los datos se guardan en el servidor
--Las notas se sincronizan con otros navegadores/dispositivos


*Sincronización*

-Cómo  se supone que funciona?

1. Cuando creas una nota offline: Se guarda localmente
2. Cuando reconectas: La nota se envía automáticamente al servidor
3. Cada 2 segundos: El cliente verifica si hay cambios en el servidor
4. Multi-dispositivo: Los cambios en un navegador aparecen en otros
5. En caso de verse aplicado es tan simple como recargar la pagina

*Toma de Decisiones y Diseño*

-Arquitectura Cliente–Servidor
Se decidió utilizar una arquitectura cliente–servidor para separar claramente la lógica de presentación (frontend)
,de la lógica de negocio y persistencia (backend), facilitando el mantenimiento y futuras extensiones del sistema.

-Uso de almacenamiento local (localStorage)
Se eligió "localStorage" en el cliente para permitir el funcionamiento offline de la aplicación,
garantizando que el usuario pueda crear, editar y eliminar notas incluso sin conexión a internet.

-Persistencia en archivos JSON
En el servidor se utiliza un archivo JSON como mecanismo de persistencia por su simplicidad, 
facilidad de lectura y adecuación al alcance académico del proyecto, evitando el uso innecesario de bases de datos ,
ya que a mi parecer es muy poco pra usar una base de datos.

-Sincronización basada en timestamps
Para resolver conflictos entre notas modificadas en distintos dispositivos, 
se decidió utilizar la marca de tiempo (`updated_at`), priorizando siempre la versión más reciente de cada nota.
siguiendo la estrategia *"Last Write Wins"*
-Diseño por capas
El proyecto se organizó en capas (modelo, controlador y aplicación) para mejorar la claridad del código,
 separar responsabilidades y facilitar su comprensión por terceros.


*Modelo de Estados (Finite State Machine)*

La aplicación implementa implícitamente un modelo de Finite State Machine (FSM) en el cliente, 
donde el comportamiento del sistema depende de estados bien definidos.

Se identifican principalmente los siguientes estados:

Estado de conexión: Offline y Online, determinado por la disponibildad del servidor.

Estado de edicion: Idle (creación de notas) y Editando, controlado por la variable editandoId.

Las transiciones entre estados se producen por acciones del usuario (editar, guardar, cancelar)
 o por eventos del sistema (pérdida o recuperación de conexión).


*-Estructura del Proyecto*


BLOCK_NOTAS/
|--cliente/
|   |- index.html(Interfaz web)
|   |- app.js(Lógica del cliente)
|   |-styles.css(Complemto visual y orden de la interfaz web)
|-- servidor/
|   |- app.py(Aplicación Flask)
|   |- almacenamiento.py(Persistencia en archivos)
|   |--controlador/
|   |    |- nota_controlador.py(Rutas y lógica)
|   |-- modelo/
|   |    |- nota.py( Modelo de nota)
|   |-notas.json(os datos se guardan automáticamente aqui)	
|- requirements.txt(Dependencias Python)
|─ README.md(Este archivo)



*-Endpoints de la API*

| Método | Ruta              | Descripción 			   |
|--------|-------------------|-------------------------------------|
| GET 	 |        "/"        | Abre la interfaz web                |
| GET    |     "/notas/"     | Lista todas las notas               |
| POST   |     "/sync" 	     | Sincroniza notas del cliente        |
| DELETE | "/notas/<nota_id>"| Elimina una nota 		   |
| GET    | 	"/status"    | Verifica si el servidor está online |



*-Almacenamiento de Datos*

--Cliente: localStorage del navegador (temporal)
--Servidor: Archivo "notas.json" (persistente)
--Sincronización: JSON entre cliente y servidor
-Los datos se guardan automáticamente en `servidor/notas.json` en el servidor.

*Solución de Problemas*

-"Not Found" al abrir la app
--Verifica que el servidor esté corriendo (`python app.py`)
--Intenta abrir: `http://localhost:5000`

-Las notas no se sincronizan
--Verifica la conexión de red
-- Abre la consola del navegador (F12) para ver errores
--Reinicia el servidor

-Se borra una nota al reconectar
--Esto ya está solucionado en la versión actual
--Si persiste, limpia el caché del navegador

-El servidor se detiene
--Presionaste Ctrl+C accidentalmente
--Ejecuta nuevamente: `python app.py`

*Notas Adicionales*

-La aplicación es responsive
-Los datos se guardan en tiempo real
-No requiere crear cuenta o login
-Todos los datos son locales en tu servidor



*Tecnologías Utilizadas*

--Frontend**: HTML5, CSS3, JavaScript ES6+
--Backend: Python, Flask
--Almacenamiento: localStorage + archivos JSON
--Comunicación: HTTP/REST API
