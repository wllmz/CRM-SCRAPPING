const axios = require('axios');
const cheerio = require('cheerio');
const Scrape = require('../models/scrapeModel');

exports.scrapeWebsite = async (req, res) => {
    try {
        const { url, selectors } = req.body;
        const moduleId = req.params.moduleId;

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let professionals = [];

        $(selectors.container).each((i, elem) => {
            let nom = $(elem).find(selectors.nom).text().trim();
            let services = $(elem).find(selectors.services).text().trim();
            let adresse = $(elem).find(selectors.adresse).text().trim();
            let email = '';

            const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
            if (emailHref) {
                const emailMatch = emailHref.match(/mailto:([^?]+)/);
                email = emailMatch ? emailMatch[1] : '';
            }


            const professional = { nom, services, adresse, email };

            if (!professionals.some(p => p.nom === nom && p.email === email)) {
                professionals.push(professional);
            }
        });

        const newScrape = new Scrape({
            ...req.body,
            moduleId: moduleId,
            professionals: professionals
        });

        const scrapeResult = await newScrape.save();
        res.status(201).json(scrapeResult);
    } catch (error) {
        console.error('Erreur lors du scraping :', error.message);
        res.status(500).send('Erreur serveur.');
    }
};

exports.listAllscrapes = async(req, res) => {
    try {
        // Récupérer le moduleId à partir des paramètres de la requête
        const moduleId = req.params.moduleId;

        // Modifier la requête pour filtrer les scrapes basés sur le moduleId
        const scrapes = await Scrape.find({ moduleId: moduleId });

        res.status(200).json(scrapes);
    } catch (error) {
        console.error("Erreur lors de la récupération des scrapes :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getScrapeById = async (req, res) => {
    try {
        const scrapeId = req.params.scrapeId;
        const moduleId = req.params.moduleId;
        const scrape = await Scrape.findById(scrapeId);

        if (!scrape) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        if (scrape.moduleId.toString() !== moduleId) {
            return res.status(404).json({ message: "Post non trouvé pour ce module" });
        }

        res.json(scrape);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};


exports.deletesScrape = async (req, res) => {
    try {
        const result = await Scrape.deleteOne({ _id: req.params.scrapeId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Post non trouvé" });
        } else {
            res.status(200).json({ message: "Post supprimé avec succès" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

exports.UpdateScrape = async (req, res) => {
    try {
        const scrapeId = req.params.scrapeId;

        const scrape = await Scrape.findById(scrapeId);
        if (!scrape) {
            return res.status(404).json({ message: "Scrape non trouvé" });
        }

        const response = await axios.get(scrape.url);
        const $ = cheerio.load(response.data);

        let professionals = [];

        $(scrape.selectors.container).each((i, elem) => {
            const professional = {
                nom: $(elem).find(scrape.selectors.nom).text().trim(),
                services: $(elem).find(scrape.selectors.services).text().trim(),
                adresse: $(elem).find(scrape.selectors.adresse).text().trim(),
                email: ''
            };

            const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
            if (emailHref) {
                const emailMatch = emailHref.match(/mailto:([^?]+)/);
                professional.email = emailMatch ? emailMatch[1] : '';
            }

            professionals.push(professional);
        });

        // Mise à jour du Scrape dans la base de données avec les nouveaux professionnels
        const updatedScrape = await Scrape.findByIdAndUpdate(scrapeId, { professionals: professionals }, { new: true });

        res.status(200).json(updatedScrape);
    } catch (error) {
        console.error('Erreur lors de la mise à jour forcée du scrape :', error.message);
        res.status(500).send('Erreur serveur lors de la mise à jour forcée du scrape.');
    }
};
