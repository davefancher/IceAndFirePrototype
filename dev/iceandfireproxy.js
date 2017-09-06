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

const API_VERSION_HEADER = "application/vnd.anapioficeandfire+json; version=1";

function get (url) {
    return (
        axios.get(
            url,
            { "headers": {
                "accept": API_VERSION_HEADER
            }})
    );
}

export function getCharacterById(id) {
    var requestUrl = apiUrl + "characters/" + id.toString();

    function parseDate(date) {
        if (!date) return null;

        var dateParts = date.split(",").map(p => p.trim());
        if (dateParts.length === 2) {
            return {
                "date": dateParts[0],
                "location": dateParts[1]
            }
        }

        if(dateParts[0].match(/[iI]n/)) {
            return { "date": dateParts[0] };
        }

        if(dateParts[0].match(/[aA]t/)) {
            return { "location": dateParts[0] };
        }
    }

    return getCachedItem(
        requestUrl,
        () =>
            get(requestUrl)
                .then(response => {
                    var birthInfo = response.data.born.split(", ");
                    var born = birthInfo[0]

                    return ({
                        character: {
                            id: id,
                            name: (response.data.name || response.data.aliases[0] + "*"),
                            aliases: response.data.aliases.filter(a => a.length !== 0),
                            gender: response.data.gender,
                            culture: response.data.culture,
                            born: parseDate(response.data.born),
                            died: parseDate(response.data.died),
                            titles: response.data.titles.filter(t => t.length !== 0),
                            portrayedBy: response.data.playedBy.filter(a => a.length !== 0)
                        }});
                }));
}

export function getCharacters(search) {
    var requestUrl = apiUrl + "characters?" + querystring.stringify(search);

    return getCachedItem(
        requestUrl,
        () =>
            get(requestUrl)
                .then(response => {
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
                            }, { page: search.page, pageSize: search.pageSize });

                    return {
                        characters: characters,
                        pagination: paging
                    };
                }));
}
