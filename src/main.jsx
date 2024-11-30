import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './router/router';
import { RouterProvider } from 'react-router-dom';
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './style/main.css'
import Color from '@helper/Color';

const queryClient = new QueryClient();

const toastOptions = {
  style: {
      fontFamily: `"Poppins", sans-serif`, 
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Color />
                <Toaster position="top-center" toastOptions={toastOptions} />
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
