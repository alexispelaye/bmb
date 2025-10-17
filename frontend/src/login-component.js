import { Session } from './auth.js';
const session = new Session();

class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .login-container {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    width: 320px;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    animation: fadeIn 1s ease-in-out;
                }

                .login-container:hover {
                    transform: translateY(0);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                h2 {
                    margin-bottom: 30px;
                    color: #d32f2f;
                    font-size: 24px;
                    font-weight: 600;
                }

                .input-group {
                    position: relative;
                    margin-bottom: 25px;
                }

                .input-group input {
                    width: 100%;
                    padding: 12px 10px;
                    border: 1px solid #bdc3c7;
                    border-radius: 4px;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                    outline: none;
                    box-sizing: border-box;
                }

                .input-group input:focus {
                    border-color: #3498db;
                }

                .input-group label {
                    position: absolute;
                    top: 12px;
                    left: 10px;
                    color: #7f8c8d;
                    pointer-events: none;
                    transition: all 0.3s ease;
                    background-color: white;
                    padding: 0 5px;
                    z-index: 10;
                }

               .input-group input:focus + label,
                .input-group input:not(:placeholder-shown) + label,
                .input-group input:-webkit-autofill + label {
                    top: -18px;
                    left: 5px;
                    font-size: 12px;
                    color: #d32f2f;
                }

                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #2ecc71;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: 700;
                    transition: background-color 0.3s ease, transform 0.1s ease;
                }

                button:hover {
                    background-color: #27ae60;
                }

                button:active {
                    transform: scale(0.99);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* Animación de feedback para el botón */
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                    100% { transform: translateX(0); }
                }
            </style>

            <div class="login-container">
                <h2>Iniciar Sesión</h2>
                <form id="loginForm">
                    <div class="input-group">
                        <input type="text" id="username" name="username" required>
                        <label for="username">Apellido y N° de móvil</label>
                    </div>
                    <div class="input-group">
                        <input type="password" id="password" name="password" required>
                        <label for="password">Contraseña</label>
                    </div>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        `;

    this.shadowRoot.querySelector('#loginForm').addEventListener('submit', this.handleLogin.bind(this));
  }

  async handleLogin(event) {
    event.preventDefault();
    const username = this.shadowRoot.querySelector('#username').value;
    const password = this.shadowRoot.querySelector('#password').value;
    const button = this.shadowRoot.querySelector('button');

    let redirectUrl = '';

    // Lógica de autenticación:
    if (await session.login(username, password)) {
      console.log(session.role, 'ok', session)
      switch (session.role) {
        case 'admin':
          // Usuario Admin: Redirige al panel de control
          redirectUrl = 'admin-dashboard';
          break;
        case 'bombero':
          // Usuario Bombero/Normal: Redirige a la pantalla de usuario
          redirectUrl = 'pantallausuario.html';
          break;
      }
    }
    if (redirectUrl) {
      button.style.backgroundColor = '#2ecc71';
      button.textContent = '¡Éxito!';
      // Redirección con retraso
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      // Error de autenticación
      button.style.backgroundColor = '#e74c3c';
      button.textContent = 'Error';
      button.style.animation = 'shake 0.5s';
      button.addEventListener('animationend', () => {
        button.style.animation = '';
        button.textContent = 'Entrar';
        button.style.backgroundColor = '#2ecc71'; // Restablece
      }, { once: true });
    }
  }
}

customElements.define('login-form', LoginForm);
