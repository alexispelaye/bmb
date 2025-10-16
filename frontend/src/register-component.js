class RegisterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .register-form {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    width: 350px;
                    max-width: 90%;
                    animation: fadeIn 0.4s ease-out;
                    
                    /* AJUSTES PARA EVITAR QUE EL FORMULARIO SE CORTE */
                    max-height: 85vh; /* Limita la altura máxima al 85% del viewport */
                    overflow-y: auto;  /* Añade barra de desplazamiento si excede max-height */
                }

                h2 {
                    text-align: center;
                    color: #d32f2f;
                    margin-bottom: 25px;
                    font-size: 24px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #2c3e50;
                    font-size: 14px;
                }

                input[type="text"], 
                input[type="number"], 
                input[type="password"], 
                select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #bdc3c7;
                    border-radius: 4px;
                    box-sizing: border-box; 
                    transition: border-color 0.3s;
                }
                
                input[type="number"] {
                    max-width: 60px; 
                    text-align: center;
                }
                
                select:focus,
                input:focus {
                    border-color: #3498db;
                    outline: none;
                }
                
                .radio-group {
                    display: flex;
                    gap: 20px;
                    padding: 5px 0;
                }
                
                .radio-group label {
                    font-weight: 400;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }

                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #2ecc71;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 700;
                    margin-top: 20px;
                    transition: background-color 0.3s ease;
                    flex-shrink: 0; 
                }

                button:hover {
                    background-color: #27ae60;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            
            <form class="register-form">
                <h2>Registro de Personal</h2>

                <div class="form-group">
                    <label for="apellido">Apellido</label>
                    <input type="text" id="apellido" name="apellido" required>
                </div>

                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>

                <div class="form-group">
                    <label for="movil">Número de Móvil (2 dígitos)</label>
                    <input type="number" id="movil" name="movil" min="10" max="99" required>
                </div>
                
                <div class="form-group">
                    <label>Género</label>
                    <div class="radio-group">
                        <label for="masculino">
                            <input type="radio" id="masculino" name="genero" value="M" required> Masculino
                        </label>
                        <label for="femenino">
                            <input type="radio" id="femenino" name="genero" value="F"> Femenino
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="categoria">Categoría</label>
                    <select id="categoria" name="categoria" required>
                        <option value="">Selecciona una categoría</option>
                        <option value="fijo">Fijo</option>
                        <option value="voluntario">Voluntario</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                </div>

                <div class="form-group">
                    <label for="confirm-password">Confirmar Contraseña</label>
                    <input type="password" id="confirm-password" name="confirm-password" required>
                </div>

                <button type="submit">Completar Registro</button>
            </form>
        `;
        
        // Simulación de envío del formulario y validación de contraseña
        this.shadowRoot.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const password = this.shadowRoot.querySelector('#password').value;
            const confirmPassword = this.shadowRoot.querySelector('#confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Error: La contraseña y la confirmación no coinciden.');
                return;
            }
            
            alert('¡Registro enviado! (Datos no guardados)');
        });
    }
}

customElements.define('register-component', RegisterComponent);