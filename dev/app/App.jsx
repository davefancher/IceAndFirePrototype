import React, { Component } from "react";
import { BrowserRouter, Route, Switch, NavLink } from "react-router-dom";
import Home from "../features/home/Home.jsx";
import CharacterTable from "../features/characters/CharacterTable.jsx";
import CharacterDetail from "../features/characters/CharacterDetail.jsx";

export default class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <div>
                    <ul className="navMenu">
                        <li><NavLink exact="true" to="/" activeClassName="active">Home</NavLink></li>
                        <li><NavLink to="/characters"  activeClassName="active">Characters</NavLink></li>
                    </ul>

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/characters" render={() =>
                            <div>
                                <Route exact path={this.props.path} component={CharacterTable} />
                                <Route path={this.props.path + ":id"} component={CharacterDetail} />
                            </div>
                        } />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
