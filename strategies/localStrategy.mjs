import passport from 'passport';
import { Strategy } from 'passport-local';
import * as db from "../db/index.mjs"
import { decryptPassword, encryptPassword } from '../utils/crypto.util.mjs';


export default passport.use(
	new Strategy(async (username, password, done) => {
		try {
			var query = await db.query('SELECT * FROM users WHERE username=$1', [username]);
			let users = query.rows
			if (users === 0) {
				let err = new Error("Invalid Credentials");
				done(err, null);
			};
			// See crypto.util for info on implementation
			if (!decryptPassword(password, users[0].password)) done('Invalid credentials', null);
			done(null, query.rows[0]);
		}
		catch (err) {
			done(err, null);
		}
	})
)

passport.serializeUser(function(user, done) {
	process.nextTick(function() {
		done(null, { id: user.id, username: user.username });
	});
});

passport.deserializeUser(function(user, done) {
	try {
		process.nextTick(async function() {
			var query = await db.query('SELECT * FROM users WHERE id=$1', [user.id])
			var foundUser = query.rows[0];
			if (!foundUser) throw new Error("User not found");
			done(null, foundUser);
		});
	}
	catch (err) {
		done(err, null);

	}
});

