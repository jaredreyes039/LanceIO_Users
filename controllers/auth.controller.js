const { initSqlConnection } = require("../config/database.config")
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('njwt');
const { tokenVerificationWrapper } = require("../middleware/auth.middleware");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

async function checkUserExists(email) {
	let foundUser = await User.find({ user_email: email })
	if (foundUser.length > 0) {
		return true;
	}
	else {
		return false;
	}
}

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

exports.authRegistrationHandler = async (req, res) => {
	let { username, password, email } = req.body
	if (checkUserExists(email)) {
		return res.status(400).send({ error: "User already exists, please log in with your username and password." })
	}
	let encryptedPassword = encryptPassword(password); i
	let user_id = uuid.v4();
	const token = createJWT(user_id, email);
	try {
		// TODO: TRANSIOTION TO SQL(?)
		const registeredUser = await User.create({
			_id: user_id,
			user_name: username,
			user_email: email,
			user_pass: encryptedPassword,
			token: token.compact()
		});
		await registeredUser.save();
		res.status(200).send({ token: token.compact(), message: "User registered!", success: true });
	}
	catch (err) {
		return res.status(501).send({ error: "Something went wrong." })
	}
}


exports.authLoginHandler = async (req, res) => {
	let { email, password } = req.body
	try {
		if (!email.length > 0 || !password.length > 0) {
			return res.status(403).send({ message: "Must enter valid email and password." })
		}
		// TODO: CAN BE DONE IN SANITIZATION
		email = email.toLowerCase()
		const foundUser = await User.find({ user_email: email })
		if (foundUser.length > 0) {
			// TODO: MOVE TO SEPARATE VALIDATION FUNCTION
			bcrypt.compare(password, foundUser[0].user_pass, async (err, resultPass) => {
				if (err) throw err;
				if (resultPass) {
					// TODO: MOVE TO VALIDATION FUNCTION
					const claims = { iss: 'lanceio', sub: foundUser[0]._id }
					const token = jwt.create(claims, process.env.JWT_SECRET)
					token.setExpiration(new Date().getTime() + 60 * 60 * 10000)
					try {
						const updateUserToken = await User.findOneAndUpdate(
							{ _id: foundUser[0]._id },
							{ $set: { token: token.compact() } }
						)
						if (updateUserToken) {
							res.status(200).send({ message: "User logged in.", token: token.compact(), user_id: foundUser[0]._id, user: foundUser[0].user_name })
						}
						else {
							res.status(501).send({ message: "Failed to update user token, try logging in again later." })
						}
					}
					catch (err) {
						res.status(501).send({ message: "Failed to update user token, try logging in later." })
					}
				}
				else {
					return res.status(401).send({ message: "Password is incorrect." })
				}
			})
		}
		else {
			return res.status(403).send({ message: "User not found" })
		}
	}
	catch (err) {
		res.status(501).send({ message: "Internal server error, please try again later." });
	}
}


exports.logoutHandler = async (req, res) => {
	const { email, token } = req.body
	tokenVerificationWrapper(req, res, async () => {
		try {
			let updatedUser = await User.findOneAndUpdate({ user_email: email }, { $set: { token: "" } })
			if (updatedUser) {
				res.status(200).send({ message: "User successfully logged out!", success: true })
			}
			else {
				res.status(400).send({ message: "Failed to log out user, please try again later." })
			}
		}
		catch (err) {
			res.status(400).send({ message: "Failed to log out user, please try again later." })
		}
	}, token)
}
