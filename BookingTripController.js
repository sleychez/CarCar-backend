const Trip  = require('./models/Trip')
const Role  = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require("./config")
const BookingTrip = require('./models/BookingTrip')



class BookingTripController {

    async book (req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Не удалось забронировать поездку", errors})
            }
            const {tripId} = req.body
            const userId = req.userId
            const trip = new BookingTrip({trip: tripId, userId})
            await trip.save()
            return res.json({trip})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Не удалось забронировать поездку'})
        }
    }
    async get (req, res) {
        try {
            const userId = req.userId
            const search = await BookingTrip.find({userId}).
            populate({
                path: 'trip',
                populate: {
                    path: 'user'
                }
            })
            if (search) {
                return res.json(search.map(trip => {
                    return trip.trip
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
    async update (req,res) {
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



module.exports = new BookingTripController()