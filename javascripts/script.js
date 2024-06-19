let loaded = () => {
  let myform = document.getElementById("formulario");
  myform.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const gearOptions = document.getElementById("gear-options");

    if (nombre.value.length == 0) {
      alert("Nombre requerido");
      nombre.focus();
      return;
    }

    if (email.value.length == 0) {
      alert("Email requerido");
      email.focus();
      return;
    }

    const constnombre = nombre.value;
    const constemail = email.value;
    const constgear = gearOptions.value;

    const constdatos = {
      nombre: constnombre,
      email: constemail,
      gear: constgear,
    };

    fetch(
      "https://dawm-mateo-daniel-default-rtdb.firebaseio.com/collection.json",
      {
        method: "POST",
        body: JSON.stringify(constdatos),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      console.log(datos);
      agregarFila(constnombre, constemail, constgear);
      formulario.reset();
    })
    .catch((error) => console.error(error));
  });

  // Cargar datos al iniciar
  obtenerDatos();
};

let template = (nombre, email, gear) => `
  <tr>
    <td>${nombre}</td>
    <td>${email}</td>
    <td>${gear}</td>
  </tr>
`;
function agregarDatos(nombre, email, gear) {
  let tablebody = document.getElementById("tablebody");
  let cardsContainer = document.getElementById("cardsContainer");
  let newRow = template(nombre, email, gear);
  let newCard = createCard(nombre, email, gear);

  tablebody.innerHTML += newRow; // Agregar fila a la tabla
  cardsContainer.innerHTML += newCard; // Agregar tarjeta
}

async function obtenerDatos() {
  const url = "https://dawm-mateo-daniel-default-rtdb.firebaseio.com/collection.json";
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    console.error("Error:", respuesta.status);
    return;
  }
  const datos = await respuesta.json();

  let tablebody = document.getElementById("tablebody");
  let cardsContainer = document.getElementById("cardsContainer");
  tablebody.innerHTML = "";
  cardsContainer.innerHTML = "";

  for (const key in datos) {
    if (datos.hasOwnProperty(key)) {
      let nombre = datos[key].nombre;
      let email = datos[key].email;
      let gear = datos[key].gear;
      agregarDatos(nombre, email, gear); // Actualizar ambas vistas
    }
  }
}

function agregarFila(nombre, email, gear) {
  let tablebody = document.getElementById("tablebody");
  tablebody.innerHTML += template(nombre, email, gear);
}

function createCard(nombre, email, gear) {
  const cardHTML = `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text">Email: ${email}</p>
          <p class="card-text">Gear: ${gear}</p>
        </div>
      </div>
    </div>
  `;
  return cardHTML;
}

window.addEventListener("DOMContentLoaded", loaded);