"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = __importDefault(require("node-fetch"));
var luxon_1 = require("luxon");
node_fetch_1.default('http://www.umlive.net/api.aspx?method=catalog.container&containerID=25483')
    .then(function (res) { return res.json(); })
    .then(function (res) { return res['Response']; })
    .then(function (res) {
    console.log(res);
    var containerId = res['containerID'];
    var prevContainerId = res['prevContainerID'];
    var nextContainerId = res['nextContainerID'];
    var date = luxon_1.DateTime.fromFormat(res['performanceDate'], 'M/d/yyyy').toSQLDate();
    var state = res['venueState'];
    var city = res['venueCity'];
    var venue = res['venueName'];
    var resTracks = res['tracks'];
    var sets = resTracks.reduce((function (sets, track) {
        var setDto = sets.find(function (s) { return s.position === track['setNum']; });
        var trackDto = {
            setPosition: track['trackNum'],
            song: track['songTitle'],
            length: track['totalRunningTime']
        };
        if (!setDto) {
            var newSet = {
                position: track['setNum'],
                name: "Set " + track['setNum'],
                tracks: [trackDto]
            };
            sets.push(newSet);
        }
        else {
            setDto.tracks.push({
                setPosition: track['trackNum'],
                song: track['songTitle'],
                length: track['totalRunningTime']
            });
        }
        return sets;
    }), []);
    var show = {
        date: date,
        state: state,
        city: city,
        venue: venue,
        sets: sets
    };
    var requestConfig = {
        method: 'POST',
        body: JSON.stringify(show),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    };
    node_fetch_1.default('http://localhost:8080/api/show', requestConfig)
        .then(function (resp) { return resp.json(); })
        .then(function (resp) {
        console.log(resp);
    });
});
//# sourceMappingURL=app.js.map