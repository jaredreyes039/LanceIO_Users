import passport from "passport";
import * as db from "../db/index.mjs"
import GoogleOidcStrategy from "passport-google-oidc";

export default passport.use(new GoogleOidcStrategy({
	clientID: "636026188458-rvhj8f4oeltrcvqr4tcmr7qc454077ch.apps.googleusercontent.com",
	clientSecret: "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",
	callbackURL: '/auth/oauth2/redirect/google',
	scope: ['profile']
}, function verify(issuer, profile, cb) {
	db.query('SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2', [
		issuer,
		profile.id
	], function(err, row) {
		if (err) { return cb(err); }
		if (!row) {
			db.query('INSERT INTO users (name) VALUES ($1)', [
				profile.displayName
			], function(err) {
				if (err) { return cb(err); }

				var id = this.lastID;
				db.query('INSERT INTO federated_credentials (user_id, provider, subject) VALUES ($1, $2, $3)', [
					id,
					issuer,
					profile.id
				], function(err) {
					if (err) { return cb(err); }
					var user = {
						id: id,
						name: profile.displayName
					};
					return cb(null, user);
				});
			});
		} else {
			db.query('SELECT * FROM users WHERE id = $1', [row.user_id], function(err, row) {
				if (err) { return cb(err); }
				if (!row) { return cb(null, false); }
				return cb(null, row);
			});
		}
	});
}));
