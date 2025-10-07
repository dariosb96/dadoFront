import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import './index.css'
import store from './Redux/store.js'
import { BrowserRouter } from 'react-router-dom'

const container = document.getElementById('root');
const root= createRoot(container);


root.render(
    <Provider store={store} stabilityCheck="never" >
    <BrowserRouter>
     <App/>
    </BrowserRouter>
  </Provider>
);


