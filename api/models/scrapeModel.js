const mongoose = require('mongoose');

const scrapeSchema = new mongoose.Schema({
  url: { type: String, required: true },
  scrapeType: { type: String, enum: ['dynamique', 'statique']},
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  selectors: {
    container: { type: String },
    nom: { type: String },
    services: { type: String },
    linkselector: { type: String}, 
  },
  professionals: [{
    nom: String,
    services: String,
    email: String
  }],
  dateScraped: { type: Date, default: Date.now },
  lastUpdated: { type: Date } 
});

const Scrape = mongoose.model('Scrape', scrapeSchema);

module.exports = Scrape;
