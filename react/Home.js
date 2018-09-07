import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import Map from './MapComponent';
class App extends Component {
    componentDidMount() {
      document.body.className = '';
    }
    render() {
      return (
          <div>
            <h1>MyWaypoints</h1>
            <Map />
          </div>
        );
    }
  }
  
  App.defaultProps = {
      children: <div></div>,
  }

  export default App