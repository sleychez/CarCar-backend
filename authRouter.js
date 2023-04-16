const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')
const jwt = require("jsonwebtoken");
const {secret} = require("./config");

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
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


router.post('/register',[
    check('username', 'Имя пользователя не можт быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 4 и меньше 10 символов').isLength({min:4, max:10}),
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/me', checkAuth, controller.getMe)
router.post('/forget-password', controller.forgetPassword)
router.post('/reset-password', controller.resetPassword)

module.exports = router