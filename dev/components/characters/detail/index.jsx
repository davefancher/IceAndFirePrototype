import React, { Component } from "react";

export class CharacterDetails extends Component {
    componentDidMount () {
        this.props.getCharacter();
    }

    render () {
        return (
            <div>
                <h2>{this.props.character.name || (this.props.character.aliases.length > 0 ? this.props.character.aliases[0] : "unknown")}</h2>
                <dl className="dl-horizontal">
                    <dt>Aliases:</dt>
                    <dd>{this.props.character.aliases.join(", ")}</dd>
                </dl>
            </div>
        );
    }
}
