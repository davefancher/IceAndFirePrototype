import { combineReducers } from "redux"
import characters from "./reducers/characters.js"

const rootReducer = combineReducers({
    characters
});

export default rootReducer;
