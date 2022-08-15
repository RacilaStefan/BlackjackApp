import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../client';
import { EVENTS, PATHS } from '../../util/constants';
import { sendMsg } from '../../util/functions';
import { Context } from '../components/ContextProvider';
import IDForm from '../components/IDForm';

export default function Menu() {
  const context = useContext(Context);
  const navigate = useNavigate();

  const playAlone = () => {
    sendMsg(socket, EVENTS.NEW_GAME, 'alone');
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});
    navigate(PATHS.game);
  }

  const createGame = () => {
    sendMsg(socket, EVENTS.NEW_GAME);
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});
    navigate(PATHS.game);
  }

  const joinGame = (value, {resetForm}) => {
    if (value.id === '') return;

    //log.debug('Value submitted', value);

    sendMsg(socket, EVENTS.JOIN_GAME, value.id);
    context.setStatusEvents({...context.statusEvents, [EVENTS.JOIN_GAME]: 'waiting'});
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});
    navigate(PATHS.game);

    resetForm();
  }

  return (
    <div className='screen-center flex-container main-band'>
      <div className='flex-container column band-child clickable bg-hearts' onClick={playAlone}>
        <p className='band-child-title title'>
          Play Alone
        </p>
      </div>
      <div className='flex-container column band-child clickable bg-clubs' onClick={createGame}>
        <p className='band-child-title title'>
          Create A Game
        </p>
      </div>
      <div className="screen-center">
        <IDForm handleSubmit={joinGame} 
          placeholder='Game ID' 
          submitString='Join' 
          label='Join A Game'
          fieldStyle={{'width': '40%', 'marginBottom' : '5%'}}
          errorStyle={{'top' : '160px', 'width' : '200px'}}
          regex= {/[0-9]{1,3}$/}
        />
      </div>
      <div className='tips title'>
        A Game ID is a number from 1 to 999
      </div>
    </div>
  );
}
