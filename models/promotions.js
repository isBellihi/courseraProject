const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name : {
        type : String
    },
    image : {
        type : String
    },
    label :{
        type : String,
        default : ''
    },
    price : {
        type : Currency
    },
    description : {
        type : String
    },
    featured : {
        type : Boolean
    }
});

var Promotions = mongoose.model('Promotion',promoSchema);
module.exports = Promotions ;