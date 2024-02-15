const mongoose = require('mongoose');

const scrapeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  selectors: {
    container: { type: String },
    nom: { type: String },
    services: { type: String },
    adresse: { type: String },
    linkselector: { type: String},
  },
  professionals: [{
    nom: String,
    services: String,
    adresse: String,
    email: String
  }],
  dateScraped: { type: Date, default: Date.now },
  lastUpdated: { type: Date } 
});

const Scrape = mongoose.model('Scrape', scrapeSchema);

module.exports = Scrape;
