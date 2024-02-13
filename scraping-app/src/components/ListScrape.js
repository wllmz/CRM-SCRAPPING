import React, { useEffect, useState } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams } from 'react-router-dom';

const ScrapeList = () => {
  const [scrapes, setScrapes] = useState([]);
  const { moduleId } = useParams();

  useEffect(() => {
    const fetchScrapes = async () => {
      try {
        const response = await axiosApiInstance.get(`/${moduleId}/scrapes`);
        setScrapes(response.data);
      } catch (err) {
        console.log('Erreur lors de la récupération des scrapes', err);
      }
    };

    fetchScrapes();
  }, [moduleId]);

  return (
    <div>
      <h2 className="mb-4">Liste des Scrapes</h2>
      {scrapes.length > 0 ? (
        scrapes.map((scrape, scrapeIndex) => (
          <div key={scrapeIndex} className="card mb-3">
            <div className="card-header">Scrape {scrapeIndex + 1}</div>
            {scrape.professionals.length > 0 ? (
              <ul className="list-group list-group-flush">
                {scrape.professionals.map((professional, index) => (
            <li key={index} className="list-group-item">
            <div className="d-flex justify-content-start align-items-center">
              <img src={professional.image} alt={professional.nom} className="img-fluid img-thumbnail mr-3" style={{maxWidth: '100px', maxHeight: '100px'}} />
              <div>
                <strong>Nom:</strong> {professional.nom}<br />
                <strong>Services:</strong> {professional.services}<br />
                <strong>Adresse:</strong> {professional.adresse}<br />
                <strong>Mail:</strong> {professional.email}<br />
              </div>
            </div>
          </li>
          
                ))}
              </ul>
            ) : (
              <div className="card-body">Aucun professionnel trouvé pour ce scrape.</div>
            )}
          </div>
        ))
      ) : (
        <div className="alert alert-info" role="alert">
          Aucun scrape trouvé pour ce module.
        </div>
      )}
    </div>
  );
};

export default ScrapeList;
