import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCharacters, fetchSingleCharacter } from "../../actions/characters.js";
import { CharacterTable } from "../../components/characters/list/index.jsx";
import { CharacterDetails } from "../../components/characters/detail/index.jsx";
import ErrorMessage from "../../components/shared/errorMessage.jsx";

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
            <div>
                <ErrorMessage message={this.props.errorMessage} />
                <Switch>
                    <Route exact path={this.props.match.url} render={props => (
                        <CharacterTable
                            getPage={this.getPage}
                            {...this.props} />
                        )
                    } />
                    <Route path={`${this.props.match.url}/:id`} render={props => (
                        <CharacterDetails
                            getCharacter={() => this.getCharacter(props.match.params.id) }
                            characterId={props.match.params.id}
                            {...this.props} />
                        )
                    } />
                </Switch>
            </div>);
    }
}

const mapStateToProps =
    state => ({
        characters: state.characters.characters,
        character: state.characters.character,
        pagination: state.characters.pagination,
        loading: state.characters.loading,
        errorMessage: state.characters.errorMessage
    });

export default connect(mapStateToProps, { fetchCharacters, fetchSingleCharacter })(CharacterHome);
