import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';

export class MapContainer extends Component {

constructor(props){
    super(props);

    this.mapClicked = this.mapClicked.bind(this);
}

    mapClicked(mapProps, map, clickEvent) {
        console.log(clickEvent.oa.x,clickEvent.oa.y )
    }
      

  render() {
    return (
      <Map google={this.props.google} zoom={14} 
        onClick={this.mapClicked}
        style={
            {
              width: '75%',  
            }
        }
      >


        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>Hi</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCrm3ndY68Krfr0ZAh5h70xHqEPhnp44ww',
})(MapContainer)