import {combineReducers} from 'redux'
import counterReducer from './counterReducer'
import localeReducer from "./localeReducer";
import menuReducer from "./menuReducer";

const rootReducer = combineReducers({
    counterReducer,
    localeReducer,
    menuReducer
});

export default rootReducer;
