const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Scrape = require('../models/scrapeModel');
const BrevoList = require('../models/brevoListModel');
const brevoAPIKey = process.env.brevoAPI;

// Fonction pour récupérer les données de scrape par ID
async function getScrapeById(scrapeId) {
    try {
        const scrape = await Scrape.findById(scrapeId);
        if (!scrape) {
            throw new Error('Scrape not found');
        }
        return scrape;
    } catch (error) {
        throw error;
    }
}

exports.sendScrapeToBrevo = async function(req, res) {
    try {
        const scrapeId = req.params.scrapeId;
        const listName = req.body.listName;
        const scrapeData = await getScrapeById(scrapeId);

        const brevoList = await BrevoList.findOne({ name: listName });
        if (!brevoList) {
            return res.status(404).json({ message: 'Brevo list not found' });
        }

        let sentContacts = 0;
        let failedContacts = 0;
        if (scrapeData.professionals && scrapeData.professionals.length > 0) {
            for (const professional of scrapeData.professionals) {
                let ext_id = uuidv4();
                const transformedData = {
                    email: professional.email,
                    ext_id: ext_id,
                    attributes: {
                        NOM: professional.nom,
                        SERVICES: professional.services
                    },
                    emailBlacklisted: false,
                    smsBlacklisted: false,
                    listIds: [brevoList.brevoId],
                    updateEnabled: false,
                    smtpBlacklistSender: []
                };

                try {
                    await axios.post('https://api.brevo.com/v3/contacts', transformedData, {
                        headers: {
                            'accept': 'application/json',
                            'api-key': brevoAPIKey,
                            'content-type': 'application/json'
                        }
                    });
                    sentContacts++;
                } catch (error) {
                    console.error('Error sending contact to Brevo:', error);
                    // Traiter l'erreur spécifique ici, par exemple enregistrer l'erreur ou ignorer le contact
                    failedContacts++;
                    // Continuer avec le prochain contact sans arrêter la boucle
                }
            }

            res.status(200).json({
                message: `Scrape data sent successfully to Brevo. Sent: ${sentContacts}, Failed: ${failedContacts}`,
            });
        } else {
            res.status(404).json({ message: 'No professionals found in scrape data' });
        }
    } catch (error) {
        console.error('Error sending scrape data to Brevo:', error);
        res.status(500).json({ message: 'Error sending scrape data to Brevo', error: error.message });
    }
};



exports.getBrevoContactLists = async function(req, res) {
  try {
      const response = await axios.get('https://api.brevo.com/v3/contacts/lists', {
          params: {
              limit: 10,
              offset: 0,
              sort: 'desc'
          },
          headers: {
              'accept': 'application/json',
              'api-key': brevoAPIKey
          }
      });

      // Convertir la liste des brevoIds en un tableau pour la comparaison
      const brevoIds = response.data.lists.map(list => list.id);
        
      // Mettre à jour les entrées existantes et ajouter de nouvelles entrées
      const updatePromises = response.data.lists.map(list => {
          return BrevoList.findOneAndUpdate(
              { brevoId: list.id },
              { name: list.name, brevoId: list.id },
              { upsert: true, new: true, setDefaultsOnInsert: true }
          );
      });
      await Promise.all(updatePromises);

      // Supprimer les entrées qui n'existent plus dans Brevo
      await BrevoList.deleteMany({ brevoId: { $nin: brevoIds } });

      res.status(200).json({
          message: 'Lists synchronized successfully',
          data: response.data.lists
      });
  } catch (error) {
      console.error('Error synchronizing lists:', error);
      res.status(500).json({ message: 'Error synchronizing lists', error: error.message });
  }
};

