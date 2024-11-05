const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users.js')
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
//event handle
//mentor handle

module.exports = router