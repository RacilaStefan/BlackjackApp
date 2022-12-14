import React, { useContext } from 'react';
import { string } from 'yup';
import Logger from '../../util/logger';
import { Context } from './ContextProvider';

const log = new Logger('Notification');

export default function Notification({ event, waitingMsg, errorMsg, successMsg } : {event: string, waitingMsg?: string, errorMsg?: string, successMsg?: string}) {
  const context = useContext(Context);
  
  let element: JSX.Element | null;
  let className: string = '';
  //log.debug(`Status ${op}`, context.statusEvents[op])
  switch(context.statusEvents[event]) {
    case 'waiting': 
      element = <div > {waitingMsg ? waitingMsg : 'Waiting for server response!'} </div>;
      className='waiting'; 
    break;

    case 'error': 
      element = <div > {errorMsg ? errorMsg : 'Error!'} </div>; 
      className='error'
    break;

    case 'success':
      element = <div > {successMsg ? successMsg : 'Success!' } </div>;
      className='success'
    break;

    default: element = null; break;
  }

  const handleClose = () => {
    context.setStatusEvents({...context.statusEvents, [event]: 'close'});
  }

  return (
    element ?
    <div className={`flex-container column notification ${className} title`}>
      {element}
      <button className='button' onClick={handleClose}>Close</button>
    </div> : <></>
  );
}
