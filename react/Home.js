import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {clickMap, changeCenter, clickMarker, toggleRouteOnMap, clearDirections} from './actions/location-actions';

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

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

    }

    getDirections(){
      
      this.directionsRenderer.setMap(this.map);
      let origin =  this.props.locationReducer.locations[0];
      origin = new google.maps.LatLng(origin.lat, origin.lng)
      let destination = this.props.locationReducer.locations[1];
      destination = new google.maps.LatLng(destination.lat, destination.lng)

      let routeRequest = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
      }


      this.directionsService.route(routeRequest, (result, status)=>{
        console.log(result,status)
        this.directionsRenderer.setDirections(result);
        
      })
      this.props.dispatch(toggleRouteOnMap());
    }

    mapClicked(mapProps, map, clickEvent) {
      if(this.props.locationReducer.locations.length >=2 ) return;
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
      const {locations,center, routeOnMap} = this.props.locationReducer;
      const {google} = this.props;
      const initialCenter = { //UB location
        lat: 43.0009664,
        lng:  -78.7890755,
     };
      let fromLocation = locations.length > 0 ? locations[0] : null;
      let toLocation = locations.length > 1 ? locations[1] : null;

      return (
          <div class="row" style={{padding: '10px'}}>
          <div class="col-xs-12 col-md-8">
            <div className="row">
              <div className="col">
                <b>From:&nbsp;</b>
                { fromLocation != null ? `${fromLocation.city}` : ''}
                <br/>
                { fromLocation != null ? `(${fromLocation.lat},${fromLocation.lng})` : ''}
              </div>
              <div className="col">
                <b>To:&nbsp;</b>
                { toLocation != null ? `${toLocation.city}` : ''}
                <br/>
                { toLocation != null ? `(${toLocation.lat},${toLocation.lng})` : ''}
              </div>
              <div className="col-3">
                <button className="btn btn-primary" onClick={this.getDirections}>Search</button>
                &nbsp;
                <button className="btn btn-default" onClick={this.clearDirections}>Clear</button>
              </div>
            </div>
            <br/>
            <div style={{height: '70vh'}}>
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
          <div class="col-xs-12 col-md-4">
            <b>Results:</b>
          </div>
           
          </div>
        );
    }
  }

 
 
  export default connect(state => state)(GoogleApiWrapper({
    apiKey: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
  })(Home));