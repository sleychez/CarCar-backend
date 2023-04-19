const Router = require('express')
const router = new Router()
const controller = require('./BookingTripController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')
const jwt = require("jsonwebtoken");
const {secret} = require("./config")


const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '')
    if (token) {
        try {
            const decoded = jwt.verify(token, secret)

            req.userId = decoded.id
            next()
        } catch (error) {
            return res.json({
                message: 'Нет доступа.',
            })
        }
    } else {
        return res.json({
            message: 'Нет доступа.',
        })
    }
}



router.post('/book', checkAuth, controller.book)
router.get('/getBookings', checkAuth, controller.get)
router.delete('/deleteTrip', checkAuth, controller.remove)


module.exports = router