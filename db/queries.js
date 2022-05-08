const mysql = require("mysql2");
const cTable = require("console.table");

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
      `CREATE TABLE IF NOT EXISTS department (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30));`
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS role (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL, department_id INT REFERENCES department(id));`
    );
    connection.query(
      `CREATE TABLE IF NOT EXISTS employee (id INT PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT REFERENCES role(id), manager_id INT);`
    );
  }

  //Next few methods display data from tables
  viewDepartments() {
    connection.query(`SELECT * FROM department;`, function (err, results) {
      console.clear();
      console.log("Departments: ");
      console.table(results);
      console.log("Press any key to continue...");
    });
  }
  viewRoles() {
    connection.query(`SELECT * FROM role;`, function (err, results) {
      console.clear();
      console.log("Roles: ");
      console.table(results);
      console.log("Press any key to continue...");
    });
  }
  viewEmployees() {
    connection.query(`SELECT * FROM employee;`, function (err, results) {
      console.clear();
      console.log("Employees: ");
      console.table(results);
      console.log("Press any key to continue...");
    });
  }

  //Get a formatted array for use in prompts
  getDepartmentArray() {
    let departmentArray = [];
    connection.query(
      `SELECT * FROM department;`,
      async function (err, results) {
        results.map((department) =>
          departmentArray.push(department.id + ": " + department.name)
        );
      }
    );
    return departmentArray;
  }
  getRoleArray() {
    let roleArray = [];
    connection.query(`SELECT * FROM role;`, async function (err, results) {
      results.map((role) => roleArray.push(role.id + ": " + role.title));
    });
    return roleArray;
  }
  getBossArray() {
      let bossArray = [];
      connection.query(`SELECT * FROM employee WHERE role_id = 1`, async function (err, results) {
          results.map((manager) => bossArray.push(manager.id + ": " + manager.first_name + " " + manager.last_name));
      });
      return bossArray;
  }
  getEmployeeArray(){
    let empArray = [];
    connection.query(`SELECT * FROM employee`, async function (err, results) {
        results.map((employee) => empArray.push(employee.id + ": " + employee.first_name + " " + employee.last_name));
    });
    return empArray;
  }

  //Create new entries in the database
  createDepartment(name) {
    connection.query(`INSERT INTO department (name) VALUES ('${name}');`);
    this.viewDepartments();
  }
  createRole(title, salary, department_id) {
    connection.query(
      `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id});`
    );
    this.viewRoles();
  }
  createEmployee(first, last, role, manager) {
    connection.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first}', '${last}', ${role}, ${manager});`
    );
    this.viewEmployees();
  }

  //Updates an employee's role
  updateEmployee(id, role) {
    connection.query(`UPDATE employee SET role_id = ${role} WHERE id = ${id}`);
    this.viewEmployees();
  }

  //Seeds default info into the database
  seed() {
    connection.query(`INSERT INTO department VALUES (1, 'engineering');`);
    connection.query(`INSERT INTO role VALUES (1, 'manager', 75000, 1);`);
    connection.query(
      `INSERT INTO employee VALUES (1, 'The', 'Boss', 1, null);`
    );
  }
}

module.exports = sql;
