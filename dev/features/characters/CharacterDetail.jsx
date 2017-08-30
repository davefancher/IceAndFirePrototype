import React, { Component } from "react";
import * as IceAndFireProxy from "../../util/iceandfireproxy.js"

const CharacterDetail =
    (props) =>
    <div>
        <h2>
            {props.character.name || (props.character.aliases.length > 0 ? props.character.aliases[0] : "unknown")}
        </h2>
        <dl className="dl-horizontal">
            <dt>Aliases:</dt>
            <dd>{props.character.aliases.join(", ")}</dd>
        </dl>
    </div>

export default class CharacterDetailContainer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            character: {
                name: "",
                aliases: []
            }
        };
    }

    componentDidMount () {
        IceAndFireProxy
            .getCharacterById(this.props.match.params.id)
            .then(response => this.setState(response));
    }

    render () {
        return (
            <CharacterDetail character={this.state.character} />
        );
    }
}
