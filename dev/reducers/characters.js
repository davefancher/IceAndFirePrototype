import { FETCH_CHARACTERS, FETCH_CHARACTER } from "../actions/characters.js";

const INITIAL_STATE = {
    loading: false,
    characters: [],
    character: {
        name: "",
        aliases: []
    },
    pagination: {
        page: 1,
        pageSize: 25,
        first: {},
        next: {},
        prev: {},
        last: {}
    },
    errorMessage: ""
}

export default function (state = INITIAL_STATE, action) {
    switch(action.type) {
        case FETCH_CHARACTERS.REQUEST:
            return {
                ...state,
                loading: true
            };

        case FETCH_CHARACTERS.SUCCESS:
            //debugger;
            return {
                ...state,
                loading: false,
                characters: action.characters,
                pagination: {
                    first: action.pagination.first,
                    prev: action.pagination.prev,
                    next: action.pagination.next,
                    last: action.pagination.last,
                    page: action.pagination.page,
                    pageSize: action.pagination.pageSize
                },
                character: {
                    name: "",
                    aliases: []
                }
             };

        case FETCH_CHARACTERS.FAILURE:
            return {
                ...state,
                loading: false,
                characters: [],
                errorMessage: action.error
            };

        case FETCH_CHARACTER.REQUEST:
            return {
                ...state,
                loading: true,
                characters: [],
                character: {
                    name: "",
                    aliases: []
                }
            };

        case FETCH_CHARACTER.SUCCESS:
            return {
                ...state,
                loading: true,
                characters: [],
                character: action.character
            };

        case FETCH_CHARACTER.FAILURE:
            return {
                ...state,
                loading: false,
                characters: [],
                character: {
                    name: "",
                    aliases: []
                }
            };
    }

    return state;
}
