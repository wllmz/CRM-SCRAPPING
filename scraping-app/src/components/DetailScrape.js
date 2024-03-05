import React, { useEffect, useState } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams, useNavigate } from 'react-router-dom';
import ListofList from '../components/ListofList';
import { Button, ListGroup, Alert, Modal } from 'react-bootstrap';

const DetailScrape = () => {
  const [scrape, setScrape] = useState(null);
  const { moduleId, scrapeId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showListModal, setShowListModal] = useState(false); // État pour le modal ListofList

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchScrapeDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosApiInstance.get(`/${moduleId}/scrapes/${scrapeId}`);
        setScrape(response.data);
      } catch (err) {
        console.log('Erreur lors de la récupération du scrape', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScrapeDetails();
  }, [moduleId, scrapeId]);

  const deleteScrape = async () => {
    try {
      await axiosApiInstance.delete(`/scrapes/${scrapeId}`);
      navigate(-1);
    } catch (err) {
      console.error('Erreur lors de la suppression du scrape', err);
    }
  };

  const updateScrape = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosApiInstance.put(`/scrapes/${scrapeId}`);
      // Re-fetching the scrape details might not be necessary if the PUT request response includes the updated data
      // Consider using the response to update state if applicable
      const updatedScrape = await axiosApiInstance.get(`/${moduleId}/scrapes/${scrapeId}`);
      setScrape(updatedScrape.data);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du scrape', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions pour gérer l'affichage du modal
  const handleShowListModal = () => setShowListModal(true);
  const handleCloseListModal = () => setShowListModal(false);

  return (
    <div className="container mt-3">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
      <Button variant="success" onClick={goBack}>Retour</Button>
      </div>
      <h2>Détails du Scrape</h2>
      <div>
        <Button variant="danger" onClick={deleteScrape} className="me-2">Supprimer</Button>
        <Button variant="primary" onClick={updateScrape} className="me-2">Mettre à Jour</Button>
      </div>
    </div>
  


  
  <div>
    <Button variant="info" onClick={handleShowListModal}>Voir Listes</Button>
  </div>
  <br></br>

      {isLoading ? (
          <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border" role="status">
                  <span className="sr-only">Chargement...</span>
              </div>
          </div>
      ) : scrape ? (
          <>
              <div className="card mb-3">
                  <div className="card-header">
                    <ul>
                      <li>URL du Scrape: <a href={scrape.url} target="_blank" rel="noopener noreferrer">{scrape.url}</a></li>
                     <li> Nombre : {scrape.professionals ? scrape.professionals.length : 0}</li>
                      </ul>
                  </div>
                  <ListGroup variant="flush">
                      {scrape.professionals && scrape.professionals.length > 0 ? (
                          scrape.professionals.map((professional, index) => (
                              <ListGroup.Item key={index}>
                                  <strong>Nom:</strong> {professional.nom}<br />
                                  <strong>Services:</strong> {professional.services}<br />
                                  <strong>Email:</strong> {professional.email}<br />
                                  <strong>Tel:</strong> {professional.tel}
                              </ListGroup.Item>
                          ))
                      ) : (
                          <div className="card-body">Aucun professionnel trouvé pour ce scrape.</div>
                      )}
                  </ListGroup>
                 
                  <div className="card-footer text-muted">
                  </div>
              </div>
          </>
      ) : (
          <Alert variant="info">Aucun détail trouvé pour ce scrape.</Alert>
      )}

      <Modal show={showListModal} onHide={handleCloseListModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Listes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListofList />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseListModal}>Fermer</Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailScrape;
