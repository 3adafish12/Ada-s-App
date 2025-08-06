import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Hobbies from './pages/Hobbies';
import Ideas from './pages/Ideas';
import Todo from './pages/Todo';
import PinAuth from './components/PinAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated (persist across page refreshes)
  useEffect(() => {
    const authStatus = localStorage.getItem('adaAppAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('adaAppAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adaAppAuthenticated');
  };

  return (
    <div className="App">
      {/* Show the main app content */}
      <Router>
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Ada's App
            </Link>
            <div className="nav-menu">
              <Link to="/hobbies" className="nav-link">Hobbies</Link>
              <Link to="/ideas" className="nav-link">Ideas</Link>
              <Link to="/todo" className="nav-link">To-Do</Link>
            </div>
            <button onClick={handleLogout} className="logout-button">
              🔓 Logout
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </Router>

      {/* Show pin authentication overlay if not authenticated */}
      {!isAuthenticated && <PinAuth onAuthSuccess={handleAuthSuccess} />}
    </div>
  );


}

function HomePage() {
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="welcome-title">Welcome Ada!</h1>
        
      </div>
      
    
    </div>
  );
}

export default App;
