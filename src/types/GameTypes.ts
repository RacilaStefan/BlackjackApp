import { WebSocket } from "ws";
import { MAX_PLAYERS_PER_GAME } from "../util/constants";
import { getRandomCard } from "../util/functions";

export class Game {
    id: string;
    players: Player[] = [];
    dealer: Player;
    
    constructor(id: string) {
        this.id = id;
        this.dealer = new Player(`Dealer #${id}`, undefined);
        this.dealer.initCards();
    }

    pushPlayer(player: Player) {
        if (this.players.length < MAX_PLAYERS_PER_GAME) {
            this.players.push(player);
            return true;
        }

        return false;
    }

    removePlayer(playerToBeRemoved: Player) {
        const players: Player[] = [];
        this.players.forEach(player => {
            if (player.id !== playerToBeRemoved.id) {
                players.push(player);
            }
        });

        this.players = players;
    }
}

export class Player {
    id: string;
    status: 'ready' | 'not_ready' = 'not_ready';
    game?: Game;
    cards: Card[] = [];
    cardsSum?: number;
    ws?: WebSocket;
    initialID: string;

    constructor(id: string, ws: WebSocket | undefined) {
        this.id = id;
        this.initialID = id;
        if (ws !== undefined)
            this.ws = ws;
    }

    initCards() {
        this.cards.length = 0;
        this.cards.push(getRandomCard(), getRandomCard());
       
        this.cardsSum = this.getCardsSum();
        while (this.cardsSum > 20) {
            this.cards[1] = getRandomCard();
            this.cardsSum = this.getCardsSum();
        }
    }

    getCardsSum() {
        let aces = 0;
        let sum = 0;
        this.cards.forEach(card => {
            if (card.value === 11) {
                aces++;
            }

            sum += card.value
        });

        if (sum > 21 && aces > 0) {
            do {
                aces--;
                sum -= 10;
            } while(aces > 0);
        }

        return sum;
    }

    toJSON () {
        let result = {};
        for (let key in this) {
            if (key !== 'ws' && key !== 'initialID' && key !== 'game') {
                result[key.toString()] = this[key];
            }
        }
        return result;
    };
}

export interface Card {
    type: string,
    value: number,
}