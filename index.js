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
            message: "What would you like to do? (select 'quit' to stop the application) ",
            name: "selectedQuery",
            choices: [
                "add a department",
                "add a role",
                "add an employee",
                "update an employee's role",
                "update an employee's manager",
                "delete an employee",
                "view all departments",
                "view all roles",
                "view all employees",
                "view the total utilized budget for each department",
                "view the total utilized budget of a specific department",
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
                case "update an employee's manager":
                    updateEmployeeManager();
                    break;
                case "delete an employee":
                    deleteAnEmployee();
                    break;
                case "view the total utilized budget for each department":
                    viewBugetPerDepartment();
                    break; 
                case "view the total utilized budget of a specific department":
                    viewBudgetOfADepartment();
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
    const queryTxt = `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
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
// ----------------------------------------------- validate ------------------------------------------------------------
//This function checks if user has entered ehe data or not
function validateInput(input){
    if(input.length === 0){
        console.log("No data is entered!");
        return false;
    }
    return true;
}
//------------------------------------------------ Add a Department ----------------------------------------------------
function addADepartment(){
    const departmentQuestion = [{
        type: "input",
        message: "What is the name of new department? ",
        name: "departmentName",
        validate: validateInput
    }]
    inquirer
        .prompt(departmentQuestion)
        .then((answer) => {
            let  {departmentName}= answer;
            const queryTxt = `INSERT INTO department(name)
                              VALUES (?)`;
            db.promise().query(queryTxt, [departmentName])
                .then(([rows, fields]) =>{
                    console.log(`\n* New department of "${departmentName}" is added.`);
                    showAllDepartments();
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch((error) => {
            console.log(error);
            console.log("Sorry! Something went wrong!");
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
                message: "What is the name of the role? ",
                name: "title",
                validate: validateInput
            },
            {
                type: "input",
                message: "What is the salary of the role? ",
                name: "salary",
                validate: validateInput
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
                        console.log(`\n* New role of "${title}" is added.`);
                        showAllRoles();
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
                    managerNameArr.push("NO MANAGER")
                    employeeQuestion = [{
                        type: "input",
                        message: "What is the employee's first name? ",
                        name: "firstName",
                        validate: validateInput
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name? ",
                        name: "lastName",
                        validate: validateInput
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
                        let  {firstName, lastName, roleTitle, managerName}= answer;
                        let roleId, managerId; 
                        for(let i=0; i<role.length; i++){
                            if (role[i].title == roleTitle){
                                roleId = role[i].id;
                            }
                        };
                        let queryTxt;
                        let queryParameters;
                        if(managerName !== "NO MANAGER"){
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
                                console.log(`\n* New employee of "${firstName} ${lastName}" is added.`);
                                showAllEmployees();
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
                                showAllEmployees();
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
//------------------------------------------- view budget per department -----------------------------------------------------------
function viewBugetPerDepartment(){
    const queryTxt = `SELECT department.name AS department_name, budget_per_department.budget
                      FROM department,
                      (SELECT role.department_id , sum(role.salary) AS budget
                        FROM employee AS employee
                        INNER JOIN role ON employee.role_id = role.id
                        group by department_id) AS budget_per_department
                      where budget_per_department.department_id = department.id`;
    db.promise().query(queryTxt)
        .then(([rows, fields]) =>{
            console.log("\n");
            console.table('budget of each department',rows);
            askQuestion();
        })
        .catch(err=>{
            console.log(err);
        })
}
//--------------------------------- View the Budget of a Specific Department -----------------------------------
function viewBudgetOfADepartment(){
    let manager;
    let departmentNameArr;
    let budgetQuestion = [];
    db.promise().query(`SELECT * FROM department`)
        .then(([rows, fields]) =>{
            department = rows;
            departmentNameArr = department.map(item => item.name);
            budgetQuestion = [{
                type: "list",
                message: "Choose A Department: ",
                name: "departmentName",
                choices: departmentNameArr
            }]
            
            inquirer
            .prompt(budgetQuestion)
            .then((answer) => {
                let  {departmentName}= answer;
                let departmentId 
                for(let i=0; i<department.length; i++){
                    if (department[i].name == departmentName){
                        departmentId = department[i].id;
                    }
                };
                const queryTxt = `SELECT budget_per_department.budget
                                  FROM department,
                                  (SELECT role.department_id , sum(role.salary) AS budget
                                    FROM employee AS employee
                                    INNER JOIN role ON employee.role_id = role.id
                                    where role.department_id = ?) AS budget_per_department
                                   where budget_per_department.department_id = department.id`;
                db.promise().query(queryTxt, [departmentId])
                    .then(([rows, fields]) =>{
                        console.log("\n");
                        console.table(`budget of ${departmentName} department`,rows);
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
//------------------------------------------------ Update an Employee's Manager ----------------------------------------------------
function updateEmployeeManager(){
    let manager, employee;
    let managerNameArr, employeeNameArr;
    let managerQuestion = [], employeeQuestion = [];
    db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS employee_name FROM employee`)
        .then(([employeeRows, employeeFields]) =>{
            employee = employeeRows;
            employeeNameArr = employee.map(item => item.employee_name);
            employeeQuestion = [{
                type: "list",
                message: "Which employee's manager do you want to update? ",
                name: "employeeName",
                choices: employeeNameArr
            }]
            inquirer
                .prompt(employeeQuestion)
                .then((answer) => {
                    let  {employeeName}= answer;
                    let employeeId; 
                    for(let i=0; i<employee.length; i++){
                        if (employee[i].employee_name == employeeName){     
                            employeeId = employee[i].id;
                            
                        }
                    };
                    //The selected employee above should be filtered from the list of managers
                    db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS manager_name FROM employee where id <> ?`, [employeeId])
                        .then(([managerRows, managerFields]) =>{
                            manager = managerRows;
                            managerNameArr = manager.map(item => item.manager_name);
                            /*This option is added because an employee could be the a top managerial post of the company.
                            In this case we set null as the id of manager*/
                            managerNameArr.push("NO MANAGER")
                            managerQuestion = [{
                                type: "list",
                                message: "Select the new manager: ",
                                name: "managerName",
                                choices: managerNameArr
                            }]
                            inquirer
                                .prompt(managerQuestion)
                                .then((answer) => {
                                        let {managerName}= answer;
                                    let managerId; 
                                    if(managerName !== "NO MANAGER"){
                                        for(let i=0; i<manager.length; i++){
                                            if (manager[i].manager_name == managerName){
                                                managerId = manager[i].id;
                                            }
                                        };
                                        queryTxt = `Update employee
                                                    SET manager_id=?
                                                    WHERE id=?`;
                                        queryParameters = [managerId, employeeId];
                                    }
                                    else{
                                        queryTxt = `Update employee
                                                    SET manager_id=NULL
                                                    WHERE id=?`;
                                        queryParameters = [employeeId];
                                    }
                                    db.promise().query(queryTxt, queryParameters)
                                        .then(([rows, fields]) =>{
                                            if(managerName !== "NO MANAGER"){
                                                console.log(`\n* Since now, the manager of "${employeeName}" is "${managerName}".\n`);
                                            }
                                            else{
                                                console.log(`\n* Since now, "${employeeName}" has no manager.\n`);
                                            }
                                            showAllEmployees();
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
                .catch((error) => {
                    console.log(error);
                    console.log("Sorry! Something went wrong!")
                })
        })
        .catch(err=>{
            console.log(err);
        })
}
//------------------------------------------------ Delete an Employee --------------------------------------------------------
function deleteAnEmployee(){
    let employee;
    let employeeNameArr;
    let employeeQuestion = [];
    db.promise().query(`SELECT id, concat(first_name, ' ', last_name) AS employee_name FROM employee`)
        .then(([employeeRows, employeeFields]) =>{
            employee = employeeRows;
            employeeNameArr = employee.map(item => item.employee_name);
            employeeQuestion = [{
                type: "list",
                message: "Which employee do you want to delete? (WARNING! If the chosen employee is a manager, another manager should be chosen for their employees.) ",
                name: "employeeName",
                choices: employeeNameArr
            }]
            inquirer
                .prompt(employeeQuestion)
                .then((answer) => {
                    let  {employeeName}= answer;
                    let employeeId; 
                    for(let i=0; i<employee.length; i++){
                        if (employee[i].employee_name == employeeName){     
                            employeeId = employee[i].id;
                            
                        }
                    };
                    db.promise().query(`DELETE FROM employee where id = ?`, [employeeId])
                        .then(([rows, fields]) =>{
                            console.log(`\n* "${employeeName}" is deleted from the list of employees.`);
                            showAllEmployees();
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


//-------------------------------------------------------- Init --------------------------------------------------------------------------

function init(){
    console.log(`
 _____________________________________________________________________________________________________________
|                                                                                                             |
|   ______                    _                               _______                _                        |            
|  |  ____|                  | |                             |__   __|              | |                       |
|  | |__    ____ ____  _ __  | |  ___   _   _   ___   ___       | | _ __  __ _  ___ | | _   ___   _ __        |
|  |  __|  |  _ ' _  || '_ \\ | | / _ \\ | | | | / _ \\ / _ \\      | || '__// _  |/ __ | |/ / / _ \\ | '__|       |
|  | |____ | | | | | || |_) || || (_) || |_| ||  __/|  __/      | || |  | (_| |(___ |   < |  __/ | |          |
|  |______||_| |_| |_|| .__/ |_| \\___/  \\__, | \\___| \\___|      |_||_|   \\__,_|\\___ |_|\\_\\ \\___| |_|          | 
|                     | |                __/ |                                                                |
|                     |_|               |___/                                                                 |
|                                                                                                             |
|_____________________________________________________________________________________________________________|                                 
    `);
    console.log("\nWELCOME TO EMPLOYEE TRACKER APPLICATION!")
    askQuestion();
}
init();
