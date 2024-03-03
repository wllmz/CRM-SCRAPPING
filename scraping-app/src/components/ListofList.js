import React, { useState, useEffect } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form, ListGroup, Alert } from 'react-bootstrap';

const Listofbrevo = () => {
    const [lists, setLists] = useState([]);
    const [selectedListName, setSelectedListName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    const { scrapeId } = useParams();

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const response = await axiosApiInstance.get(`/brevo-contact-lists`);
            setLists(response.data.data);
            if (response.data.data.length > 0) {
                setSelectedListName(response.data.data[0].name);
            }
            // Ajout d'un message de confirmation de l'actualisation
            setMessage('Listes actualisées avec succès.');
        } catch (err) {
            console.error('Erreur lors de la récupération des listes', err);
            // Affichage d'un message d'erreur si la récupération échoue
            setMessage('Erreur lors de la récupération des listes. Veuillez réessayer.');
        }
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setMessage(''); // Réinitialiser le message à chaque ouverture du popup
    };

    const handleSelectChange = (event) => {
        setSelectedListName(event.target.options[event.target.selectedIndex].text);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosApiInstance.post(`/send-scrape/${scrapeId}`, {
                listName: selectedListName,
            });
            // Utilisation du message de l'API pour mettre à jour l'état
            const apiMessage = response.data.message;
            setMessage(apiMessage);
            // togglePopup(); // Supprimez ou commentez cette ligne pour garder le popup ouvert
        } catch (err) {
            console.error(err);
            // Définir un message d'erreur générique ou basé sur l'erreur de l'API
            setMessage('Échec de l\'envoi. Veuillez réessayer plus tard.');
        }
    };
    

    return (
        <div className="container mt-3">
            <Button onClick={togglePopup} variant="secondary" className="ml-2">Envoyer Scrape</Button>

            {message && <Alert variant={message.startsWith('Erreur') ? 'danger' : 'success'} className="mt-3">{message}</Alert>}
            
            <Modal show={showPopup} onHide={togglePopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Envoyer Scrape à Brevo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label htmlFor="listSelect">Choisir une liste :</Form.Label>
                            <Form.Control as="select" id="listSelect" value={selectedListName} onChange={handleSelectChange} required>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.name}>{list.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <div className="text-right">
                            <br/>
                            <Button variant="success" type="submit">Soumettre</Button>
                            <Button variant="danger" onClick={togglePopup} className="ml-2">Fermer</Button>
                        </div>
                    </Form>
                    {message && <Alert variant="info" className="mt-3">{message}</Alert>}
                </Modal.Body>
            </Modal>
    
            {lists.length ? (
                <div className="mt-3">
                    <h2>Listes Synchronisées:</h2>
                    <ListGroup>
                        {lists.map((list) => (
                            <ListGroup.Item key={list.id}>Nom: {list.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ) : (
                <div>Chargement des listes...</div>
            )}
        </div>
    );
};

export default Listofbrevo;
