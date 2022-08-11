import { socket } from "../client";
import { CustomEvent } from "../client/types/CustomEvent";
import { OPS } from "./constants";
import Logger from "./logger";

const log = new Logger('Functions');

export function validId(id: string) {
    return id.match(/[A-Za-z0-9]$/) !== null;
}

export function handleMessageClient(message: MessageEvent<any>) {
    const data = JSON.parse(message.data as string) as CustomEvent;

    switch(data.event) {
        case OPS.INFO: log.info(data.data); break;
        case OPS.SET_COOKIE: document.cookie = 'ID='+data.data; break;
        case OPS.VALIDATE_ID: break;
    }
}

export function constructRequest(request: CustomEvent): string {
    return JSON.stringify(request);
}

export function readCookie(cookies: string, id?: string) {
    const cookiesArray = cookies.split(';').map(cookie => { return {id: cookie.split('=')[0], value: cookie.split('=')[1]} });
    if (id !== undefined)
        return cookiesArray.find(cookie => cookie.id === id);
    else
        return cookiesArray;
}