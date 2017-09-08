import axios from "axios";
import querystring from "querystring";

const API_URL = "https://www.anapioficeandfire.com/api/";
const API_VERSION_HEADER = "application/vnd.anapioficeandfire+json; version=1";

const reHeaderLink = /^<(http(?:s)?:\/\/[a-zA-Z0-9-_\.]+\.[a-zA-Z0-9]{2,}\/[-a-zA-Z0-9%_\.#//]*[-a-zA-Z0-9:%_\+.~#?&//=]*)>; rel=\"([a-zA-Z]+)\"/;

function range(start, end) {
    return Array(end - start).fill(0).map((v, ix) => start + ix);
}

function getPage(section, page, pageSize) {
    var url = `${API_URL}/${section}?page=${page}&pageSize=${pageSize}`;

    return (
        axios.get(
            url,
            { "headers": {
                "accept": API_VERSION_HEADER
            }}
    ));
}

function loadData(section, munger) {
    var cachedData = localStorage.getItem(section);

    if(cachedData) {
        return new Promise(resolve => resolve(JSON.parse(cachedData)));
    }

    return (
        getPage(section, 1, 50)
            .then(function (response) {
                var firstPageData =
                    response.data;

                var lastPage =
                    response
                        .headers
                        .link
                        .split(", ")
                        .map(item => {
                            var match = reHeaderLink.exec(item);
                            var pageInfo = querystring.parse(match[1].split("?")[1]);
                            var result = {
                                rel: match[2],
                                page: parseInt(pageInfo.page, 10)
                            };
                            return result;
                        }).find(l => l.rel.toLowerCase() === "last")
                        .page;

                var pageRequests =
                    range(2, lastPage)
                        .map(page => getPage(section, page, 50));

                return (
                    Promise
                        .all(pageRequests)
                        .then(
                            pages => {
                                var characters =
                                    pages
                                        .reduce(
                                            (allItems, page) => allItems.concat(page.data),
                                            firstPageData)
                                        .map(munger)
                                        .sort((a, b) => {
                                            // We can assume that our objects will have an id property
                                            if (a.id < b.id) return -1;
                                            if (a.id > b.id) return 1;
                                            return 0;
                                        });
                                
                                localStorage.setItem(section, JSON.stringify(characters));
                                return characters;
                            }));
            }));
}

var _allCharacters;
function loadCharacterData() {
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

    function munge(characterRaw) {
        return {
            id: (url => {
                    var parts = url.split("/");
                    var id =  parts[parts.length - 1];
                    return parseInt(id, 10);
                })(characterRaw.url),
            name: characterRaw.name,
            aliases: characterRaw.aliases.filter(a => a.length !== 0),
            gender: characterRaw.gender,
            culture: characterRaw.culture,
            born: parseDate(characterRaw.born),
            died: parseDate(characterRaw.died),
            titles: characterRaw.titles.filter(t => t.length !== 0),
            portrayedBy: characterRaw.playedBy.filter(a => a.length !== 0)
        }
    }

    return (
        loadData("characters", munge)
            .then(characters => { _allCharacters = characters })
    );
}

function query (collection, filter) {
    if (!filter) {
        return query(collection, { page: 1, pageSize: 25 });
    } else if (typeof(filter) === "number") {
        return collection.filter(i => i.id === filter);
    } else if (typeof(filter) === "function") {
        return collection.filter(filter);
    } else if (typeof(filter) === "object") {
        var page =
            filter.hasOwnProperty("page") ? filter.page : 1;
        var pageSize =
            filter.hasOwnProperty("pageSize") ? filter.pageSize : 25;
        
        var startAt = (page - 1) * pageSize;
        var endAt = startAt + pageSize;
        var lastPage = Math.ceil(collection.length / pageSize);
        
        return {
            characters: collection.slice(startAt, endAt),
            pagination: {
                first: 1,
                prev: (page === 1 ? null : page - 1),
                next: (page === lastPage ? null : page + 1),
                last: lastPage,
                page: page,
                pageSize: pageSize
            }
        };
    }
};

function queryAsync (collection, filter) {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                var result = query(collection, filter);
                resolve(result)
            },
            1000
        )
    });
}

function store(collection, obj) {
    throw "Not Implemented";
}

function remove(collection, obj) {
    throw "Not Implemented";
}

const IceAndFireRepository = {
    init: (() => Promise.all([ loadCharacterData() ])),
    characters: {
        get: (filter => queryAsync(_allCharacters, filter)),
        store: (character => store(_allCharacters, character)),
        remove: (character => remove(_allCharacters, character)),
    }
};

export default IceAndFireRepository;
