// const getEndpoint = (endpoint) => `https://prehistorically-juiciest-lenora.ngrok-free.dev/api/${endpoint}`
const getEndpoint = (endpoint) => `http://localhost:3000/api/${endpoint}`
export class Session {
  #token;
  role;

  async authFetch(endpoint, options) {
    const req = await fetch(getEndpoint(endpoint), {
      ...options,
      headers: {
        Authorization: `Bearer ${this.#token}`
      }
    })
    const data = await req.json()
    return data
  }

  async login(usuario, contraseña) {
    const response = await fetch(getEndpoint('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario,
        password: contraseña
      })
    })
    if (!response.ok) return false
    const data = await response.json()
    this.#token = data.token
    this.role = data.role
    console.log(this.role)
    return true
  }

  async registrarAdministrador(usuario, contraseña) {
    const response = await fetch(getEndpoint('auth/registrar-admin'), {
      method: 'POST',
      body: JSON.stringify({
        usuario,
        contraseña
      })
    })
    if (!response.ok) return false
    const data = await req.json()
    return true
  }

  async registrarBombero(nombre, apellido, movil, genero, tipo_bombero) {
    const req = await fetch(getEndpoint('auth/registrar-bombero'), {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        apellido,
        movil,
        genero,
        tipo_bombero
      })
    })
    if (!response.ok) return false
    const data = await req.json();
    return true
  }
}

