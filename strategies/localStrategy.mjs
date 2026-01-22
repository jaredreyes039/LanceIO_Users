import passport from 'passport';
import { Strategy } from 'passport-local';
import * as db from "../db/index.mjs"

// USER: {id, username, email, password}

export default passport.use(
	new Strategy(async (username, password, done) => {
		try {
			var query = await db.query('SELECT * FROM users WHERE username=$1 AND password=$2', [username, password]);
			if (query.rows.length === 0) {
				let err = new Error("Invalid Credentials");
				done(err, null);
			};
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
		console.log("Deserialization")
		process.nextTick(async function() {
			var query = await db.query('SELECT * FROM users WHERE id=$1', [user.id])
			var foundUser = query.rows[0];
			if (!foundUser) throw new Error("User not found");
			done(null, foundUser);
		});
	}
	catch (err) {
		console.log("error")
		done(err, null);

	}
});

