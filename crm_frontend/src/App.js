
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import CampaignBuilder from './pages/CampaignBuilder';
import CampaignHistory from './pages/CampaignHistory';
import MessageSuggestions from './pages/MessageSuggestions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/campaigns/new"
          element={
            <ProtectedRoute>
              <CampaignBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns/history"
          element={
            <ProtectedRoute>
              <CampaignHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai/messages"
          element={
            <ProtectedRoute>
              <MessageSuggestions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
