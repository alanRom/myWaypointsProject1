// Adapted from: https://www.sitepoint.com/building-a-react-universal-blog-app-a-step-by-step-guide/

import { render } from 'react-dom';
import App from './app';
import { BrowserRouter as Router } from 'react-router-dom';
import React, { Component } from 'react'



const app = document.getElementById('app')
render((
    <Router>
        <App />
    </Router>
), document.getElementById('app'));