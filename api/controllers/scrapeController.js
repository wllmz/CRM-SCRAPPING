const axios = require('axios');
const cheerio = require('cheerio');
const ScrapeResult = require('../models/scrapeModel');

exports.scrapeWebsite = async (req, res) => {
    try {
        const url = req.body.url;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageText = $('html').text();

        // Regex pour détecter des adresses e-mail
        const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
        const emails = pageText.match(emailRegex) || [];

        // Éliminer les doublons
        const uniqueEmails = [...new Set(emails)];

        // Préparation de la réponse HTML (si nécessaire)
        const emailsHtml = uniqueEmails.join('<br>');

        // Sauvegarder le résultat du scraping
        const scrapeResult = new ScrapeResult({ url, emails: uniqueEmails });
        await scrapeResult.save();

        // Envoyer la réponse
        res.send(emailsHtml);
    } catch (error) {
        console.error('Erreur lors du scraping :', error.message);
        res.status(500).send('Erreur lors du scraping de la page');
    }
};

exports.listAllscrapes = async(req, res) => {
    try {
        const Scrapes = await ScrapeResult.find({});
        res.status(200);
        res.json(Scrapes);

    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur." })
    }
}


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
        const updateData = req.body;

        // Vérifier si l'URL est modifiée
        const scrape = await ScrapeResult.findById(scrapeId);
        if (!scrape) {
            return res.status(404).json({ message: "Scrape non trouvé" });
        }

        if (updateData.url && updateData.url !== scrape.url) {
            // Effectuer un nouveau scraping pour la nouvelle URL
            const response = await axios.get(updateData.url);
            const $ = cheerio.load(response.data);
            const pageText = $('html').text();
            const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
            const emails = pageText.match(emailRegex) || [];
            updateData.emails = [...new Set(emails)]; // Mise à jour des e-mails
        }

        // Mise à jour du scrape
        const updatedScrape = await ScrapeResult.findByIdAndUpdate(scrapeId, updateData, { new: true });

        // Renvoyer le scrape mis à jour
        res.status(200).json(updatedScrape);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du scrape :', error.message);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du scrape" });
    }
};
