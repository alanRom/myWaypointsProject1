import { ADD_LOCATION, CHANGE_CENTER, REMOVE_LOCATION } from '../types/location-type';

const initState = {
 locations: [],
 center: null,
}
export default (state = initState, action) => {
switch(action.type) {
   
    case ADD_LOCATION:
        return {...state, locations: [...state.locations, action.payload.location]}
    case CHANGE_CENTER:
        return {...state, center: action.payload.location}
    case REMOVE_LOCATION:
        return {...state, locations: [...state.locations.filter((loc) => {
            return !(loc.lat == action.payload.location.lat && loc.lng == action.payload.location.lng)
        })]}
    default :
        return state
 }
}