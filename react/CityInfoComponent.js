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
                let formattedDate = `${parseInt(splitDatePieces[1])}/${parseInt(splitDatePieces[2])}`
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
                let weatherCode = '';
                let colorCode = '#ececec';
                switch(weatherIcon){
                    case '01d':
                    case '01n':
                        weatherCode = 'wi-day-sunny';
                        colorCode = '#ffe428';
                        break;
                    case '02d':
                    case '02n':
                        weatherCode = 'wi-day-cloudy';
                        colorCode = '#c8a104';
                        break;
                    case '03d':
                    case '03n':
                        weatherCode = 'wi-cloud';
                        colorCode = '#c0c0c0';
                        break;
                    case '04d':
                    case '04n':
                        weatherCode = 'wi-cloudy';
                        colorCode = '#708090';
                        break;
                    case '09d':
                    case '09n':
                        weatherCode = 'wi-day-showers';
                        colorCode = '#6495ed';
                        break;
                    case '10d':
                    case '10n':
                        weatherCode = 'wi-rain';
                        colorCode = '#4169e1';
                        break;
                    case '11d':
                    case '11n':
                        weatherCode = 'wi-thunderstorm';
                        colorCode = '#db7093';
                        break;
                    case '13d':
                    case '13n':
                        weatherCode = 'wi-snow';
                        weatherCode = '#87cefa';
                        break;
                    case '50d':
                    case '50n':
                        weatherCode = 'wi-day-haze';
                        colorCode = '#2e8b57';
                        break;
                }
                return <div style={{
                    flex:'0 0 120px',
                    padding: '5px 10px',
                    margin: '5px 10px',
                    border: '1px solid #ececec',
                    //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2',
                    borderRadius: '5px',
                    backgroundColor: colorCode,
                    color: 'white',
                    }}>
                        {formattedDate}
                        <br/>
                        <i className={"wi " + weatherCode} ></i>
                        <br/>
                        <span>High: {maxOfEntireDay}&#176;F</span>
                        <br/>
                        <span>Low: {minOfEntireDay}&#176;F</span>
                </div>
    
            })
        } else {
            weatherDisplays = <span style={{textAlign: 'center'}}><i>Weather not available</i></span>
        }
        /*
        <img
                        src={imageURL}
                        /> */
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

