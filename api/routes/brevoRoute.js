module.exports = (server) => {
    const brevoController = require('../controllers/BrevoController');
    const jwtverifytoken = require("../middleware/jwtMiddleware");

    // Ajout d'une nouvelle route pour envoyer les données de scrape à Brevo
    server.route('/send-scrape/:scrapeId')
        .post(jwtverifytoken.verifyToken, brevoController.sendScrapeToBrevo);

    server.route('/brevo-contact-lists')
        .get(jwtverifytoken.verifyToken, brevoController.getBrevoContactLists);


}
