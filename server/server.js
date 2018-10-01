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
import { parse } from 'querystring';

//Google Maps
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
    Promise: Promise,
  });

// Express
const app = express()
var mongodb;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {

    mongodb = db.db("waybetter");



});

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


app.post('/directions', async (req,res) => {
    var requestDetails = req.body.request;
    requestDetails.mode = requestDetails.travelMode.toLowerCase();
    delete requestDetails.travelMode

    let results = await mongodb.collection('map_response').findOne({
        "origin.lat": requestDetails.origin.lat,
        "origin.lng": requestDetails.origin.lng,
        "destination.lat": requestDetails.destination.lat,
        "destination.lng": requestDetails.destination.lng,

    })

    if(results == null){
        results = await googleMapsClient.directions(requestDetails).asPromise();
        mongodb.collection('map_response').insertOne({
            request: requestDetails,
            response: results,
        });
    } else {
        results = results.response
    }
    
    if(results.json.routes){
        results.json.routes.forEach(element => {
            var points = decodePolyline(element.overview_polyline.points);
            var selectedPoints = [];
            for(let i = 0; i < points.length; i+=CITY_PRECISION){
                selectedPoints.push(points[i]);
            }
            points = null;
            let promises = selectedPoints.map(elem => {
                let fourDigitLat = parseFloat(parseFloat(elem.lat).toFixed(4));
                let fourDigitLng = parseFloat(parseFloat(elem.lng).toFixed(4));
                return mongodb.collection('location_response').findOne({
                    "request.lat": fourDigitLat,
                    "request.lng": fourDigitLng,
                }) .then((dbLocationResult)=> {
                    if(dbLocationResult == null){
                        return googleMapsClient.reverseGeocode({latlng:{lat: fourDigitLat, lng: fourDigitLng}}).asPromise()
                        .then((googleLocationResult) => {
                            mongodb.collection('location_response').insertOne({
                                request: {
                                    lat: fourDigitLat,
                                    lng: fourDigitLng,
                                },
                                response: googleLocationResult,
                            })

                            return googleLocationResult
                        })
                    } else {
                        return dbLocationResult.response
                    }
                })
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
                        let lastHour  = new Date().getHours > 0 ? new Date().getHours() - 1 : 0;
                        mongodb.collection('weather_response').findOne({
                            zip: {
                                $eq: city.zip,
                            },
                            date: {
                                $gt: new Date(new Date().setHours(lastHour, 0 ,0 ,0)),
                            },
                            
                        }).then(dbWeatherResult => {
                            if(dbWeatherResult != null){
                                city.weather = dbWeatherResult.response;
                                resolve(city);
                            } else {
                                 axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${city.zip},us&units=imperial&appid=0e4ff9a19d12c0025cdb34c4349609a1`)
                                .then(weatherResult => {
                                    mongodb.collection('weather_response').insertOne({
                                        zip: city.zip,
                                        date: new Date(),
                                        response: weatherResult.data,
                                    })
                                    city.weather = weatherResult.data;
                                    resolve(city);
                                })
                                .catch(err => {
                                    city.weather = null;
                                    resolve(city)
                                })
                            }
                        })

                        
                    });
                });

                Promise.all(promiseArray).then(weatherResults => {
                    res.json({
                        results: results,
                        cities: weatherResults.filter(city => city.weather != null),
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


app.post('/locationDetails', async (req,res) => {
    var location = req.body.location;
    
    
    mongodb.collection('location_response').findOne({
        "request.lat": location.lat,
        "request.lng": location.lng,

    })
    .then(function(dbLookup){

        if(dbLookup != null){
            return res.json(dbLookup.response);
        }

         googleMapsClient.reverseGeocode({latlng: location}).asPromise()
        .then((geocodeResult) => {
            mongodb.collection('location_response').insertOne({
                request: location,
                response: {
                    locationDetails: geocodeResult.json.results[0],
                    status: geocodeResult.json.status,
                },
            });
            
            return res.json({
                locationDetails: geocodeResult.json.results[0],
                status: geocodeResult.json.status,
            });
        })
    });
    
        
   
})

app.listen(app.get('port'))

console.info('==> Server is listening in ' + process.env.NODE_ENV + ' mode')
console.info('==> Go to http://localhost:%s', app.get('port'))