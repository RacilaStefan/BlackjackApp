import React, { useContext } from 'react';
import { string } from 'yup';
import Logger from '../../util/logger';
import { Context } from './ContextProvider';

const log = new Logger('Notification');

export default function Notification({ op }) {
  const context = useContext(Context);
  
  let element: JSX.Element | null;
  let className: string = '';
  //log.debug(`Status ${op}`, context.statusEvents[op])
  switch(context.statusEvents[op]) {
    case 'waiting': 
      element = <div > Waiting for server response! </div>;
      className='waiting'; 
    break;

    case 'error': 
      element = <div > Error! </div>; 
      className='error'
    break;

    case 'success':
      element = <div > Success! </div>;
      className='success'
    break;

    default: element = null; break;
  }

  const handleClose = () => {
    context.setStatusEvents({...context.statusEvents, [op]: 'close'});
  }

  return (
    element ?
    <div className={`notification ${className} title`}>
      {element}
      <button className='button' onClick={handleClose}>Close</button>
    </div> : <></>
  );
}
