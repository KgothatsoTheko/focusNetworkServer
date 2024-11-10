const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectToMongo = async ()=> {
    try {
       await mongoose.connect(process.env.MONGO_ATLAS)
       console.log("Connected To ATLAS")
       }
       
     catch (error) {
        console.log(`Failed to connect to ATLAS, trying to connect to local`, error)
        try {
                await mongoose.connect(process.env.MONGO_LOCAL)
                console.log("Connected To LOCAL");
        } catch (error) {
            console.log(`Something went wrong, cant connect to ATLAS or LOCAL`, error)
        }
    }
}


module.exports = connectToMongo