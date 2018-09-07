import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';

export class MapContainer extends Component {

    constructor(props){
        super(props);

        this.mapClicked = this.mapClicked.bind(this);

        
    }

    mapClicked(mapProps, map, clickEvent) {
        this.props.onMapClick({
            lat: clickEvent.latLng.lat(),
            lng: clickEvent.latLng.lng(),
           });
    }
      

  render() {

    const {google, chosenLocations} = this.props;
    return (
      <Map google={google} zoom={14} 
        onClick={this.mapClicked}
        style={{
              width: '75%',  
            }}
      >
        {
            chosenLocations.map(loc => <Marker name='' position={{lat: loc.lat, lng: loc.lng}}/>)
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