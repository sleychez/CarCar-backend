const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require("./config")
const nodemailer = require("nodemailer");

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
        user: "sokova.lana",
        pass: "zawqgsmopmemfpvj"
    },
    tls: {
        rejectUnauthorized: false
    }
});


class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password, email} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, email, roles: [userRole.value]})
            await user.save()
            const token = generateAccessToken(user._id, user.roles)
            return res.json({message: "Пользователь успешно зарегистрирован", token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {

        }
    }

    async getMe(req, res) {
        try {
            const user = await User.findById(req.userId)

            if (!user) {
                return res.json({
                    message: 'Такого юзера не существует.',
                })
            }

            const token = jwt.sign({
                id: user._id,
            }, secret, {expiresIn: '30d'},)

            res.json({
                user, token,
            })
        } catch (error) {
            res.json({message: 'Нет доступа.'})
        }
    }

    async forgetPassword(req, res) {
        const {username} = req.body
        const user = await User.findOne({username});
        if (user) {
            const token = jwt.sign({_id: user._id}, secret, {
                expiresIn: '3h',
            });
            user.resetToken = token;
            await user.save();

            //reset link
            console.log(`http://localhost:3000/reset-password/${token}`);

            await transporter.sendMail({
                from: '"Fred Foo 👻" <sokova.lana@yandex.ru>', // sender address
                to: user.email, // list of receivers
                subject: "Reset password", // Subject line
                html: `<a href='http://localhost:3000/reset-password/${token}'>http://localhost:3000/reset-password/${token}</a>`, // html body
            })
        } else {
            res.status(404).send({message: 'Пользователь не найден'});
        }
    }


   async resetPassword (req, res) {
        jwt.verify(req.body.token, secret, async (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Неверный токен' });
            } else {
                const user = await User.findOne({ resetToken: req.body.token });
                console.log(req.body.token)
                if (user) {
                    if (req.body.password) {
                        user.password = bcrypt.hashSync(req.body.password, 7);
                        await user.save();

                        res.send({
                            message: 'Пароль обновлен',
                        });
                    }
                } else {
                    res.status(404).send({ message: 'Пользователь не найден' });
                }
            }
        });
    }
}

module.exports = new authController()