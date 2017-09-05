import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

import reducers from "./reducers";
import Home from "./components/home/index.jsx";
import CharacterHome from "./containers/characters/index.jsx";

const store =
    createStore(
        reducers,
        applyMiddleware(thunkMiddleware)
    );

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <ul className="nav nav-tabs">
                    <li role="presentation">
                        <NavLink exact to="/" activeClassName="active">Home</NavLink>
                    </li>
                    <li role="presentation">
                        <NavLink to="/characters"  activeClassName="active">Characters</NavLink>
                    </li>
                </ul>

                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/characters" component={CharacterHome} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.querySelector("#container")
);
