import { createStore, combineReducers, applyMiddleware } from 'redux'
import locationReducer from './reducers/locations-reducer'
import thunk from 'redux-thunk'
const reducer = combineReducers({
    locationReducer,
})
const store = createStore(
 reducer,
 applyMiddleware(thunk)
)
export default store;