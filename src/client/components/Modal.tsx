import React from 'react';
import ReactDOM from 'react-dom';
import { rootElem } from '..';

export default function Modal({ children, show } : {children?: JSX.Element, show?: boolean}) {

  if (!show) return <></>;
  
  return (
    ReactDOM.createPortal(
        children,
        rootElem
    )
  );
}
