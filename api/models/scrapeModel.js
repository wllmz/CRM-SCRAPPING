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
    formSelectors: { type: Map, of: String }, // Pour stocker les sélecteurs de formulaire et les valeurs
    dataSelectors: { type: Map, of: String }, // Pour stocker les sélecteurs des données à extraire après la soumission
  },
  professionals: [{
    nom: String,
    services: String,
    email: String,
    tel: String,
    telephonefixe: String,
    adresse: String,
    adressepart2: String,
  }],
  dateScraped: { type: Date, default: Date.now },
  lastUpdated: { type: Date } 
});

const Scrape = mongoose.model('Scrape', scrapeSchema);

module.exports = Scrape;
