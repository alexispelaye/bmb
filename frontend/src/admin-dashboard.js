import { Session } from './auth.js';
const session = new Session();
class AdminDashboard extends HTMLElement {
  constructor() {
    super();
    this.controles = [];
    this.bomberos = [];
    this.filtros = {
      bomberos: {
        genero: 'todos',
        tipo: 'todos'
      }
    }

    this._cargarBomberos();
    this._cargarControles();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.cargarControles();
    this.cargarDashboard();
    this.configurarTabs();

  }
  render() {
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="admin-dashboard.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <div class="container">
          <!-- Sidebar -->
          <div class="sidebar">
              <div class="logo">
                  <h1><i class="fas fa-fire-extinguisher"></i> Sistema EPP</h1>
                  <p>Bomberos Voluntarios</p>
              </div>
              <ul class="menu">
                  <li class="active"><i class="fas fa-tachometer-alt"></i> Dashboard</li>
                  <li><i class="fas fa-users"></i> Bomberos</li>
                  <li><i class="fas fa-helmet-safety"></i> Equipos EPP</li>
                  <li><i class="fas fa-clipboard-check"></i> Revisiones</li>
                  <li><i class="fas fa-chart-bar"></i> Reportes</li>
                  <li><i class="fas fa-cog"></i> Configuración</li>
              </ul>
          </div>

          <!-- Main Content -->
          <div class="main-content">
              <div class="header">
                  <h2>Control de Equipos de Protección Personal</h2>
                  <div class="user-info">
                      <img src="https://ui-avatars.com/api/?name=Admin+Sistema&background=d32f2f&color=fff" alt="Admin">
                      <span>Administrador</span>
                  </div>
              </div>

              <!-- Dashboard Cards -->
              <div class="dashboard-cards" id="dashboard">
                  <div class="card success" id="ok">
                      <h3>EPP en Óptimas Condiciones</h3>
                      <div class="value"></div>
                      <p>Bomberos con equipos al día</p>
                  </div>
                  <div class="card warning" id="warning">
                      <h3>EPP por Vencer</h3>
                      <div class="value"></div>
                      <p>Equipos con revisión próxima</p>
                  </div>
                  <div class="card danger" id="danger">
                      <h3>EPP Vencidos</h3>
                      <div class="value"></div>
                      <p>Equipos que necesitan revisión urgente</p>
                  </div>
                  <div class="card info" id="activos">
                      <h3>Total de Bomberos</h3>
                      <div class="value"></div>
                      <p>Personal activo en el cuerpo</p>
                  </div>
              </div>

              <!-- Tabs -->
              <div class="tabs">
                  <div class="tab active" data-tab="bomberos">Lista de Bomberos</div>
                  <div class="tab" data-tab="controles">Controles Realizados</div>
              </div>

              <!-- Tab Content: Bomberos -->
              <div class="tab-content active" id="bomberos-tab">
                  <!-- Filtros -->
                  <div class="filters">
                      <div class="filter-group">
                          <label for="tipoFiltro">Tipo:</label>
                          <select id="tipoFiltro">
                              <option value="todos">Todos</option>
                              <option value="voluntario">Voluntarios</option>
                              <option value="fijo">Fijos</option>
                          </select>
                      </div>
                      <div class="filter-group">
                          <label for="generoFiltro">Género:</label>
                          <select id="generoFiltro">
                              <option value="todos">Todos</option>
                              <option value="masculino">Masculino</option>
                              <option value="femenino">Femenino</option>
                              <option value="otro">Otro</option>
                          </select>
                      </div>
                      <button class="btn btn-primary">Aplicar Filtros</button>
                  </div>

                  <!-- Tabla de Bomberos -->
                  <div class="table-container">
                      <table id="tablaBomberos">
                          <thead>
                              <tr>
                                  <th>Nombre</th>
                                  <th>Apellido</th>
                                  <th>Móvil</th>
                                  <th>Género</th>
                                  <th>Tipo</th>
                                  <th>Estado EPP</th>
                                  <th>Acciones</th>
                              </tr>
                          </thead>
                          <tbody>
                              <!-- Los datos se cargarán dinámicamente desde el backend -->
                          </tbody>
                      </table>
                  </div>

                  <button class="btn btn-primary"><i class="fas fa-plus"></i> Agregar Bombero</button>
              </div>

              <!-- Tab Content: Controles -->
              <div class="tab-content" id="controles-tab">
                  <!-- Tabla de Controles -->
                  <div class="table-container">
                      <table id="tablaControles">
                          <thead>
                              <tr>
                                  <th>Bombero</th>
                                  <th>Fecha Control</th>
                                  <th>Tipo Control</th>
                                  <th>Elemento Revisado</th>
                                  <th>Estado</th>
                                  <th>Observaciones</th>
                                  <th>Inspector</th>
                              </tr>
                          </thead>
                          <tbody>
                              <!-- Los datos se cargarán dinámicamente desde el backend -->
                          </tbody>
                      </table>
                  </div>

                  <button class="btn btn-primary"><i class="fas fa-plus"></i> Nuevo Control</button>
                  <button class="btn btn-outline"><i class="fas fa-file-pdf"></i> Generar Reporte</button>
              </div>
          </div>
      </div>

      <!-- Modal para revisión detallada -->
      <div class="modal" id="reviewModal">
          <div class="modal-content">
              <div class="modal-header">
                  <h3>Revisión de EPP - Juan Pérez</h3>
                  <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label for="reviewDate">Fecha de Revisión</label>
                      <input type="date" id="reviewDate" value="2023-10-15">
                  </div>

                  <h4>Elementos de Protección Personal</h4>
                  <div class="epp-items">
                      <div class="epp-item">
                          <i class="fas fa-helmet-safety"></i>
                          <h4>Casco</h4>
                          <select>
                              <option selected>Válido</option>
                              <option>Por vencer</option>
                              <option>Vencido</option>
                              <option>Dañado</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-hand-paper"></i>
                          <h4>Guantes</h4>
                          <select>
                              <option>Válido</option>
                              <option selected>Por vencer</option>
                              <option>Vencido</option>
                              <option>Dañado</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-shoe-prints"></i>
                          <h4>Botas</h4>
                          <select>
                              <option selected>Válido</option>
                              <option>Por vencer</option>
                              <option>Vencido</option>
                              <option>Dañado</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-tshirt"></i>
                          <h4>Traje</h4>
                          <select>
                              <option selected>Válido</option>
                              <option>Por vencer</option>
                              <option>Vencido</option>
                              <option>Dañado</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-wind"></i>
                          <h4>SCBA</h4>
                          <select>
                              <option>Válido</option>
                              <option>Por vencer</option>
                              <option selected>Vencido</option>
                              <option>Dañado</option>
                          </select>
                      </div>
                  </div>

                  <div class="form-group">
                      <label for="observations">Observaciones</label>
                      <textarea id="observations" rows="4" placeholder="Agregar observaciones sobre el estado del equipo..."></textarea>
                  </div>

                  <button class="btn btn-primary" style="width: 100%;">Guardar Revisión</button>
              </div>
          </div>
      </div>

      <!-- Modal para nuevo bombero -->
      <div class="modal" id="nuevoBomberoModal">
          <div class="modal-content">
              <div class="modal-header">
                  <h3>Agregar Nuevo Bombero</h3>
                  <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label for="nombre">Nombre</label>
                      <input type="text" id="nombre" placeholder="Ingrese el nombre">
                  </div>
                  <div class="form-group">
                      <label for="apellido">Apellido</label>
                      <input type="text" id="apellido" placeholder="Ingrese el apellido">
                  </div>
                  <div class="form-group">
                      <label for="movil">Móvil</label>
                      <input type="text" id="movil" placeholder="Ingrese el número de móvil">
                  </div>
                  <div class="form-group">
                      <label for="genero">Género</label>
                      <select id="genero">
                          <option value="masculino">Masculino</option>
                          <option value="femenino">Femenino</option>
                          <option value="otro">Otro</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="tipo">Tipo</label>
                      <select id="tipo">
                          <option value="voluntario">Voluntario</option>
                          <option value="fijo">Fijo</option>
                      </select>
                  </div>

                  <button class="btn btn-primary" style="width: 100%;">Guardar Bombero</button>
              </div>
          </div>
      </div>

      <!-- Modal para nuevo control -->
      <div class="modal" id="nuevoControlModal">
          <div class="modal-content">
              <div class="modal-header">
                  <h3>Nuevo Control de EPP</h3>
                  <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label for="bomberoControl">Bombero</label>
                      <select id="bomberoControl">
                          <option value="">Seleccione un bombero</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="fechaControl">Fecha de Control</label>
                      <input type="date" id="fechaControl">
                  </div>
                  <div class="form-group">
                      <label for="tipoControl">Tipo de Control</label>
                      <select id="tipoControl">
                          <option value="rutina">Rutina</option>
                          <option value="especial">Especial</option>
                          <option value="revision">Revisión Post-Uso</option>
                      </select>
                  </div>

                  <h4>Elementos Revisados</h4>
                  <div class="epp-items">
                      <div class="epp-item">
                          <i class="fas fa-helmet-safety"></i>
                          <h4>Casco</h4>
                          <select id="estadoCasco">
                              <option value="optimo">Óptimo</option>
                              <option value="regular">Regular</option>
                              <option value="defectuoso">Defectuoso</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-hand-paper"></i>
                          <h4>Guantes</h4>
                          <select id="estadoGuantes">
                              <option value="optimo">Óptimo</option>
                              <option value="regular">Regular</option>
                              <option value="defectuoso">Defectuoso</option>
                          </select>
                      </div>
                      <div class="epp-item">
                          <i class="fas fa-shoe-prints"></i>
                          <h4>Botas</h4>
                          <select id="estadoBotas">
                              <option value="optimo">Óptimo</option>
                              <option value="regular">Regular</option>
                              <option value="defectuoso">Defectuoso</option>
                          </select>
                      </div>
                  </div>

                  <div class="form-group">
                      <label for="observacionesControl">Observaciones</label>
                      <textarea id="observacionesControl" rows="4" placeholder="Agregar observaciones sobre el control..."></textarea>
                  </div>

                  <button class="btn btn-primary" style="width: 100%;">Guardar Control</button>
              </div>
          </div>
      </div>
      `

    const procModal = (modalName, submitFunc) => {
      const modal = this.shadowRoot.querySelector(`#${modalName}Modal > .modal-content`);
      const closeModalBtn = modal.querySelector('.modal-header span');
      const submitModalBtn = modal.querySelector('.modal-body button');
      closeModalBtn.onclick = () => this.closeModal(modalName);
      submitModalBtn.onclick = submitFunc;
    }

    procModal('nuevoControl', this.guardarControl);
    procModal('nuevoBombero', this.guardarBombero);
    procModal('review', this.saveReview);

    const procTab = (tabName, modalName)=>{
      const tab = this.shadowRoot.querySelector(`#${tabName}-tab`)
      const tabBtn = tab.querySelector('button');
      const tabFilters = tab.querySelector('filters');
      if (tabFilters) {
        const tabFiltersBtn = tabFilters.querySelector('button');
        tabFiltersBtn.onclick = this.aplicarFiltros;
      }
      tabBtn.onclick = ()=>this.openModal(modalName)
    }

    procTab('controles', 'nuevoControl');
    procTab('bomberos', 'nuevoBombero');
  }
  cargarControles() {
    const tbody = this.shadowRoot.querySelector('#tablaControles tbody');
    tbody.innerHTML = '';

    this.controles.forEach(control => {
      const bombero = this.bomberos.find(b => b.id === control.bomberoId);
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

  async cargarDashboard() {
    const dashboard = this.shadowRoot.querySelector('#dashboard');
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

  async guardarBombero() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const movil = document.getElementById('movil').value;
    const genero = document.getElementById('genero').value;
    const tipo = document.getElementById('tipo').value;

    if (!nombre || !apellido || !movil) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const { ok } = await session.authFetch('auth/registrar-bombero', {
      body: JSON.stringify({
        nombre,
        apellido,
        movil,
        genero,
        tipo
      })
    });
    if (!ok){
      alert('Error al registrar bombero')
    }

    alert('Bombero registrado correctamente');
    closeModal('nuevoBombero');

    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('movil').value = '';
    cargarBomberos();
  }

  async cargarBomberos() {
    const tbody = this.shadowRoot.querySelector('#tablaBomberos tbody');
    tbody.innerHTML = '';
    await this._cargarBomberos();
    const bomberosFiltrados = bomberos.filter(bombero => {
      const cumpleTipo = this.filtros.bomberos.tipo === 'todos' || bombero.tipo.toLowerCase()[0] === this.filtros.bomberos.tipo.toLowerCase()[0];
      const cumpleGenero = this.filtros.bomberos.genero === 'todos' || bombero.genero.toLowerCase()[0] === this.filtros.bomberos.genero.toLowerCase()[0];
      return cumpleTipo && cumpleGenero;
    });
    bomberosFiltrados.forEach(bombero => {
      const fila = document.createElement('tr');
      let estadoClase = '';
      let estadoTexto = '';
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
                  <button class="btn btn-outline"><i class="fas fa-eye"></i> Ver</button>
              </td>
          `;
      const filaBtn = fila.querySelector('button');
      filaBtn.onclick = () => this.verDetalleBombero(bombero.id)

      tbody.appendChild(fila);
    });
  }

  async _cargarBomberos() {
    const response = await fetch('http://localhost:3000/api/bomberos')
    const data = await response.json()
    if (data.success) this.bomberos = data
  }

  async _cargarControles() {
    const response = await fetch('http://localhost:3000/api/controles')
    const data = await response.json()
    if (data.success) this.controles = data
  }

  configurarTabs() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        this.shadowRoot.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        const tabId = this.getAttribute('data-tab');
        this.shadowRoot.querySelector(`#${tabId}-tab`).classList.add('active');
      });
    });
  }

  aplicarFiltros() {
    console.log(this.shadowRoot.getElementById('#tipoFiltro'))
    this.filtros.bomberos.tipo = this.shadowRoot.querySelector('#tipoFiltro').value;
    this.filtros.bomberos.genero = this.shadowRoot.querySelector('#generoFiltro').value;
    cargarBomberos();
  }

  guardarControl() {
    const bomberoId = document.getElementById('bomberoControl').value;
    const fecha = document.getElementById('fechaControl').value;
    const tipoControl = document.getElementById('tipoControl').value;
    const observaciones = document.getElementById('observacionesControl').value;

    if (!bomberoId || !fecha) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    alert('Control guardado correctamente');
    closeModal('nuevoControl');
    cargarControles();
  }
  openModal(tipo) {
    this.shadowRoot.getElementById(`${tipo}Modal`).style.display = 'flex';

    if (tipo === 'nuevoControl') {
      const selectBombero = this.shadowRoot.getElementById('bomberoControl');
      selectBombero.innerHTML = '<option value="">Seleccione un bombero</option>';

      this.bomberos.forEach(bombero => {
        const option = document.createElement('option');
        option.value = bombero.id;
        option.textContent = `${bombero.nombre} ${bombero.apellido}`;
        selectBombero.appendChild(option);
      });
    }
  }
  closeModal(tipo) {
    this.shadowRoot.getElementById(`${tipo}Modal`).style.display = 'none';
  }

  verDetalleBombero(id) {
    const bombero = this.bomberos.find(b => b.id === id);
    if (bombero) {
      alert(`Detalle de ${bombero.nombre} ${bombero.apellido}\nMóvil: ${bombero.movil}\nGénero: ${bombero.genero}\nTipo: ${bombero.tipo}`);
    }
  }

  saveReview() {
    alert('Revisión guardada correctamente');
    closeModal('review');
  }

}

customElements.define('admin-dashboard', AdminDashboard)
// const controles = [
//   { id: 1, bomberoId: 1, fecha: "2023-10-15", tipo: "rutina", elemento: "Casco", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" },
//   { id: 2, bomberoId: 2, fecha: "2023-10-14", tipo: "especial", elemento: "Guantes", estado: "Regular", observaciones: "Desgaste en palma", inspector: "Admin" },
//   { id: 3, bomberoId: 3, fecha: "2023-10-13", tipo: "revision", elemento: "Botas", estado: "Defectuoso", observaciones: "Suela desgastada", inspector: "Admin" },
//   { id: 4, bomberoId: 1, fecha: "2023-10-12", tipo: "rutina", elemento: "Traje", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" },
//   { id: 5, bomberoId: 4, fecha: "2023-10-11", tipo: "rutina", elemento: "SCBA", estado: "Óptimo", observaciones: "Sin observaciones", inspector: "Admin" }
// ];

// Funciones originales de la primera interfaz


// Cerrar modal al hacer clic fuera de él
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
      modal.style.display = 'none';
    });
  }
}
