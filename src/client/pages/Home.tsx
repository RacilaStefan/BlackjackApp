import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../components/ContextProvider';
import Logger from '../../util/logger';
import { EVENTS, PATHS } from '../../util/constants';
import Notification from '../components/Notification';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IDForm from '../components/IDForm';
import { socket } from '../client';
import { constructEvent } from '../../util/functions';

const log = new Logger('Home');

export default function Home() {
  const context = useContext(Context);
  const navigate = useNavigate();

  //const idProvenience = /*context.custom ? 'custom' :*/ 'generated';

  const handleSubmit = (value, {resetForm}) => {
    if (value.id === '') return;

    //log.debug('Value submitted', value);

    socket.send(constructEvent({
      type: EVENTS.SET_ID,
      data: value.id,
    }));
    context.setStatusEvents({...context.statusEvents, [EVENTS.SET_ID]: 'waiting'});

    resetForm();
  }
  
  return (
    <div className='screen-center flex-container main-band'>
      <Notification op={EVENTS.SET_ID} />
      <div className='flex-container column band-child bg-hearts'>
        <p className='band-child-title title'>
          Your {/*{idProvenience}*/} ID is {context.id}.
        </p>
        <IDForm handleSubmit={handleSubmit}/>
        <button className='button' style={{
            'position': 'absolute',
            'left': '3%',
            'top': '89%'}} onClick={() => navigate(PATHS.menu)}>
          To Menu
          <div className='button-icon-right'>
            <ArrowForwardIcon />
          </div>
        </button>
      </div>
      <div className='tips title'>
        A custom ID can contain only letters and number and it must be between 2 and 20 characters
      </div>
    </div>
  );
}

