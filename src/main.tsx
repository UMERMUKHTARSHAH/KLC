
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/Store';
import { ToastContainer } from 'react-toastify';
import { options } from './Constants/utils.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <ToastContainer {...options} />
        <App />
      </Provider>
    </PersistGate>
  </Router>,
);
