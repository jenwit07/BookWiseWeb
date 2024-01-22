import React from "react";
import 'mobx-react-lite/batchingForReactDom'
import ReactDOM from "react-dom";
import {Provider as ReduxProvider} from 'react-redux';
import {createStore, applyMiddleware} from "redux";
import promiseMiddleware from 'redux-promise'
import rootReducer from './store/redux/reducers'
import i18n from "./i18n";
import {MobxProvider} from "./store/mobx";
import {BrowserRouter} from "react-router-dom";
import {composeWithDevTools} from 'redux-devtools-extension'
import {Provider as MainDrawerProvider} from  './store/context/MainDrawerContext';

import App from "./App"
import "./index.less";

const reduxStore = createStore(rootReducer, composeWithDevTools(applyMiddleware(promiseMiddleware)));

import mobxStores from "./store/mobx/stores";

i18n.init().then(
    async () => {
        return ReactDOM.render(
            <ReduxProvider store={reduxStore}>
                <MobxProvider store={{...mobxStores}}>
                  <MainDrawerProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                  </MainDrawerProvider>
                </MobxProvider>
            </ReduxProvider>,
            document.getElementById('root'))
    }
);
