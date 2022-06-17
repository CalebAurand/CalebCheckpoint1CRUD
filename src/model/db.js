/**
 * Import mysql
 * 
 * Create the db connection variable to access the database information typically held for each user in their .env file
 * need to program access to the database':
 * >host url:
 * >username:
 * >password:
 * >database name:
 * >port:
 * 
 * Then> run the connection
 * then>> test the connection
 * 
 * then export the database connection using the variable connection
 */

let mysql = require('mysql');

//use the mysql create connection method, to create a connection to the database
// if port is not defined here, then the default will be 3306
//this connection uses the dotenv process.env variable connections
let connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST
});

connection.connect(); //run the connection

//test the connection
connection.query("select now()", function(err, result){
  if(err){
    console.log("Could not connect to database", err);
  } else {
    console.log("connected to database", result);
  };
});

//export the connection
module.exports = connection;

