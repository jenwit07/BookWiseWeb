import i18n from '../../../i18n';
import {SET_LOCALE} from '../types'
import moment from "moment";

const localeReducer = (state = {locale: localStorage.getItem("i18nextLng")}, {type, payload}) => {
    switch (type) {
        case SET_LOCALE:
            i18n.changeLanguage(payload);
            moment.locale(payload);
            return {
                ...state,
                locale: payload
            };
        default:
            return state
    }
};

export default localeReducer;
