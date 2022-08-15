import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EVENTS, PATHS } from '../../util/constants';
import { sendMsg } from '../../util/functions';
import Logger from '../../util/logger';
import { socket } from '../client';

const log = new Logger('Game Detector');

export default function GameDetector() {
    const location = useLocation();
    
    useEffect(() => {
        if (location.pathname !== PATHS.game) {
            if (socket.readyState === socket.OPEN)
                sendMsg(socket, EVENTS.LEAVE_GAME);
        }
    }, [location.pathname]);

    return (
        <></>
    );
}
