import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '../../types/GameClass';
import { Context } from '../components/ContextProvider';
import { EVENTS, PATHS } from '../../util/constants';
import { HeartsIcon, ClubsIcon, DiamondsIcon, SpadesIcon }  from '../components/card-icons/CardIconTypes';
import StopIcon from '@mui/icons-material/PanToolOutlined';
import AddIcon from '@mui/icons-material/Add';
import ReadyIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { socket } from '../client';
import { sendMsg } from '../../util/functions';
import Modal from '../components/Modal';
import Logger from '../../util/logger';
import { Player } from '../../types/PlayerClass';

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

  if (game === null || player === undefined) {
    log.debug('Game', game);
    log.debug('Player', player);
    return <Navigate to={PATHS.home}/>;
  }

  if (player.status === 'not-ready' && !showReadyModal)
    setShowReadyModal(true);

    let playersElem: JSX.Element[] = [];

  if (game.is1v1) {
    playersElem.push(renderPlayer(player, game.turnID));
  } else {
    playersElem = game.players.map(player => {
      return <> {renderPlayer(player, game.turnID)} </>;
    });
  }
    
  let dealer: JSX.Element = <></>; 

  if (game.is1v1) {
    let oponent = game.players.find(_player => _player.id !== player.id);

    if (oponent !== undefined)
      dealer = renderPlayer(oponent, game.turnID, true);
  } else {
    dealer = renderPlayer(game.dealer, game.turnID, true);
  }

  const logs = game.logs.map(log => {
    return (
      <div key={Math.random()} className='title'>
        {log}
      </div>
    );
  });

  return (
    <div className='screen-center board'>
      <div className='title game-id'>
        Game id: {game.id}
      </div>
      {dealer}
      <div className='flex-container players-wrapper'>
        {playersElem}
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
        <button 
          className={game.players.length === 1 && game.is1v1 ? 'button-disabled' : 'button'} 
          disabled={game.players.length === 1 && game.is1v1 ? true : false}
          style={{}} 
          onClick={setReady}>
          <div className='button-icon-left'>
            {player.status === 'ready' ? <CancelIcon /> : <ReadyIcon />}
          </div>
          {player.status === 'ready' ? 'Not Ready' : 'Ready'}
        </button>
        { player.id === (game.players[0]?.id) ? 
          <div className='flex-container column title text-border-2px current-turn share-id'>
            <span style={{'fontSize' : '2rem'}} className='not-ready'> {game.id} </span>
            { game.is1v1 ? 
            <span>Share this code with your friend so that he/she can join the BATTLE</span> : 
            <span>Share this code with your friends so that they can join the game</span>}
          </div>
          : <></> 
        }
      </Modal>
    </div>
  );
}

const renderCards = (cards: Card[]) => {
  const cardsElem: JSX.Element[] = [];
  cards.forEach(card => {
    cardsElem.push(
      <div key={card.value + card.type} className='flex-container card'>
        {cardValues[card.value] === undefined ? card.value : cardValues[card.value]}
        <div className={`card-icon `}>
          {cardIcons[card.type]}
        </div>
      </div>
    );
  });

  return cardsElem;
}

const renderPlayer = (player: Player, turnID: string, isDealer?: boolean) => {
  return (
    <div key={player.id} className={`flex-container ${isDealer ? 'dealer-container' : 'player-container'}`}>
      <div className={`flex-container ${isDealer ? 'dealer-title' : 'player-title'} title text-border-2px ${player.status} ${turnID === player.id ? 'current-turn' : ''}`}>
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
}
