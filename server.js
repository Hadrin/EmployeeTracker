const dotenv = require('dotenv').config();
const sql = require('./db/queries');
const mysql = require('mysql2');

const db = new sql
console.log('test');
db.establishConnection();
db.create();
//db.seed();
db.viewDepartments();
db.viewRoles();
db.viewEmployees();
