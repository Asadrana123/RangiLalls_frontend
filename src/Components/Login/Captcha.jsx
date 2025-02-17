import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const generateRandomCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

const Captcha = ({ onChange }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const generateNewCaptcha = () => {
    const newCaptcha = generateRandomCaptcha();
    setCaptchaText(newCaptcha);
    setInputValue('');
    setError('');
    onChange('');
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    setError('');
    onChange(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative bg-gray-100 rounded-md p-2 flex items-center justify-between">
        <div className="flex-1 text-center">
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '24px',
              letterSpacing: '8px',
              fontWeight: 'bold',
              color: '#666',
              userSelect: 'none',
              textDecoration: 'line-through',
              textDecorationStyle: 'wavy',
              textDecorationColor: '#999'
            }}
          >
            {captchaText}
          </div>
        </div>
        <button
          onClick={generateNewCaptcha}
          type="button"
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Refresh Captcha"
        >
          <RefreshCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter above captcha code"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        maxLength={6}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Captcha;