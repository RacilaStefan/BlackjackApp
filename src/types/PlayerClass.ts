import { Card, Game } from "./GameClass";
import WebSocket from "ws";

const log = console.log;

const cardValues = {
    '14' : 'King',
    '13' : 'Queen',
    '12' : 'Jack',
    '11' : 'Ace',
}

export class Player {
    id: string;
    status: 'ready' | 'not-ready' = 'not-ready';
    game?: Game;
    cards: Card[] = [];
    cardsSum: number = 0;
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
        if (this.game === undefined) return
        
        // log('My game id is', this.game.id, 'and the deck of it is', this.game.deck);
        // log('My id is', this.id);
        // log('I wand to init cards');
        this.cards.push(this.game.deck.getCard(), this.game.deck.getCard());
        // log('I draw 2 cards, my cards are', this.cards);

        /*
            This was some desperate debugging at 2 AM, it's much easier to debug if you make little
            dialogues for each component. Also it's more fun if you read the dialogues with 
            different funny voices. 
            
            ( •_•)>⌐■-■  (⌐■_■)  (☞⌐■_■)☞ if you saw this don't hesitate to leave me a message.

        */
        
        this.cardsSum = this.getCardsSum();
        while (this.cardsSum > 20) {
            this.game.deck.putCardBack(this.cards[1]);
            this.cards[1] = this.game.deck.getCard();
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

    drawCard() {
        if (this.game === undefined) return;

        if (this.cardsSum > 21) {
            this.game.logs.push(`${this.id} could not draw a new card`);
            return;
        }

        this.cards.push(this.game.deck.getCard());
        const value = this.cards[this.cards.length - 1]?.value as number;
        const stringValue = cardValues[value] === undefined ? value : cardValues[value]; 
        this.game.logs.push(`${this.id} draws ${stringValue} of ${this.cards[this.cards.length - 1]?.type.toUpperCase()}`);
        this.cardsSum = this.getCardsSum();
    }

    autoPlay(target: number) {
        if (this.cardsSum > target) return;
        
        do {
            let drawCard = 21 - this.cardsSum + Math.floor(Math.random() * 5) < 8;

            if (drawCard || this.cardsSum < target) {
                this.drawCard();
            } else {
                break;
            }
        } while (this.cardsSum < 21);
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