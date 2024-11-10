const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    title: {type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    additionalInfo: {type: String, required: true},
    link: {type: String, required: true}
    
})

module.exports = mongoose.model('Events', eventSchema)