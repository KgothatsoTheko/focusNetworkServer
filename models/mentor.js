const mongoose = require('mongoose')

const mentorSchema = mongoose.Schema({
    profileImage: {type: String}, /// URL link from their LinkedIn profile
    fullName: { type: String, required: true },
    bio: { type: String, required: true },
    expertise: { type: String, required: true },
    availability: [{ date: {type: String}, time: {type: String}, isBooked: {type: Boolean}}],
    contactInfo: {type: String}, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional link to User
})

module.exports = mongoose.model('Mentor', mentorSchema)