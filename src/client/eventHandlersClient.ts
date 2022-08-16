import { EVENTS, PATHS } from '../util/constants';
import { contextHolder } from './contextHolder';
import { CustomEvent } from '../types/CustomEvent';
import Logger from '../util/logger';
import { Game } from '../types/GameClass';
import { sendMsg } from '../util/functions';
import { socket } from './client';

const log = new Logger('Event Handlers');


export function handleMessageClient(message: MessageEvent<any>) {
    const event = JSON.parse(message.data as string) as CustomEvent;
    const context = contextHolder.context;

    //log.debug('Context Holder', context);
    if (context !== undefined) {
        switch(event.type) {
            case EVENTS.BOUNCE:
                const bouncingEvent: CustomEvent = JSON.parse(event.data);
                sendMsg(socket, bouncingEvent.type, bouncingEvent.data); break;
            case EVENTS.GET_GAME:
                let game = JSON.parse(event.data);
                if (game !== null) {
                    game = new Game('');
                    Object.assign(game, JSON.parse(event.data));
                    //log.debug('Game', game);
                    context.setGame(game);
                    context.setPlayer(game.getPlayerFromID(context.id));
                    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'close'});
                }
                break;

            case EVENTS.INFO: log.info(event.data); break;
            case EVENTS.JOIN_GAME:
                if (event.data === JSON.stringify(false)) {
                    context.setStatusEvents({...context.statusEvents, [EVENTS.JOIN_GAME]: 'error'});
                    break;
                }

                context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'success'});
                break;
            case EVENTS.PING: log.info(event.data); break;
            case EVENTS.SET_COOKIE: 
                document.cookie = 'ID='+event.data; 
                context.setId(event.data);
                break;

            case EVENTS.SET_ID:
                if (event.data !== '') {
                    document.cookie = 'ID='+event.data;
                    context.setId(event.data);
                    context.setStatusEvents({...context.statusEvents, [EVENTS.SET_ID]: 'success'});
                    break;
                }
                context.setStatusEvents({...context.statusEvents, [EVENTS.SET_ID]: 'error'});
                break;

            default: log.info('Unknown event'); break;
        }
    }
}