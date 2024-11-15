const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    dateOfBirth: {type: String, required: true}
})

module.exports = mongoose.model('User', UserSchema)