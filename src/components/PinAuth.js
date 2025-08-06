import React, { useState } from 'react';
import './PinAuth.css';

const PinAuth = ({ onAuthSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const CORRECT_PIN = '157415';

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        onAuthSuccess();
      } else {
        setError('Try again!');
        setPin('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && pin.length === 6) {
      handleSubmit(e);
    }
  };

  return (
    <div className="pin-auth-overlay">
      <div className="pin-auth-box">
        <h2>Enter pin:</h2>
        <form onSubmit={handleSubmit} className="pin-form">
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter PIN"
            className="pin-input"
            maxLength="6"
            autoFocus
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button
            type="submit"
            className={`submit-button ${pin.length === 6 ? 'active' : ''}`}
            disabled={pin.length !== 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinAuth; 