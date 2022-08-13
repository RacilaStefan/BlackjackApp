import { Game } from "./GameTypes";
import { EVENTS, statusEvents } from "../util/constants";

export class ContextObject {
    statusEvents = statusEvents;
    id?: string | undefined;
    setId: any;
    game?: Game | undefined;
    setGame?: any;
    setStatusEvents?: any;
}