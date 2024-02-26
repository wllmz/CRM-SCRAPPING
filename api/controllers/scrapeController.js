const axios = require('axios');
const cheerio = require('cheerio');
const Scrape = require('../models/scrapeModel');
const puppeteer = require('puppeteer');

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
            let email = '';

            const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
            if (emailHref) {
                const emailMatch = emailHref.match(/mailto:([^?]+)/);
                email = emailMatch ? emailMatch[1] : '';
            }


            const professional = { nom, services, email };

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

        let professionals = [];

        if (scrape.scrapeType !== 'statique')  {
            // Logique pour le scraping dynamique
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(scrape.url, { waitUntil: 'networkidle2' });

            const professionalLinks = await page.evaluate((selector) => {
                return Array.from(document.querySelectorAll(selector)).map(link => link.href);
            }, scrape.selectors.linkselector);

            for (const link of professionalLinks) {
                await page.goto(link, { waitUntil: 'networkidle2' });

                const professional = {
                    nom: await extractText(page, scrape.selectors.nom),
                    services: await extractText(page, scrape.selectors.services),
                    email: await extractEmail(page)
                };
                professionals.push(professional);
            }

            await browser.close();
        } else {
            // Logique pour le scraping statique
            const response = await axios.get(scrape.url);
            const $ = cheerio.load(response.data);

            $(scrape.selectors.container).each((i, elem) => {
                let nom = $(elem).find(scrape.selectors.nom).text().trim();
                let services = $(elem).find(scrape.selectors.services).text().trim();
                let email = extractEmailCheerio($, elem);

                const professional = { nom, services, email };

                if (!professionals.some(p => p.nom === nom && p.email === email)) {
                    professionals.push(professional);
                }
            });
        }

        const updatedScrape = await Scrape.findByIdAndUpdate(scrapeId, { professionals, lastUpdated: new Date() }, { new: true });
        res.status(200).json(updatedScrape);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du scrape :', error.message);
        res.status(500).send('Erreur serveur lors de la mise à jour du scrape.');
    }
};

// Fonctions d'assistance pour Puppeteer
async function extractText(page, selector) {
    return page.evaluate(sel => {
        const element = document.querySelector(sel);
        return element ? element.innerText.trim() : '';
    }, selector);
}

async function extractEmail(page) {
    return page.evaluate(() => {
        const emailElement = document.querySelector('a[href^="mailto:"]');
        return emailElement ? emailElement.href.split(':')[1] : '';
    });
}

// Fonction d'assistance pour Cheerio
function extractEmailCheerio($, elem) {
    const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
    if (emailHref) {
        const emailMatch = emailHref.match(/mailto:([^?]+)/);
        return emailMatch ? emailMatch[1] : '';
    }
    return '';
}




exports.scrapeDynamique = async (req, res) => {
    // Récupération des paramètres depuis le corps de la requête
    const { url, selectors } = req.body; // Utiliser un objet selectors pour une configuration dynamique
    const moduleId = req.params.moduleId;

    try {
        const browser = await puppeteer.launch({ headless: true }); // Passer à headless: true pour un fonctionnement en production
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Utilisation du sélecteur pour extraire les URLs des professionnels
        const professionalLinks = await page.evaluate((selector) => {
            const links = Array.from(document.querySelectorAll(selector));
            return links.map(link => link.href);
        }, selectors.linkselector); // Utilisation de selectors.linkselector

        let professionals = [];

        for (const link of professionalLinks) {
            await page.goto(link, { waitUntil: 'networkidle2' });

            // Initialisation de l'objet professional avec des champs vides
            const professional = {
                nom: '',
                services: '',
                email: ''
            };

            // Extraction du nom en utilisant le sélecteur dynamique fourni
            if (selectors.nom) {
                professional.nom = await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.innerText.trim() : 'Nom non trouvé';
                }, selectors.nom);
            }

            if (selectors.services) {
                professional.services = await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.innerText.trim() : 'Services non trouvés';
                }, selectors.services);
            }

            // Extraction de l'email sans avoir besoin de préciser un sélecteur
            professional.email = await page.evaluate(() => {
                const emailElement = document.querySelector('a[href^="mailto:"]');
                return emailElement ? emailElement.href.split(':')[1] : 'Email non trouvé';
            });

            professionals.push(professional);
        }

        await browser.close();

        // Création d'un nouvel objet Scrape avec les données extraites
        const newScrape = new Scrape({
            url,
            moduleId,
            selectors, // Inclure les sélecteurs utilisés pour le scraping
            professionals
        });

        const scrapeResult = await newScrape.save();
        res.status(201).json(scrapeResult);
    } catch (error) {
        console.error('Erreur lors du scraping dynamique:', error);
        res.status(500).send('Erreur serveur lors du scraping dynamique.');
    }
};
