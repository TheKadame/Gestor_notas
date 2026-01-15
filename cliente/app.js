let notas = JSON.parse(localStorage.getItem("notas")) || [];
let online = false;
let editandoId = null;

function guardarNota() {
  const contenido = document.getElementById("contenido").value.trim();
  if (!contenido) {
    alert("La nota no puede estar vacía");
    return;
  }

  if (editandoId) {
    const nota = notas.find(n => n.id === editandoId);
    if (nota) {
      nota.contenido = contenido;
      nota.updated_at = Date.now();
    }
    editandoId = null;
    document.querySelector("button").textContent = "Guardar";
  } else {
    notas.push({
      id: crypto.randomUUID(),
      contenido,
      updated_at: Date.now()
    });
  }

  localStorage.setItem("notas", JSON.stringify(notas));
  document.getElementById("contenido").value = "";
  render();

  if (online) {
    sincronizar();
    ultimaSincronizacion = Date.now();
  }
}

function editarNota(id) {
  const nota = notas.find(n => n.id === id);
  if (nota) {
    document.getElementById("contenido").value = nota.contenido;
    editandoId = id;
    document.querySelector("button").textContent = "Actualizar";
    document.getElementById("contenido").focus();
  }
}

function eliminarNota(id) {
  if (confirm("¿Eliminar esta nota?")) {
    notas = notas.filter(n => n.id !== id);
    localStorage.setItem("notas", JSON.stringify(notas));
    if (editandoId === id) {
      editandoId = null;
      document.getElementById("contenido").value = "";
      document.querySelector("button").textContent = "Guardar";
    }
    render();
    if (online) sincronizar();
  }
}

function cancelarEdicion() {
  editandoId = null;
  document.getElementById("contenido").value = "";
  document.querySelector("button").textContent = "Guardar";
}

function render() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  notas.forEach(n => {
    const li = document.createElement("li");
    li.className = "nota-item";

    const contenido = document.createElement("div");
    contenido.className = "nota-contenido";
    contenido.textContent = n.contenido;

    const acciones = document.createElement("div");
    acciones.className = "nota-acciones";

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️ Editar";
    btnEditar.onclick = () => editarNota(n.id);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑️ Eliminar";
    btnEliminar.onclick = () => eliminarNota(n.id);

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    li.appendChild(contenido);
    li.appendChild(acciones);
    ul.appendChild(li);
  });
}

let ultimaSincronizacion = 0;

async function verificarConexion() {
  try {
    await fetch("http://localhost:5000/status");
    if (!online) {
      online = true;
      document.getElementById("estado").textContent = "🟢 Conectado";
      await sincronizar();
      ultimaSincronizacion = Date.now();
    } else {
      if (Date.now() - ultimaSincronizacion > 1000) {
        await traerNotasDelServidor();
      }
    }
  } catch {
    online = false;
    document.getElementById("estado").textContent = "🔴 Sin conexión";
  }
}

async function traerNotasDelServidor() {
  try {
    const res = await fetch("http://localhost:5000/notas");
    if (res.ok) {
      const notasServidor = await res.json();
      let cambios = false;

      for (let notaServidor of notasServidor) {
        const notaLocal = notas.find(n => n.id === notaServidor.id);
        if (!notaLocal) {
          notas.push(notaServidor);
          cambios = true;
        } else if (notaLocal.updated_at < notaServidor.updated_at) {
          notaLocal.contenido = notaServidor.contenido;
          notaLocal.updated_at = notaServidor.updated_at;
          cambios = true;
        }
      }

      if (cambios) {
        localStorage.setItem("notas", JSON.stringify(notas));
        render();
      }
    }
  } catch (error) {
    console.log("Error al traer notas:", error);
  }
}

async function sincronizar() {
  try {
    const res = await fetch("http://localhost:5000/sync", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(notas)
    });

    if (res.ok) {
      const notasDelServidor = await res.json();

     
      notas = notas.filter(n => notasDelServidor.some(s => s.id === n.id));

     
      for (let notaServidor of notasDelServidor) {
        const indexLocal = notas.findIndex(n => n.id === notaServidor.id);
        if (indexLocal !== -1) {
          if (notas[indexLocal].updated_at < notaServidor.updated_at) {
            notas[indexLocal] = notaServidor;
          }
        } else {
          notas.push(notaServidor);
        }
      }

      localStorage.setItem("notas", JSON.stringify(notas));
      render();
    }
  } catch (error) {
    console.log("Error al sincronizar:", error);
  }
}

setInterval(verificarConexion, 2000);
verificarConexion();
render();