const Router = require('express')
const router = new Router()
const controller = require('../controllers/BookingTripController')
const jwt = require("jsonwebtoken");
const {secret} = require("../config")


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
router.delete('/deleteBookTrip/:id', checkAuth, controller.remove)


module.exports = router