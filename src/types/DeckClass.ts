import { CARDS } from "../util/constants";
import { shuffleCards } from "../util/functions";
import { Card } from "./GameClass";

const log = console.log;

export class Deck {
    cards: Card[];

    constructor() {
        this.cards = shuffleCards([...CARDS]);
    }

    getCard() {
        let card: any;
        // log('I am a deck and I want to find a card');
        // log('My cards are', this.cards);
        // log('I have', this.cards.length, 'cards');
        for (let i = 0; i < this.cards.length; i++) {
            // log('Current card is', this.cards[i]);
            if (this.cards[i] !== undefined) {
                card = this.cards[i];
                this.cards.splice(i, 1);
                // log('Value of the found card', card);
                // log('Value of the deleted card', this.cards[i]);
                break;
            }
        }

        return card as Card;
    }

    putCardBack(card: Card | undefined) {
        if (card)
            this.cards.push(card);
    }
}