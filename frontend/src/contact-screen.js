class ContactScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 50px;
                }
                .contact-card {
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                    width: 400px;
                    text-align: center;
                    animation: slideInRight 0.7s ease-out;
                }
                h2 {
                    font-size: 30px;
                    color: #3498db;
                    margin-bottom: 30px;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 15px;
                    font-size: 16px;
                    color: #2c3e50;
                }
                .info-item span {
                    margin-left: 15px;
                }
                .icon {
                    font-size: 20px;
                    color: #3498db;
                    width: 25px;
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            </style>
            
            <div class="contact-card">
                <h2>Contáctanos</h2>
                <div class="info-item">
                    <span class="icon">📧</span><span>contacto@.com</span>
                </div>
                <div class="info-item">
                    <span class="icon">📞</span><span>+54 3462 1234 5678</span>
                </div>
                <div class="info-item">
                    <span class="icon">📍</span><span>Av. Innovación 123, Ciudad Digital</span>
                </div>
            </div>
        `;
    }
}

customElements.define('contact-screen', ContactScreen);