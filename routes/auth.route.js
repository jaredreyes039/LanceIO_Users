const express = require('express');
const ROUTER = express.Router();
const AUTH_CONTROLLER = require('../controllers/auth.controller');

//ROUTER.post('/register', AUTH_CONTROLLER.authRegistrationHandler)
// TODO: Set up catch and param opts for the login and register route(?)
ROUTER.post('/login', AUTH_CONTROLLER.loginHandler)
//ROUTER.post('/logout', AUTH_CONTROLLER.logoutHandler)

exports.AUTH = ROUTER;
