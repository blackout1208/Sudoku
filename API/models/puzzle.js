const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const puzzleSchema = new Schema({
    date: {
        type: Date
        , required: true
        , default: Date.now
    }
    , difficulty:{
        type: Number
        , required: true
    }
    , puzzleBoard: {
        type: [Number]
        , required: true
    }
    , solution: {
        type: [Number]
        , required: true
    }
    , saved: {
        type: Boolean
        , required: true
        , default: false
    }
});

const puzzle = Mongoose.model('puzzle', puzzleSchema);
module.exports = puzzle;