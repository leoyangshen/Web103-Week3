import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Trying without the .jsx extension one last time
import './styles.css?used';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

