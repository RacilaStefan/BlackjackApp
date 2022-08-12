import { constructRequest, getRandomCard, readCookie } from "../util/functions";
import { CustomEvent } from "../types/CustomEvent";
import { OPS } from "../util/constants";
import { IncomingMessage } from "http";
import { MessageEvent, WebSocket } from "ws";
import { Game, Player } from "../types/GameTypes";

const log = console.log;

export const games : { [key: string]: Game } = {};
export const players : { [key: string]: Player } = {};

export function handleMessageServer(message: MessageEvent, ws: WebSocket, id: string) {
    const event = JSON.parse(message.data as string) as CustomEvent;

    const player = players[id];

    if (player !== undefined) {
        switch(event.type) {
            case OPS.GET_GAME: 
                if (player.game !== undefined) {
                    ws.send(
                        constructRequest({
                            type: OPS.GET_GAME,
                            data: JSON.stringify(games[player.game.id]),
                    }));
                }
                break;

            case OPS.NEW_GAME: 
                const game = new Game(getValidID(true));
                player.cards.push(getRandomCard(), getRandomCard());

                if (event.data === 'alone') {
                    player.status = 'ready';
                }

                game.users.push(player);
                games[game.id] = game;

                ws.send(constructRequest({
                    type: OPS.GET_GAME,
                    data: JSON.stringify(games[game.id]),
                }));
                break;

            case OPS.SET_ID: 
                let isValid = false;
                if (players[event.data] === undefined) {
                    player.id = event.data;
                    players[event.data] = player;
                    isValid = true;
                }
                ws.send(constructRequest({
                    type: OPS.SET_ID,
                    data: isValid ? event.data : '',
                }));
                break;
            default: log('Unknown event'); break; 
        }
    } else {
        ws.send(constructRequest({
            type: OPS.ERROR,
            data: `Player with id ${id} does not exist`,
        }));
    }
    
    if (process.env['NODE_ENV'] === 'development') {
        log('Players', JSON.stringify(players, null, 2));
        log('Games', JSON.stringify(games, null, 2));
    }
}

/**
 * This function tries to identify a user from the cookie ID
 * 
 * It creates a new `Player` if the cookie is not set
 */
export function handleIncomingMessage(ws: WebSocket, request: IncomingMessage) : string {

    const cookies = request.headers.cookie;
    let id: string;

    if (cookies === undefined || readCookie(cookies, 'ID') === undefined) {
        id = getValidID();
        players[id] = new Player(id, ws);
        ws.send(constructRequest({type: OPS.SET_COOKIE, data: id}));

        log('Connected with a new client, sendind id: ' + id);
    } else {
        id = (readCookie(cookies, 'ID') as any).value;
        if (players[id] === undefined) {
            players[id] = new Player(id, ws);
        }
        log('Connected with client, id: ' + id);
    }

    ws.send(constructRequest({type: OPS.INFO, data: 'Message from the server'}));

    return id;
}


function getValidID(isForGame?: boolean) {
    let isValid = true;
    let id: string;

    do {
        id = Math.floor(Math.random() * 1000).toString();
        if (isForGame) {
            isValid = games[id] === undefined;
        } else {
            isValid = players[id] === undefined;
        }
    } while (!isValid);

    return id;
}