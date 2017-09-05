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
export const FETCH_CHARACTER = createRequestTypes("FETCH_CHARACTER");
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
    
// export const dispatchFetchCharactersRequest =
//     () => dispatch(fetchCharactersRequest());

// export const dispatchFetchCharactersSuccess =
//     response => dispatch(fetchCharactersSuccess(response));

// export const dispatchFetchCharactersFailure =
//     error => dispatch(fetchCharactersFailure(error));


// Fetch Character Actions
const fetchCharacterRequest =
    () => ({ type: FETCH_CHARACTER.REQUEST });

const fetchCharacterSuccess =
    response => ({
        type: FETCH_CHARACTER.SUCCESS,
        character: response.character
    });

const fetchCharacterFailure =
    error => ({
        type: FETCH_CHARACTER.FAILURE,
        error: error
    });

export const fetchCharacter =
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


// export const dispatchFetchCharacterRequest =
//     () => dispatch(fetchCharacterRequest());

// export const dispatchFetchCharacterSuccess =
//     response => dispatch(fetchCharacterSuccess(response));

// export const dispatchFetchCharacterError =
//     error => dispatch(fetchCharacterFailure(error));
