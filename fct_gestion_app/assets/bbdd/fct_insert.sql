/* 
  Miguel Mondéjar González
  2º DAW - Proyecto Integrado
*/

/* Insertar roles */
insert into Roles (nombre) values ('profesor');
insert into Roles (nombre) values ('alumno');

/* Insertar usuarios */ 
insert into Usuarios (nombre, apellidos, fecha_nacimiento, dni, email, telefono, password, rol_id) 
values ('Antonio', 'Gago Espinosa', '1985-01-01', '12345678A', 'agagesp006@g.educaand.es', '623456789', 'contraseña123', 1);
/* Insertar usuarios (menos el primer usuario, todos son de https://www.mockaroo.com/)
insert into Usuarios (nombre, apellidos, fecha_nacimiento, dni, email, telefono, password, rol_id) 
values ('Lanny', 'Barwis', '1987-01-28', '46184720A', 'lbarwis0@com.com', '667991459', 'f5W1IB2Z', 1);
insert into Usuarios (nombre, apellidos, fecha_nacimiento, dni, email, telefono, password, rol_id) 
values ('Jo', 'Urlich', '1984-11-22', '53816824P', 'jurlich1@pbs.org', '648219549', 'gtQY4L', 2);
insert into Usuarios (nombre, apellidos, fecha_nacimiento, dni, email, telefono, password, rol_id) 
values ('Zahara', 'Peetermann', '1978-01-12', '16320373X', 'zpeetermann2@hao123.com', '620399221', 'CEGeXv1', 2);
insert into Usuarios (nombre, apellidos, fecha_nacimiento, dni, email, telefono, password, rol_id) 
values ('Dotti', 'Iacovides', '1997-04-15', '71623722L', 'diacovides3@hatena.ne.jp', '686559257', 'hnEZFNeF', 2); */

/* Insertar empresas (https://www.mockaroo.com/) */
insert into Empresas (cif, nombre, email) values ('A68870733', 'Zoomlounge', 'jmcgiffie0@fema.gov');
insert into Empresas (cif, nombre, email) values ('S45302970', 'Meejo', 'velcock1@taobao.com');
insert into Empresas (cif, nombre, email) values ('W37429598', 'Flashdog', 'ihayworth2@tmall.com');
insert into Empresas (cif, nombre, email) values ('M60532685', 'Quimba', 'nsaynor3@php.net');
insert into Empresas (cif, nombre, email) values ('G40505483', 'Browsezoom', 'lzorzin4@nps.gov');

/* Insertar sedes (https://www.mockaroo.com/) */
insert into Sedes (nombre, direccion, localidad, provincia, codigo_postal, telefono, email, empresa_id) 
values ('Sede Cogibox', '23 International Hill', 'Vitoria-Gasteiz', 'Pais Vasco', '01005', '913405312', 'lguidetti0@imageshack.us', 1);
insert into Sedes (nombre, direccion, localidad, provincia, codigo_postal, telefono, email, empresa_id) 
values ('Sede Eadel', '089 Forest Point', 'Ourense', 'Galicia', '32005', '980472076', 'cscalia1@vkontakte.ru', 2);
insert into Sedes (nombre, direccion, localidad, provincia, codigo_postal, telefono, email, empresa_id) 
values ('Sede Wikivu', '36 Bluejay Drive', 'Sevilla', 'Andalucia', '41020', '930819956', 'hdavidge2@usda.gov', 3);
insert into Sedes (nombre, direccion, localidad, provincia, codigo_postal, telefono, email, empresa_id) 
values ('Sede Mycat', '8123 Green Ridge Place', 'Castellon De La Plana/Castello De La Pla', 'Comunidad Valenciana', '12005', '931162180', 'cdjokic3@mail.ru', 4);
insert into Sedes (nombre, direccion, localidad, provincia, codigo_postal, telefono, email, empresa_id) 
values ('Sede Yabox', '8 Vahlen Center', 'Malaga', 'Andalucia', '29010', '909976936', 'jwhight4@elegantthemes.com', 5);