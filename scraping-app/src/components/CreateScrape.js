import React, { useState } from 'react';
import axiosApiInstance from '../services/axiosApi'; // Assurez-vous que le chemin d'importation est correct
import { useParams } from 'react-router-dom';

const ScrapeForm = () => {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState({ container: '', nom: '', services: '', adresse: '' });
  const { moduleId } = useParams();

  const handleScrape = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosApiInstance.post(`/${moduleId}/scrapes`, {
        url,
        selectors,
      });

      console.log(response.data);
      window.location.reload();
    } catch (error) {
      // Gérez les erreurs ici
      console.error("Erreur lors du scsssraping :", error);
    }
  };


  const handleSelectorChange = (e) => {
    const { name, value } = e.target;
    setSelectors(prevSelectors => ({
      ...prevSelectors,
      [name]: value
    }));
  };

  return (
<div className="container">
  <form onSubmit={handleScrape}>
    <div className="mb-3">
      <label htmlFor="url" className="form-label">URL:</label>
      <input type="text" id="url" className="form-control" value={url} onChange={(e) => setUrl(e.target.value)} />
    </div>
    <div className="mb-3">
      <label htmlFor="container" className="form-label">Container Selector:</label>
      <input type="text" id="container" className="form-control" name="container" value={selectors.container} onChange={handleSelectorChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="nom" className="form-label">Nom Selector:</label>
      <input type="text" id="nom" className="form-control" name="nom" value={selectors.nom} onChange={handleSelectorChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="services" className="form-label">Services Selector:</label>
      <input type="text" id="services" className="form-control" name="services" value={selectors.services} onChange={handleSelectorChange} />
    </div>
    <div className="mb-3">
      <label htmlFor="adresse" className="form-label">Adresse Selector:</label>
      <input type="text" id="adresse" className="form-control" name="adresse" value={selectors.adresse} onChange={handleSelectorChange} />
    </div>
    <button type="submit" className="btn btn-primary">Scrape</button>
  </form>
</div>

  );
};

export default ScrapeForm;
