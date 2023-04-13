const Trip  = require('./models/Trip')
const Role  = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require("./config")



class tripController {
    async create (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Не удалось создать поездку", errors})
            }
            const {from, to, cost} = req.body
            const user = req.userId
            const trip = new Trip({from, to, cost, user})
            await trip.save()
            return res.json({trip})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Не удалось создать поездку'})
        }
    }
async get (req, res) {
    try {
       const {from, to} = req.query
        const search = await Trip.find({from, to}).populate('user').exec()
        if (search) {
            return res.json(search.filter(trip => {
                return req.userId !== trip.user.id
            } ))
        }
        return []
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Не удалось получить поездки'})
    }
}
    async remove (req,res) {
        try {
            const tripId = req.params.id
            Trip.findOneAndDelete({
                _id: tripId,
            }, (e, trip) => {
                if (e) {
                    console.log(e)
                    return res.status(500).json({
                        message: 'Не удалось удалить поездку'
                    })
                }
                if (!trip) {
                    return res.status(404).json({
                        message: 'Поездка не найдена',
                    })
                }
                res.json({
                    success: true
                })
            },
            )
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Не удалось удалить поездку'})
        }
    }
    async update (req, res) {
        try {
            const tripId = req.params.id
            await Trip.updateOne(
                {
                    _id: tripId,
                },
                {
                    from: req.body.from,
                    to: req.body.to,
                    cost: req.body.cost,
                    user: req.userId
                }
            );
            res.json({
                success: true
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Не удалось обновить поездку'})
        }
    }


}



module.exports = new tripController()