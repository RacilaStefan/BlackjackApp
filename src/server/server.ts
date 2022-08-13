import { createServer } from 'http';
import { MessageEvent, WebSocketServer } from 'ws';
import { requestListener } from './routing';
import { handleIncomingMessage, handleLoosingConnection, handleMessageServer } from './eventHandlers';

const log = console.log;

const port = process.env['PORT'] ? process.env['PORT'] : 8000;
log('Server will start listening on port ' + port)
const server = createServer(requestListener).listen(port);
const wss = new WebSocketServer({ server: server });

log('Server is running');

wss.on('connection', (ws, request) => {
    //log(request.headers);

    let id = handleIncomingMessage(ws, request);

    ws.onmessage = (event: MessageEvent) => {
        handleMessageServer(event, ws, id);
    }

    ws.onclose = (event) => {
        handleLoosingConnection(id);
    }
});

