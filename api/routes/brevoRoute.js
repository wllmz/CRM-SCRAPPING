module.exports = (server) => {
    const brevoController = require('../controllers/BrevoController');
    const jwtverifytoken = require("../middleware/jwtMiddleware");

    // Ajout d'une nouvelle route pour envoyer un contact test à Brevo
    server.route('/send-test-contact')
        .post(jwtverifytoken.verifyToken, brevoController.sendTestContactToBrevo);
}
