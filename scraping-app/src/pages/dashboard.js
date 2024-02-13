import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import AllModules from '../components/AllModules';
import CreateModule from '../components/CreateModule';
import AuthService from '../services/AuthService'; 
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function Dashboard() {
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user || !user.token) {
            navigate('/'); // Use navigate for redirection
        }
    }, [navigate]);


    return (
    <div className="container">
    <div class="text-center" style={{ marginTop: '50px'}} >
        <img src="https://ac96b7666e0bdb8ff3253f60ac448ec3.cdn.bubble.io/f1683090427041x993346153580118400/logo-Mylizy.svg" alt="Logo Spotify" style={{ maxWidth: '100px', margin: '0 auto 20px' }} />
    </div>
        <Tabs>
          <TabList>
            {AuthService.isAdmin() && <Tab>Créer un Module</Tab>}
            <Tab>Tous les Modules</Tab>
          </TabList>
  
          {AuthService.isAdmin() && (
            <TabPanel>
              <CreateModule />
            </TabPanel>
          )}
          <TabPanel>
            <AllModules />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
 
export default Dashboard;