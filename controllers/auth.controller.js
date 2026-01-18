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

async function updateJWT(user_id, email) {
	const token = createJWT(user_id, email);
	try {
		await User.findOneAndUpdate(
			{ _id: foundUser[0]._id },
			{ $set: { token: token.compact() } }
		)

		return res.status(200).send({ message: "User logged in.", token: token.compact(), user_id: foundUser[0]._id, user: foundUser[0].user_name })
	}
	catch (err) {
		return res.status(501).send({ message: "Something went wrong." })
	}
}

// Registration Authentication
exports.authRegistrationHandler = async (req, res) => {
	let { username, password, email } = req.body
	if (checkUserExists(email)) {
		return res.status(400).send({ error: "User already exists, please log in with your username and password." })
	}
	let encryptedPassword = encryptPassword(password); i
	let user_id = uuid.v4();
	const token = createJWT(user_id, email);
	try {
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

// Login Authentication
exports.authLoginHandler = async (req, res) => {
	let { email, password } = req.body
	try {
		const foundUser = await User.find({ user_email: email })
		if (foundUser.length > 0) {
			bcrypt.compare(password, foundUser[0].user_pass, async (err) => {
				if (err) return res.status(503).send({ message: "Invalid credentials." });
				else { await updateJWT() };
			})
		}
		else {
			return res.status(503).send({ message: "User not found." })
		}
	}
	catch (err) {
		console.log(err)
		return res.status(501).send({ message: "Something went wrong." });
	}
}

// Logout Handler
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
