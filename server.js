const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { AUTH } = require('./routes/auth.route');
const cors = require('cors');

const APP = express()
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

APP.use('/auth', AUTH)

APP.listen(process.env.PORT || PORT, () => {

	console.log(`User service listening on Port ${PORT}`)
}
)
