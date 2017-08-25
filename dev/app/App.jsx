import React, { Component } from "react";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import Home from "../features/home/Home.jsx";
import CharacterList from "../features/characters/CharacterList.jsx";
import Character from "../features/characters/Character.jsx";

export default class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <div>
                    <ul>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/characters">Characters</NavLink></li>
                    </ul>

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/characters" render={() =>
                            <div>
                                <Route exact path={this.props.path} component={CharacterList} />
                                <Route path={this.props.path + ":id"} component={Character} />
                            </div>
                        } />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
