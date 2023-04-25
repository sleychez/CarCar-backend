const express = require('express')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const authRouter = require('./routers/authRouter')
const app =express()
const cors = require('cors')
const tripsRouter = require('./routers/tripRouter')
const BookingTripRouter = require('./routers/BookingTripRouter')

app.use(cors())

app.use(express.json())
app.use("/auth", authRouter)
app.use("/trips", tripsRouter)
app.use('/booking', BookingTripRouter)

const start = async () => {
    try{
        await mongoose.connect(`mongodb+srv://qwerty:Sokova25@cluster0.chc8mpg.mongodb.net/auth_roles?retryWrites=true&w=majority`)
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    }catch (e){
        console.log(e)
    }
}
start()