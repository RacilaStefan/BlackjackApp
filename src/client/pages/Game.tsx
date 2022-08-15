import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '../../types/GameClass';
import { Context } from '../components/ContextProvider';
import { EVENTS, PATHS } from '../../util/constants';
import HeartsIcon from '../components/card-icons/HeartsIcon';
import ClubsIcon from '../components/card-icons/ClubsIcon';
import DiamondsIcon from '../components/card-icons/DiamondsIcon';
import SpadesIcon from '../components/card-icons/SpadesIcon';
import StopIcon from '@mui/icons-material/PanToolOutlined';
import AddIcon from '@mui/icons-material/Add';
import ReadyIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { socket } from '../client';
import { sendMsg } from '../../util/functions';
import Modal from '../components/Modal';
import Logger from '../../util/logger';

const log = new Logger('Game');

const cardIcons = {
  'hearts' : <HeartsIcon />,
  'clubs' : <ClubsIcon />,
  'diamonds' : <DiamondsIcon />,
  'spades' : <SpadesIcon />
}

const cardValues = {
  '14' : 'K',
  '13' : 'Q',
  '12' : 'J',
  '11' : 'A',
}

export default function Game() {
  const context = useContext(Context);
  const [showReadyModal, setShowReadyModal] = useState(false);
  
  const renderCards = (cards: Card[]) => {
    const cardsElem: JSX.Element[] = [];
    let id = 0;
    cards.forEach(card => {
      cardsElem.push(
        <div key={id++} className='flex-container card'>
          {cardValues[card.value] === undefined ? card.value : cardValues[card.value]}
          <div className={`card-icon `}>
            {cardIcons[card.type]}
          </div>
        </div>
      );
    });

    return cardsElem;
  }

  const handleDrawCard = () => {
    sendMsg(socket, EVENTS.DRAW_CARD);
  }

  const handleStand = () => {
    sendMsg(socket, EVENTS.END_TURN);
  }

  const setReady = () => {
    sendMsg(socket, EVENTS.READY);
  }

  if (context.statusEvents[EVENTS.GET_GAME] !== 'close') return <></>;
  
  const game = context.game;
  const player = context.player;

  if (game === undefined || player === undefined) {
    log.info('Buna ziua, am navigat');
    return <Navigate to={PATHS.home}/>;
  }

  if (player.status === 'not-ready' && !showReadyModal)
    setShowReadyModal(true);

  const players = game.players.map(player => {
    return (
      <div key={player.id} className='flex-container player-container'>
        <div className={`flex-container player-title title text-border-2px ${player.status} ${game.turnID === player.id ? 'current-turn' : ''}`}>
          {player.id}
          <div className='flex-container points'>
            {player.cardsSum}
          </div>
        </div>
        <div className='flex-container cards-container'>
          {renderCards(player.cards)}
        </div>
      </div>
    );
  });

  const logs = game.logs.map(log => {
    return (
      <div key={Math.random()} className='title'>
        {log}
      </div>
    );
  });

  return (
    <div className='screen-center board'>
      <div className='flex-container column dealer-container'>
        <div className={`flex-container dealer-title title text-border-2px ${game.dealer.status} ${game.turnID === game.dealer.id ? 'current-turn' : ''}`}>
          {game.dealer.id}
          <div className='flex-container points'>
            {game.dealer.cardsSum}
          </div>
        </div>
        <div className='flex-container cards-container'>
            {renderCards(game.dealer.cards)}
        </div>
      </div>
      <div className='flex-container players-wrapper'>
        {players}
      </div>
      { game.turnID === player.id ? 
          <><button className='button special-button' style={{'left' : '-25%'}} onClick={handleDrawCard}>
            <div className='button-icon-left'>
              <AddIcon />
            </div>
            Hit
          </button>
          <button className='button special-button' style={{'right' : '-25%'}} onClick={handleStand}>
            <div className='button-icon-left'>
              <StopIcon />
            </div>
            Stand
          </button></> : <></> }
      <div className='flex-container column logs-container'>
        {logs}
      </div>
      <Modal show={game.dealer.status === 'not-ready'}>
        <div className='modal flex-container'>
          <button className='button' style={{}} onClick={setReady}>
            <div className='button-icon-left'>
              {player.status === 'ready' ? <CancelIcon /> : <ReadyIcon />}
              
            </div>
            {player.status === 'ready' ? 'Not Ready' : 'Ready'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
