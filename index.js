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
    
//------------------------------------------- Ask Intial Questions ----------------------------------------------------------- 
function askQuestion() {   
    console.log("\n--------------------------------------------")   
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
                case "add a role":
                    addARole();
                    break;
                case "add an employee":
                    addAnEmployee();
                    break;
                case "update an employee's role":
                    updateEmployeeRole();
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
//------------------------------------------- Show all Departments -----------------------------------------------------------
function showAllDepartments(){
    const queryTxt = 'SELECT * FROM department';
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.log("\n");
            console.table('department',rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}
//------------------------------------------- Show all Roles -----------------------------------------------------------
function showAllRoles(){
    const queryTxt = `SELECT role.id, role.title, department.name as department_name, role.salary
                      FROM role
                      INNER JOIN department 
                      ON role.department_id = department.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.log("\n");
            console.table('role', rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}
//------------------------------------------- Show all Employees -----------------------------------------------------------
function showAllEmployees(){
    const queryTxt = `SELECT employee.first_name, employee.last_name, role.title, 
                      concat(manager.first_name, ' ', manager.last_name) AS manager_name
                      FROM employee AS employee
                      INNER JOIN role ON employee.role_id = role.id
                      lEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.log("\n");
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
                    console.log(`\n* New department of "${departmentName}" is added.`)
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
function addARole(){
    let department;
    let departmentNameArr;
    let roleQuestion = [];
    db.promise().query(`SELECT * FROM department`)
        .then(([rows, fields]) =>{
            department = rows;
            departmentNameArr = department.map(item => item.name);
            roleQuestion = [{
                type: "input",
                message: "What is the name of the role? (write quit if you have given up) ",
                name: "title",
            },
            {
                type: "input",
                message: "What is the salary of the role? (write quit if you have given up) ",
                name: "salary",
            },
            {
                type: "list",
                message: "Which department does the role belong to? ",
                name: "departmentName",
                choices: departmentNameArr
            }]
            
            inquirer
            .prompt(roleQuestion)
            .then((answer) => {
                if(answer === "quit"){
                    askQuestion();
                    return; 
                }
                let  {title, salary, departmentName}= answer;
                let departmentId 
                for(let i=0; i<department.length; i++){
                    if (department[i].name == departmentName){
                        departmentId = department[i].id;
                    }
                };
                const queryTxt = `INSERT INTO role(title, salary, department_id)
                                  VALUES (?, ?, ?)`;
                db.promise().query(queryTxt, [title, salary, departmentId])
                    .then(([rows, fields]) =>{
                        console.log(`\n* New role of "${title}" is added.`)
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
        })
        .catch(err=>{
            console.log(err);
        })
    
}

//------------------------------------------------ Add an Employee ----------------------------------------------------
function addAnEmployee(){
    let role, manager;
    let roleTitleArr, managerNameArr;
    let employeeQuestion = [];
    db.promise().query(`SELECT * FROM role`)
        .then(([roleRows, roleFields]) =>{
            role = roleRows;
            roleTitleArr = role.map(item => item.title);
            db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS manager_name FROM employee`)
                .then(([managerRows, managerFields]) =>{
                    manager = managerRows;
                    managerNameArr = manager.map(item => item.manager_name);
                    managerNameArr.push("No Manager")
                    employeeQuestion = [{
                        type: "input",
                        message: "What is the employee's first name? (write quit if you have given up) ",
                        name: "firstName",
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name? (write quit if you have given up) ",
                        name: "lastName",
                    },
                    {
                        type: "list",
                        message: "Which is the employee's role? ",
                        name: "roleTitle",
                        choices: roleTitleArr
                    },
                    {
                        type: "list",
                        message: "Who is the employee's manager? ",
                        name: "managerName",
                        choices: managerNameArr
                    }]

                    
                    inquirer
                    .prompt(employeeQuestion)
                    .then((answer) => {
                        if(answer === "quit"){
                            askQuestion();
                            return; 
                        }

                        let  {firstName, lastName, roleTitle, managerName}= answer;
                        let roleId, managerId; 
                        for(let i=0; i<role.length; i++){
                            if (role[i].title == roleTitle){
                                roleId = role[i].id;
                            }
                        };
                        let queryTxt;
                        let queryParameters;
                        if(managerName !== "No Manager"){
                            for(let i=0; i<manager.length; i++){
                                if (manager[i].manager_name == managerName){     
                                    managerId = manager[i].id;
                                    
                                }
                            };
                            queryTxt = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`;
                            queryParameters = [firstName, lastName, roleId, managerId];
                        }
                        else{
                            queryTxt = `INSERT INTO employee(first_name, last_name, role_id)
                                        VALUES (?, ?, ?)`;
                            queryParameters = [firstName, lastName, roleId];
                        }
                        db.promise().query(queryTxt, queryParameters)
                            .then(([rows, fields]) =>{
                                console.log(`\n* New employee of "${firstName} ${lastName}" is added.`)
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
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>{
            console.log(err);
        })
    
}
//------------------------------------------------ Update an employee's Role ----------------------------------------------------
function updateEmployeeRole(){
    let role, employee;
    let roleTitleArr, employeeNameArr;
    let employeeQuestion = [];
    db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS employee_name FROM employee`)
        .then(([employeeRows, employeeFields]) =>{
            employee = employeeRows;
            employeeNameArr = employee.map(item => item.employee_name);
            db.promise().query(`SELECT * FROM role`)
                .then(([roleRows, roleFields]) =>{
                    role = roleRows;
                    roleTitleArr = role.map(item => item.title);
                    employeeQuestion = [{
                        type: "list",
                        message: "Which employee's role do you want to update? ",
                        name: "employeeName",
                        choices: employeeNameArr
                    },
                    {
                        type: "list",
                        message: "Which role do you want to assign the selected employee? ",
                        name: "roleTitle",
                        choices: roleTitleArr
                    }]

                    
                    inquirer
                    .prompt(employeeQuestion)
                    .then((answer) => {
                        if(answer === "quit"){
                            askQuestion();
                            return; 
                        }

                        let  {employeeName, roleTitle}= answer;
                        let roleId, employeeId; 
                        for(let i=0; i<role.length; i++){
                            if (role[i].title == roleTitle){
                                roleId = role[i].id;
                            }
                        };
                        for(let i=0; i<employee.length; i++){
                            if (employee[i].employee_name == employeeName){     
                                employeeId = employee[i].id;
                                
                            }
                        };
                        queryTxt = `Update employee
                                    SET role_id=?
                                    WHERE id=?`;
                        queryParameters = [roleId, employeeId];
                        db.promise().query(queryTxt, queryParameters)
                            .then(([rows, fields]) =>{
                                console.log(`\n* The new role of "${roleTitle}" is assigned to "${employeeName}".\n`);
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
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>{
            console.log(err);
        })
    
}


//---------------------------------------------------------------------------------------------------------------------------------------
askQuestion();
