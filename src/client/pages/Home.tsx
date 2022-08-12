import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../components/ContextProvider';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Logger from '../../util/logger';
import { socket } from '../client';
import { constructRequest } from '../../util/functions';
import { OPS, PATHS } from '../../util/constants';
import Notification from '../components/Notification';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const log = new Logger('Home');

export default function Home() {
  const context = useContext(Context);
  const initialValues = {
    id: ''
  }
  const validationSchema = Yup.object({
    id: Yup.string().matches(/^[A-Za-z0-9]{2,20}$/, 'Caractere ilegale introduse!'),
  });

  //const idProvenience = /*context.custom ? 'custom' :*/ 'generated';

  const navigate = useNavigate();

  const handleSubmit = (value) => {
    if (value.id === '') return;

    log.debug('Value submitted', value);

    socket.send(constructRequest({
      type: OPS.SET_ID,
      data: value.id,
    }));
    context.setStatusEvents({...context.statusEvents, [OPS.SET_ID]: 'waiting'});
  }

  return (
    <div className='center-band'>
      <Notification op={OPS.SET_ID} />
      <div className='band-child'>
        <p className='band-child-title title'>
          Your {/*{idProvenience}*/} ID is {context.id}.
        </p>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          initialValues={initialValues}
        >
          <Form className='form-container'>
            <Field className='form-field' placeholder='Custom ID' name='id'/>
            <ErrorMessage className='error-message title' component='div' name='id'/>
            <button className='button' style={{'marginBottom' : '45%'}}>Change</button> 
          </Form>
        </Formik>
        <button className='button' style={{
            'position': 'absolute',
            'left': '3%',
            'top': '89%'}} onClick={() => navigate(PATHS.menu)}>
          To Menu
          <div className='button-icon-right'>
            <ArrowForwardIcon />
          </div>
        </button>
      </div>
    </div>
  );
}

