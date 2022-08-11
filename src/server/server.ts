import { createServer, IncomingMessage, ServerResponse } from 'http';
import { MessageEvent, WebSocket, WebSocketServer } from 'ws';
import { OPS } from '../util/constants';
import { constructRequest, readCookie } from '../util/functions';
import { CustomEvent } from '../client/types/CustomEvent';
import { Game, Player } from './types/types';
import { requestListener } from './routing';

const games : Map<string, Game> = new Map();
const players : Map<string, Player> = new Map();

const log = console.log;

const server = createServer(requestListener).listen(8000);
const wss = new WebSocketServer({ server: server });

log('Server is started');

wss.on('connection', (ws, request) => {
    //log(request.headers);
    
    const cookies = request.headers.cookie;
    let id: string;

    if (cookies === undefined || readCookie(cookies, 'ID') === undefined) {
        id = getValidID();
        players.set(id, new Player(id));
        ws.send(constructRequest({event: OPS.SET_COOKIE, data: id}));

        log('Connected with a new client, sendind id: ' + id);
    } else {
        id = (readCookie(cookies, 'ID') as any).value;
        if (players.get(id) === undefined) {
            players.set(id, new Player(id));
        }
        log('Connected with client, id: ' + id);
    }

    //log(players);
    ws.send(constructRequest({event: OPS.INFO, data: 'Message from the server'}));
    
    ws.onmessage = (event: MessageEvent) => {
        handleMessageServer(event, ws, id);
    }
});

function handleMessageServer(message: MessageEvent, ws: WebSocket, id: string) {
    const data = JSON.parse(message.data as string) as CustomEvent;

    //log(players);
    switch(data.event) {
        case OPS.GET_GAME: ws.send(
            constructRequest({
                event: OPS.GET_GAME,
                data: JSON.stringify(games.get(players[id].game.id)),
            })); break;

        case OPS.NEW_GAME: 
            const game = new Game(getValidID(true));
            const player = players.get(id);

            if (player !== undefined) {
                if (data.data === 'alone') {
                    player.status = 'ready';
                }
                game.users.push(player);
                games.set(game.id, game);
                ws.send(constructRequest({
                    event: OPS.GET_GAME,
                    data: JSON.stringify(games.get(game.id)),
                }));
            } else {
                ws.send(constructRequest({
                    event: OPS.ERROR,
                    data: `Player with id ${id} does not exist`,
                }));
            }
            break;

        default: log('Unknown event'); break; 
    }
}

function getValidID(isForGame?: boolean) {
    let isValid = true;
    let id: string;

    do {
        id = Math.floor(Math.random() * 1000).toString();
        if (isForGame) {
            isValid = games.get(id) === undefined;
        } else {
            isValid = players.get(id) === undefined;
        }
    } while (!isValid);

    return id;
}

