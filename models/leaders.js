const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name : {
        type : String
    },
    image : {
        type : String
    },
    designation :{
        type : String
    },
    abbr : {
        type : String
    },
    description : {
        type : String
    },
    featured : {
        type : Boolean
    }
});

var Leaders = mongoose.model('Leader',leaderSchema);
module.exports = Leaders ;
