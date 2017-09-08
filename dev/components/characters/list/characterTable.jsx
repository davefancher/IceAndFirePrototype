import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import Loading from "../../shared/loading.jsx";

const PaginationButtons =
    (props) =>
    {
        var pageSize = props.pagination.pageSize;
        var makeButton = (target, label) =>
            <button onClick={() => props.getPage({ page: target, pageSize: pageSize })} className="btn btn-primary" key={label}>
                {label}
            </button>;  

        var buttons = [];
        if (props.pagination.first) buttons.push(makeButton(props.pagination.first, "First"));
        if (props.pagination.prev) buttons.push(makeButton(props.pagination.prev, "Previous"));
        if (props.pagination.next) buttons.push(makeButton(props.pagination.next, "Next"));
        if (props.pagination.last) buttons.push(makeButton(props.pagination.last, "Last"));

        return (
            <div>
                <div className="btn-group pull-right">{buttons}</div>
                <div><small>Current Page: {props.pagination.page}</small></div>
            </div>
        );
    };

const CharacterRow =
    (character) =>
        <tr key={character.id}>
            <td><Link to={`/characters/${character.id}`}>{character.name}</Link></td>
            <td>{character.gender}</td>
            <td>{character.culture}</td>
            <td>{(character.born ? (character.born.date ? character.born.date : "") + (character.born.location ? character.born.location : "") : "")}</td>
            <td>{(character.died ? (character.died.date ? character.died.date : "") + (character.died.location ? character.died.location : "") : "")}</td>
        </tr>;

const NoCharacters =
    (props) =>
        <tr>
            <td colSpan="5">No characters found</td>
        </tr>

const CharacterRows =
    (props) =>
        <tbody>
        {props.characters.length === 0
            ? [ <NoCharacters key="0" /> ]
            : props.characters.map(CharacterRow)}
        </tbody>;

export class CharacterTable extends Component {
    componentDidMount() {
        this.props.getPage({pageSize: this.props.pagination.pageSize, page: 1});
    }

    render () {
        if (this.props.loading) {
            return <Loading />;
        }

        return (
            <div>
                <div className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="pageSizeSelect" className="col-sm-2">Items Per Page:</label>
                        <div className="col-sm-10">
                            <select id="pageSizeSelect"
                                    value={this.props.pagination.pageSize}
                                    onChange={this.props.changePageSize}>
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>
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
                    <CharacterRows characters={this.props.characters} />
                </table>
                <PaginationButtons getPage={this.props.getPage} pagination={this.props.pagination} />
            </div>
        );
    }
}