import React, { Component } from 'react';
import {  Link } from 'react-router-dom';

class App extends Component {
    componentDidMount() {
      document.body.className = '';
    }
    render() {
      return (
          <div>
            <h1>React Universal Blog</h1>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/work">Work</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>
            {this.props.children}
          </div>
        );
    }
  }
  
  App.defaultProps = {
      children: <div></div>,
  }

  export default App