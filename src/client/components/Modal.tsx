import React from 'react';
import ReactDOM from 'react-dom';
import { rootElem } from '..';

export default function Modal({ children, show, setShow } : {children?: JSX.Element[] | JSX.Element, show?: boolean, setShow?}) {

  if (!show) return <></>;

  const _setShow = setShow === undefined ? () => {} : () => setShow(false)
  
  return (
    ReactDOM.createPortal(
      <div className='modal flex-container column' onClick={_setShow}>
        {children}
      </div>,
        rootElem
    )
  );
}
