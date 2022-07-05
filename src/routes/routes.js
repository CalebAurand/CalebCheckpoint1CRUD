/**import express
 * create a new router using the express method
 * import the controller from the controls/controller file
 * use the routes for each specified function or app capability
 * 
 * export the router
 */

const express = require('express');
const router = new express.Router();
const controller = require('../controls/controller');
const userController = require('../controls/userControls');

//get the authorization middleware for use in verifying JWT's
const auth = require('../middleware/auth');
router.get("/users", controller.getUsers);


//create a route to get one user by id if the JWT is for an admin role
router.get("/users/:id", auth.verifyJWT, /*auth.verifyAdmin*/ controller.getOneUser); // check if user is logged in, then admin role

//create a route to update one user's info
router.put("/users/:id", controller.updateUser);

//create a route to create a new user
router.post("/users", controller.createUser);

//create a route to delete a user from the database
router.delete("/users/:id", controller.deleteUser);

//create a route that will display the count of the users, grouped by county, that does not require a JWT to access
router.get("/count", controller.getCount);

//create a registration (/register) route for users to register for the app
// router.post("/register", controller.register);

//create a login route for users to ligin and get a JWT
// router.put("/login", controller.login);

//create a route that will take in the users JWT and give them back their personal info, including their id number
router.get("/personal/:id", auth.verifyJWT, userController.getPersonal);

module.exports = router;