import { ADD_LOCATION, CHANGE_CENTER, REMOVE_LOCATION, TOGGLE_ROUTE_ON_MAP, CLEAR_LOCATIONS, GET_ROUTE, SAVE_CITY_INFO } from '../types/location-type';

const initState = {
 locations: [], //limit to 2 locations
 to:null,
 origin: null,
 center: null,
 routeOnMap: false,
 cities:[],

}
export default (state = initState, action) => {
switch(action.type) {
   
    case ADD_LOCATION:
        const locations = [...state.locations, action.payload.location].slice(0,2)
        let newState = {...state};
        if( state.origin == null){
            newState.origin = action.payload.location;
        } else if(state.to == null) {
            newState.to = action.payload.location;
        }
        return newState;
    case CHANGE_CENTER:
        return {...state, center: action.payload.location}
    case REMOVE_LOCATION:
        let newState2 = {...state};
        if(state.to.lat == action.payload.location.lat && state.to.lng == action.payload.location.lng){
            newState2.to == null;
        }  else if(state.origin.lat == action.payload.location.lat && state.origin.lng == action.payload.location.lng){
            newState2.origin == null;
        }
        return newState2;
    case TOGGLE_ROUTE_ON_MAP:
        return {...state, routeOnMap: !state.routeOnMap}
    case CLEAR_LOCATIONS:
        return {...state, locations: [], to: null, origin: null, routeOnMap: false, cities: []}
    case GET_ROUTE:
        return {...state}
    case SAVE_CITY_INFO:
        return {...state, cities: action.payload}
    default :
        return state
 }
}