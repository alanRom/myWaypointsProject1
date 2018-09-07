import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {clickMap} from './actions/location-actions';
import Map from './MapComponent';
class Home extends Component {
    constructor(props){
      super(props);

      this.onMapClick = this.onMapClick.bind(this);
    }
    onMapClick(location){
      this.props.dispatch(clickMap(location))
    }

    render() {
      const {locations} = this.props.locationReducer;
      return (
          <div>
            <h1>MyWaypoints</h1>
            
            <Map onMapClick={this.onMapClick} chosenLocations={locations}/>
          </div>
        );
    }
  }

 

  export default connect(state => state)(Home);