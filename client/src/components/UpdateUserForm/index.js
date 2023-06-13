import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { UPDATE_USER } from '../../utils/mutations';

const UpdateUserForm = (props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [formState, setFormState] = useState({ name: '' });
  const [updateUser] = useMutation(UPDATE_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };


};
export default UpdateUserForm;
