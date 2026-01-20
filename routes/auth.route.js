import { Router } from "express";
import passport from "passport";
import "../strategies/localStrategy.mjs";

export const AUTH = Router();

//ROUTER.post('/register', AUTH_CONTROLLER.authRegistrationHandler)
AUTH.post('/login', passport.authenticate('local'), (req, res) => {
	console.log(req.body)
	return res.status(400)
})
//ROUTER.post('/logout', AUTH_CONTROLLER.logoutHandler)


