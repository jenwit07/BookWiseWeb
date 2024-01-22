import {MENU_TOGGLE} from '../types';
const menuReducer = (state = {collapse: false}, {type, payload}) => {
    switch (type) {
        case MENU_TOGGLE:
            return {
                ...state,
                collapse: payload
            };
        default:
            return state
    }
};

export default menuReducer
