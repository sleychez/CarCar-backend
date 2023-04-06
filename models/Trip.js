const {Schema, model} = require('mongoose')

const Trip = new Schema({
    from: {type:String, ref: 'City'},
    to: {type:String, ref: 'City'},
    cost: {type: Number},
    user: { type: Schema.Types.ObjectId, ref: 'User'}
})
module.exports = model('Trip', Trip)