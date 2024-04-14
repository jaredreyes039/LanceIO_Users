const mongoose = require('mongoose');

const User = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.UUID,
        required: true,
        default: ()=>randomUUID()
    },
    user_name: {
        type: String,
        required: false
    },
    user_email: {
        type: String,
        required: true
    },
    user_pass: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', User)