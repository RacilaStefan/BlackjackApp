import React, { createContext, useEffect, useState } from 'react'
import { readCookie, validId } from '../../util/functions';
import Logger from '../../util/logger';
import { ContextObject } from '../types/ContextObject';

const log = new Logger('ContextProvider');

export const Context = createContext<ContextObject>({});

export default function ContextProvider({children}) {
    const [id, setId] = useState();

    useEffect(() => {
        const cookie = readCookie(document.cookie, 'ID');
        if (cookie !== undefined)
            setId(cookie['value']);
    }, []);

    const context = {
        id: id,
    };

    log.debug('Context', context);

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider> 
    );
}
