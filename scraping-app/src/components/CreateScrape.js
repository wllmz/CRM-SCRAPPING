import React, { useState } from 'react';
import axiosApiInstance from '../services/axiosApi'; // Assurez-vous que le chemin est correct
import { useParams } from 'react-router-dom';

const ScrapeForm = () => {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState({container: '', nom: '', services: '' });
  const [show, setShow] = useState(false); // Contrôle l'affichage du modal
  const { moduleId } = useParams();
  const scrapeType = 'statique'; // Défini comme dynamique

  const handleScrape = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosApiInstance.post(`/${moduleId}/scrapes`, { url, selectors, scrapeType });
      console.log(response.data);
      setShow(false); 
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors du scraping :", error);
    }
  };

  const handleSelectorChange = (e) => {
    const { name, value } = e.target;
    setSelectors(prevSelectors => ({ ...prevSelectors, [name]: value }));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <button type="button" className="btn btn-primary" onClick={handleShow}>
        Scrape form static
      </button>

      <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Scrape Form</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleScrape}>
                <div className="mb-3">
                  <label htmlFor="url" className="form-label">URL:</label>
                  <input type="text" className="form-control" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="container" className="form-label">Container Selector:</label>
                  <input type="text" className="form-control" name="container" value={selectors.container} onChange={handleSelectorChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="nom" className="form-label">Nom Selector:</label>
                  <input type="text" className="form-control" name="nom" value={selectors.nom} onChange={handleSelectorChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="services" className="form-label">Services Selector:</label>
                  <input type="text" className="form-control" name="services" value={selectors.services} onChange={handleSelectorChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Scrape</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ScrapeForm;
