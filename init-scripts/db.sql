DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS bombero;
DROP TABLE IF EXISTS equipamiento;
DROP TABLE IF EXISTS equipamiento_bombero;

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
  id_usuario INTEGER NOT NULL,
  tipo TipoBombero NOT NULL,
);

INSERT INTO bombero (genero, nombre, apellido, movil, id_usuario, tipo, estado) VALUES
  ('Masculino', 'Juan', 'Perez', 12, 1, 'voluntario'),
  ('Masculino', 'Carlos', 'Díaz', 13, 1, 'voluntario'),
  ('Masculino', 'Pedro', 'Fernandez', 14, 1, 'fijo'),
  ('Masculino', 'Luis', 'Gema', 15, 1, 'voluntario'),
  ('Femenino', 'María', 'González', 16, 1, 'fijo'),
  ('Femenino', 'Ana', 'López', 17, 1, 'voluntario');

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

INSERT INTO control (movil, fecha) VALUES
    (16, CURRENT_DATE);

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
