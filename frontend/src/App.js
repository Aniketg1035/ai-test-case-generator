import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const navStyles = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    padding: '15px',
    background: 'rgba(0,0,0,0.3)',
  },
  link: {
    padding: '8px 20px',
    borderRadius: '30px',
    textDecoration: 'none',
    color: '#ccc',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  activeLink: {
    background: 'linear-gradient(90deg, #00d2ff, #7b2ff7)',
    color: 'white',
  },
};

function NavBar() {
  const location = useLocation();

  return (
    <div style={navStyles.nav}>
      <Link
        to="/"
        style={{
          ...navStyles.link,
          ...(location.pathname === '/' ? navStyles.activeLink : {}),
        }}
      >
        🚀 Generate
      </Link>
      <Link
        to="/dashboard"
        style={{
          ...navStyles.link,
          ...(location.pathname === '/dashboard' ? navStyles.activeLink : {}),
        }}
      >
        📊 Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;