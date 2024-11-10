const mongoose = require('mongoose')


const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //refrence to the user
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }, //refrence to the user
    date: {type: String},
    time: {type: String},
    status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  });
  
module.exports = mongoose.model('Booking', BookingSchema);