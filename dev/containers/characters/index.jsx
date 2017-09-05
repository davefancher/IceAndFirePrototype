import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux"
import { fetchCharacters, fetchCharacter } from "../../actions/characters.js";
import { CharacterTable } from "../../components/characters/list/index.jsx";
import { CharacterDetails } from "../../components/characters/detail/index.jsx";

class CharacterHome extends Component {
    constructor (props) {
        super(props);

        this.getPage = this.getPage.bind(this);
        this.getCharacter = this.getCharacter.bind(this);
    }

    componentDidMount() {
        //debugger;
        //this.props.fetchCharacters({ pageSize:  })
    }

    getPage (pageInfo) {
        this.props.fetchCharacters(pageInfo);
    }

    getCharacter (characterId) {
        if(!characterId) return;

        // IceAndFireProxy
        //     .getCharacterById(characterId)
        //     .then(response => this.setState(response))
        //     .catch(err => console.error(err));
    }

    render () {
        return (
            <Switch>
                <Route exact path={this.props.match.url} render={props => (
                        <CharacterTable
                            getPage={this.getPage}
                            characters={this.props.characters}
                            pagination={this.props.pagination}
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

const mapStateToProps =
    state => ({
        characters: state.characters.characters,
        character: state.characters.character,
        pagination: state.characters.pagination,
    });

export default connect(mapStateToProps, { fetchCharacters, fetchCharacter })(CharacterHome);