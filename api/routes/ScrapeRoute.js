module.exports = (server) => {
    const scrapeController = require('../controllers/scrapeController');
    const jwtverifytoken = require("../middleware/jwtMiddleware");

    server.route('/:moduleId/scrapes')
        .post(jwtverifytoken.verifyToken, scrapeController.scrapeWebsite)
        .get(jwtverifytoken.verifyToken, scrapeController.listAllscrapes);

    server.route('/scrapes/:scrapeId')
        .delete(jwtverifytoken.verifyToken, scrapeController.deletesScrape)
        .get(jwtverifytoken.verifyToken, scrapeController.getScrapeById)
        .put(jwtverifytoken.verifyToken, scrapeController.updateScrape);
};
