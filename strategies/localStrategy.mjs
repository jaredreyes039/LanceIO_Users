import passport from 'passport';
import { Strategy } from 'passport-local';
import * as db from "../db/index.mjs"

export default passport.use(
	new Strategy(async (username, password, done) => {
		try {
			console.log("test")
			var query = await db.query('SELECT * FROM users WHERE username=$1', [username])
			if (query.rows.length === 0) {
				throw new Error("Invalid Credentials");
			}
			done(null, query.rows[0])
		}
		catch (err) {
			done(err, null);
		}
	})
)
