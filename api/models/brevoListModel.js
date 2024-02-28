const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let brevoListSchema = new Schema({
    name: String,
    brevoId: Number,
});

module.exports = mongoose.model('BrevoList', brevoListSchema);
