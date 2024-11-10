const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users.js')
const mentor = require('../models/mentor.js')
const booking = require('../models/booking.js')
const events = require('../models/events.js')
const dotenv = require('dotenv').config()

//default
router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html'); // Explicitly set content type
    res.send(`<h3 style="animation: marquee 10s linear infinite;">Hello Focus Network Database 🤗</h3>
              <style>
                  @keyframes marquee {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                  }
                  h3 {
                      white-space: nowrap;
                      overflow: hidden;
                      display: inline-block;
                  }
              </style>`);
});
//register
router.post('/register', async(req, res)=> {
    try {

        //check to see if they havent already registered
        const user = await User.findOne({email: req.body.email})
        if(user) {
            return res.status(409).send("Email already registered, sign in or forgot password")
        }

        //add to payload
        const payload = {...req.body}
        //hash password - wait till salt is done, hash the request password and replace payload with new hashed password 
        const salt = await bcrypt.genSalt(12)
        const newPassword = await bcrypt.hash(req.body.password, salt)
        payload.password = newPassword
        const newUser = new User(payload)

        //save to mongoDB
        const result = await newUser.save()
        res.status(201).send(result) 
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }

})
//login
router.post('/login', async (req, res) => {
    try {
        //check to see if they havent already registered
        const user = await User.findOne({email: req.body.email})

        //if user email is not found
        if(!user) {
            return res.status(404).send("Email address not found, register!")
        }

        //compare password
        const correctPassword = await bcrypt.compare(req.body.password, user.password)
        if(!correctPassword) {
            return res.status(401).send("Password is Incorrect!");
        }

        //generate token
        const token = jwt.sign({
            id: user._id
        },process.env.JWT_SECRET, {expiresIn: '1h'})

        //store token in http cookie
        res.cookie('access_token', token, {httpOnly: true})

        //send response
        res.status(200).json({
            message: "Login Success",
            data: user,
            status: 200,
            token: token
        })
        
    } catch (error) {
        return res.status(500).send("Internal Server Error")
    }
})
//mentor handle
//add mentors
router.post('/add-mentors', async (req, res) => {
    try {

        //check to see if already added a mentor
        const existMentor = await mentor.findOne({fullName: req.body.fullName})
        if(existMentor) {
            return res.status(409).send("Mentor already added!")
        }

        const payload = {...req.body}
        const newMentor = new mentor(payload);
        const savedMentor = await newMentor.save();
        res.status(201).send(savedMentor);
    } catch (error) {
        res.status(500).send('Could not create mentor');
    }
});
//get all mentors
router.get('/mentors', async (req, res) => {
    try {
        const mentors = await mentor.find();
        res.status(200).send(mentors);
    } catch (error) {
        res.status(500).send('Could not get all mentors');
    }
  });
//get specific mentor
router.get('/mentors/:mentorId', async (req, res) => {
    try {
        const findmentor = await mentor.findById(req.params.mentorId);
        res.status(200).send(findmentor);
    } catch (error) {
        res.status(500).send('Could not find a specific mentor');
    }
});
//update mentor
router.put('/update-mentors/:id', async (req, res) => {
    try {
        const updatedMentor = await mentor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMentor) return res.status(404).send('Mentor not found');
        res.status(200).send(updatedMentor);
    } catch (error) {
        res.status(500).send('Could not update mentor');
    }
});
//delete mentor
router.delete('/delete-mentor/:id', async (req, res)=> {
    try {
        const id = req.params._id;
        const result = await mentor.deleteOne({ id });

        if (result) {
            return res.status(200).send("Mentor deleted successfully");
        } else {
            return res.status(404).send("Mentor not found");
        }

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})
//add booking
router.post('/add-bookings', async (req, res) => {
    try {
        const { userId, mentorId, date, time, status } = req.body;
        const newbooking = new booking({ userId, mentorId, date, time , status});
        await newbooking.save();
        res.status(201).send(newbooking);
    } catch (error) {
        res.status(500).send('Could not create booking');
    }
});
//get bookings
router.get('/get-bookings/:userId', async (req, res) => { 
    try {
        const bookings = await booking.find({ userId: req.params.userId }); 
        res.status(200).send(bookings);
    } catch (error) {
        res.status(500).send('Could not get all bookings');
    } 
});
//update bookings
router.put('/update-booking/:id', async (req, res) => {
    try {
        const updatedBooking = await booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) return res.status(404).send('Booking not found');
        res.status(200).send(updatedBooking);
    } catch (error) {
        res.status(500).send('Could not update booking');
    }
});
//event handle
//add event
router.post('/add-events', async (req, res) => {
    try {

        //check to see if event exists
        const existEvent = await events.findOne({title: req.body.title})
        if(existEvent) {
            return res.status(409).send("Event already added!")
        }

        const payload = {...req.body}
        const newEvent = new events(payload);
        const savedEvent = await newEvent.save();
        res.status(201).send(savedEvent);
    } catch (error) {
        res.status(500).send('Could not add event');
    }
});
//get all events
router.get('/events', async (req, res) => {
    try {
        const allEvents = await events.find();
        res.status(200).send(allEvents);
    } catch (error) {
        res.status(500).send('Could not get all events');
    }
  });

module.exports = router