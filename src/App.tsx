import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AffiliateProfiles from './components/companies/Companies';
import Contacts from './components/contacts/Contacts';
import Settings from './components/settings/Settings';
import Opportunities from './components/opportunities/Opportunities';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/affiliate-profiles" element={<AffiliateProfiles />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;