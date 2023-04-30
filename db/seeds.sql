INSERT INTO department(name)
VALUES ("research"),
       ("design"),
       ("development"),
       ("HR"),
       ("company board");


INSERT INTO role(title, salary, department_id)
VALUES ("research director", 100000, 1),
       ("enginner", 80000, 1),
       ("senior engineer", 90000, 1),
       ("database director", 120000, 2),
       ("database designer", 110000, 2),
       ("data scientist", 100000, 2),
       ("delevopment director", 130000, 3),
       ("back-end developper",120000, 3),
       ("front-end developper", 90000, 3),
       ("HR director", 90000, 4),
       ("HR assistant", 70000, 4),
       ("chairman of the board",200000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Sara", "Roberts", 12, NULL),
       ("David", "Moore", 1, 1),
       ("John", "Cruz", 2, 2),     
       ("Rebecca", "Hanks", 3, 2),
       ("Anna", "Stewart", 4, 1),
       ("Tom", "Smith", 5, 5),
       ("samuel","Blunt", 6, 5),
       ("James", "Davis",7, 1),
       ("Julia", "Cooper", 8, 8),
       ("Judie", "Tracy", 9, 8),
       ("Scarlett", "Adams", 10, 1),
       ("Emma", "Kidman", 11, 11);
       

