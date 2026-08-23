import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes';
import { subscribeToDataChanges } from './api/cloudSync';

export const App: React.FC = () => {
  useEffect(() => {
    subscribeToDataChanges((key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {}
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 1800,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.625rem',
                fontSize: '0.8125rem',
                padding: '8px 12px',
                maxWidth: '300px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              },
              success: {
                duration: 1600,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#0f172a',
                },
              },
              error: {
                duration: 2200,
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#0f172a',
                },
              },
            }}
          />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
