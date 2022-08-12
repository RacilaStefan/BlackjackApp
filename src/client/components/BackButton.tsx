import React from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button className='button' style={{
        'position': 'absolute',
        'left': '10%',
        'top': '125%'}} onClick={() => navigate('/')}>
    <div className='button-icon-left'>
      <ArrowBackIcon />
    </div>
    Back
  </button>
  );
}
