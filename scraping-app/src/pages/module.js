import React from 'react';
import CreateScrape from '../components/CreateScrape';
import CreateScrapeDynamique from '../components/CreateScrapeDynamique';
import ListScrape from '../components/ListScrape';
import { useNavigate } from 'react-router-dom';


function Module() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Cela ramène l'utilisateur à la page précédente
    };


    return (
<div style={{ margin: '5px' }}>
    <button onClick={goBack} className="btn btn-success">Retour</button>
    <div className="row justify-content-center">
        <div className="col-auto">
            <CreateScrape />
        </div>
        <div className="col-auto">
            <CreateScrapeDynamique />
        </div>
    </div>
    <ListScrape />
</div>

    
    );
}

export default Module;