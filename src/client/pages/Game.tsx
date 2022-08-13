import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '../../types/GameTypes';
import { Context } from '../components/ContextProvider';
import { EVENTS, PATHS } from '../../util/constants';
import HeartsIcon from '../components/card-icons/HeartsIcon';
import ClubsIcon from '../components/card-icons/ClubsIcon';
import DiamondsIcon from '../components/card-icons/DiamondsIcon';
import SpadesIcon from '../components/card-icons/SpadesIcon';

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

  if (context.statusEvents[EVENTS.GET_GAME] !== 'close') return <></>;
  
  const game = context.game;

  if (game === undefined) return <Navigate to={PATHS.home}/>;

  const players = game.players.map(player => {
    return (
      <div key={player.id} className='flex-container player-container'>
        <div className='player-title title'>
          {`${player.id} is ${player.status}. Points: ${player.cardsSum}`}
        </div>
        <div className='flex-container cards-container'>
          {renderCards(player.cards)}
        </div>
      </div>
    );
  });

  return (
    <div className='screen-center board'>
      <div className='flex-container column dealer-container'>
        <div className='dealer-title title'>
          {`${game.dealer.id} Points: ${game.dealer.cardsSum}`}
        </div>
        <div className='flex-container cards-container'>
            {renderCards(game.dealer.cards)}
        </div>
      </div>
      <div className='flex-container players-wrapper'>
        {players}
      </div>
      <button className='button'>Hit</button>
      <button className='button'>Stand</button>
    </div>
  );
}
