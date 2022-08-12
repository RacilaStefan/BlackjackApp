import { WebSocket } from "ws";
import { getRandomCard } from "../util/functions";

export class Game {
    id: string;
    users: Player[] = [];
    dealerCards: Card[] = [];
    
    constructor(id: string) {
        this.id = id;
        this.dealerCards.push(getRandomCard(), getRandomCard());
    }
}

export class Player {
    id: string;
    status: 'ready' | 'not_ready' = 'not_ready';
    game?: Game;
    cards: Card[] = [];
    ws?: WebSocket;

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
    }

    toJSON () {
        var result = {};
        for (var x in this) {
            if (x !== "ws") {
                result[x.toString()] = this[x];
            }
        }
        return result;
    };
}

export interface Card {
    type: string,
    value: number,
}