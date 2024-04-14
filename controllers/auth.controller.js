const { initSqlConnection } = require("../config/database.config")
const mssql = require("mssql")
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('njwt');
const { tokenVerificationWrapper } = require("../middleware/auth.middleware");
const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");

exports.authRegistrationHandler = async (req, res) => {

    let { username, password, email } = req.body


    if (username == "" || email == "" || password == "") {
        return res.status(401).send({ error: "Please fill out all fields." })
    }

    try {
        let salt_passkey = await bcrypt.genSalt(12)
        let salt_email = await bcrypt.genSalt(12)

        let hashedEmail = await bcrypt.hash(email, salt_email)
        let hashedPassword = await bcrypt.hash(password, salt_passkey)
        let user_id = uuid.v4();

        const claims = { iss: 'lanceio', sub: user_id }
        const token = jwt.create(claims, process.env.JWT_SECRET)
        token.setExpiration(new Date().getTime() + 60 * 60 * 1000)
        console.log(token.compact())
        try {
            const registeredUser = await User.create({
                _id: user_id,
                user_name: username,
                user_email: hashedEmail,
                user_pass: hashedPassword,
                token: token.compact()
            });
            await registeredUser.save();
            console.log('resgistered')
            res.status(200).send({ token: token.compact(), message: "User registered!" });
        }
        catch (err) {
            console.log(err)
            res.status(500).send({ message: "Internal server error. Registration failed, please try again later." });
        }


    }
    catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Something went wrong." })
    }
}

exports.authLoginHandler = async (req, res) => {

    let { username, password } = req.body
    console.log(username, password)
    try {
        const foundUser = await User.find({ user_name: username })
        if (foundUser.length > 0) {
            bcrypt.compare(password, foundUser[0].user_pass, async (err, resultPass) => {
                if (err) throw err;
                if (resultPass) {
                    const claims = { iss: 'lanceio', sub: foundUser[0]._id }
                    const token = jwt.create(claims, process.env.JWT_SECRET)
                    token.setExpiration(new Date().getTime() + 60 * 60 * 10000)
                    console.log("Token:" + token)
                    try {
                        const updateUserToken = await User.findOneAndUpdate(
                            { _id: foundUser[0]._id },
                            { $set: { token: token.compact() } }
                        )
                        if (updateUserToken) {
                            res.status(200).send({ message: "User logged in.", token: token.compact(), user_id: foundUser[0]._id })
                        }
                        else {
                            res.status(500).send({ message: "Failed to update user token, try logging in again later." })
                        }
                    }
                    catch (err) {
                        console.log(err)
                        res.status(500).send({ message: "Failed to update user token, try logging in later." })
                    }
                }
                else {
                    return res.status(401).send({ error: "Password is incorrect." })
                }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Internal server error, please try again later." });
    }
}

exports.logoutHandler = async (req, res) => {
    const { username, token } = req.body

    tokenVerificationWrapper(req, res, async () => {
        try {
            console.log(username)
            let updatedUser = await User.findOneAndUpdate({ user_name: username }, { $set: { token: "" } })
            if (updatedUser) {
                console.log("success")
                res.status(200).send({ message: "User successfully logged out!", success: true })
            }
            else {
                console.log("failure")
                res.status(400).send({ message: "Failed to log out user, please try again later." })
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: "Failed to log out user, please try again later." })
        }
    }, token)
}
