CREATE TYPE Genero AS ENUM ('Femenino', 'Masculino');
CREATE TYPE Esta as ENUM ('Si', 'No');
CREATE TYPE Role as ENUM ('bombero', 'admin');
CREATE TYPE TipoBombero as ENUM ('voluntario', 'fijo');
CREATE TYPE EstadoEEP as ENUM ('ok', 'warning', 'danger');


CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  contraseña VARCHAR(255) NOT NULL,
  usuario VARCHAR(255) NOT NULL UNIQUE,
  role Role DEFAULT 'bombero'
);

CREATE TABLE bombero (
  id SERIAL PRIMARY KEY,
  genero Genero NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  movil INTEGER UNIQUE NOT NULL,
  id_usuario INTEGER UNIQUE NOT NULL,
  tipo TipoBombero NOT NULL,
  CONSTRAINT fk_bombero_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id)
);

CREATE TABLE administrador (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario (id)
);

CREATE OR REPLACE FUNCTION check_usuario_role_exclusivity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'bombero' THEN
        IF EXISTS (SELECT 1 FROM administrador WHERE id_usuario = NEW.id_usuario) THEN
            RAISE EXCEPTION 'El usuario con ID % ya está registrado como administrador.', NEW.id_usuario;
        END IF;
    ELSIF TG_TABLE_NAME = 'administrador' THEN
        IF EXISTS (SELECT 1 FROM bombero WHERE id_usuario = NEW.id_usuario) THEN
            RAISE EXCEPTION 'El usuario con ID % ya está registrado como cliente.', NEW.id_usuario;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_exclusivity_on_bombero
BEFORE INSERT OR UPDATE ON bombero
FOR EACH ROW
EXECUTE FUNCTION check_usuario_role_exclusivity();

CREATE TRIGGER enforce_exclusivity_on_administrador
BEFORE INSERT OR UPDATE ON administrador
FOR EACH ROW
EXECUTE FUNCTION check_usuario_role_exclusivity();

CREATE TABLE equipamiento (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO equipamiento (nombre) VALUES
  ('Casco'),
  ('Botas'),
  ('Mameluco (Traje)'),
  ('Guantes');

CREATE TABLE equipamiento_bombero (
  id_bombero INTEGER NOT NULL,
  id_equipamiento INTEGER NOT NULL,
  esta Esta NOT NULL,
  FOREIGN KEY (id_bombero) REFERENCES bombero(id),
  FOREIGN KEY (id_equipamiento) REFERENCES equipamiento(id)
);

CREATE TABLE control (
  id SERIAL PRIMARY KEY,
  movil INTEGER NOT NULL,
  fecha DATE NOT NULL,
  FOREIGN KEY (movil) REFERENCES bombero(movil)
);


CREATE MATERIALIZED VIEW bombero_estado AS
WITH controles_mes AS (
    SELECT
        movil,
        COUNT(movil) AS total_controles
    FROM
        control
    WHERE
        fecha >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY
        movil
)
SELECT
    b.id,
    COALESCE(cm.total_controles, 0) AS controles_mes_actual,
    CASE
        WHEN COALESCE(cm.total_controles, 0) >= 3 THEN 'ok'
        WHEN COALESCE(cm.total_controles, 0) >= 1 THEN 'warning'
        ELSE 'danger'
    END AS estado_bombero
FROM
    bombero b
LEFT JOIN
    controles_mes cm ON b.movil = cm.movil;
