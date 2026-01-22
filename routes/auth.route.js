import { Router } from "express";
import passport from "passport";
import "../strategies/localStrategy.mjs";

export const AUTH = Router();

//ROUTER.post('/register', AUTH_CONTROLLER.authRegistrationHandler)

AUTH.post('/login', passport.authenticate('local'), (req, res) => {
	return res.sendStatus(200)
})

AUTH.get('/status', (req, res) => {
	if (req.user) return res.send(req.user)
	return res.sendStatus(401);
})

//ROUTER.post('/logout', AUTH_CONTROLLER.logoutHandler)


