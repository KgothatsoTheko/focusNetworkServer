const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const connectToMongo = require('./dbconn/dbconn')
const router = require('./routes/routes')
dotenv.config()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/api',router)

//connect to Database and start server
connectToMongo()
.then(()=>{
    const PORT = process.env.PORT || 3000
    app.listen(PORT, ()=> {
    console.log(`Server running on PORT: ${PORT}`);  
    })
})
.catch((error)=> {
    console.log(`Server failed to connect and launch: ${error}`);
})

