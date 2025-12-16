import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import VotingScreen from './components/VotingScreen';
import Dashboard from './components/Dashboard';
import { hasUserVoted } from './services/voteService';

const App: React.FC = () => {
  const [view, setView] = useState<'voting' | 'dashboard'>('voting');

  useEffect(() => {
    // Check if user has already voted on initial load
    if (hasUserVoted()) {
      setView('dashboard');
    }
  }, []);

  const handleVoteSuccess = () => {
    setView('dashboard');
  };

  return (
    <Layout>
      {view === 'voting' ? (
        <VotingScreen onVoteSuccess={handleVoteSuccess} />
      ) : (
        <Dashboard />
      )}
    </Layout>
  );
};

export default App;