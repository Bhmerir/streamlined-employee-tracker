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
    
// [
//     "view all departments",
//     "view all roles",
//     "view all employees",
//     "add a department",
//     "add a role",
//     "add an employee",
//     "update an employee's role",
//     "quit"
// ]    
function askQuestion() {      
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do? ",
            name: "selectedQuery",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees","add a department",
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
    const queryTxt = 'select * from department';
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
    const queryTxt = `select role.id, role.title, department.name as department_name, role.salary
                   from role
                   inner join department 
                   on role.department_id = department.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.table('role', rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}


askQuestion();
