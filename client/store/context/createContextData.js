import React, {useReducer} from 'react';

export default (reducer, actions, initialState) => {
  const Context = React.createContext();

  const Provider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const boundActions = {};

    // eslint-disable-next-line no-unused-vars
    for (let action in actions) {
      boundActions[action] = actions[action](dispatch);
    }

    return (
      <Context.Provider value={{state, ...boundActions}}>
        {children}
      </Context.Provider>
    );
  };
  return {Context, Provider};
};
