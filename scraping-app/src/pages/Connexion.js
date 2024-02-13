import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function Connexion() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await AuthService.login(email, password);
            console.log(data);
            navigate('/dashboard');
        } catch (error) {
            console.error("Erreur lors de la connexion:", error.response?.data?.message || error.message);
        }
    };


    return (
        <div className="container" style={{ marginTop: '250px' }}>
        <div class="row">
            <div class="col-md-6 offset-md-3">
            <div class="text-center">
        <img src="https://ac96b7666e0bdb8ff3253f60ac448ec3.cdn.bubble.io/f1683090427041x993346153580118400/logo-Mylizy.svg" alt="Logo mylizy" style={{ maxWidth: '100px', margin: '0 auto 20px' }} />
    </div>

                <h2 class="text-center">Page de Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div class="form-group">
                        <label for="email">Email :</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe :</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-success" style={{ margin: '15px' }} >Connexion</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    );
}

export default Connexion;