import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampaignBuilder from './pages/CampaignBuilder';
import CampaignHistory from './pages/CampaignHistory';
import MessageSuggestions from './pages/MessageSuggestions';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/campaigns/new" element={<CampaignBuilder />} />
        <Route path="/" element={<Home />} />
        <Route path="/campaigns/history" element={<CampaignHistory />} />
 <Route path="/campaigns/messages" element={<MessageSuggestions />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return <h1 style={{ textAlign: 'center' }}>Welcome to Xeno CRM</h1>;
}

export default App;
