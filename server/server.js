import React from 'react'
import { renderToString } from "react-dom/server";
import { StaticRouter as Router, matchPath } from 'react-router';
import express from 'express'
import hogan from 'hogan-express'
import { Provider  } from 'react-redux'
import store from '../react/store';
// Routes
import App from '../react/app'

//Google Maps
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
    Promise: Promise,
  });

// Express
const app = express()


app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/public/'))
app.set('port', (process.env.PORT || 3000))

app.get('*',(req, res) => {
    
    const reactMarkup = renderToString(
        <Provider store={store}>
            <Router context={{}} location={req.url}>
                <App />
            </Router>
        </Provider>
    )

    res.locals.reactMarkup = reactMarkup

    res.status(200).render('index.html')
})


app.post('/directions', (req,res) => {
    var requestDetails = req.body.request;


    googleMapsClient.directions(requestDetails)
    .then(results => {

    })
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))