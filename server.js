import React from 'react'
import { renderToString } from "react-dom/server";
import { StaticRouter as Router, matchPath } from 'react-router';
import express from 'express'
import hogan from 'hogan-express'
// Routes
import App from './app'
// Express
const app = express()
app.engine('html', hogan)
app.set('views', __dirname + '/views')
app.use('/', express.static(__dirname + '/public/'))
app.set('port', (process.env.PORT || 3000))

app.get('*',(req, res) => {
    
    const reactMarkup = renderToString(
        <Router context={{}} location={req.url}>
            <App  />
        </Router>
    )

    res.locals.reactMarkup = reactMarkup

    res.status(200).render('index.html')
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))