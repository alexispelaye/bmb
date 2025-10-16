// const getEndpoint = (endpoint) => `https://prehistorically-juiciest-lenora.ngrok-free.dev/api/${endpoint}`
const getEndpoint = (endpoint) => `http://localhost:3000/api/${endpoint}`

const LOCAL_STORAGE_TOKEN_KEY = 'bmb-token';

export class Session {
  #token;
  role;
  constructor() {
    this.recoverFromLocal();
  }
  async authFetch(endpoint, options) {
    const response = await fetch(getEndpoint(endpoint), {
      ...options,
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    })
    const data = await req.json()
    return { ok: response.ok, data }
  }

  async login(usuario, contraseña) {
    const res = await fetch(getEndpoint('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario,
        password: contraseña
      })
    })
    if (!res.ok) return false
    const data = await res.json()

    const tmp = this.saveNewJwt(data.token);
    console.log(tmp);
    return tmp;
  }

  parseJwt(rawToken) {
    try {
      const parts = rawToken.split('.');
      const payload = parts[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  recoverFromLocal() {
    const rawToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (!rawToken) {
      return false;
    }
    return this.saveJwt(rawToken)
  }

  saveJwt(token) {
    const parsedToken = this.parseJwt(token);
    if (!parsedToken) {
      return false;
    };
    this.#token = token;
    this.role = parsedToken['role'];
    return true;
  }

  saveNewJwt(token) {
    if (!this.saveJwt(token)) {
      return false;
    }
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    return true;
  }

  async registrarAdministrador(usuario, contraseña) {
    const res = await this.authFetch('auth/registrar-admin', {
      method: 'POST',
      body: JSON.stringify({
        usuario,
        contraseña
      })
    })
    return res.ok;
  }

  async registrarBombero(nombre, apellido, movil, genero, tipo_bombero) {
    const res = await this.authFetch('auth/registrar-bombero', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        apellido,
        movil,
        genero,
        tipo_bombero
      })
    })
    return res.ok;
  }
}
