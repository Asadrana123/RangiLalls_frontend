import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from "../src/redux/store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* ✅ Wrap App with HelmetProvider */}
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
