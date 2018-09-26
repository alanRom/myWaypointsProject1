import React, { Component } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default class CityInfoComponent extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let {info} = this.props;
        let weatherGroups = {};
        let weatherDisplays = [];

        if(info.weather){
            info.weather.list.forEach(hourInterval => {
                let curDate = hourInterval.dt_txt.split(' ')[0];
                if(weatherGroups[curDate] == null){
                    weatherGroups[curDate] = [hourInterval];
                } else {
                    weatherGroups[curDate].push(hourInterval);
                }
            });
            console.log(weatherGroups)
            weatherDisplays = Object.keys(weatherGroups).map(key => {
                let weatherDay = weatherGroups[key];
                let splitDatePieces = weatherDay[0].dt_txt.split(' ')[0].split('-');
                let formattedDate = `${splitDatePieces[1]}/${splitDatePieces[2]}`
                //for Simplicity, show only high and low of day
                let minOfEntireDay = 900;
                let maxOfEntireDay = 0;

                weatherDay.forEach((weatherHour) => {
                    let curMin = parseFloat(weatherHour.main.temp_min);
                    let curMax = parseFloat(weatherHour.main.temp_max);

                    if(curMin < minOfEntireDay){
                        minOfEntireDay = curMin;
                    } 
                    if(curMax > maxOfEntireDay){
                        maxOfEntireDay = curMax;
                    }
                })

                minOfEntireDay = Math.round(minOfEntireDay);
                maxOfEntireDay = Math.round(maxOfEntireDay);
                const weatherIcon = weatherDay[0].weather[0].icon;
                const imageURL  = `http://openweathermap.org/img/w/${weatherIcon}.png`;
                return <div style={{
                    display:'flex',
                    flex:'0 0 120px',
                    padding: '10px',
                    margin: '10px',
                    border: '1px solid #ececec',
                    //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2',
                    borderRadius: '5px',
                    }}>
                   <div  >
                        {formattedDate}<br/>
                        <img
                        src={imageURL}
                        />
                        <br/>
                        <span>High: {maxOfEntireDay}&#176;F</span>
                        <br/>
                        <span>Low: {minOfEntireDay}&#176;F</span>
                   </div>
                </div>
    
            })
        }
        
        return <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ececec',
            //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2',
            borderRadius: '5px',
        }}>
            {info.city}, {info.state}
            <br/>
            <div  style={{
                overflowX: 'auto',
                padding: '10px',
                display: 'flex',
            }}>
                {weatherDisplays}
            </div>
        </div>
    }
}

