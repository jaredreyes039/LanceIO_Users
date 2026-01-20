const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('njwt');
const { tokenVerificationWrapper } = require("../middleware/auth.middleware");
const sql = require('../config/database.config.js')

// TODO: INTERFACE WITH A LOGGER LIKE MORGAN
// TODO: INTERFACE WITH PROMETHEUS FOR MONITORING
// TODO: TRANSITION TO RELATIONAL DB

async function encryptPassword(pass) {
	const salt = await bcrypt.genSalt(2);
	const hashedPassword = await bcrypt.hash(pass, salt); // Pass the salt  << - ~ - >>	
	return hashedPassword;
}

function createJWT(user_id, email) {
	const claims = { iss: 'LanceIO', sub: user_id, aud: email };
	const token = jwt.create(claims, process.env.JWT_SECRET).setExpiration(new Date().getTime() + (3600 * 1000));
	return token;
}

async function updateJWT(user_id, email, res) {
	const token = createJWT(user_id, email);
	try {
		return token.compact()
	}
	catch (err) {
		return res.status(501).send({ message: "Something went wrong." })
	}
}


