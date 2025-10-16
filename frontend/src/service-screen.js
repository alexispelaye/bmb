class ServiceScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 50px;
                    text-align: center;
                    width: 100%;
                }
                h2 {
                    font-size: 36px;
                    color: #3498db; /* Color principal */
                    margin-bottom: 25px;
                    animation: fadeInDown 0.6s ease-out;
                }
                .service-grid {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    flex-wrap: wrap;
                }
                .service-card {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
                    width: 300px;
                    text-align: left;
                    transition: transform 0.3s ease-in-out;
                }
                .service-card:hover {
                    transform: translateY(-5px);
                }
                h3 {
                    color: #2c3e50;
                    margin-top: 0;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                p {
                    color: #7f8c8d;
                    line-height: 1.6;
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            
            <h2>Nuestros Servicios Destacados</h2>
            <div class="service-grid">
                <div class="service-card">
                    <h3>Desarrollo Web</h3>
                    <p>Creación de sitios y aplicaciones web modernas, rápidas y responsivas, optimizadas para cualquier dispositivo.</p>
                </div>
                <div class="service-card">
                    <h3>Diseño UX/UI</h3>
                    <p>Diseñamos interfaces de usuario intuitivas y experiencias de usuario que deleitan a sus clientes.</p>
                </div>
                <div class="service-card">
                    <h3>Consultoría Técnica</h3>
                    <p>Análisis y asesoramiento experto para mejorar el rendimiento y la arquitectura de sus soluciones existentes.</p>
                </div>
            </div>
        `;
    }
}

customElements.define('service-screen', ServiceScreen);