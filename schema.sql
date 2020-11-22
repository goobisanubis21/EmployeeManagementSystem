/* If database already exsits drop it and overwrite it */
DROP DATABASE IF EXISTS management;

/* Creating and using database */
CREATE DATABASE management;
USE management;

/* New tables with primary keys that auto-increments and ids that refer to other tables */
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  salary INT NOT NULL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);