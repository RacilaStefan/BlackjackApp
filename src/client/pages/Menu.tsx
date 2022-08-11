import React from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '..';
import { OPS } from '../../util/constants';
import { constructRequest } from '../../util/functions';

export default function Menu() {

  const navigate = useNavigate();

  const playAlone = () => {
    socket.send(constructRequest({event: OPS.NEW_GAME, data: 'alone'}));
    navigate('/play');
  }

  return (
    <div className='center-band'>
      <div className='band-child'>
        <p className='band-child-title'>
          Play Alone
        </p>
        <div className='button-group' style={{'width': '80%'}}>
          <button className='button' onClick={playAlone}>Play</button>
        </div>
      </div>
      <div className='band-child'>
        <p className='band-child-title'>
          Play with friends
        </p>
        <div className='button-group' style={{'width': '80%'}}>
          <button className='button'>Create Room</button>
        </div>
      </div>
    </div>
  );
}
