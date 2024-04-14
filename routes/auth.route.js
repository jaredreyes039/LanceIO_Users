const express = require('express');
const ROUTER = express.Router();
const AUTH_CONTROLLER = require('../controllers/auth.controller');

ROUTER.post('/register', AUTH_CONTROLLER.authRegistrationHandler)
ROUTER.post('/login', AUTH_CONTROLLER.authLoginHandler)
ROUTER.post('/logout', AUTH_CONTROLLER.logoutHandler)

exports.AUTH = ROUTER;