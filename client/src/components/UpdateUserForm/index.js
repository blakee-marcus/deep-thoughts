import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { UPDATE_NAME } from '../../utils/mutations';

const UpdateUserForm = (props) => {
  const [formState, setFormState] = useState({ name: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [updateName] = useMutation(UPDATE_NAME);

  const validate = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'name':
        if (value.length < 1) {
          errorMessage = "Name can't be blank";
        }
        break;
      default:
        errorMessage = '';
    }
    return errorMessage;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const errorMessage = validate(name, value);
    setErrorMessage(errorMessage);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { name } = formState;
    try {
      updateName({
        variables: { username: props.username, name },
      });
      props.setModalVisible(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='modal'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header flex-row justify-space-between'>
            <div className='flex-row'>
              <button
                type='button'
                className='btn-close'
                onClick={() => props.setModalVisible(false)}>
                x
              </button>
              <h5 className='modal-title'>Edit Profile</h5>
            </div>
            <div className='flex-row'>
              <button
                className='signUpBtn w-100 btn btn-light px-1 py-1 text-standard'
                type='submit'
                onClick={handleFormSubmit}>
                Save
              </button>
            </div>
          </div>
          <div className='modal-body'>
            <form className='flex-column'>
              <div className='flex-column form-input'>
                <label htmlFor='name'>Name:</label>
                <input
                  name='name'
                  type='text'
                  id='name'
                  value={formState.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {errorMessage && <div>{errorMessage}</div>}
              <div className='modal-footer'></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateUserForm;
