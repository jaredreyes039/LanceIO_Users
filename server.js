const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { AUTH } = require('./routes/auth.route');
const cors = require('cors');
const { USERS } = require('./routes/users.route');
const mongoose = require('mongoose')
const APP = express()
const PORT = 5000

dotenv.config();

// Environment-specific origins
const allowedOrigins = [
	'http://localhost:3000',  // Development
	'https://myapp.com',      // Production
	'https://www.myapp.com'   // Production with www
];

const corsOptions = {
	origin: function(origin, callback) {
		// Allow requests with no origin (mobile apps, etc.)
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
APP.use('/users', USERS)

// Move into a singleton class
const establishMongoConnection = (URI) => {
	console.log("Connecting to MongoDB...")
	mongoose.connect(URI, {
		dbName: 'Users',
	}).then((res, err) => {
		if (err) return console.log(err);
		if (res) return console.log('Connected to MongoDB')
	})
}

APP.listen(process.env.PORT || PORT, () => {
	console.log(`User service listening on Port ${PORT}`)
	establishMongoConnection(process.env.MONGO_URI)
}
)
