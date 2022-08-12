export const PATHS = {
    home: '/',
    menu: '/menu',
    play: '/game',
};

export const OPS = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    GET_GAME: 'GET_GAME',
    NEW_GAME: 'NEW_GAME',
    SET_COOKIE: 'SET_COOKIE',
    SET_ID: 'SET_ID',
    VALIDATE_ID: 'VALIDATE_ID',
}

export const statusEvents: { [key: string] : 'waiting' | 'close' | 'error' | 'success' } = {};

for (const [key, ] of Object.entries(OPS)) {
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

export const CARD_TYPES = [ 'spades', 'heart', 'clubs', 'diamond' ];