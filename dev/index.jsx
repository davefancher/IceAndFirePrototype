import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";

import reducers from "./reducers.js";
import AppContainer from "./containers/appContainer.jsx";

const store =
    createStore(
        reducers,
        applyMiddleware(thunkMiddleware)
    );

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.querySelector("#container")
);
