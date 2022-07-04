import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainBody from "./main_body";
import Background from "./background";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Background />
      <MainBody />
  </React.StrictMode>
);

reportWebVitals();
