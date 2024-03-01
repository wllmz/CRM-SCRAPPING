import React, { useState, useEffect } from 'react';
import axiosApiInstance from '../services/axiosApi';
import { useParams } from 'react-router-dom';

const Listofbrevo = () => {
    const [lists, setLists] = useState([]);
    const [selectedListName, setSelectedListName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState(''); // Ajout d'un état pour stocker le message
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
        } catch (err) {
            console.error('Erreur lors de la récupération des listes', err);
        }
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setMessage(''); // Réinitialise le message à chaque ouverture du popup
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
            console.log(response.data);
            setMessage('Scrape envoyé avec succès à Brevo.'); // Message de succès
            togglePopup();
        } catch (err) {
            console.error(err);
            // Ici, vous pourriez définir des messages d'erreur basés sur la réponse de l'API
            setMessage('Échec de l\'envoi. Vérifiez si les contacts existent déjà ou réessayez.');
        }
    };

    return (
        <div>
            <button onClick={fetchLists} className="btn btn-primary">Actualiser les listes</button>
            <button onClick={togglePopup} className="btn btn-secondary">Envoyer Scrape</button>
            
            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h3>Envoyer Scrape à Brevo</h3>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="listSelect">Choisir une liste :</label>
                            <select id="listSelect" value={selectedListName} onChange={handleSelectChange} required>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.name}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                            <div>
                                <button type="submit" className="btn btn-primary">Soumettre</button>
                                <button type="button" className="btn btn-light" onClick={togglePopup}>Fermer</button>
                            </div>
                        </form>
                        {message && <div className="alert alert-info mt-3">{message}</div>}
                    </div>
                </div>
            )}

            {lists.length ? (
                <div>
                    <h2>Listes Synchronisées:</h2>
                    <ul>
                        {lists.map((list) => (
                            <li key={list.id}>Nom: {list.name}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>Chargement des listes...</div>
            )}
        </div>
    );
};

export default Listofbrevo;
