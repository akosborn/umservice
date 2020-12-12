import fetch, {RequestInit} from 'node-fetch';
import {DateTime} from 'luxon';

interface ShowDto {
    date: string;
    state: string;
    city: string;
    venue: string;
    sets: SetDto[];
}

interface SetDto {
    name: string;
    position: number;
    tracks: TrackDto[];
}

interface TrackDto {
    setPosition: number;
    song: string;
    length: number;
}

fetch('http://www.umlive.net/api.aspx?method=catalog.container&containerID=25483')
    .then(res => res.json())
    .then(res => res['Response'])
    .then(res => {
        const containerId = res['containerID'];
        const prevContainerId = res['prevContainerID'];
        const nextContainerId = res['nextContainerID'];
        const date: string = DateTime.fromFormat(res['performanceDate'], 'M/d/yyyy').toSQLDate();
        const state = res['venueState'];
        const city = res['venueCity'];
        const venue = res['venueName'];
        const resTracks: [] = res['tracks'];

        const sets: SetDto[] = resTracks.reduce(((sets, track) => {
            const setDto: SetDto | undefined = sets.find(s => s.position === track['setNum']);
            const trackDto: TrackDto = {
                setPosition: track['trackNum'],
                song: track['songTitle'],
                length: track['totalRunningTime']
            };

            if (!setDto) {
                const newSet: SetDto = {
                    position: track['setNum'],
                    name: `Set ${track['setNum']}`,
                    tracks: [trackDto]
                };
                sets.push(newSet);
            } else {
                setDto.tracks.push({
                    setPosition: track['trackNum'],
                    song: track['songTitle'],
                    length: track['totalRunningTime']
                });
            }
            return sets;
        }), [] as SetDto[]);

        const show: ShowDto = {
            date,
            state,
            city,
            venue,
            sets: sets
        }

        const requestConfig: RequestInit = {
            method: 'POST',
            body: JSON.stringify(show),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        };

        fetch('http://localhost:8080/api/show', requestConfig)
            .then(resp => resp.json())
            .then(resp => {
                console.log(resp)
            })
    });
