import React, { createContext, useEffect, useState } from 'react'
import { readCookie, sendMsg } from '../../util/functions';
import Logger from '../../util/logger';
import { ContextObject } from '../../types/ContextObject';
import { contextHolder } from '../contextHolder';
import { EVENTS, PATHS, statusEvents } from '../../util/constants';
import { enviroment, socket } from '../client';
import { useLocation, useNavigate } from 'react-router-dom';

const log = new Logger('ContextProvider');

export const Context = createContext<ContextObject>(new ContextObject());

export default function ContextProvider({children}) {
    const [id, setId] = useState();
    const [game, setGame] = useState(null);
    const [player, setPlayer] = useState();
    const [status, setStatusEvents] = useState(statusEvents);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const cookie = readCookie(document.cookie, 'ID');
        if (cookie !== undefined)
            setId(cookie['value']);
    }, []);

    useEffect(() => {
        //log.debug('Game', game);
        //log.debug('Location', location.pathname);
        if (game !== null && location.pathname !== PATHS.game) {
            navigate(PATHS.game);
        }
    }, [game]);
    

    const context = {
        id: id,
        setId: setId,
        game: game,
        setGame: setGame,
        player: player,
        setPlayer: setPlayer,
        statusEvents: status,
        setStatusEvents: setStatusEvents,
    };

    contextHolder.context = {...context};
    if (enviroment === 'development') {
        // log.debug('Context', context);
        // log.debug('Context Holder', contextHolder.context);
    }

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider> 
    );
}
