import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
const Captcha = ({ onCaptchaVerify }) => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);
  console.log(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
  const handleCaptchaChange = (token) => {
    setError(null);
    setCaptchaToken(token);
    if (onCaptchaVerify) {
      onCaptchaVerify(token);
    }
  };

  const handleExpired = () => {
    setCaptchaToken(null);
    setError('Captcha has expired. Please verify again.');
    if (onCaptchaVerify) {
      onCaptchaVerify(null);
    }
  };

  const handleError = () => {
    setCaptchaToken(null);
    setError('Error loading captcha. Please try again.');
    if (onCaptchaVerify) {
      onCaptchaVerify(null);
    }
  };

  const refreshCaptcha = () => {
    setIsLoading(true);
    setError(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setCaptchaToken(null);
    setIsLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
          onExpired={handleExpired}
          onError={handleError}
        />
        <button
          onClick={refreshCaptcha}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          disabled={isLoading}
          aria-label="Refresh Captcha"
        >
          <RefreshCw 
            className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      {isLoading && (
        <p className="text-gray-500 text-sm mt-1">Loading captcha...</p>
      )}
    </div>
  );
};

export default Captcha;