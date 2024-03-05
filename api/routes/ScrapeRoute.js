module.exports = (server) => {
    const scrapeController = require('../controllers/scrapeController');
    const jwtverifytoken = require("../middleware/jwtMiddleware");

    server.route('/:moduleId/scrapes')
        .post(jwtverifytoken.verifyToken, scrapeController.scrapeWebsite)
        .get(jwtverifytoken.verifyToken, scrapeController.listAllscrapes);

    server.route('/:moduleId/scrapes/:scrapeId')
        .get(jwtverifytoken.verifyToken, scrapeController.getScrapeById);

    server.route('/scrapes/:scrapeId')
        .delete(jwtverifytoken.verifyToken, scrapeController.deletesScrape)
        .put(jwtverifytoken.verifyToken, scrapeController.UpdateScrape);

    server.route('/:moduleId/scrapes/dynamique/') 
        .post(jwtverifytoken.verifyToken, scrapeController.scrapeDynamique);

    server.route('/:moduleId/scrapes/form/') 
        .post(jwtverifytoken.verifyToken, scrapeController.scrapeDynamiqueSagesFemmes  );

    
};
