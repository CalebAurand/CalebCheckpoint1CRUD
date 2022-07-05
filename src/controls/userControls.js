let db = require('../model/db');
let argon = require('argon2');
//use jsonwebtoken library to create JWTs
let jwt = require('jsonwebtoken');
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
  let sql = "SELECT id, pw_hash FROM usersWithPasswords WHERE email = ?;";
  db.query(sql, params, async (err, results)=>{
    if(err){
      //if server error send back server error code
      console.log('could not get password hash', err);
      res.sendStatus(500);
      return;
    }
    //if we find more than one result for that email they sent, send back a server error http code
    if(results.length > 1){
      console.log("returned more than 1 result");
      res.sendStatus(500);
      return;
    } 
    //if the user's email is not found send back a bad request code
    if(results.length < 1){
      res.sendStatus(400);
      return;
    }

    //get the user's id to store in the json web token
    let id = results[0].id;

    //store the passwordHash from the sql select statement for verification
    dbPWHash = results[0].pw_hash;

    //define what a good verified password is
    let goodPassword = await argon.verify(dbPWHash, password);

    //define the token to be sent back on a good request
    let token = {
      //include user's email in the token
      "userID": id,
      "email": email,
      //include the website name for the token
      "website_name": "userDBCrudSite"
    };
  
    //still in query compare pw-hashes
    if(goodPassword){
      //if the password is good (truthy) send back a signed json token
      let signedToken = jwt.sign(token, process.env.JWT_SECRET);
      res.send(signedToken);
    } else {
      //if the password is bad (falsy) send back 400 code bad request, but don't give them any other info
      res.sendStatus(400);
    }
  });
};

/**This function takes in a request from a client to get their personal information
 * It takes in their id, email, and json web token to verify their identity, then sends back their personal information
 */
const getPersonal = (req, res) =>{
  console.log("getPersonal");

  //get bearer token value from header authorization key

  //get id of user from jwt
  //*************will need to adjust this to get id from the jwt */
  let id;
  let header = req.get('authorization'); //'Bearer+ space +token'

  //specifically access the token part
  let signedToken;
  if(header){
    let parts = header.split(' ');
    signedToken = parts[1];
  }
  if(signedToken){
    jwt.verify(signedToken, process.env.JWT_SECRET, (err, decoded)=>{
      if(err){
        res.sendStatus(400);
        return;
      }
      if(decoded){
        //grab the id to find the right user, JWT id is stored as key 'userID'
        id = decoded.userID;
      }

    });
  }
  let params = [id];

  //set sql for query
  let sql = "SELECT id, first_name, last_name, county, employed, salary FROM crudUsers WHERE id = ?;";

  //run the db query
  db.query(sql, params, function(err, results){
    if(err){
      console.log("could not query database");
      res.sendStatus(500);
    } else {
      if(results.length > 1){
        res.sendStatus(500);
      } else if(results.length < 1){
        res.sendStatus(400);
      }else{
        res.send(results);
      }
    }
  })
};


module.exports = {
  register,
  login,
  getPersonal
}