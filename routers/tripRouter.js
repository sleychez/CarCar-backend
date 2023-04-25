const Router = require('express')
const router = new Router()
const controller = require('../controllers/tripController')
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



router.post('/createTrip', checkAuth, controller.create)
router.get('/getTrips', checkAuth, controller.get)
router.delete('/deleteTrip/:id', checkAuth, controller.remove)
router.patch('/updateTrip', checkAuth, controller.update)
router.get('/createdTrips', checkAuth, controller.getCreatedTrip)


module.exports = router