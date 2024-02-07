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
                image: '', 
                email: ''
            };

   
            const img = $(elem).find('img[width="160"][height="160"]').first();
            if (img.length) {
                const imageUrl = img.attr('src');
                const urlBase = new URL(url).origin;
                professional.image = imageUrl.startsWith('http') ? imageUrl : `${urlBase}${imageUrl}`;
            }

     
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
