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

function render() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  notas.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.contenido;
    ul.appendChild(li);
  });
}

render();