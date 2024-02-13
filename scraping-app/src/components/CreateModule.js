import React, { useState, useEffect } from 'react';
import axiosApiInstance from '../services/axiosApi';

function ManageModules() {
    const [modules, setModules] = useState([]);
    const [moduleData, setModuleData] = useState({ module: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await axiosApiInstance.get('/modules');
            setModules(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des modules:", error);
        }
    };

    const handleSubmit = async () => {
        if (!moduleData.module.trim()) return;

        try {
            if (isEditing) {
                await axiosApiInstance.put(`/modules/${moduleData._id}`, moduleData);
            } else {
                await axiosApiInstance.post('/modules', moduleData);
            }
            setModuleData({ module: '' });
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la création ou de la mise à jour du module:", error);
        }
    };

    const handleEdit = (module) => {
        setModuleData({ ...module });
        setIsEditing(true);
    };

    const handleDelete = async (moduleId) => {
        try {
            await axiosApiInstance.delete(`/modules/${moduleId}`);
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la suppression du module:", error);
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div className="col-md-8 mx-auto"> 
                <h3>Gérer les Modules</h3>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        name="module"
                        value={moduleData.module}
                        onChange={(e) => setModuleData({ ...moduleData, module: e.target.value })}
                        placeholder="Nom du module"
                    />
                </div>
                <button className="btn btn-success" onClick={handleSubmit} style={{ margin: '20px' }}>
                    {isEditing ? 'Mettre à jour' : 'Créer'}
                </button>
            
                <ul className="list-group">
                    {modules.map(module => (
                        <li key={module._id} className="list-group-item" style={{ margin: '15px' }}>
                            {module.module}
                            <button className="btn btn-success" onClick={() => handleEdit(module)} style={{ marginLeft: '10px', marginRight: '10px' }}>
                                Modifier
                            </button>
                            <button className="btn btn-danger ml-2" onClick={() => handleDelete(module._id)}>
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ManageModules;
