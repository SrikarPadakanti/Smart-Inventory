import React, { useState } from 'react';
import ProductDashboard from './ProductDashboard'; // move your existing logic to this component

function App() {
  const [view, setView] = useState('dashboard'); // dashboard | reports | settings

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      {/* Simple Navigation */}
      <nav style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('reports')}>Reports</button>
        <button onClick={() => setView('settings')}>Settings</button>
      </nav>

      {/* Conditional Rendering of Views */}
      {view === 'dashboard' && <ProductDashboard />}
      {view === 'reports' && <h2>📊 Reports Coming Soon...</h2>}
      {view === 'settings' && <h2>⚙️ Settings Coming Soon...</h2>}
    </div>
  );
}

export default App;
