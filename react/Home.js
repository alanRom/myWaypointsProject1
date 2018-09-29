import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {clickMap, changeCenter, clickMarker, toggleRouteOnMap, clearDirections, saveCityInfo} from './actions/location-actions';
import axios from 'axios';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import CityInfo from './CityInfoComponent';
class Home extends Component {
    constructor(props){
      super(props);

      this.map = null;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer()
      this.getDirections = this.getDirections.bind(this);
      this.mapClicked = this.mapClicked.bind(this);
      this.markerClicked = this.markerClicked.bind(this);
      this.changeCenter = this.changeCenter.bind(this);
      this.onMapLoad = this.onMapLoad.bind(this);
      this.clearDirections = this.clearDirections.bind(this)
      
      
    }
   

    onMapLoad(mapProps, map){
      const {google} = mapProps;
      this.map = map;
      const service = new google.maps.places.PlacesService(map);
      this.directionsRenderer.setMap(this.map);

    }

    getDirections(){
      
      let origin =  this.props.locationReducer.origin;
      if(origin == null){
        alert('Please select a starting location!')
        return;
      }
      origin = new google.maps.LatLng(origin.lat, origin.lng)
      let destination = this.props.locationReducer.to;
      if(destination == null){
        alert('Please select a destination!')
        return;
      }
      destination = new google.maps.LatLng(destination.lat, destination.lng)

      let routeRequest = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,

      }

      let thisReference = this;
      axios.post('http://localhost:3000/directions', {
        request: routeRequest,
      })
      .then(function (response) {
        //equivalent to result above is response.data.results.json
        var clientFormattedResults = thisReference.convertNodeFormatToClientFormat(response);
        thisReference.props.dispatch(toggleRouteOnMap());
        thisReference.directionsRenderer.setMap(thisReference.map);
        thisReference.directionsRenderer.setDirections(clientFormattedResults);

        thisReference.props.dispatch(saveCityInfo(response.data.cities));

      })
    }
    convertNodeFormatToClientFormat(nodeResult){
      let clientJSFormatResult = nodeResult.data.results.json;
      
      let origin = nodeResult.data.results.query.origin.split(',').map(parseFloat)
      let destination = nodeResult.data.results.query.destination.split(',').map(parseFloat)
      clientJSFormatResult.request = {
        destination: {
          location: new google.maps.LatLng(destination[0], destination[1]),
        },
        origin: {
          location:new google.maps.LatLng(origin[0], origin[1]),
        },
        travelMode: google.maps.TravelMode.DRIVING,
      }

      if(clientJSFormatResult.routes != null){
        clientJSFormatResult.routes.forEach((route) => {
          let bounds = route.bounds;
          route.bounds = new google.maps.LatLngBounds(bounds.southwest, bounds.northeast);
          //taken from https://stackoverflow.com/questions/29481300/plot-polyline-in-google-maps
          let polylinePoints = google.maps.geometry.encoding.decodePath(route.overview_polyline.points)
          route.overview_path = polylinePoints;
          route.overview_polyline = route.overview_polyline.points;

          if(route.legs != null ){
            route.legs.forEach((leg) => {
              leg.end_location = new google.maps.LatLng(leg.end_location)
              leg.start_location = new google.maps.LatLng(leg.start_location)

              leg.steps.forEach(function(step){
                step.end_point = new google.maps.LatLng(step.end_location);
                step.end_location = new google.maps.LatLng(step.end_location);
                step.start_point = new google.maps.LatLng(step.start_location);
                step.start_location = new google.maps.LatLng(step.start_location);
                step.instructions = step.html_instructions;
                step.encoded_lat_lngs = step.polyline.points;
                step.path = google.maps.geometry.encoding.decodePath(step.polyline.points);
                step.lat_lngs = step.path;
                step.maneuver = '';
              });
            });
          }
        });
      }
      return clientJSFormatResult
    }

    mapClicked(mapProps, map, clickEvent) {
      if(this.props.locationReducer.to != null && this.props.locationReducer.origin != null   ) return;
      this.props.dispatch(clickMap({
        lat: clickEvent.latLng.lat(),
        lng: clickEvent.latLng.lng(),
       }));
    }


    

    changeCenter(location){
      const newCenter = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      this.props.dispatch(changeCenter(newCenter))
    }

    markerClicked(props, marker, e){
      const markerLocation = {
        lat: marker.position.lat(),
        lng: marker.position.lng(),
      };
      this.props.dispatch(clickMarker(markerLocation))
    }

    componentDidMount(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.changeCenter);
      }
    }

    clearDirections(){
      this.directionsRenderer.setMap(null);
      this.props.dispatch(clearDirections());
    }
    

    render() {
      const {center, routeOnMap, to, origin, cities} = this.props.locationReducer;
      const {google} = this.props;
      const initialCenter = { //UB location
        lat: 43.0009664,
        lng:  -78.7890755,
     };
      let fromLocation = origin;
      let toLocation = to;
      let locations = [];

      if(fromLocation != null) locations.push(fromLocation);
      if(toLocation != null) locations.push(toLocation);

      return (
          <div class="row" style={{padding: '10px'}}>
            <div class="col-xs-12 col-md-8">
              <div className="row" >
                <div className="col-xs-12 col-md-4">
                  <b>From:&nbsp;</b>
                  { fromLocation != null ? `${fromLocation.city}` : ''}
                  <br/>
                  <span >
                    { fromLocation != null ? `(${fromLocation.lat}, ${fromLocation.lng})` : ''}
                  </span>
                
                </div>
                <div className="col-xs-12 col-md-4">
                  <b>To:&nbsp;</b>
                  { toLocation != null ? `${toLocation.city}` : ''}
                  <br/>
                  <span >
                    { toLocation != null ? `(${toLocation.lat}, ${toLocation.lng})` : ''}
                  </span>
                </div>
                <div className="col-xs-12 col-md-4">
                  <div className="float-right">
                    <button className="btn btn-primary " onClick={this.getDirections} >Search</button>
                    &nbsp;
                    <button className="btn btn-default " onClick={this.clearDirections}>Clear</button>
                  </div>
                
                </div>
              </div>
              <br/>
              <div className="row" style={{
                position:'relative',
                height: '77vh',
              }}>
                <Map google={google} zoom={10} 
                onClick={this.mapClicked}
                onReady={this.onMapLoad}
                initialCenter={initialCenter}
                center={center}
              
                >
                  {
                    routeOnMap ? '' : locations.map(loc => <Marker name='' position={{lat: loc.lat, lng: loc.lng}} onClick={this.markerClicked}/>)
                  }

                  <InfoWindow onClose={this.onInfoWindowClose}>
                      
                  </InfoWindow>
                </Map>
              </div>
            
            </div>
            <div class="col-xs-12 col-md-4" style={{height: '90vh', overflowY: 'auto'}}>
              {cities.map(city => <CityInfo info={city} />)}
            </div>
           
          </div>
        );
    }
  }

 
 
  export default connect(state => state)(GoogleApiWrapper({
    apiKey: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
  })(Home));