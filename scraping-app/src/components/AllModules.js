import React, { useEffect, useState } from 'react';
import axiosApiInstance from '../services/axiosApi'; 
import { useNavigate } from 'react-router-dom';

function AllModules() {
    const [modules, setModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllModules = async () => {
            try {
                const response = await axiosApiInstance.get('/modules');
                setModules(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des modules:", error);
                
            }
        };

        fetchAllModules();
    }, []);

    const handleViewDetails = (moduleId) => {
        navigate(`/modules/${moduleId}`);
    };

    return (
        <div className="container"  style={{ marginTop: '50px' }}>
        <h3 className="text-center">Tous les Modules</h3>
        <div className="row">
            {modules.map((module) => (
                <div className="col-md-4" key={module._id}>
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">{module.module}</h5>
                            <p className="card-text">Créé le: {new Date(module.created_at).toLocaleDateString()}</p>
                            <button className="btn btn-success" onClick={() => handleViewDetails(module._id)}>Voir Détails</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    
    
    
    );
}

export default AllModules;