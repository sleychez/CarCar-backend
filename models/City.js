const {Schema,model} = require('mongoose')

const City = new Schema({
    value: {type:String, unique: true},

})
module.exports = model('City',City)