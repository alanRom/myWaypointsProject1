import React, { Component } from 'react';

export default class CityInfoComponent extends Component{
    constructor(props){
        super(props);


    }

    render(){
        let {info} = this.props;

        return <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ececec',
            //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2',
            borderRadius: '5px',
        }}>
            {info.city}, {info.state}
        </div>
    }
}

