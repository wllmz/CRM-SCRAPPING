const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/crm-scrapping");
const cors = require('cors');

app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000'
  }));
  

const db = mongoose.connection;

// Gestionnaire d'erreurs de connexion
db.on('error', (error) => {
    console.error('Erreur de connexion à MongoDB:', error);
});

// Confirmation de la connexion réussie
db.once('open', () => {
    console.log('Connecté avec succès à MongoDB');
});

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const moduleRoute = require("../api/routes/ModuleRoute");
moduleRoute(app);

const scrapeRoute = require("../api/routes/ScrapeRoute");
scrapeRoute(app);

const userRoute = require("../api/routes/userRoute");
userRoute(app);



// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
