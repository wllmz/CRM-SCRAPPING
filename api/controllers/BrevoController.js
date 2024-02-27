const axios = require('axios');


const brevoAPIKey = process.env.brevoAPI

exports.sendTestContactToBrevo = async function(req, res) {
  const testContactData = {
    email: "wiwi+6@example.com",
    ext_id: "123456715", // Identifiant unique fictif
    attributes: {
      NOM: "John+3",
      PRENOM: "Doe+3"
    },
    emailBlacklisted: false,
    smsBlacklisted: false,
    listIds: [12], // ID de liste fictif
    updateEnabled: false,
    smtpBlacklistSender: []
  };

  try {
    const response = await axios.post('https://api.brevo.com/v3/contacts', testContactData, {
      headers: {
        'accept': 'application/json',
        'api-key': brevoAPIKey,
        'content-type': 'application/json'
      }
    });

    // Envoi d'une réponse de succès à Postman
    res.status(200).json({
      message: 'Test contact sent successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error sending test contact:', error);
    // Envoi d'une réponse d'erreur à Postman
    res.status(500).json({ message: 'Error sending test contact', error: error.message });
  }
};