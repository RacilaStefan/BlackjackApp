import { EVENTS } from "../util/constants";
import { constructEvent, handleMessageClient } from "../util/functions";
import Logger from "../util/logger";

const log = new Logger('Client');

export const enviroment = process.env['NODE_ENV'];
const url = enviroment === 'development' ? 'ws://localhost:8000' : `wss://${window.location.host}`;
export const socket = new WebSocket(url);

log.debug('URL', url);
log.debug('Enviroment', enviroment);

socket.onopen = () => {
    log.info('Connection open');
    
    if (enviroment === 'production') {
        setInterval(() => {
            socket.send(constructEvent({
                type: EVENTS.PING,
                data: 'Ping?'
            }));
        }, 20 * 1000);
    }

    socket.send(constructEvent({
        type: EVENTS.INFO,
        data: 'Hello server!'
    }));

    socket.onmessage = (event) => {
        log.debug('Message Event', event.data);
        handleMessageClient(event);
    }
}