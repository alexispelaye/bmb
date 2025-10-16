class AboutScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 80px 50px;
                    text-align: center;
                    max-width: 800px;
                    margin: auto;
                }
                h2 {
                    font-size: 36px;
                    color: #2c3e50;
                    margin-bottom: 20px;
                    animation: zoomIn 0.8s ease-out;
                }
                p {
                    font-size: 18px;
                    color: #7f8c8d;
                    line-height: 1.8;
                    margin-bottom: 25px;
                }
                .highlight {
                    color: #3498db;
                    font-weight: 600;
                }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            </style>
            
            <h2>Acerca de Nuestra Misión</h2>
            <p>
                Somos un equipo apasionado dedicado a la <span class="highlight">innovación y la calidad</span> en el desarrollo de soluciones digitales. Nuestra meta es transformar sus ideas en experiencias web funcionales y estéticamente impecables.
            </p>
            <p>
                Desde nuestro inicio, nos hemos enfocado en la transparencia, la comunicación constante y la entrega de productos que realmente generan valor para nuestros clientes.
            </p>
        `;
    }
}

customElements.define('about-screen', AboutScreen);