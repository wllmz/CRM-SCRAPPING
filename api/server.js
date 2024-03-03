// Importations nécessaires
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Configuration du port
const port = process.env.PORT || 5000;

// Configuration de CORS pour autoriser uniquement les requêtes provenant d'un certain origine
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Configuration de la connexion à MongoDB
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    // initial(); // Assurez-vous que cette fonction est définie quelque part si vous avez l'intention de l'utiliser.
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit(1);
  });

// Middleware pour analyser le corps des requêtes en JSON et URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Importation des routes
const moduleRoute = require("../api/routes/ModuleRoute");
const scrapeRoute = require("../api/routes/ScrapeRoute");
const userRoute = require("../api/routes/userRoute");
const brevoRoute = require("../api/routes/brevoRoute");

// Utilisation des routes
moduleRoute(app);
scrapeRoute(app);
userRoute(app);
brevoRoute(app);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
