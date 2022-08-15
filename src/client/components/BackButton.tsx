import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logger from '../../util/logger';
import { PATHS } from '../../util/constants';

const log = new Logger('Back Button');

export default function BackButton({ text } : {text?: string}) {
  const navigate = useNavigate();
  const location = useLocation();

  //log.debug('Location', location);
  return (
    <button className='button' style={{
        'display': `${location.pathname === PATHS.home ? 'none' : 'flex'}`,
        'position': 'absolute',
        'left': '10%',
        'top': '80%',
        'zIndex' : '10'}} onClick={() => navigate(-1)}>
      <div className='button-icon-left'>
        <ArrowBackIcon />
      </div>
      { text ? text : 'Back'}
    </button>
  );
}
