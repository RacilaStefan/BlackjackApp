import React, { createContext, useEffect, useState } from 'react'
import { readCookie, validId } from '../../util/functions';
import Logger from '../../util/logger';
import { ContextObject } from '../../types/ContextObject';
import { contextHolder } from '../contextHolder';
import { statusEvents } from '../../util/constants';

const log = new Logger('ContextProvider');

export const Context = createContext<ContextObject>(new ContextObject());

export default function ContextProvider({children}) {
    const [id, setId] = useState();
    const [game, setGame] = useState();
    const [status, setStatusEvents] = useState(statusEvents);

    useEffect(() => {
        const cookie = readCookie(document.cookie, 'ID');
        if (cookie !== undefined)
            setId(cookie['value']);
    }, []);

    const context = {
        id: id,
        setId: setId,
        game: game,
        setGame: setGame,
        statusEvents: status,
        setStatusEvents: setStatusEvents,
    };

    contextHolder.context = {...context};
    log.debug('Context', context);
    log.debug('Context Holder', contextHolder.context);

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider> 
    );
}
