import { EVENTS } from "../util/constants";
import { sendMsg } from "../util/functions";
import Logger from "../util/logger";
import { handleMessageClient } from "./eventHandlersClient";

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
            sendMsg(socket, EVENTS.PING, 'Ping?');
        }, 200 * 1000);
    }

    setInterval(() => {
        sendMsg(socket, EVENTS.GET_GAME)
    }, 5 * 1000);

    sendMsg(socket, EVENTS.INFO, 'Hello server!');

    socket.onmessage = (event) => {
        //log.debug('Message Event', event.data);
        handleMessageClient(event);
    }
}