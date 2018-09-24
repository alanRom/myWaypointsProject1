import {  ADD_LOCATION, REMOVE_LOCATION, CHANGE_CENTER, TOGGLE_ROUTE_ON_MAP, CLEAR_LOCATIONS, GET_ROUTE, SAVE_CITY_INFO } from '../types/location-type';

export const clickMap = (location) => {
    return dispatch => {
        location.city = '';
        var googleLocation = new google.maps.LatLng(location.lat, location.lng);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': googleLocation}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
             var result;
             if (results.length > 0) {
               result = results[0];
             }
             location.city = result.formatted_address//result.address_components[3].long_name;
             dispatch({
                type: ADD_LOCATION,
                payload:{
                   location: location,
                },
            })
           }  else {
                dispatch({
                    type: ADD_LOCATION,
                    payload:{
                    location: location,
                    },
                })
           }
        });
        
    }
}

export const changeCenter = (location) => {
    return dispatch => {
        dispatch({
            type: CHANGE_CENTER,
            payload: {
                location: location,
            },
        })
    }
}

export const clickMarker = (location) => {
    return dispatch => {
        dispatch({
            type: REMOVE_LOCATION,
            payload: {
                location: location,
            },
        })
    }
}

export const toggleRouteOnMap = () => {
    return dispatch => {
        dispatch({
            type: TOGGLE_ROUTE_ON_MAP,
            payload:{},
        })
    }
}

export const clearDirections = () => {
    return dispatch => {
        dispatch({
            type: CLEAR_LOCATIONS,
            payload: {},
        })
    }
}

export const getRoute = (request) => {
    return dispatch => {


        dispatch({
            type: GET_ROUTE,
            payload:{},
        })
    }
}

export const saveCityInfo = (infoArray) => {
    return dispatch => {
        dispatch({
            type: SAVE_CITY_INFO,
            payload:infoArray,
        })
    }
}