const mongoose = require('mongoose');

const scrapeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }, // Ajout du champ moduleId
  professionals: [{
    nom: String,
    services: String,
    adresse: String,
    email: String
  }],
  dateScraped: { type: Date, default: Date.now }
});

const Scrape = mongoose.model('Scrape', scrapeSchema);

module.exports = Scrape;
