import React from "react";
const StoreContext = React.createContext(null);

export const MobxProvider = ({store, children}) => {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const store = React.useContext(StoreContext)

    if (!store) {
        throw new Error('useStore must be used within a MobxProvider.')
    }
    return store
};
