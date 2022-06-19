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
  db.query(sql, params, (err, results)=>{
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

const login = async (req, res) =>{
  console.log('login');
  //hold their input email and use it for the find/filter criteria for the db query
  let email = req.body.email;
  //hold their input password for comparison
  let password = req.body.password;  
  //create a variable dbPWHash to hold the password hash found by the db query
  let dbPWHash;
  //set param for email for finding the password hash in the database for comparison
  let params = [email];
  //set sql statement to find the password hash for the corresponding email
  let sql = "SELECT pw_hash FROM usersWithPasswords WHERE email = ?;";
  db.query(sql, params, async (err, results)=>{
    if(err){
      res.sendStatus(500);
    } else {
      if(results.length > 1){
        console.log("returned more than 1 result");
        res.sendStatus(500);
        return;
      } else if(results.length < 1){
        res.sendStatus(404);
      } else {
        dbPWHash = results[0].pw_hash;
      }
    }
    //still in query compare pw-hashes
    if(await argon.verify(dbPWHash, password)){
      res.sendStatus(200);
    } else {
      console.log("password couldn't be verified");
      res.sendStatus(400);
    }
  });
};


module.exports = {
  register,
  login
}