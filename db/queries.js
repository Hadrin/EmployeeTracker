const mysql = require("mysql2");
const cTable = require('console.table');

let connection;

class sql {
  //Create a connection to our database
  establishConnection() {
    connection = mysql.createConnection({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("Connection established");
  }

  //Create tables if necessary
  create() {
    connection.query(
      `CREATE TABLE IF NOT EXISTS department (id INT, name VARCHAR(30));`
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS role (id INT, title VARCHAR(30), salary DECIMAL, department_id INT REFERENCES department(id));`
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS employee (id INT PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT REFERENCES role(id), manager_id INT);`
    );
  }

  //Next few methods display data from tables
  viewDepartments() {
    connection.query(`SELECT * FROM department;`, function (err, results) {
      console.log(results);
    });
  }
  viewRoles() {
    connection.query(`SELECT * FROM role;`, function (err, results) {
      console.log(results);
    });
  }
  viewEmployees() {
    connection.query(`SELECT * FROM employee;`, function (err, results) {
      console.log(results);
    });
  }

  //Seeds default info into the database
  seed() {
    connection.query(`INSERT INTO department VALUES (1, 'engineering');`);
    connection.query(`INSERT INTO role VALUES (1, 'manager', 75000, 1);`);
    connection.query(`INSERT INTO employee VALUES (1, 'The', 'Boss', 1, null);`);
  }
}

module.exports = sql;
