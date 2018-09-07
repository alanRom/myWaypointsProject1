import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {clickMap, changeCenter, clickMarker} from './actions/location-actions';
import Map from './MapComponent';
class Home extends Component {
    constructor(props){
      super(props);

      this.onMapClick = this.onMapClick.bind(this);
      this.onMarkerClick = this.onMarkerClick.bind(this);
      this.changeCenter = this.changeCenter.bind(this);
    }
    onMapClick(location){
      this.props.dispatch(clickMap(location))
    }

    
    changeCenter(location){
      this.props.dispatch(changeCenter(location))
    }

    onMarkerClick(location){
      this.props.dispatch(clickMarker(location))

    }

    render() {
      const {locations,center} = this.props.locationReducer;
      return (
          <div>
            <h1>MyWaypoints </h1>
            
            <Map onMapClick={this.onMapClick} 
                  chosenLocations={locations} 
                  center={center}
                  onMarkerClick={this.onMarkerClick}
                  changeCenter={this.changeCenter} />
          </div>
        );
    }
  }

 

  export default connect(state => state)(Home);