import React, { useState } from 'react';
import './PinAuth.css';

const PinAuth = ({ onAuthSuccess }) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAgree = () => {
    setHasAgreed(true);
    setIsLoading(true);
    
    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      onAuthSuccess();
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="pin-auth-overlay">
      <div className="pin-auth-box">
        <h2>Welcome! This is Ada's test website. Enjoy :)</h2>
        <div className="honor-buttons">
          <button
            onClick={handleAgree}
            className="agree-button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'ok'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinAuth; 