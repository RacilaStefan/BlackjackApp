import { Game } from "./GameClass";
import { Player } from "./PlayerClass";
import { statusEvents } from "../util/constants";

export class ContextObject {
    id: string | undefined;
    setId: any;
    game: Game | null = null;
    setGame: any;
    player: Player | undefined;
    setPlayer: any;
    statusEvents = statusEvents;
    setStatusEvents?: any;
}