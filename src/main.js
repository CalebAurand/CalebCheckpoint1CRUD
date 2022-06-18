/**Import express
 * import dotenv
 * import bodyparser
 * define which port to use to run locally
 * 
 * access/ use express method, assigned to app variable
 * access/ use the users routes
 * 
 * have app/server listen on specified port
 */

let express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 9000;

//create a new express method for our server, assigned to the app variable
let app = new express();
// tell the app to use the bodyParser.json() method to be able to read json
app.use(bodyParser.json());

//create a variable to access the exported routes for users
let userRoutes = require('./routes/routes');
//tell the app to use these routes for users
app.use(userRoutes);

//tell the app to use the routes for user's registration and login
let pwUserRoutes = require('./routes/usersRoute');
app.use(pwUserRoutes);


app.listen(PORT, function(){
  console.log('server started listening on port ', PORT);
});
