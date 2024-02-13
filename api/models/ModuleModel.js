const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let moduleSchema = new Schema({
    module: {
        type: String,
        required: true,
    },     
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Module', moduleSchema);