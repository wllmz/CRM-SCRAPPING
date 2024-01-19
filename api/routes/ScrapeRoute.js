module.exports = (server) => {
    const scrapeController = require('../controllers/scrapeController');

    server.route('/scrapes')
        .post(scrapeController.scrapeWebsite)
        .get(scrapeController.listAllscrapes);

    server.route('/scrapes/:scrapeId')
        .delete(scrapeController.deletesScrape)
        .get(scrapeController.getScrapeById)
        .put(scrapeController.updateScrape);
};
