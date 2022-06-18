let express = require('express');
let controller = require('../controls/userControls')
let route = new express.Router();

route.post("/register", controller.register);

module.exports = route;