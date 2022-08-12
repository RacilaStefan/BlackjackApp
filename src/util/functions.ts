import { contextHolder } from "../client/contextHolder";
import { CustomEvent } from "../types/CustomEvent";
import { Card } from "../types/GameTypes";
import { CARD_TYPES, OPS } from "./constants";
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
            case OPS.GET_GAME: context.setGame(JSON.parse(event.data)); break;
            case OPS.INFO: log.info(event.data); break;
            case OPS.SET_COOKIE: document.cookie = 'ID='+event.data; break;
            case OPS.SET_ID:
                if (event.data !== '') {
                    document.cookie = 'ID='+event.data;
                    context.setId(event.data);
                    context.setStatusEvents({...context.statusEvents, [OPS.SET_ID]: 'success'});
                    break;
                }
                context.setStatusEvents({...context.statusEvents, [OPS.SET_ID]: 'error'});
                break;
            case OPS.VALIDATE_ID: break;
        }
    }
}

export function constructRequest(request: CustomEvent): string {
    return JSON.stringify(request, null ,2);
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
        value: Math.floor((Math.random() * 14)) + 1,
        type: CARD_TYPES[randomNumber] as string,
    };
}