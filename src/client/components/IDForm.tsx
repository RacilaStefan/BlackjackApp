import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import React, { useContext, useRef } from 'react';
import * as Yup from 'yup';

export default function IDForm({handleSubmit, submitString, placeholder, label, fieldStyle, buttonStyle, errorStyle, regex} : 
  { handleSubmit: any, 
    submitString?: string, 
    placeholder?: string, 
    label?: string, 
    fieldStyle?: { [key: string] : string }, 
    buttonStyle?: { [key: string] : string },
    errorStyle?: { [key: string] : string },
    regex?: RegExp,
  }) {

  const initialValues = {
    id: '',
  };

  const validationSchema = Yup.object({
    id: Yup.string().matches(regex ? regex : /^[A-Za-z0-9]{2,20}$/, 'Illegal characters!'),
  });
    
  const formRef = useRef<FormikProps<typeof initialValues>>(null);

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
      formRef={formRef}
    >
      <Form className='flex-container column form-container'>
        {label ? <label className='title field-label' htmlFor='id'>{label}</label> : <></>}
        <Field className='form-field' style={fieldStyle} placeholder={ placeholder ? placeholder : 'Custom ID' } name='id'/>
        <ErrorMessage name='id'>
          {msg => <div className='error-message title' style={errorStyle}>{msg}</div>}
        </ErrorMessage>
        <button type='submit' className='button' style={{'position' : 'absolute', 'top' : '55%', ...buttonStyle}}>
          { submitString ? submitString : 'Change' }
        </button> 
      </Form>
    </Formik>
  )
}
