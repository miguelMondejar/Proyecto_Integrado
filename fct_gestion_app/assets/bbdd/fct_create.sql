/* 
  Miguel Mondéjar González
  2º DAW - Proyecto Integrado
*/

/* DDL Tabla Roles */
CREATE TABLE Roles (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL
);

/* DDL Tabla Usuarios */
CREATE TABLE Usuarios (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(25) NOT NULL,
  apellidos VARCHAR(30) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  dni VARCHAR(10) NOT NULL,
  email VARCHAR(50) NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  password VARCHAR(60) NOT NULL,
  rol_id INTEGER(5) NOT NULL,
  FOREIGN KEY (rol_id) REFERENCES Roles(id)
);

/* DDL Tabla Curriculums */
CREATE TABLE Curriculums (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  ruta VARCHAR(20) NOT NULL,
  usuario_id INTEGER(5) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

/* DDL Tabla Empresas */
CREATE TABLE Empresas (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  cif VARCHAR(10) NOT NULL,
  nombre VARCHAR(25) NOT NULL,
  email VARCHAR(30) NOT NULL
);

/* DDL Tabla Sedes */
CREATE TABLE Sedes (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(25) NOT NULL,
  direccion VARCHAR(50) NOT NULL,
  localidad VARCHAR(50) NOT NULL,
  provincia VARCHAR(50) NOT NULL,
  codigo_postal VARCHAR(5) NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  empresa_id INTEGER(5) NOT NULL,
  FOREIGN KEY (empresa_id) REFERENCES Empresas(id) ON DELETE CASCADE
);

/* DDL Tabla Candidaturas */
CREATE TABLE Candidaturas (
  id INTEGER(5) PRIMARY KEY AUTO_INCREMENT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado VARCHAR(15) NOT NULL,
  usuario_id INTEGER(5) NOT NULL,
  empresa_id INTEGER(5) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (empresa_id) REFERENCES Empresas(id) ON DELETE CASCADE
);