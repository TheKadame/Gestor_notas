let notas = JSON.parse(localStorage.getItem("notas")) || [];
let editandoId = null;

function guardarNota() {
  const contenido = document.getElementById("contenido").value.trim();
  if (!contenido) {
    alert("La nota no puede estar vacía");
    return;
  }

  if (editandoId) {
    const nota = notas.find(n => n.id === editandoId);
    nota.contenido = contenido;
    nota.updated_at = Date.now();
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
}

function editarNota(id) {
  const nota = notas.find(n => n.id === id);
  if (nota) {
    document.getElementById("contenido").value = nota.contenido;
    editandoId = id;
    document.querySelector("button").textContent = "Actualizar";
  }
}

function eliminarNota(id) {
  notas = notas.filter(n => n.id !== id);
  localStorage.setItem("notas", JSON.stringify(notas));
  render();
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
    btnEditar.textContent = "Editar";
    btnEditar.onclick = () => editarNota(n.id);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => eliminarNota(n.id);

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    li.appendChild(contenido);
    li.appendChild(acciones);
    ul.appendChild(li);
  });
}

render();
