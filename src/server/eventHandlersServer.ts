import { constructEvent, readCookie } from "../util/functions";
import { CustomEvent } from "../types/CustomEvent";
import { EVENTS } from "../util/constants";
import { IncomingMessage } from "http";
import { MessageEvent, WebSocket } from "ws";
import { Game } from "../types/GameClass";
import { Player } from "../types/PlayerClass";

const log = console.log;

export const games : { [key: string]: Game } = {};
export const players : { [key: string]: Player } = {};
export const playersIDLedger : { [key: string] : string } = {};

export function handleMessageServer(message: MessageEvent, ws: WebSocket, initialPlayerID: string) {
    const event = JSON.parse(message.data as string) as CustomEvent;

    const currentPlayerID = playersIDLedger[initialPlayerID] as string;
    const player = players[currentPlayerID];
    log('Initial ID', initialPlayerID);
    log('Current ID', currentPlayerID);
    log('Event', event.type);

    if (player !== undefined) {
        switch(event.type) {
            case EVENTS.DEALER_TURN:
                if (player.game === undefined) break;

                let highestScore = 0;
                let winnerId = '';
                player.game.players.forEach(player => {
                    if (highestScore < player.cardsSum && player.cardsSum <= 21) {
                        highestScore = player.cardsSum;
                        winnerId = player.id;
                    }
                });

                log('Winner id is', winnerId, 'and has', highestScore, 'score');
                if (highestScore === 0) {
                    player.game.winner = player.game.dealer.id; // If all players had scores over 21 the dealer wins
                } else {
                    
                    // The dealer plays only if exists a player that has a score less then or equal with 21
                    player.game.dealer.autoPlay(highestScore); // The dealer may overscore

                    if (player.game.dealer.cardsSum > 21) {
                        player.game.winner = winnerId;
                    } else {
                        player.game.winner = player.game.dealer.cardsSum < player.cardsSum ? winnerId : player.game.dealer.id;
                    }
                }

                player.game.logs.push(`${player.game.winner} wins`);
                player.game.turnID = '';
                broadcastGame(player.game);
                break;

            case EVENTS.DRAW_CARD:
                if (player.game === undefined) break;

                const cardsLength = player.cards.length;
                player.drawCard();
                if (cardsLength === player.cards.length || player.cardsSum >= 21) {
                    sendMsg(ws, EVENTS.BOUNCE, { type: EVENTS.END_TURN, data: '' });
                }
                
                broadcastGame(player.game);
                break;

            case EVENTS.END_TURN:
                if (player.game === undefined) break;

                player.game.updateTurn();
                if (player.game.turnID === player.game.dealer.id) {
                    sendMsg(ws, EVENTS.BOUNCE, { type: EVENTS.DEALER_TURN, data: '' });
                }

                broadcastGame(player.game);
                break;

            case EVENTS.GET_GAME: 
                if (player.game === undefined) break;
                
                sendMsg(ws, EVENTS.GET_GAME, games[player.game.id]);
                break;

            case EVENTS.INFO: log(`Player with id ${currentPlayerID} says: ${event.data}`); break;
            case EVENTS.JOIN_GAME:

                const wantedGame = games[event.data];
                if (wantedGame === undefined) {
                    sendMsg(ws, EVENTS.JOIN_GAME, false);
                    break;
                }

                if (wantedGame.pushPlayer(player)) {
                    player.initCards();
                    sendMsg(ws, EVENTS.JOIN_GAME, true);
                }

                log(wantedGame);
                broadcastGame(wantedGame);
                break;

            case EVENTS.LEAVE_GAME: 
                player.status = 'not-ready';
                if (player.game === undefined) break;
                
                games[player.game.id]?.removePlayer(player);

                if (games[player.game.id]?.players.length === 0) {
                    delete games[player.game.id];
                }

                //delete player.game;
                
                break;

            case EVENTS.NEW_GAME: 
                const newGame = new Game(getValidID(true));

                if (event.data === 'alone') {
                    player.status = 'ready';
                    newGame.dealer.status = 'ready';
                }

                newGame.pushPlayer(player);
                player.initCards();
                newGame.logs.push(`${player.id} created a game`);

                games[newGame.id] = newGame;

                sendMsg(ws, EVENTS.GET_GAME, newGame);
                break;

            case EVENTS.PING:
                log(event.data);
                sendMsg(ws, EVENTS.PING, 'Pong.'); 
                break;

            case EVENTS.READY:
                if (player.game === undefined) break;

                player.status = player.status === 'ready' ? 'not-ready' : 'ready';
                player.game.logs.push(`${player.id} is ${player.status === 'ready' ? 'ready' : 'not ready'}`);

                let isEveryBodyReady = true;
                player.game.players.forEach(player => {
                    if (player.status === 'not-ready') {
                        isEveryBodyReady = false;
                    }
                });

                if (isEveryBodyReady) {
                    player.game.dealer.status = 'ready';
                    player.game.logs.push(`Game #${player.game.id} started`);
                }

                broadcastGame(player.game);
                break;

            case EVENTS.SET_ID: 
                let isValid = false;
                if (players[event.data] === undefined) { // Check if wanted ID is valid
                    delete players[currentPlayerID]; // If it is valid, delete the previous entry
                    player.id = event.data; // Change the current player object
                    players[event.data] = player; // Assign the new player to the new key
                    playersIDLedger[initialPlayerID] = event.data;
                    isValid = true;
                }
                sendMsg(ws, EVENTS.SET_ID, isValid ? event.data : '');
                break;

            default: log('Unknown event'); break; 
        }
    } else {
        sendMsg(ws, EVENTS.ERROR, `Player with id ${initialPlayerID} does not exist`);
    }
    
    if (process.env['NODE_ENV'] === 'development') {
        log('Players', JSON.stringify(players, null, 2));
        //log('Players', players);
        log('ID Ledger', JSON.stringify(playersIDLedger, null, 2));
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
        playersIDLedger[id] = id;
        players[id] = new Player(id, ws);
        sendMsg(ws, EVENTS.SET_COOKIE, id);

        log('Connected with a new client, sendind id: ' + id);
    } else {
        id = (readCookie(cookies, 'ID') as any).value;
        if (playersIDLedger[id] === undefined) {
            playersIDLedger[id] = id;
            players[id] = new Player(id, ws);
        }
        log('Connected with client, id: ' + id);
    }

    sendMsg(ws, EVENTS.INFO, 'Message from the server');

    return id;
}

export function handleLoosingConnection(id: string) {
    const currentID = playersIDLedger[id];
    if (currentID !== undefined) {
        log(`Client with ID ${currentID} has lost connection`);
        const currentPlayer = players[currentID];

        if (currentPlayer === undefined) {
            log ('Player was not registered, HELP...');
            return;
        }

        const game = currentPlayer.game;
        
        if (game !== undefined) {
            games[game.id]?.removePlayer(currentPlayer);
            if (games[game.id]?.players.length === 0) {
                log('Removing game with ID', id);
                delete games[game.id];
            }
        }

        delete players[currentID];
        delete playersIDLedger[id];
    }
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

function sendMsg(ws: WebSocket, type: string, msg: any) {
    ws.send(constructEvent({
        type: type,
        data: typeof msg === 'string' ? msg : JSON.stringify(msg),
    }));
}

function broadcastGame(game: Game) {
    game.players.forEach(player => {
        sendMsg(player.ws as any, EVENTS.GET_GAME, player.game);
    });
}