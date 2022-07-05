/**In this file we must create the functions to
 * 
 * Import the db.js file from the model folder
 *  in order to access the database
 * 
 * 
 * Read all users
 * Read a single user in more detail
 * Create a user
 * Update an existing user's info
 * Delete a user
 * 
 */

let db = require('../model/db');

//bring in the argon2 encryption password hash library
let argon = require('argon2');

//bring in the jwt library to use JSON Web Tokens
let jwt = require('jsonwebtoken');

/**Create the logic to create a new user
 * Take the json body from the user input
 * check if the user input scenarios are valid
 * run a sql statement to the server to insert a new user
 * put the user provided info into the sql variables, in the sql statement
 */
const createUser = (req, res) =>{
  let sql = "INSERT INTO crudUsers (first_name, last_name, county, employed, salary) VALUES(?, ?, ?, ?, ?);";

  //take in the first name in variable firstN
  //take in last name in variable lastN
  //take in county in variable county
  //take in employed boolean in variable employed
  //take in salary in variable salary

  let firstN = req.body.first_name;
  let lastN = req.body.last_name;
  let county = req.body.county;
  let employed = req.body.employed;
  let salary = req.body.salary;
  
  //set firstN, lastN, and county as required inputs
  if(!firstN){
    res.status(400).send("first_name is required");
    return;
  };
  if(!lastN){
    res.status(400).send("last_name is required");
    return;
  };
  if(!county){
    res.status(400).send("county is required");
    return;
  };
  
  let employedBoolean;

  //convert employed true/false boolean into 0/1 boolean for mysql
  if(employed == true){
    employedBoolean = 1;
  } else if(employed == false){
    employedBoolean = 0;
  };

  //set the params for the db query to utilize in the sql statement variables
  let params = [firstN, lastN, county, employedBoolean, salary];

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("Could not create new user", err);
    } else {
      console.log("New user created");
      res.sendStatus(201);
    };
  })
};

/**Create the logic to Read all users
 * check if the user input scenarios are valid
 * run a sql statement to the server to select(read) all users
 */
const getUsers = function(req, res){
  let sql = "select id, county, first_name, last_name from crudUsers;";

  //access the db using the sql query and create a 
  //callback function to handle the error and results
  db.query(sql, (err, results)=>{
    if(err){
      console.log("could not get users ", err);
      res.sendStatus(500);
    } else {
      console.log("accessed users ");
      res.json(results);
    };
  })
};

/**Create the logic to Read one user
 * check if the user input id, and scenarios are valid
 * run a sql statement to the server to select(read) one user
 * with more details
 * expect path /users/:id
 */
const getOneUser = (req, res)=>{
  let sql = "SELECT id, first_name, last_name, county, employed, salary FROM crudUsers WHERE id = ?;";

  let id = req.params.id;
  let params = [id];

  if(!id){
    res.sendStatus(404);
    return;
  }
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("Cound not issue query to database", err);
      res.sendStatus(500);
    } else {
      if(results.length < 1){
        res.sendStatus(404);
        return;
      } else if (results.length > 1){
        res.sendStatus(500);
        return;
      }
      res.send(results[0]);
    }
  });
};

/**Create the logic to update a user
 * Take the json body from the user input
 * check if the user input scenarios are valid
 * run a sql statement to the server to update an existing user by id number
 * put the user provided info into the sql variables, in the sql statement
 */
const updateUser = (req, res) =>{
  let id = req.params.id;
  if(!id){
    res.sendStatus(404);
    return;
  }
  
  //take in user json body input for updating their information
  let firstN = req.body.first_name;
  let lastN = req.body.last_name;
  let county = req.body.county;
  let employed = req.body.employed;
  let salary = req.body.salary;
  let employedBoolean;

  //set the employed boolean up for the sql statement
  if(employed == true){
    employedBoolean = 1;
  } else if(employed == false){
    employedBoolean = 0;
  };

  //set the parameters for the sql variables
  let params = [firstN, lastN, county, employedBoolean, salary, id];

  //set up the sql statement for updating the user's info
  let sql = "UPDATE crudUsers SET first_name = ?, last_name = ?, county = ?, employed = ?, salary = ? WHERE id = ?;";
  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("could not issue query to database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

/**Create the logic to delete a user
 * check if the user input scenarios are valid
 * run a sql statement to the server to delete a user by id number
 */
const deleteUser = (req, res)=>{
  let id = req.params.id;
  //set id as a requirement failsafe at the beginning
  if(!id){
    res.sendStatus(404);
    return;
  }

  //set params variable for the sequal statement to use
  let params = [id];

  let sql = "DELETE FROM crudUsers WHERE id = ?;";

  db.query(sql, params, (err, results)=>{
    if(err){
      console.log("Could not issue query to database ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

/**Create a function that will get the count of all of the users in the crudUser table,
 * and return the number of users grouped by county
 * this function can run without any id's, or JWT's, and does not take any * * user input
 */
const getCount = (req, res) => {
  let sql = "SELECT count(id), county from crudUsers group by county;";

  db.query(sql, (err, results)=>{
    if(err){
      console.log("Could not issue query to database ", err);
      res.sendStatus(500);
    } else {
      res.send(results);
    }
  })
};

/**Create a function that will register a user in the database
 * It should take in an email,
 * register a unique email address,
 * take in a password from the user
 * take in the minimum necessary information to create a new user for the app
 * store the hash of the password in the database, in their row
 */

/**Create a function that will log a user into the app, and return a JWT to them
 * It should take in their input for their email address,
 * take in their password
 * compare their password hash that is in the database, 
 * to the hash of the password that they are trying to use to login.
 * Throw a 400 error if the password comparison failed (returns false).
 * Return a JWT if the comparison returns true
 */

/**Create a function that will take a users id, and their JWT and return their personal info
 * it should 
 */

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  getCount,
}

 
  
  
  
  //register,
  //login,
  //getPersonal