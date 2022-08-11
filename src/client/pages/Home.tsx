import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../components/ContextProvider';

export default function Home() {
  const context = useContext(Context);
  let idProvenience = /*context.custom ? 'custom' :*/ 'generated';

  const navigate = useNavigate();

  return (
    <div className='center-band'>
      <div className='band-child'>
        <p className='band-child-title'>
          Your {idProvenience} ID is {context.id}.
        </p>
        <textarea className='textarea' placeholder='Custom ID' rows={1}></textarea>
        <div className='button-group' style={{'width': '80%'}}>
          <button className='button'>Change</button>
          <button className='button' onClick={() => navigate('/menu')}>To Menu</button>
        </div>
      </div>
    </div>
  );
}
