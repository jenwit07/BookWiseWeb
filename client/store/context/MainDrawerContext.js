import createContextData from './createContextData';

const SET_TITLE = 'SET_TITLE';
const SET_COMPONENT = 'SET_COMPONENT';
const SET_VISIBILITY = 'SET_VISIBILITY';

const setTitle = dispatch => (title) => {
  dispatch({type: SET_TITLE, payload: title});
};

const setComponent = dispatch => (component) => {
  dispatch({type: SET_COMPONENT, payload: component});
};

const setVisibility = dispatch => (visibility) => {
  dispatch({type: SET_VISIBILITY, payload: visibility});
};


const reducer = (state, {type, payload}) => {
  switch (type) {
    case SET_VISIBILITY:
      return {...state, visibility: payload};
    case SET_TITLE:
      return {...state, title: payload};
    case SET_COMPONENT:
      return {...state, component: payload};
    default:
      return state;
  }
};

export const {Context, Provider} = createContextData(
  reducer,
  {setTitle, setComponent, setVisibility},
  {title: null, component: null, visibility: true},
);
