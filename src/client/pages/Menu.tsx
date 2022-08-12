import React from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../client';
import { OPS, PATHS } from '../../util/constants';
import { constructRequest } from '../../util/functions';

export default function Menu() {

  const navigate = useNavigate();

  const playAlone = () => {
    socket.send(constructRequest({type: OPS.NEW_GAME, data: 'alone'}));
    navigate(PATHS.play);
  }

  const playWithFriends = () => {
    socket.send(constructRequest({type: OPS.NEW_GAME, data: ''}));
    navigate(PATHS.play);
  }

  return (
    <div className='center-band'>
      <div className='band-child clickable' onClick={playAlone}>
        <p className='band-child-title title'>
          Play Alone
        </p>
      </div>
      <div className='band-child clickable' onClick={playWithFriends}>
        <p className='band-child-title title'>
          Play with friends
        </p>
      </div>

    </div>
  );
}
