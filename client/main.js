// Adapted from: https://www.sitepoint.com/building-a-react-universal-blog-app-a-step-by-step-guide/

import { render } from 'react-dom';
import App from '../react/app';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { Component } from 'react'
import { Provider  } from 'react-redux'
import store from '../react/store';


const app = document.getElementById('app')
render((
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
), document.getElementById('app'));