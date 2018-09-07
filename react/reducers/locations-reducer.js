import { CLICK_MAP } from '../types/location-type';

const initState = {
 message: '',
 locations: [
     {
        lat: 37.778519,
        lng:  -122.405640,
     },
 ],
}
export default (state = initState, action) => {
switch(action.type) {
   
    case CLICK_MAP:
        return {...state, locations: [...state.locations, action.payload.location]}
    default :
        return state
 }
}