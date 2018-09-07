import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';

export class MapContainer extends Component {

    constructor(props){
        super(props);

        this.mapClicked = this.mapClicked.bind(this);
        this.markerClicked = this.markerClicked.bind(this);
        this.changeCenter = this.changeCenter.bind(this);
        
    }

    mapClicked(mapProps, map, clickEvent) {
        this.props.onMapClick({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
           });
    }

    changeCenter(location){
      const newCenter = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      this.props.changeCenter(newCenter)
    }

    markerClicked(props, marker, e){
      const markerLocation = {
        lat: marker.position.lat(),
        lng: marker.position.lng(),
      };

      this.props.onMarkerClick(markerLocation)
    }

    componentDidMount(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.changeCenter);
      }
    }

  render() {

    const {google, chosenLocations, center} = this.props;
    const initialCenter = {
      lat: 43.0009664,
      lng:  -78.7890755,
   };
    return (
      <Map google={google} zoom={14} 
        onClick={this.mapClicked}
        initialCenter={initialCenter}
        center={center}
        style={{
              width: '75%',  
            }}
      >
        {
            chosenLocations.map(loc => <Marker name='' position={{lat: loc.lat, lng: loc.lng}} onClick={this.markerClicked}/>)
        }

        <InfoWindow onClose={this.onInfoWindowClose}>
            
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
})(MapContainer)