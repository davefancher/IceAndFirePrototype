import axios from "axios";

var querystring = require("querystring");

var apiUrl = "https://www.anapioficeandfire.com/api/";

export function getCharacters(search) {
    var qs = querystring.stringify(search);
    return axios.get(apiUrl + "characters?" + qs);
}