import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import CharacterDetail from "./CharacterDetail.jsx";
import * as IceAndFireProxy from "../../util/iceandfireproxy.js"

var querystring = require("querystring");

const PagingButtons =
    (props) =>
    {
        var makeButton = (target, label) =>
            <button onClick={() => props.getPage(target)} className="btn btn-primary">
                {label}
            </button>;

        var buttons = [];
        if (props.paging.first) buttons.push(makeButton(props.paging.first, "First"));
        if (props.paging.prev) buttons.push(makeButton(props.paging.prev, "Previous"));
        if (props.paging.next) buttons.push(makeButton(props.paging.next, "Next"));
        if (props.paging.last) buttons.push(makeButton(props.paging.last, "Last"));

        return (
            <div>
                <div className="btn-group pull-right">{buttons}</div>
                <div><small>Current Page: {props.paging.currentPage}</small></div>
            </div>
        );
    };

const CharacterRow =
    (props) =>
        <tr>
            <td><Link to={`/characters/${props.id}`}>{props.name}</Link></td>
            <td>{props.gender}</td>
            <td>{props.culture}</td>
            <td>{props.born}</td>
            <td>{props.died}</td>
        </tr>;

export default class CharacterTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            characters: [],
            paging: {
                currentPage: 1,
                pageSize: 10
            }
        };
    }

    componentDidMount () {
        this.getPage({pageSize: 10, page: 1});
    }

    getPage (pageInfo) {
        IceAndFireProxy
            .getCharacters({pageSize: pageInfo.pageSize, page: pageInfo.page })
            .then(response => {
                this.setState(response);
            })
            .catch(err => {
                console.error(err);
            });
    }

    setPageSize (event) {
        this.getPage({ pageSize: event.target.value, page: 1});
    }

    render () {
        return (
            <div>
                <Route path={`${this.props.match.url}/:id`} component={CharacterDetail} />
                <Route exact path={`${this.props.match.url}`} render={() =>
                    <div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>
                                    Page Size:&nbsp;
                                    <select value={this.state.paging.pageSize}
                                            onChange={this.setPageSize.bind(this)}
                                            className="form-control">
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Culture</th>
                                    <th>Born</th>
                                    <th>Died</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.characters.length > 0
                                    ? this.state.characters.map(CharacterRow)
                                    : <tr>
                                        <td colSpan="5">No characters found</td>
                                    </tr>}
                            </tbody>
                        </table>
                        <PagingButtons getPage={this.getPage.bind(this)} paging={this.state.paging} />
                    </div>
                } />
            </div>
        );
    }
}