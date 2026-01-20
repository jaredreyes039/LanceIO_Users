const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { AUTH } = require('./routes/auth.route.js')

const APP = express()
APP.use(session({
	secret: "tempt.turtle.dictator.spectre",
	resave: false,
	saveUninitialized: false,
}));
const PORT = 5000

dotenv.config();

// Environment-specific origins
const allowedOrigins = [
	'http://localhost:3000',  // Development
];

const corsOptions = {
	origin: function(origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
};

APP.use(cors(corsOptions));
APP.use(bodyParser.json());
APP.use(passport.initialize());
APP.use(passport.session());


APP.use('/auth', AUTH)

APP.listen(process.env.PORT || PORT, () => {

	console.log(`User service listening on Port ${PORT}`)
}
)
