import React, { useEffect, useState } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams, useNavigate } from 'react-router-dom';

const ScrapeList = () => {
  const [scrapes, setScrapes] = useState([]);
  const { moduleId } = useParams();
  const navigate = useNavigate();

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

  const handleViewMore = (scrapeId) => {
    navigate(`/${moduleId}/scrapes/${scrapeId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Utiliser le format 24h
    }).format(date);
  };

  return (
    <div className='container'>
    <h2 className="mb-4">Liste des Scrapes</h2>
    <div className="row row-cols-1 row-cols-md-2">
      {scrapes.map((scrape, index) => (
        <div key={scrape._id} className="col mb-5">
          <div className="card h-100 shadow-sm">
            <div className="card-header">
              <a> date scrape : {formatDate(scrape.dateScraped)}</a> <br></br>
              <a> date scrape update : {scrape.lastUpdated ? formatDate(scrape.lastUpdated) : "pas d'update"}</a> <br></br>
              Scrape {index + 1} - <a href={scrape.url} target="_blank" rel="noopener noreferrer">{scrape.url}</a>
            </div>
            <div className="card-body">
              <button className="btn btn-primary" onClick={() => handleViewMore(scrape._id)}>Voir plus</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    {scrapes.length === 0 && (
      <div className="alert alert-info mt-4" role="alert">
        Aucun scrape trouvé pour ce module.
      </div>
    )}
  </div>
  
  );
};

export default ScrapeList;
