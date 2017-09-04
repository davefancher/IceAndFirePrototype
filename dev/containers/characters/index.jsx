import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import * as IceAndFireProxy from "../../iceandfireproxy.js"
import { CharacterTable } from "../../components/characters/list/index.jsx";
import { CharacterDetails } from "../../components/characters/detail/index.jsx";

export default class CharacterHome extends Component {
    constructor (props) {
        super(props);
        this.state = {
            characters: [],
            character: {
                name: "",
                aliases: []
            },
            pagination: {
                page: 1,
                pageSize: 25,
                first: "",
                prev: "",
                next: "",
                last: ""
            }
        };
    }

    getPage (pageInfo) {
        IceAndFireProxy
            .getCharacters({pageSize: pageInfo.pageSize, page: pageInfo.page })
            .then(response => this.setState(response))
            .catch(err => console.error(err));
    }

    getCharacter (characterId) {
        if(!characterId) return;

        IceAndFireProxy
            .getCharacterById(characterId)
            .then(response => this.setState(response))
            .catch(err => console.error(err));
    }

    render () {
        return (
            <Switch>
                <Route exact path={this.props.match.url} render={props => (
                        <CharacterTable
                            getPage={this.getPage.bind(this)}
                            characters={this.state.characters}
                            pagination={this.state.pagination}
                        />
                    )
                } />
                <Route path={`${this.props.match.url}/:id`} render={props => (
                    <CharacterDetails
                        getCharacter={() => this.getCharacter(props.match.params.id) }
                        characterId={props.match.params.id}
                        character={this.state.character} />
                    )
                } />
            </Switch>);
    }
}
