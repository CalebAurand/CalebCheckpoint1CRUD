-- create the table of users
-- input test users
-- occuoation
-- grades
-- salary
-- phone
-- taxes,etc


CREATE TABLE crudUsers 
(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
first_name VARCHAR(50) NOT NULL, 
last_name VARCHAR(50) NOT NULL, 
county VARCHAR(40) NOT NULL,
employed BOOLEAN, 
salary INT
);



-- find all users first name, last name, and county
SELECT county, first_name, last_name FROM crudUsers;

-- get one user by id and show all their info except id
SELECT first_name, last_name, county, employed, salary FROM crudUsers WHERE id = ?;

-- update a users info, name, employed, salary, county
UPDATE crudUsers SET first_name = ?, last_name = ?, county = ?, employed = ?, salary = ? WHERE id = ?;

-- create a new user in the table
INSERT INTO crudUsers (first_name, last_name, county, employed, salary) VALUES(?, ?, ?, ?, ?);

-- delete a user from the table 
DELETE FROM crudUsers WHERE id = ?;


-- testing user info --
INSERT INTO crudUsers
(first_name, last_name, county, employed, salary)
VALUES 
  ("Art","Venere", "New York", 0, null),
  ("Lenna","Paprocki", "Albequerqe", 1, 50000),
  ("Donette","Foller", "Ellis", 1, 30000),
  ("Simona","Morasca", "Brighton", 0, null),
  ("Mitsue","Tollner", "Dallas", 1, 45000),
  ("Leota","Dilliard", "Philly", 0, null),
  ("Sage","Wieser", "Palm Dale", 1, 60000),
  ("Kris","Marrier", "Boston", 1, 75000),
  ("Minna","Amigon", "Susquehanna", 1, 49000),
  ("Abel","Maclead", "Maricopa", 1, 32000),
  ("Kiley","Caldarera", "Fort Hood", 1, 56000),
  ("Graciela","Ruta", "Salt Lake", 1, 39000),
  ("Cammy","Albares", "Red Rock", 0, null),
  ("Mattie","Poquette", "Mt Everett", 1, 81000),
  ("Meaghan","Garufi", "D.C.", 1, 66000);