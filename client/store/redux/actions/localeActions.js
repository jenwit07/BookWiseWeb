import {SET_LOCALE} from '../types'
const setLocale = (locale) => {
    return {
        type: SET_LOCALE,
        payload: locale
    }
};

export default {
    setLocale
}
