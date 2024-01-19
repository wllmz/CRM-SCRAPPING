const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/crm-scrapping");


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

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});


const moduleRoute = require("../api/routes/ModuleRoute");
moduleRoute(app);

const scrapeRoute = require("../api/routes/ScrapeRoute");
scrapeRoute(app);



// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
