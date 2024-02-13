import React, { useEffect, useState } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams, useNavigate } from 'react-router-dom';

const DetailScrape = () => {
  const [scrape, setScrape] = useState(null); // Modifier pour stocker un seul objet scrape
  const { moduleId, scrapeId } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
      navigate(-1); // Cela ramène l'utilisateur à la page précédente
  };


  useEffect(() => {
    const fetchScrapeDetails = async () => {
      try {
        const response = await axiosApiInstance.get(`/${moduleId}/scrapes/${scrapeId}`);
        setScrape(response.data); // Mettre à jour pour stocker la réponse directement
      } catch (err) {
        console.log('Erreur lors de la récupération du scrape', err);
      }
    };

    fetchScrapeDetails();
  }, [moduleId, scrapeId]);


  const deleteScrape = async () => {
    try {
      await axiosApiInstance.delete(`/scrapes/${scrapeId}`);
      navigate(-1); // Rediriger l'utilisateur après la suppression
    } catch (err) {
      console.error('Erreur lors de la suppression du scrape', err);
    }
  };

  const updateScrape = async () => {
    try {
      await axiosApiInstance.put(`/scrapes/${scrapeId}`);
      navigate(0); 
    } catch (err) {
      console.error('Erreur lors de la mise à jour du scrape', err);
    }
  };

  return (
    <div>
         <button onClick={goBack} className="btn btn-success">Retour</button>
      <h2 className="mb-4">Détails du Scrape</h2>
      {scrape ? (
        <div className="card mb-3">
          <ul>
          <button onClick={deleteScrape} className="btn btn-danger">Supprimer</button>
         <button onClick={updateScrape} className="btn btn-primary">Mettre à Jour</button>
         </ul>
          <div className="card-header">URL du Scrape: {scrape.url}</div>
          {scrape.professionals && scrape.professionals.length > 0 ? (
            <ul className="list-group list-group-flush">
              {scrape.professionals.map((professional, index) => (
                <li key={index} className="list-group-item">
                  <strong>Nom:</strong> {professional.nom}<br />
                  <strong>Services:</strong> {professional.services}<br />
                  <strong>Adresse:</strong> {professional.adresse}<br />
                  <strong>Email:</strong> {professional.email}
                </li>
                
              ))}
            </ul>
          ) : (
            <div className="card-body">Aucun professionnel trouvé pour ce scrape.</div>
          )}
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          Aucun détail trouvé pour ce scrape.
        </div>
      )}
    </div>
  );
};

export default DetailScrape;
