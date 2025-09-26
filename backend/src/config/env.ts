
interface Envs {
  DB_CONTAINER_NAME: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_EXT_PORT: number;
  DB_INT_PORT: number;
  DB_HOST: string;
}

class Transformable {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  toInt() {
    return parseInt(this.value);
  }
}

class Requireable {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
  required() {
    if (!this.value) {
      throw new Error(`Missing env variable: ${this.value}`);
    }
    return new Transformable(this.value);
  }
  default(defaultValue: string) {
    if (!this.value) {
      this.value = defaultValue;
    }
    return new Transformable(this.value);
  }
}

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env variable: ${key}`);
  }
  return new Requireable(value);
}


export const envs: Envs = {
  DB_CONTAINER_NAME: getEnv('DB_CONTAINER_NAME').required().value,
  DB_EXT_PORT: getEnv('DB_EXT_PORT').required().toInt(),
  DB_INT_PORT: getEnv('DB_INT_PORT').required().toInt(),
  DB_NAME: getEnv('DB_NAME').required().value,
  DB_USER: getEnv('DB_USER').required().value,
  DB_PASS: getEnv('DB_PASS').required().value,
  DB_HOST: getEnv('DB_HOST').required().value,
}
