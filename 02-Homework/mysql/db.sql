
DROP DATABASE IF EXISTS employee_tracker_v2_db;

CREATE DATABASE employee_tracker_v2_db;
USE employee_tracker_v2_db;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE role (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(50),
      salary decimal(10,2),
      department INT,
      PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(50) NULL,
  role_id   INT NOT NULL DEFAULT 0,

  department_id INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)

);
