const express=require('express')
const app=express();
require('dotenv').config();
const cors=require('cors')
const UserDetails=require('./routes/userRoute')

const authorizedRoute=require('./routes/userRoute')

const OTP=require('./routes/otpRoute')
const addingItems=require('./routes/itemRoute')

app.use(cors())
app.use(express.json())

app.use('/user',UserDetails)

app.use('/user',OTP)

app.use('/user',authorizedRoute)

app.use('/user',addingItems)

const PORT=process.env.PORT||1234;
app.listen(PORT,()=>
{
    console.log("server is working ")
})