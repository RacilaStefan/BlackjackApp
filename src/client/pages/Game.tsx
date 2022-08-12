import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Card } from '../../types/GameTypes';
import { Context } from '../components/ContextProvider';
import { PATHS } from '../../util/constants';

export default function Game() {
  const context = useContext(Context);
  
  const renderCards = (cards: Card[]) => {
    const cardsElem: JSX.Element[] = [];
    cards.forEach(card => {
      cardsElem.push(
        <div className='card'>
          {`${card.value} ${card.type}`}
        </div>
      );
    });

    return cardsElem;
  }

  const game = context.game;

  if (game === undefined) return <Navigate to={PATHS.home}/>;

  const players = game.users.map(user => {
    return (
      <div>
        <div className='user-container'>
          {user.id}
        </div>
        <div className='cards-container'>
          {renderCards(user.cards)}
        </div>
      </div>
    );
  });

  return (
    <div className='board'>
      <div className='dealer'>
        {game.id}
        <div className='cards-container'>
          <div className='card'>
            {renderCards(game.dealerCards)}
          </div>
        </div>
      </div>
      {players}
    </div>
  );
}
