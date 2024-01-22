import {MENU_TOGGLE} from '../types';

const toggle = (collapse) => {
    return {
        type: MENU_TOGGLE,
        payload: collapse
    }
};

export default {
    toggle
}
