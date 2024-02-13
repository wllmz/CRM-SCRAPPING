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
    // Naviguer vers la route de détail du scrape en utilisant le bon identifiant
    navigate(`/${moduleId}/scrapes/${scrapeId}`);
  };

  return (
<div className='container'>
  <h2 className="mb-4">Liste des Scrapes</h2>
  <div className="row row-cols-1 row-cols-md-2"> {/* Utilisation de row-cols-md-3 pour spécifier 3 cartes par ligne sur les écrans de taille moyenne et plus grands */}
    {scrapes.map((scrape, index) => (
      <div key={scrape._id} className="col mb-5"> {/* Chaque carte occupe toute la largeur sur les écrans de taille moyenne et plus grands */}
        <div className="card h-100 shadow-sm"> {/* Utilisez h-100 pour que toutes les cartes aient la même hauteur */}
          <div className="card-header">
            Scrape {index + 1} - <a href={scrape.url} target="_blank" rel="noopener noreferrer">{scrape.url}</a>
          </div>
          <div className="card-body">
            <button className="btn btn-primary" onClick={() => handleViewMore(scrape._id)}>Voir plus</button>
          </div>
        </div>
      </div>
    ))}
  </div>
  {scrapes.length === 0 && ( /* Afficher un message si aucune scrape n'est trouvée */
    <div className="alert alert-info mt-4" role="alert">
      Aucun scrape trouvé pour ce module.
    </div>
  )}
</div>

  
  );
};

export default ScrapeList;
