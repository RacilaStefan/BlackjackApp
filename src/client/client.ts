import { handleMessageClient } from "../util/functions";
import Logger from "../util/logger";

const log = new Logger('Client');

const url = process.env['NODE_ENV'] === 'development' ? 'ws://localhost:8000' : `wss://${window.location.host}`;
export const socket = new WebSocket(url);

log.debug('URL', url);
log.debug('Enviroment', process.env['NODE_ENV']);

socket.onopen = () => {
    log.info('Connection open');
    
    socket.onmessage = (event) => {
        log.debug('Message Event', event.data);
        handleMessageClient(event);
    }
}