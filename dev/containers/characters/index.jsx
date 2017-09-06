import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux"
import { fetchCharacters, fetchSingleCharacter } from "../../actions/characters.js";
import { CharacterTable } from "../../components/characters/list/index.jsx";
import { CharacterDetails } from "../../components/characters/detail/index.jsx";

class CharacterHome extends Component {
    constructor (props) {
        super(props);

        this.getPage = this.getPage.bind(this);
        this.getCharacter = this.getCharacter.bind(this);
    }

    getPage (pageInfo) {
        this.props.fetchCharacters(pageInfo);
    }

    getCharacter (characterId) {
        if(!characterId) return;

        this.props.fetchSingleCharacter(characterId);
    }

    render () {
        return (
            <Switch>
                <Route exact path={this.props.match.url} render={props => (
                        <CharacterTable
                            getPage={this.getPage}
                            loading={this.props.loading}
                            characters={this.props.characters}
                            pagination={this.props.pagination}
                        />
                    )
                } />
                <Route path={`${this.props.match.url}/:id`} render={props => (
                    <CharacterDetails
                        getCharacter={() => this.getCharacter(props.match.params.id) }
                        characterId={props.match.params.id}
                        loading={this.props.loading}
                        character={this.props.character} />
                    )
                } />
            </Switch>);
    }
}

const mapStateToProps =
    state => ({
        characters: state.characters.characters,
        character: state.characters.character,
        pagination: state.characters.pagination,
        loading: state.characters.loading
    });

export default connect(mapStateToProps, { fetchCharacters, fetchSingleCharacter })(CharacterHome);
