import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { UPDATE_PROFILE } from '../../utils/mutations';

const UpdateUserForm = (props) => {
  console.log(props);
  const [formState, setFormState] = useState({ name: props.user.name, bio: props.user.bio, location: props.user.location, website: props.user.website });
  const [errorMessage, setErrorMessage] = useState('');
  const [updateProfile] = useMutation(UPDATE_PROFILE);

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
    if (errorMessage) {
      return;
    }

    const { name, bio, location, website } = formState;

    try {
      updateProfile({
        variables: { username: props.user.username, name, bio, location, website },
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
              <div
                className={`flex-column form-input mb-3${
                  errorMessage &&
                  errorMessage.includes('Name') &&
                  'form-input-error'
                }`}>
                <label
                  htmlFor='name'
                  className={`${
                    errorMessage &&
                    errorMessage.includes('Name') &&
                    'text-error'
                  }`}>
                  Name:
                </label>
                <input
                  name='name'
                  type='text'
                  id='name'
                  value={formState.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div
                className={`flex-column form-input mb-3${
                  errorMessage &&
                  errorMessage.includes('bio') &&
                  'form-input-error'
                }`}>
                <label
                  htmlFor='bio'
                  className={`${
                    errorMessage &&
                    errorMessage.includes('Bio') &&
                    'text-error'
                  }`}>
                  Bio:
                </label>
                <input
                  name='bio'
                  type='text'
                  id='bio'
                  value={formState.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div
                className={`flex-column form-input mb-3${
                  errorMessage &&
                  errorMessage.includes('location') &&
                  'form-input-error'
                }`}>
                <label
                  htmlFor='location'
                  className={`${
                    errorMessage &&
                    errorMessage.includes('Location') &&
                    'text-error'
                  }`}>
                  Location:
                </label>
                <input
                  name='location'
                  type='text'
                  id='location'
                  value={formState.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div
                className={`flex-column form-input ${
                  errorMessage &&
                  errorMessage.includes('website') &&
                  'form-input-error'
                }`}>
                <label
                  htmlFor='website'
                  className={`${
                    errorMessage &&
                    errorMessage.includes('Website') &&
                    'text-error'
                  }`}>
                  Website:
                </label>
                <input
                  name='website'
                  type='text'
                  id='website'
                  value={formState.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {errorMessage && (
                <div className='text-standard text-error'>{errorMessage}</div>
              )}
              <div className='modal-footer'></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateUserForm;
