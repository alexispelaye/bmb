let bomberos = []
const controles = [
  { id: 1, bomberoId: 1, fecha: "2023-10-15", tipo: "rutina", elemento: "Casco", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" },
  { id: 2, bomberoId: 2, fecha: "2023-10-14", tipo: "especial", elemento: "Guantes", estado: "Regular", observaciones: "Desgaste en palma", inspector: "Admin" },
  { id: 3, bomberoId: 3, fecha: "2023-10-13", tipo: "revision", elemento: "Botas", estado: "Defectuoso", observaciones: "Suela desgastada", inspector: "Admin" },
  { id: 4, bomberoId: 1, fecha: "2023-10-12", tipo: "rutina", elemento: "Traje", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" },
  { id: 5, bomberoId: 4, fecha: "2023-10-11", tipo: "rutina", elemento: "SCBA", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" }
];

async function _cargarBomberos() {
  const response = await fetch('http://localhost:3000/api/bomberos')

  // then(response => response.json())
  // .then(data => {
  const data = await response.json()
  console.log(data)
  if (data.success) bomberos = data
  return data
  // })
  // .catch(error => console.error(error))
}
async function _cargarControles() {
  const response = await fetch('http://localhost:3000/api/controles')
  const data = await response.json()
  if (data.success) controles = data
  return data
}


_cargarBomberos()
_cargarControles()

// Inicializar la interfaz
document.addEventListener('DOMContentLoaded', function () {
  cargarBomberos();
  cargarControles();
  configurarTabs();
  cargarDashboard();
});

async function cargarDashboard() {
  const dashboard = document.querySelector('#dashboard');
  const activos = dashboard.querySelector('#activos > .value');
  const ok = dashboard.querySelector('#ok > .value');
  const warning = dashboard.querySelector('#warning > .value');
  const danger = dashboard.querySelector('#danger > .value');

  const response = await fetch("http://localhost:3000/api/bomberos/stats");
  const data = await response.json()

  activos.textContent = data.activos;
  ok.textContent = data.ok;
  warning.textContent = data.warning;
  danger.textContent = data.danger;
}

// Configurar pestañas
function configurarTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remover clase active de todas las pestañas
      tabs.forEach(t => t.classList.remove('active'));
      // Agregar clase active a la pestaña clickeada
      this.classList.add('active');

      // Ocultar todos los contenidos
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      // Mostrar el contenido correspondiente
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

// Cargar datos de bomberos en la tabla
async function cargarBomberos(filtroTipo = 'todos', filtroGenero = 'todos') {
  const tbody = document.querySelector('#tablaBomberos tbody');
  tbody.innerHTML = '';
  bomberos = await _cargarBomberos();
  console.log(filtroTipo, filtroGenero)
  const bomberosFiltrados = bomberos.filter(bombero => {
    console.log(bombero.genero, filtroGenero);
    const cumpleTipo = filtroTipo === 'todos' || bombero.tipo.toLowerCase()[0] === filtroTipo.toLowerCase()[0] ;
    const cumpleGenero = filtroGenero === 'todos' || bombero.genero.toLowerCase()[0] === filtroGenero.toLowerCase()[0] ;
    console.log(bombero.tipo)
    return cumpleTipo && cumpleGenero;
  });
  // const bomberosFiltrados = await _cargarBomberos();
  console.log(bomberosFiltrados)
  bomberosFiltrados.forEach(bombero => {
    const fila = document.createElement('tr');

    // Determinar clase de estado
    let estadoClase = '';
    let estadoTexto = '';
    console.log(bombero)
    switch (bombero.estado) {
      case 'ok':
        estadoClase = 'status-ok';
        estadoTexto = 'En orden';
        break;
      case 'warning':
        estadoClase = 'status-warning';
        estadoTexto = 'Revisar';
        break;
      case 'danger':
        estadoClase = 'status-danger';
        estadoTexto = 'Urgente';
        break;
    }

    fila.innerHTML = `
            <td>${bombero.nombre}</td>
            <td>${bombero.apellido}</td>
            <td>${bombero.movil}</td>
            <td>${bombero.genero.charAt(0).toUpperCase() + bombero.genero.slice(1)}</td>
            <td>${bombero.tipo.charAt(0).toUpperCase() + bombero.tipo.slice(1)}</td>
            <td><span class="status ${estadoClase}">${estadoTexto}</span></td>
            <td>
                <button class="btn btn-outline" onclick="verDetalleBombero(${bombero.id})"><i class="fas fa-eye"></i> Ver</button>
            </td>
        `;

    tbody.appendChild(fila);
  });
}

// Cargar datos de controles en la tabla
function cargarControles() {
  const tbody = document.querySelector('#tablaControles tbody');
  tbody.innerHTML = '';

  controles.forEach(control => {
    const bombero = bomberos.find(b => b.id === control.bomberoId);
    const nombreBombero = bombero ? `${bombero.nombre} ${bombero.apellido}` : 'N/A';

    const fila = document.createElement('tr');
    fila.innerHTML = `
            <td>${nombreBombero}</td>
            <td>${control.fecha}</td>
            <td>${control.tipo.charAt(0).toUpperCase() + control.tipo.slice(1)}</td>
            <td>${control.elemento}</td>
            <td>${control.estado}</td>
            <td>${control.observaciones}</td>
            <td>${control.inspector}</td>
        `;

    tbody.appendChild(fila);
  });
}

// Aplicar filtros
function aplicarFiltros() {
  const tipoFiltro = document.getElementById('tipoFiltro').value;
  const generoFiltro = document.getElementById('generoFiltro').value;
  cargarBomberos(tipoFiltro, generoFiltro);
}

// Funciones para abrir y cerrar modales
function openModal(tipo) {
  document.getElementById(`${tipo}Modal`).style.display = 'flex';

  if (tipo === 'nuevoControl') {
    // Cargar lista de bomberos en el select
    const selectBombero = document.getElementById('bomberoControl');
    selectBombero.innerHTML = '<option value="">Seleccione un bombero</option>';

    bomberos.forEach(bombero => {
      const option = document.createElement('option');
      option.value = bombero.id;
      option.textContent = `${bombero.nombre} ${bombero.apellido}`;
      selectBombero.appendChild(option);
    });
  }
}

function closeModal(tipo) {
  document.getElementById(`${tipo}Modal`).style.display = 'none';
}

// Guardar nuevo bombero
function guardarBombero() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const movil = document.getElementById('movil').value;
  const genero = document.getElementById('genero').value;
  const tipo = document.getElementById('tipo').value;

  if (!nombre || !apellido || !movil) {
    alert('Por favor complete todos los campos obligatorios');
    return;
  }

  // Aquí normalmente enviaríamos los datos al backend
  alert('Bombero guardado correctamente');
  closeModal('nuevoBombero');

  // Limpiar formulario
  document.getElementById('nombre').value = '';
  document.getElementById('apellido').value = '';
  document.getElementById('movil').value = '';

  // Recargar la tabla (en una implementación real, se actualizaría desde el backend)
  cargarBomberos();
}

// Guardar nuevo control
function guardarControl() {
  const bomberoId = document.getElementById('bomberoControl').value;
  const fecha = document.getElementById('fechaControl').value;
  const tipoControl = document.getElementById('tipoControl').value;
  const observaciones = document.getElementById('observacionesControl').value;

  if (!bomberoId || !fecha) {
    alert('Por favor complete todos los campos obligatorios');
    return;
  }

  // Aquí normalmente enviaríamos los datos al backend
  alert('Control guardado correctamente');
  closeModal('nuevoControl');

  // Recargar la tabla (en una implementación real, se actualizaría desde el backend)
  cargarControles();
}

// Ver detalle de bombero
function verDetalleBombero(id) {
  const bombero = bomberos.find(b => b.id === id);
  if (bombero) {
    alert(`Detalle de ${bombero.nombre} ${bombero.apellido}\nMóvil: ${bombero.movil}\nGénero: ${bombero.genero}\nTipo: ${bombero.tipo}`);
  }
}

// Funciones originales de la primera interfaz
function saveReview() {
  alert('Revisión guardada correctamente');
  closeModal('review');
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
      modal.style.display = 'none';
    });
  }
}
