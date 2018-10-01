import React from 'react'
import { renderToString } from "react-dom/server";
import { StaticRouter as Router, matchPath } from 'react-router';
import express from 'express'
import hogan from 'hogan-express'
import { Provider  } from 'react-redux'
import store from '../react/store';
import bodyParser from 'body-parser';
import decodePolyline from 'decode-google-map-polyline';
import axios from 'axios';

const CITY_PRECISION = 10;

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
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    requestDetails.mode = requestDetails.travelMode.toLowerCase();
    delete requestDetails.travelMode
    googleMapsClient.directions(requestDetails).asPromise()
    .then(results => {
        if(results.json.routes){
            results.json.routes.forEach(element => {
                var points = decodePolyline(element.overview_polyline.points);
                var selectedPoints = [];
                for(let i = 0; i < points.length; i+=CITY_PRECISION){
                    selectedPoints.push(points[i]);
                }
                points = null;

                let promises = selectedPoints.map(elem => {
                    return googleMapsClient.reverseGeocode({latlng: elem}).asPromise()
                });

                Promise.all(promises).then(resultsArray => {
                    var uniqueCities = [];
                    var cityInfo = [];
                    resultsArray.forEach(place => {
                        var address = place.json.results[0].formatted_address.split(/,/g);
                        var city = address[1];
                        var latlng = place.query.latlng.split(',').map(parseFloat);

                        if(uniqueCities.indexOf(city) == -1){
                            var stateZipSplit = address[2].split(' ')
                            var addressToLookup = {city: city, state: stateZipSplit[1], zip: stateZipSplit[2], lat: latlng[0], lng:latlng[1] }
                            uniqueCities.push(city);
                            cityInfo.push(addressToLookup);
                        }
                        
                    })

                    let promiseArray = cityInfo.map(city => {
                        return new Promise((resolve,reject) => {
                            axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${city.zip},us&units=imperial&appid=0e4ff9a19d12c0025cdb34c4349609a1`)
                            .then(weatherResult => {
                                city.weather = weatherResult.data;
                                resolve(city);
                            })
                            .catch(err => {
                                city.weather = null;
                                resolve(city)
                            })
                        });
                    });

                    Promise.all(promiseArray).then(weatherResults => {
                        res.json({
                            results: results,
                            cities: weatherResults,
                        })
                    })
                    .catch(function(err){
                        console.log(err);
                        res.json({
                            results: results,
                            cities: [],
                        })
                    })
                    
                    
                })
                
                
            })

        } else {
            res.json({
                results: results,
                cities: [],
            })
        }
    
        
    })
})


app.post('/locationDetails', (req,res) => {
    var location = req.body.location;
    googleMapsClient.reverseGeocode({latlng: location}).asPromise()
    .then((geocodeResult) => {
        return res.json({
            locationDetails: geocodeResult.json.results[0],
            status: geocodeResult.json.status,
        });
    })
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))