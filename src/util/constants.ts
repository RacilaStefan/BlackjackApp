export const PATHS = {
    home: '/',
    menu: '/menu',
    game: '/game',
};

export const EVENTS = {
    DRAW_CARD: 'DRAW_CARD',
    END_TURN: 'END_TURN',
    ERROR: 'ERROR',
    INFO: 'INFO',
    GET_GAME: 'GET_GAME',
    JOIN_GAME: 'JOIN_GAME',
    LEAVE_GAME: 'LEAVE_GAME',
    NEW_GAME: 'NEW_GAME',
    PING: 'PING',
    SET_COOKIE: 'SET_COOKIE',
    SET_ID: 'SET_ID',
    VALIDATE_ID: 'VALIDATE_ID',
}

export const statusEvents: { [key: string] : 'waiting' | 'close' | 'error' | 'success' } = {};

for (const [key, ] of Object.entries(EVENTS)) {
    statusEvents[key] = 'close';
}

export const ASSET_TYPES = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.ico': 'image/*',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/*',
    '': 'text/html',    
};

export const CARD_TYPES = [ 'spades', 'hearts', 'clubs', 'diamonds' ];

export const MAX_PLAYERS_PER_GAME = 5;