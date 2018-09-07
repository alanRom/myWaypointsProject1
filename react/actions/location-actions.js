import {  ADD_LOCATION, REMOVE_LOCATION, CHANGE_CENTER } from '../types/location-type';

export const clickMap = (location) => {
    return dispatch => {
        dispatch({
            type: ADD_LOCATION,
            payload:{
               location: location,
            },
        })
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