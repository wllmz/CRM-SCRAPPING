const mongoose = require('mongoose');

const scrapeSchema = new mongoose.Schema({
    url: String,
    emails: [String]
});

const Scrape = mongoose.model('Scrape', scrapeSchema);

module.exports = Scrape;


