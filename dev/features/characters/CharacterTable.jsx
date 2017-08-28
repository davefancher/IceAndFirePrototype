import React, { Component } from "react";
import * as IceAndFireProxy from "../../util/iceandfireproxy.js"

var querystring = require("querystring");

const PagingButtons =
    (props) =>
    {
        var makeButton = (target, label) =>
            <button onClick={() => props.getPage(target)}>
                {label}
            </button>;

        var buttons = [];
        if (props.paging.first) buttons.push(makeButton(props.paging.first, "First"));
        if (props.paging.prev) buttons.push(makeButton(props.paging.prev, "Previous"));
        if (props.paging.next) buttons.push(makeButton(props.paging.next, "Next"));
        if (props.paging.last) buttons.push(makeButton(props.paging.last, "Last"));

        return (
            <div>
                <div>{buttons}</div>
                <div><small>Current Page: {props.paging.currentPage}</small></div>
            </div>
        );
    };

const CharacterRow =
    (props) =>
        <tr>
            <td>{props.name || props.aliases[0]}</td>
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
        var reHeaderLink = /^<(http(?:s)?:\/\/[a-zA-Z0-9-_\.]+\.[a-zA-Z0-9]{2,}\/[-a-zA-Z0-9%_\.#//]*[-a-zA-Z0-9:%_\+.~#?&//=]*)>; rel=\"([a-zA-Z]+)\"/;

        IceAndFireProxy
            .getCharacters({pageSize: pageInfo.pageSize, page: pageInfo.page })
            .then(response => {
                var paging =
                    response
                        .headers
                        .link
                        .split(", ")
                        .map(item => reHeaderLink.exec(item))
                        .reduce((o, match) => {
                            var url = match[1];
                            var pageInfo = querystring.parse(url.split("?")[1]);
                            pageInfo.url = url;
                            o[match[2]] = pageInfo;
                            return o;
                        }, { currentPage: pageInfo.page, pageSize: pageInfo.pageSize });

                this.setState({
                    characters: response.data,
                    paging: paging
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    setPageSize (event) {
        this.getPage({ pageSize: event.target.value, page: 1});
    }

    render () {
        return (
            <div>
                <div>
                    <label>
                        Page Size:&nbsp;
                        <select value={this.state.paging.pageSize}
                                onChange={this.setPageSize.bind(this)}>
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                    </label>
                </div>
                <table>
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
                    <tfoot>
                        <PagingButtons getPage={this.getPage.bind(this)} paging={this.state.paging} />
                    </tfoot>
                </table>
            </div>
        );
    }
}
