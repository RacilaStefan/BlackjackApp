import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EVENTS, PATHS } from '../../util/constants';
import { constructEvent } from '../../util/functions';
import Logger from '../../util/logger';
import { socket } from '../client';

const log = new Logger('Game Detector');

export default function GameDetector() {
    const location = useLocation();
    
    useEffect(() => {
        if (location.pathname !== PATHS.game) {
            socket.send(constructEvent({
                type: EVENTS.LEAVE_GAME,
                data: '',
            }));
        }
    }, [location.pathname]);

    return (
        <></>
    );
}
