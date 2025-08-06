import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Hobbies from './pages/Hobbies';
import Ideas from './pages/Ideas';
import Todo from './pages/Todo';

function App() {
  return (
    <Router>
      <div className="App">
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
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </div>
    </Router>
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
