import { contextHolder } from "../client/contextHolder";
import { CustomEvent } from "../types/CustomEvent";
import { Card } from "../types/GameTypes";
import { CARD_TYPES, EVENTS } from "./constants";
import Logger from "./logger";

const log = new Logger('Functions');

export function validId(id: string) {
    return id.match(/[A-Za-z0-9]$/) !== null;
}

export function handleMessageClient(message: MessageEvent<any>) {
    const event = JSON.parse(message.data as string) as CustomEvent;
    const context = contextHolder.context;

    //log.debug('Context Holder', context);
    if (context !== undefined) {
        switch(event.type) {
            case EVENTS.GET_GAME: 
                context.setGame(JSON.parse(event.data)); 
                context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'close'});
                break;
            case EVENTS.INFO: log.info(event.data); break;
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

export function getRandomCard(): Card {
    const randomNumber = Math.floor(Math.random() * 4);
    return {
        value: Math.floor((Math.random() * 13)) + 2,
        type: CARD_TYPES[randomNumber] as string,
    };
}