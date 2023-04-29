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
    
  
function askQuestion() {      
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do? ",
            name: "selectedQuery",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee's role",
                "quit",
            ]    
        })
        .then((answer) => {
            let {selectedQuery} = answer;
            switch (selectedQuery){
                case "view all departments":
                    showAllDepartments();
                    break;
                case "view all roles":
                    showAllRoles();
                    break;
                case "view all employees":
                    showAllEmployees();
                    break;
                case "add a department":
                    addADepartment();
                    break;
                case "quit":
                    db.end();
            }
            
        })
        .catch((error) => {
            console.log(error);
            console.log("Sorry! Something went wrong!")
        })
}

function showAllDepartments(){
    const queryTxt = 'SELECT * FROM department';
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.table('department',rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}

function showAllRoles(){
    const queryTxt = `SELECT role.id, role.title, department.name as department_name, role.salary
                   FROM role
                   INNER JOIN department 
                   ON role.department_id = department.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.table('role', rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}

function showAllEmployees(){
    const queryTxt = `SELECT employee.first_name, employee.last_name, role.title, 
                      concat(manager.first_name, ' ', manager.last_name) AS manager_name
                      FROM employee AS employee
                      INNER JOIN role ON employee.role_id = role.id
                      lEFT JOIN employee AS manager ON employee.id = manager.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.table('employee', rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}
//------------------------------------------------ Add a Department ----------------------------------------------------
function addADepartment(){
    const departmentQuestion = [{
        type: "input",
        message: "What is the name of new department? (write quit if you have given up) ",
        name: "departmentName",
    }]
    inquirer
        .prompt(departmentQuestion)
        .then((answer) => {
            if(answer === "quit"){
                askQuestion();
                return; 
            }
            let  {departmentName}= answer;
            const queryTxt = `INSERT INTO department(name)
                              VALUES (?)`;
            db.promise().query(queryTxt, [departmentName])
                .then(([rows, fields]) =>{
                    console.log(`New department of ${departmentName} is added.`)
                    askQuestion();
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch((error) => {
            console.log(error);
            console.log("Sorry! Something went wrong!")
        })
}

//------------------------------------------------ Add a Role ----------------------------------------------------



askQuestion();
