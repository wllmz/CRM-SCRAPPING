import React, { useState } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams } from 'react-router-dom';

const ScrapeFormDynamique = () => {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState({ linkselector: '', nom: '', services: '' });
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  const { moduleId } = useParams();

  const handleScrape = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Commence le chargement
    try {
      const response = await axiosApiInstance.post(`/${moduleId}/scrapes/dynamique`, { url, selectors });
      console.log(response.data);
      setShow(false);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors du scraping :", error);
    } finally {
      setIsLoading(false); // Arrête le chargement
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
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          <button type="button" className="btn btn-primary" onClick={handleShow}>
            Scrape Form Dynamique
          </button>

          <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Scrape Form Dynamique</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleScrape}>
                    <div className="mb-3">
                      <label htmlFor="url" className="form-label">URL:</label>
                      <input type="text" className="form-control" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="linkselector" className="form-label">Link Selector:</label>
                      <input type="text" className="form-control" name="linkselector" value={selectors.linkselector} onChange={handleSelectorChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nom" className="form-label">Nom Selector:</label>
                      <input type="text" className="form-control" name="nom" value={selectors.nom} onChange={handleSelectorChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nom" className="form-label">Services Selector:</label>
                      <input type="text" className="form-control" name="services" value={selectors.services} onChange={handleSelectorChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Scrape</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {show && <div className="modal-backdrop fade show"></div>}
        </>
      )}
    </div>
  );
};



export default ScrapeFormDynamique;
