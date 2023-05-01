# Streamlined Employee Tracker

## Description 
---

This is a streamlined human resource program which lets the user define the different department of a company, the roles within each department, and also the employees, their role and their supervising managers. The data entry can get updated by the user, and according to the user's request, multiple types of report can be generated. Therefore, it is a beneficial system for doing the HR work.

<br>

The user by applying the program, can do the following:

<br>

1. add a department

2. add a role including its title, its salary, and the department to which it belongs 

3. add an employee including their first name, their last name, the department in which they will be working, and their manager

4. update the role of an employee

5. update the manager of an employee (If the employee is the top managerial post of the company, the option of `'NO MANAGER'` can be chosen.)

6. delete an employee

7. delete a role

8. delete a department

9. view all departments

10. view all roles and the department to which each one of them belongs

11. view all employees, their role titles, and their managers

12. view the total utilized budget for each department

13. view the total utilized budget of a specific department

<br>

## Table of Contents
---

* [Description](#description)

* [Installation](#installation)

* [Usage](#usage)

* [Technology Used](#technology-used)

* [Questions](#questions)

* [Credit](#credit)

* [License](#license)

<br>

## Installation

---

In order to install this application, clone the repository and write the below command in terminal :

`npm i`

Then, execute the `'schema.sql'` file which is inside of the `'db'` folder, in your mySql environment. This file is resposible to create the database and the related tables. In case you are interested to see some example data in each table, you can execute the file of `'seeds.sql'` too. Otherwise you can use the program to add your desired data.

<br>

## Usage

---

To run the program, enter the below command in console, and then follow the instructions:

`node index`

This is a link to a video which instructs the users on how to work with software : 

[Walk-through Video Link](https://drive.google.com/)

<br>

## Technology Used

---

| Technology Used         |
| -------------           |
| JavaScript              |  
| Node.js                 |  
| MySQL2 Module           | 
| Inquirer Module         | 
| console.table Module    |


<br>

## Questions 

---

If you have any additional questions, you can send me an email to :

[My Email Address](mailto:(mer_ir@yahoo.com))

<br>

## Credit

---

Name:     Bahareh Hosseini

Github page:      [https://github.com/Bhmerir](https://github.com/Bhmerir)

<br>

## License

---

MIT License

Copyright (c) 2023 jonnyboy808; CTep09; Bhmerir; osuchaya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

© 2023 Confidential and Proprietary. All Rights Reserved.
