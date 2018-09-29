import React, { Component } from 'react';
import {  Route, Switch, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NoMatch from './NotFound';
import Results from './Results';
export default class MainApp extends Component {

  componentDidMount()
  {
    document.getElementById('app').style = '';
  }
  render() {
      
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
          <Link to="/" className="brand-link" ><h3>WayBetter &#945;</h3></Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" 
            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
      
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              
              <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
              
            </ul>
          </div>
        </nav>
        <main className="container-fluid">
          <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/results" exact component={Home}/>
              <Route path="/about"  component={About}/>
              <Route path="*" component={NoMatch}/>
          </Switch>
          
        </main>
      </div>

          );
    }
}
