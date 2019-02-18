const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating : {
        type : Number,
        max : 5,
        min : 1,
        required :true
    },
    comment : {
        type : String,
        required : true,
    },
    author : {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{
    timestamps : true
});

const dishSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

    var Dishes = mongoose.model('Dish',dishSchema);

    module.exports = Dishes ;