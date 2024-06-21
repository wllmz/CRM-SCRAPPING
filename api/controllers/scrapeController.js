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

        if (scrape.scrapeType !== 'statique') {
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
                    email: await extractEmail(page),
                    tel: await extractTel(page) // Ajoutez cette ligne pour récupérer le tel
                };
                professionals.push(professional);
            }

            await browser.close();
        } else {
            const response = await axios.get(scrape.url);
            const $ = cheerio.load(response.data);

            $(scrape.selectors.container).each((i, elem) => {
                const nom = $(elem).find(scrape.selectors.nom).text().trim();
                const services = $(elem).find(scrape.selectors.services).text().trim();
                const email = extractEmailCheerio($, elem);
                const tel = extractTelCheerio($, elem); // Utilisez cette fonction pour le tel

                const professional = { nom, services, email, tel }; // Ajoutez `tel` ici

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

async function extractTel(page) {
    return page.evaluate(() => {
        const telElement = document.querySelector('a[href^="tel:"]');
        return telElement ? telElement.href.split(':')[1] : '';
    });
}

// Fonctions d'assistance pour Cheerio
function extractEmailCheerio($, elem) {
    const emailHref = $(elem).find('a[href^="mailto:"]').attr('href');
    return emailHref ? emailHref.split(':')[1] : '';
}

function extractTelCheerio($, elem) {
    const telHref = $(elem).find('a[href^="tel:"]').attr('href');
    return telHref ? telHref.split(':')[1] : '';
}





exports.scrapeDynamique = async (req, res) => {
    const { url, selectors } = req.body;
    const moduleId = req.params.moduleId;

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        // Augmenter le délai d'attente si nécessaire
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const professionalLinks = await page.evaluate((selector) => {
            const links = Array.from(document.querySelectorAll(selector));
            return links.map(link => link.href);
        }, selectors.linkselector);

        let professionals = [];

        for (const link of professionalLinks) {
            try {
                // Gestion des erreurs pour chaque navigation
                await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
            } catch (error) {
                console.error(`Erreur lors de la navigation vers ${link}:`, error);
                continue; // Continue avec le prochain lien en cas d'erreur
            }

            const professional = {
                nom: '',
                services: '',
                email: ''
            };

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

            professional.email = await page.evaluate(() => {
                const emailElement = document.querySelector('a[href^="mailto:"]');
                return emailElement ? emailElement.href.split(':')[1] : 'Email non trouvé';
            });

            professionals.push(professional);
        }

        await browser.close();

        const newScrape = new Scrape({
            url,
            moduleId,
            selectors,
            professionals
        });

        const scrapeResult = await newScrape.save();
        res.status(201).json(scrapeResult);
    } catch (error) {
        console.error('Erreur lors du scraping dynamique:', error);
        res.status(500).send('Erreur serveur lors du scraping dynamique.');
    }
};



exports.scrapeDynamiqueSagesFemmes = async (req, res) => {
    // Extraction des informations à partir de la requête
    const { url, departementSelector, departementValue, resultSelector, containerSelector, services } = req.body;
    const moduleId = req.params.moduleId;

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        if (departementSelector && departementValue) {
            await page.select(departementSelector, departementValue);
            await page.evaluate(() => rchflib());
        }

        await page.waitForSelector(resultSelector, { timeout: 60000 });
        await page.waitForSelector(containerSelector, { timeout: 60000 });

        const professionals = await page.evaluate((containerSelector) => {
            const containers = Array.from(document.querySelectorAll(containerSelector));
            return containers.map(container => {
                const nom = container.querySelector('h2') ? container.querySelector('h2').innerText.trim() : '';
                const infos = Array.from(container.querySelectorAll('span')).map(span => span.innerText.trim());
                const professional = {
                    nom, 
                    adresse: infos[0],
                    adressepart2: infos[1], 
                    telephonefixe: infos.find(info => info.startsWith('Tél :'))?.replace('Tél : ', '') || '',
                    tel: infos.find(info => info.startsWith('Mobile :'))?.replace('Mobile : ', '') || '',
                    email: infos.find(info => info.startsWith('Mail :'))?.replace('Mail : ', '') || '',
        
                };
                return professional;
            });
        }, containerSelector);

        await browser.close();

        const professionalsWithServices = professionals.map(professional => ({
            ...professional,
            services 
        }));

        const newScrape = new Scrape({
            url,
            scrapeType: 'dynamique',
            moduleId,
            selectors: {
                container: containerSelector,

            },
            professionals: professionalsWithServices, 
            dateScraped: new Date(),
        });

        await newScrape.save();

        res.status(201).json({ success: true, message: "Les données ont été sauvegardées avec succès.", data: professionalsWithServices });
    } catch (error) {
        console.error('Erreur lors du scraping dynamique:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du scraping dynamique' });
    }
};


exports.scrapeDynamicH2ContentsAndContactInfo = async (req, res) => {
    const { baseUrl } = req.body;
    const moduleId = req.params.moduleId;

    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const professionals = [];

        for (let i = 300; i <= 400; i++) {
            const url = `${baseUrl}/?f=${i}`;
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            const result = await page.evaluate(() => {
                const h2 = document.querySelector('h2') ? document.querySelector('h2').innerText.trim() : '';
                let tel = '', email = '';

                // Extraction basée sur le texte intégral de la page pour le téléphone et l'email
                const bodyText = document.body.innerText;

                // Essayer d'extraire le téléphone s'il est mentionné
                const phoneMatch = bodyText.match(/Téléphone\s*:\s*([\s\S]*?)\n/);
                if (phoneMatch && phoneMatch[1]) {
                    tel = phoneMatch[1].trim();
                }

                // Essayer d'extraire l'email s'il est mentionné
                const emailMatch = bodyText.match(/Email\s*:\s*([\s\S]*?)\n/);
                if (emailMatch && emailMatch[1]) {
                    email = emailMatch[1].trim();
                }

                // Vérifier si h2 contient du texte
                if (h2 && email) { // Si `h2` et `email` ne sont pas vides
                    return {
                        url: window.location.href,
                        nom: h2,
                        tel: tel,
                        email: email,
                    };
                } else {
                    return null; // Retourner null si h2 est vide ou si email est vide
                }
            });

            // Ajoute le résultat aux résultats si ce n'est pas null
            if (result) {
                professionals.push({ ...result });
            }
        }

        await browser.close();

        const newScrape = new Scrape({
            url: baseUrl,
            scrapeType: 'dynamique',
            moduleId,
            professionals,
            dateScraped: new Date(),
        });

        await newScrape.save();
  res.status(201).json({ success: true, message: "Les données ont été sauvegardées avec succès.", data: professionals });
    } catch (error) {
        console.error('Erreur lors du scraping dynamique:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du scraping dynamique', error: error.message });
    }
};