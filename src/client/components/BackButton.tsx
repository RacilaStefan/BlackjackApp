import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logger from '../../util/logger';
import { EVENTS, PATHS } from '../../util/constants';
import { sendMsg } from '../../util/functions';
import { socket } from '../client';

const log = new Logger('Back Button');

export default function BackButton({ text } : {text?: string}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    sendMsg(socket, EVENTS.LEAVE_GAME);
    navigate(-1);
  }
  //log.debug('Location', location);
  return (
    <button className='button' style={{
        'display': `${location.pathname === PATHS.home ? 'none' : 'flex'}`,
        'position': 'absolute',
        'left': '10%',
        'top': '80%',
        'zIndex' : '10'}} onClick={handleGoBack}>
      <div className='button-icon-left'>
        <ArrowBackIcon />
      </div>
      { text ? text : 'Back'}
    </button>
  );
}
