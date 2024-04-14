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
APP.use(cors());
APP.use(bodyParser.json());

APP.use('/auth', AUTH)
APP.use('/users', USERS)

const establishMongoConnection = (URI) => {
    console.log("Connecting to MongoDB...")
    mongoose.connect(URI, {
        dbName: 'Users',
    }).then((res, err)=>{
        if(err) return console.log(err);
        if(res) return console.log('Connected to MongoDB')
    })
}


APP.listen(process.env.PORT || PORT, () => {
        console.log(`User service listening on Port ${PORT}`)
        establishMongoConnection(process.env.MONGO_URI)
    }
)
