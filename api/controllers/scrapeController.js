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
            const professional = {
                nom: $(elem).find(selectors.nom).text().trim(),
                services: $(elem).find(selectors.services).text().trim(),
                adresse: $(elem).find(selectors.adresse).text().trim(),
                email: ''
            };

            const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
            if (emailHref) {
                const emailMatch = emailHref.match(/mailto:([^?]+)/);
                professional.email = emailMatch ? emailMatch[1] : '';
            }

            professionals.push(professional);
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
        const scrape = await ScrapeResult.findById({ _id: req.params.scrapeId });
        if (!scrape) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.json(scrape);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
};


exports.deletesScrape = async (req, res) => {
    try {
        const result = await ScrapeResult.deleteOne({ _id: req.params.scrapeId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Post non trouvé" });
        } else {
            res.status(200).json({ message: "Post supprimé avec succès" });
        }
    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur." });
    }
};

exports.updateScrape = async (req, res) => {
    try {
        const scrapeId = req.params.scrapeId;
        const { url, selectors } = req.body;

        // Vérifier si le Scrape existe
        const scrape = await Scrape.findById(scrapeId);
        if (!scrape) {
            return res.status(404).json({ message: "Scrape non trouvé" });
        }

        let professionals = scrape.professionals;

        // Vérifier si l'URL ou les sélecteurs sont modifiés pour effectuer un nouveau scraping
        if ((url && url !== scrape.url) || (selectors && JSON.stringify(selectors) !== JSON.stringify(scrape.selectors))) {
            const response = await axios.get(url || scrape.url);
            const $ = cheerio.load(response.data);

            professionals = [];

            $(selectors.container || scrape.selectors.container).each((i, elem) => {
                const professional = {
                    nom: $(elem).find(selectors.nom || scrape.selectors.nom).text().trim(),
                    services: $(elem).find(selectors.services || scrape.selectors.services).text().trim(),
                    adresse: $(elem).find(selectors.adresse || scrape.selectors.adresse).text().trim(),
                    email: ''
                };

                // Traitement de l'email sans la partie image
                const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
                if (emailHref) {
                    const emailMatch = emailHref.match(/mailto:([^?]+)/);
                    professional.email = emailMatch ? emailMatch[1] : '';
                }

                professionals.push(professional);
            });
        }

        // Préparation de l'objet de mise à jour avec les données actualisées
        const updateData = {
            ...req.body,
            professionals: professionals
        };

        // Mise à jour du Scrape dans la base de données
        const updatedScrape = await Scrape.findByIdAndUpdate(scrapeId, updateData, { new: true });

        res.status(200).json(updatedScrape);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du scrape :', error.message);
        res.status(500).send('Erreur serveur lors de la mise à jour du scrape.');
    }
};
