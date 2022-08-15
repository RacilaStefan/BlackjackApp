import { CustomEvent } from "../types/CustomEvent";
import { Card } from "../types/GameClass";
import Logger from "./logger";

const log = new Logger('Functions');

export function validId(id: string) {
    return id.match(/[A-Za-z0-9]$/) !== null;
}

export function constructEvent(event: CustomEvent): string {
    return JSON.stringify(event, null ,2);
}

export function readCookie(cookies: string, id?: string) {
    const cookiesArray = cookies.split(';').map(cookie => { return {id: cookie.split('=')[0], value: cookie.split('=')[1]} });
    if (id !== undefined)
        return cookiesArray.find(cookie => cookie.id === id);
    else
        return cookiesArray;
}

export function sendMsg(ws: WebSocket, type: string, msg?: any) {
    ws.send(constructEvent({
        type: type,
        data: typeof msg === 'string' ? msg : JSON.stringify(msg),
    }));
}

// Fisher–Yates shuffle
export function shuffleCards(cards: Card[]) {
   
    let currentIndex = cards.length;
    let randomIndex: number;
    
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [cards[currentIndex] as any, cards[randomIndex] as any] = [cards[randomIndex], cards[currentIndex]];
    }

    return cards;
}