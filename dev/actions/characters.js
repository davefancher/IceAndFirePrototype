import * as IceAndFireProxy from "../iceandfireproxy.js"

function createRequestTypes (prefix) {
    return (
        ["REQUEST", "SUCCESS", "FAILURE"]
            .reduce(
                (obj, type) => { obj[type] = `${prefix}_${type}`; return obj; },
                {})
    );
}

// Action Type Constants
export const FETCH_SINGLE_CHARACTER = createRequestTypes("FETCH_SINGLE_CHARACTER");
export const FETCH_CHARACTERS = createRequestTypes("FETCH_CHARACTERS");


// Fetch Characters Actions
export const fetchCharactersRequest =
    () => ({ type: FETCH_CHARACTERS.REQUEST });

const fetchCharactersSuccess =
    response => ({
        type: FETCH_CHARACTERS.SUCCESS,
        characters: response.characters,
        pagination: response.pagination
    });

const fetchCharactersFailure =
    error => ({
        type: FETCH_CHARACTERS.FAILURE,
        error: error
    });

export const fetchCharacters =
    pageInfo =>
        dispatch => {
            dispatch(fetchCharacterRequest());
            return (
                IceAndFireProxy
                    .getCharacters({pageSize: pageInfo.pageSize, page: pageInfo.page })
                    .then(response => dispatch(fetchCharactersSuccess(response)))
                    .catch(err => dispatch(fetchCharactersFailure(err)))
            );
        };

// Fetch Character Actions
const fetchCharacterRequest =
    () => ({ type: FETCH_SINGLE_CHARACTER.REQUEST });

const fetchCharacterSuccess =
    response => ({
        type: FETCH_SINGLE_CHARACTER.SUCCESS,
        character: response.character
    });

const fetchCharacterFailure =
    error => ({
        type: FETCH_SINGLE_CHARACTER.FAILURE,
        error: error
    });

export const fetchSingleCharacter =
    id =>
        dispatch => {
            dispatch(fetchCharacterRequest());
            return (
                IceAndFireProxy
                    .getCharacterById(id)
                    .then(response => dispatch(fetchCharacterSuccess(response)))
                    .catch(err => dispatch(fetchCharacterFailure(err)))
            );
        };
