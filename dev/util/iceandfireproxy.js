import axios from "axios";

var querystring = require("querystring");

var apiUrl = "https://www.anapioficeandfire.com/api/";

var reHeaderLink = /^<(http(?:s)?:\/\/[a-zA-Z0-9-_\.]+\.[a-zA-Z0-9]{2,}\/[-a-zA-Z0-9%_\.#//]*[-a-zA-Z0-9:%_\+.~#?&//=]*)>; rel=\"([a-zA-Z]+)\"/;

function getCachedItem(key, getter) {
    var cachedItem = localStorage.getItem(key);

    if(cachedItem) {
        return (
            new Promise(
                (resolve) => resolve(JSON.parse(cachedItem))
            )
        )
    }

    return (
        getter()
            .then(response => {
                localStorage.setItem(key, JSON.stringify(response));
                return response;
        })
    );
}

export function getCharacterById(id) {
    var requestUrl = apiUrl + "characters/" + id.toString();

    return getCachedItem(
        requestUrl,
        () =>
            axios.get(
                requestUrl,
                { headers: {
                    "accept": "application/vnd.anapioficeandfire+json; version=1"
                }
            }).then(response =>
                ({
                    character: response.data
                })
            ));
}

export function getCharacters(search) {
    var requestUrl = apiUrl + "characters?" + querystring.stringify(search);

    return getCachedItem(
        requestUrl,
        () =>
            axios.get(
                requestUrl,
                { headers: {
                    "accept": "application/vnd.anapioficeandfire+json; version=1"
                }
            }).then(response => {
                var characters =
                    response
                        .data
                        .map(c => ({
                            id: (() => { var parts = c.url.split("/"); return parts[parts.length - 1]; })(),
                            name: c.name || c.aliases[0],
                            gender: c.gender,
                            culture: c.culture,
                            born: c.born,
                            died: c.died
                        }));
    
                var paging =
                    response
                        .headers
                        .link
                        .split(", ")
                        .map(item => reHeaderLink.exec(item))
                        .reduce((o, match) => {
                            var url = match[1];
                            var pageInfo = querystring.parse(url.split("?")[1]);
                            pageInfo.url = url;
                            o[match[2]] = pageInfo;
                            return o;
                        }, { currentPage: search.page, pageSize: search.pageSize });
    
                return {
                    characters: characters,
                    paging: paging
                };
            }));
}
