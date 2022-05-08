const dotenv = require("dotenv").config();
const sql = require("./db/queries");
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = new sql();
console.log("test");
db.establishConnection();
db.create();

let depChoices = []
depChoices = db.getDepartmentArray();

let roleChoice = [];
roleChoice = db.getRoleArray();

let bossChoice = [];
bossChoice = db.getBossArray();

let empList = [];
empList = db.getEmployeeArray();

//db.seed();

async function inquirerLoop() {
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
          console.clear();
          inquirer
            .prompt([
              {
                name: "depName",
                type: "input",
                message: "What is the name of your department?",
              },
            ])
            .then((answers) => {
              db.createDepartment(answers.depName);
              depChoices = db.getDepartmentArray();
              inquirerLoop();
            });
          break;
        case "Create Role":
          console.clear();
          inquirer
            .prompt([
              {
                name: "roleTitle",
                type: "input",
                message: "What is the title of your role?",
              },
              {
                name: "roleSalary",
                type: "number",
                message: "What is the salary for this role?",
              },
              {
                name: "roleDep",
                type: "list",
                message: "Which department does this role work in?",
                choices: depChoices,
              },
            ])
            .then((answers) => {
                const deptID = answers.roleDep.substring(0,1);
                console.log(deptID);
            db.createRole(answers.roleTitle, answers.roleSalary, deptID);
            roleChoice = db.getRoleArray();
              inquirerLoop();
            });

          break;
        case "Create Employee":
          inquirer.prompt([
              {
                  name: "fName",
                  type: 'input',
                  message: 'What is the employees first name?'
              },
              {
                  name: 'lName',
                  type: 'input',
                  message: 'What is the employees last name?'
              },
              {
                  name: 'empRole',
                  type: 'list',
                  choices: roleChoice,
                  message: 'What role is the employee in?',
              },
              {
                  name: 'empManager',
                  type: 'list',
                  choices: [...bossChoice, "None"],
                  message: "who is the employees boss?"
              }
          ]).then((answers) => {
              const eRole = answers.empRole.substring(0,1);
              let eBoss;
              if(answers.empManager == "None"){
                  eBoss = "null";
              } else {
                  eBoss = answers.empManager.substring(0,1);
              }
              db.createEmployee(answers.fName, answers.lName, eRole, eBoss);
              empList = db.getEmployeeArray();
              bossChoice = db.getBossArray();
              inquirerLoop();
          });
          break;
        case "Update Employee":
          inquirer.prompt([
              {
                  name: "empName",
                  type: "list",
                  choices: empList,
                  message: "Which employee to modify?"
              },
              {
                  name: "empRole",
                  type: "list",
                  choices: roleChoice,
                  message: "Which role for this employee?"
              }
          ]).then((answers) => {
              empID = answers.empName.substring(0,1);
              empRole = answers.empRole.substring(0,1);
              db.updateEmployee(empID, empRole);
              bossChoice = db.getBossArray();
              inquirerLoop();
          })
          break;
        case "Exit":
          console.log("Exiting program.");
          process.exit();
          break;
      }
    });
}

inquirerLoop();
