import React, { useContext, useState } from 'react';
import { socket } from '../client';
import { EVENTS } from '../../util/constants';
import { sendMsg } from '../../util/functions';
import { Context } from '../components/ContextProvider';
import IDForm from '../components/IDForm';
import KingOfHearts from '../components/card-icons/KingOfHearts';
import KingOfClubs from '../components/card-icons/KingOfClubs';
import Modal from '../components/Modal';
import Notification from '../components/Notification';

export default function Menu() {
  const context = useContext(Context);
  const [show, setShow] = useState(false);

  const playAlone = () => {
    sendMsg(socket, EVENTS.NEW_GAME, 'alone');
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});
  }

  const createGame = (is1v1: boolean) => {
    sendMsg(socket, EVENTS.NEW_GAME, is1v1);
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});
  }

  const joinGame = (value, {resetForm}) => {
    if (value.id === '') return;

    //log.debug('Value submitted', value);

    sendMsg(socket, EVENTS.JOIN_GAME, value.id);
    context.setStatusEvents({...context.statusEvents, [EVENTS.JOIN_GAME]: 'waiting'});
    context.setStatusEvents({...context.statusEvents, [EVENTS.GET_GAME]: 'waiting'});

    resetForm();
  }

  return (
    <div className='screen-center flex-container main-band'>
      <Notification event={ EVENTS.JOIN_GAME } errorMsg='Game does not exist'/>
      <div className='flex-container column band-child clickable' onClick={playAlone}>
        <KingOfHearts />
        <p className='band-child-title title'>
          Play Alone
        </p>
      </div>
      <div className='flex-container column band-child clickable' onClick={() => setShow(true)}>
        <KingOfClubs />
        <p className='band-child-title title'>
          Create A Game
        </p>
      </div>
      <div className="screen-center">
        <IDForm handleSubmit={joinGame} 
          placeholder='Game ID' 
          submitString='Join' 
          label='Join A Game'
          fieldStyle={{'width': '100%'}}
          //errorStyle={{'top' : '160px', 'width' : '200px'}}
          buttonStyle={{'top' : '160%'}}
          regex= {/[0-9]{1,3}$/}
        />
      </div>
      <div className='tips title'>
        A Game ID is a number from 1 to 999
      </div>
      <Modal show={show} setShow={setShow}> 
        <button className='button special-button' style={{'top' : '35%'}} onClick={() => createGame(false)}>
          Play with Dealer
        </button>
        <button className='button special-button' style={{'top' : '59%'}} onClick={() => createGame(true)}>
          Play 1vs1
        </button>
      </Modal>
    </div>
  );
}
