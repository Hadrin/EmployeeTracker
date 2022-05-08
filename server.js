const dotenv = require("dotenv").config();
const sql = require("./db/queries");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = new sql();
console.log("test");
db.establishConnection();
db.create();

function inquirerLoop() {
  inquirer
    .prompt([
      {
        name: "menu",
        type: "list",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Create Department",
          "Create Role",
          "Create Employee",
          "Update Employee",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menu) {
        case "View Departments":
          db.viewDepartments();
          inquirerLoop();
          break;
        case "View Roles":
          db.viewRoles();
          inquirerLoop();
          break;
        case "View Employees":
          db.viewEmployees();
          inquirerLoop();
          break;
        case "Create Department":
          //TODO
          inquirerLoop();
          break;
        case "Create Role":
          //TODO
          inquirerLoop();
          break;
        case "Create Employee":
          //TODO
          inquirerLoop();
          break;
        case "Update Employee":
          //TODO
          inquirerLoop();
          break;
        case "Exit":
          break;
      }
    });
}

inquirerLoop();