const inquirer = require("inquirer");
const mySql = require("mysql2");
const cTable = require("console.table");

const db = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

const questions = [
    {
        type: "list",
        message: "What would you like to do? ",
        name: "seletedQuery",
        options: 
            [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee's role"
            ]
    }
]