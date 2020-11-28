/* If database already exsits drop it and overwrite it */
DROP DATABASE IF EXISTS management;

/* Creating and using database */
CREATE DATABASE management;
USE management;

/* New tables with primary keys that auto-increments and ids that refer to other tables */
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT,
  PRIMARY KEY (id),
);

SELECT * FROM departments INNER JOIN employee ON role_id = departments.id INNER JOIN role ON department_id = employee.id;

INSERT INTO departments (department) VALUES ('Engineering');
INSERT INTO role (title, salary, department_id) VALUES ('Software Developer', '150000', '1');
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Anthony', 'Parrino', '1');

INSERT INTO departments (department) VALUES ('Arts');
INSERT INTO role (title, salary, department_id) VALUES ('Artist', '180000', '2');
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Morgan', 'Danton', '2');

INSERT INTO departments (department) VALUES ('Restaurant');
INSERT INTO role (title, salary, department_id) VALUES ('Chief', '1000000', '3');
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Gordon', 'Ramsey', '3');

INSERT INTO departments (department) VALUES ('Entertainment');
INSERT INTO role (title, salary, department_id) VALUES ('Singer', '200', '4');
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Chad', 'Kroeger', '4');

INSERT INTO departments (department) VALUES ('Sales');
INSERT INTO role (title, salary, department_id) VALUES ('Saleman', '1000000000', '5');
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Steve', 'Jobs', '5');