import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Connexion from './pages/Connexion';
import Dashboard from './pages/dashboard';
import ModuleDetail from './pages/module';
import DetailScrape from './components/DetailScrape';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/modules/:moduleId" element={<ModuleDetail />} />
          <Route path="/:moduleId/scrapes/:scrapeId" element={<DetailScrape />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;