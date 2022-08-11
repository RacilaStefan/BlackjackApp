export class Game {
    id: string;
    users: Player[] = [];
    
    constructor(id: string) {
        this.id = id;
    }
}

export class Player {
    id: string;
    status: 'ready' | undefined = undefined;
    game?: Game;
    cards: Card[] = [];

    constructor(id: string) {
        this.id = id;
    }
}

interface Card {
    type: CardType,
    value: number,
}

enum CardType {
    SPADES = 'SPADES',
    HEART = 'HEART',
    CLUBS ='CLUBS',
    DIAMONDS = 'DIAMONDS',
}