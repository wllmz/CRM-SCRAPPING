const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let moduleSchema = new Schema({
    module: {
        type: String,
        required: true,
        unique: true
    }

});

module.exports = mongoose.model('Module', moduleSchema);