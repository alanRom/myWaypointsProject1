import {  CLICK_MAP } from '../types/location-type';

export const clickMap = (location) => {
    return dispatch => {
        dispatch({
            type: CLICK_MAP,
            payload:{
               location: location,
            },
        })
    }
}