class HomeScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.isLoggedIn = false;
        this.showLogin = false;
        // this.showRegister = false; // ELIMINADO: Ya no controlamos el modal de registro
        // Controla la pantalla actual ('home', 'services', 'about', 'contact')
        this.currentPage = 'home'; 

        this.render();
    }

    // Método para cambiar la pantalla
    navigateTo(page) {
        this.currentPage = page;
        this.render(); // Redibuja el componente con el nuevo contenido
    }

    // Método para renderizar el contenido del Shadow DOM
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    /* ... estilos host ... */
                    width: 100%; 
                    box-sizing: border-box; 
                }

                /* --- Estilos de la Barra de Navegación (Header) --- */
                .header {
                    width: 100%;
                    background-color: #d32f2f;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    padding: 15px 50px; 
                    box-sizing: border-box; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 999;
                }

                .logo {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    cursor: pointer;
                }
                
                .nav-links {
                    display: flex;
                    gap: 30px;
                }

                .nav-links a {
                    text-decoration: none;
                    color: #2c3e50;
                    font-weight: 500;
                    font-size: 16px;
                    transition: color 0.3s ease;
                    cursor: pointer; 
                }

                .nav-links a.active,
                .nav-links a:hover {
                    color: #ffffff;
                    font-weight: 600; 
                }

                /* --- Contenido Principal --- */
                .page-content {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: ${this.currentPage === 'home' ? 'center' : 'flex-start'};
                    width: 100%;
                    padding-top: ${this.currentPage === 'home' ? '0' : '40px'};
                    padding-bottom: 40px;
                }
                
                /* Estilos específicos de la HOME/Hero Section */
                .hero-section {
                    text-align: center;
                    animation: slideUp 0.8s ease-out;
                    max-width: 800px;
                }

                .hero-section h1 {
                    font-size: 48px;
                    color: #2c3e50;
                    margin-bottom: 20px;
                }

                .hero-section p {
                    font-size: 18px;
                    color: #7f8c8d;
                    margin-bottom: 40px;
                }
                
                /* Botones del Hero */
                .hero-actions {
                    display: flex;
                    justify-content: center;
                    gap: 20px; /* Espacio entre los botones */
                }
                
                /* Botón base */
                .hero-actions button {
                    padding: 10px 20px;
                    background-color: #b71c1c;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    transition: background-color 0.3s ease, transform 0.1s ease;
                }

                .hero-actions button:hover {
                    background-color: #d32f2f;
                }
                
                /* ELIMINADO: Estilo para el botón de 'Registrarse' 
                .register-btn {
                    background-color: #2ecc71 !important;
                }
                
                .register-btn:hover {
                    background-color: #27ae60 !important;
                }
                */

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* --- Contenedor del Modal (Login) --- */
                .modal-wrapper { 
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeInOverlay 0.3s ease-in-out;
                }
                
                /* Control de visibilidad para el modal de login */
                .login-wrapper {
                    display: ${this.showLogin ? 'flex' : 'none'};
                }
                
                /* ELIMINADO: Estilo para el modal de registro 
                .register-wrapper {
                    display: ${this.showRegister ? 'flex' : 'none'}; 
                }
                */

                .modal-form-container {
                    position: relative;
                }

                .close-btn {
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    line-height: 1;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.2s;
                }
                
                .close-btn:hover {
                    background-color: #c0392b;
                }

                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
            
            <header class="header">
                <div class="logo" data-page="home">Bomberos voluntarios</div>
                <nav class="nav-links">
                    <a data-page="home" class="${this.currentPage === 'home' ? 'active' : ''}">Inicio</a>
                    <a data-page="services" class="${this.currentPage === 'services' ? 'active' : ''}">Servicios</a>
                    <a data-page="about" class="${this.currentPage === 'about' ? 'active' : ''}">Acerca de</a>
                    <a data-page="contact" class="${this.currentPage === 'contact' ? 'active' : ''}">Contacto</a>
                </nav>
                <div>
                    </div>
            </header>

            <div class="page-content">
                ${this.getComponentForPage(this.currentPage)}
            </div>
            
            <div class="modal-wrapper login-wrapper" id="loginWrapper">
                <div class="modal-form-container">
                    <login-form></login-form>
                    <button class="close-btn" id="close-login">×</button>
                </div>
            </div>
            
            `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listener para el botón de cerrar Login (Modal)
        this.shadowRoot.querySelector('#close-login').addEventListener('click', this.toggleLogin.bind(this));
        // ELIMINADO: Listener para el botón de cerrar Registro
        // this.shadowRoot.querySelector('#close-register').addEventListener('click', this.toggleRegister.bind(this)); 
        
        // Listener para el logo
        this.shadowRoot.querySelector('.logo').addEventListener('click', () => this.navigateTo('home'));

        // Listener para la navegación
        this.shadowRoot.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.target.dataset.page);
            });
        });
        
        // Cierra el modal de login si se hace clic fuera
        this.shadowRoot.querySelector('#loginWrapper').addEventListener('click', (e) => {
            if (e.target.id === 'loginWrapper') {
                this.toggleLogin();
            }
        });
        
        // ELIMINADO: Cierra el modal de registro si se hace clic fuera
        /*
        this.shadowRoot.querySelector('#registerWrapper').addEventListener('click', (e) => {
            if (e.target.id === 'registerWrapper') {
                this.toggleRegister(); 
            }
        });
        */
        
        // --- LISTENERS PARA LOS BOTONES DEL HERO (solo si estamos en la home) ---
        if (this.currentPage === 'home') {
            const loginBtn = this.shadowRoot.querySelector('#hero-login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', this.toggleLogin.bind(this));
            }
            
            // ELIMINADO: Listener para el botón de 'Registrarse' del Hero
            /*
            const registerBtn = this.shadowRoot.querySelector('#hero-register-btn');
            if (registerBtn) {
                registerBtn.addEventListener('click', this.toggleRegister.bind(this)); 
            }
            */
        }
    }

    // Función que devuelve el HTML del componente según la página
    getComponentForPage(page) {
        switch (page) {
            case 'services':
                return '<service-screen></service-screen>';
            case 'about':
                return '<about-screen></about-screen>';
            case 'contact':
                return '<contact-screen></contact-screen>';
            case 'home':
            default:
                return `
                    <div class="hero-section">
                        <h1>Sistema de gestión de elementos</h1>
                        <p>Explora nuestras últimas características con una interfaz diseñada para ser intuitiva y visualmente atractiva, siguiendo el estilo que ya conoces.</p>
                        
                        <div class="hero-actions">
                            <button id="hero-login-btn">Iniciar Sesión</button>
                            </div>
                    </div>
                `;
        }
    }

    // Muestra/Oculta el formulario de login
    toggleLogin() {
        this.showLogin = !this.showLogin;
        
        // Ya no es necesario ocultar el registro, solo controlamos 'showLogin'
        
        this.shadowRoot.getElementById('loginWrapper').style.display = this.showLogin ? 'flex' : 'none';
        
        // ELIMINADO: Ya no necesitamos controlar registerWrapper
        // this.shadowRoot.getElementById('registerWrapper').style.display = this.showRegister ? 'flex' : 'none';

        // Controla el scroll del body
        // La condición se simplifica, ya que solo showLogin puede ser true
        document.body.style.overflow = this.showLogin ? 'hidden' : ''; 
    }
    
    // ELIMINADO: Método toggleRegister
    /*
    toggleRegister() {
        this.showRegister = !this.showRegister;
        
        if (this.showRegister) {
            this.showLogin = false;
        }

        this.shadowRoot.getElementById('loginWrapper').style.display = this.showLogin ? 'flex' : 'none';
        this.shadowRoot.getElementById('registerWrapper').style.display = this.showRegister ? 'flex' : 'none';
        
        document.body.style.overflow = this.showLogin || this.showRegister ? 'hidden' : ''; 
    }
    */
}

customElements.define('home-screen', HomeScreen);