import { ADD_LOCATION, CHANGE_CENTER, REMOVE_LOCATION, TOGGLE_ROUTE_ON_MAP, CLEAR_LOCATIONS } from '../types/location-type';

const initState = {
 locations: [], //limit to 2 locations
 center: null,
 routeOnMap: false,

}
export default (state = initState, action) => {
switch(action.type) {
   
    case ADD_LOCATION:
        const locations = [...state.locations, action.payload.location].slice(0,2)
        return {...state, locations: locations}
    case CHANGE_CENTER:
        return {...state, center: action.payload.location}
    case REMOVE_LOCATION:
        return {...state, locations: [...state.locations.filter((loc) => {
            return !(loc.lat == action.payload.location.lat && loc.lng == action.payload.location.lng)
        })]}
    case TOGGLE_ROUTE_ON_MAP:
        return {...state, routeOnMap: !state.routeOnMap}
    case CLEAR_LOCATIONS:
        return {...state, locations: []}
    default :
        return state
 }
}