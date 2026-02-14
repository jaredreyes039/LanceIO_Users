import { Router } from "express";
import passport from "passport";
import * as db from "../db/index.mjs";
import "../strategies/localStrategy.mjs";
import { checkIfUserExists } from "../utils/verifyUser.util.mjs";
import { encryptPassword } from "../utils/crypto.util.mjs";

export const AUTH = Router();

AUTH.post('/register', async (req, res, next) => {
	let { username, email, password } = req.body;
	if (!username, !password, !email) return res.sendStatus(401).send({ message: "Fuck" });
	if (await checkIfUserExists(username, email)) return res.sendStatus(401);
	try {
		password = await encryptPassword(password)
		let query = await db.query('INSERT INTO users(username, email, password) VALUES ($1,$2,$3)', [username, email, password])
		return res.sendStatus(200)
	}
	catch (err) {
		return res.sendStatus(500)
	}
})

AUTH.post('/login', passport.authenticate('local'), (req, res) => {
	return res.sendStatus(200);
});

AUTH.get('/status', (req, res) => {
	if (req.user) return res.send(req.user)
	return res.sendStatus(401);
})

AUTH.post('/logout', (req, res, next) => {
	if (!req.user) return res.sendStatus(401);
	req.logout(function(err) {
		if (err) return next(err);
		res.sendStatus(200)
	})
})


