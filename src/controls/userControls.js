let db = require('../model/db');
let argon = require('argon2');
/**Create a function that will register a user in the database
 * It should take in an email,
 * register a unique email address,
 * take in a password from the user
 * take in the minimum necessary information to create a new user for the app
 * store the hash of the password in the database, in their row
 */
const register = async (req, res) =>{
  console.log("register");
  //add a user to the database

  //INSERT INTO usersWithPasswords (first_name, last_name, email, pw_hash) VALUES(?, ?, ?, ?);
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let password = req.body.password;

  //get the hash of the password using argon
  let pwHash = await argon.hash(password);
  let params = [first_name, last_name, email, pwHash];

  let sql = "INSERT INTO usersWithPasswords (first_name, last_name, email, pw_hash) VALUES(?, ?, ?, ?);";

  //run the database query to register/create the new user
  db.query(sql, params, /**middleware here */ (err, results)=>{
    if(err){
      console.log("Could not add user ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
  //what if the email already exists in the database?
  //what if the user doesn't input an email?
  //
};

const login = (req, res) =>{

};


module.exports = {
  register,
  login
}