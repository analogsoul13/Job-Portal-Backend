require('dotenv').config()

const connectDB = require('./Connection/db')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const jpServer = express()

// middlewares
jpServer.use(express.json())
jpServer.use(cookieParser())

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
jpServer.use(cors(corsOptions))

const PORT=3000 || process.env.PORT

jpServer.listen(PORT,()=>{
    connectDB()
    console.log("Server Running At :",PORT)
})

jpServer.get('/',(req,res)=>{
    res.send("<h1>jpServer is Active!!</h1>")
})