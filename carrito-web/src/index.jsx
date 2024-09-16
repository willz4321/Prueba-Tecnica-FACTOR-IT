import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { Tienda } from './Tienda';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import RootLayout from './app/layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootLayout>
      <Provider store={store}>
        <BrowserRouter>
          <Tienda />
        </BrowserRouter>
      </Provider>
    </RootLayout>
</React.StrictMode>
);
