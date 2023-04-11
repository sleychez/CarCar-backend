const {Schema, model} = require('mongoose')

const BookingTrip = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
    trip: {type: Schema.Types.ObjectId, ref: 'Trip'}
})
module.exports = model('BookingTrip', BookingTrip)