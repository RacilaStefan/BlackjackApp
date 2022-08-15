import { CARDS, MAX_PLAYERS_PER_GAME } from "../util/constants";
import { Deck } from "./DeckClass";
import { Player } from "./PlayerClass";

const log = console.log;

export class Game {
    id: string;
    players: Player[] = [];
    dealer: Player;
    logs: string[] = [];
    turnID: string = '';
    turnIndex: number = 0;
    deck: Deck;
    winner: string = '';
    
    constructor(id: string) {
        this.id = id;
        this.deck = new Deck();
        this.dealer = new Player(`Dealer #${id}`, undefined);
        this.dealer.game = this;
        this.dealer.initCards();
    }

    pushPlayer(player: Player) {
        if (this.players.length < MAX_PLAYERS_PER_GAME) {
            player.game = this;
            this.players.push(player);
            if (this.players.length === 1) {
                this.turnID = this.players[this.turnIndex++]?.id as string;
            }
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

    updateTurn() {
        log(this.turnIndex);
        if (this.turnIndex > this.players.length - 1) {
            this.turnID = this.dealer.id;
            return false;
        }

        this.turnID = this.players[this.turnIndex++]?.id as string;

        return true;
    }

    getPlayerFromID(id: string | undefined) {
        if (id === undefined) return undefined;
        
        return this.players.find(player => player.id === id);
    }

    toJSON () {
        let result = {};
        for (let key in this) {
            if (key !== 'turnIndex' && key !== 'deck') {
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