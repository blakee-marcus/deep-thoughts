import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_REACTION } from '../../utils/mutations';

const ReactionForm = ({ thoughtId }) => {
  const [reactionBody, setBody] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [addReaction, { error }] = useMutation(ADD_REACTION);

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setBody(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add reaction to database
      await addReaction({
        variables: { reactionBody, thoughtId },
      });

      // clear form value
      setBody('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='w-100 border-right border-bottom'>
      <form
        className='flex-column justify-center justify-space-between-md align-stretch'
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder='Think your reply'
          value={reactionBody}
          className='col-12 col-md-9'
          onChange={handleChange}
        ></textarea>
        <div className='flex-row justify-flex-end align-center'>
          <p
            className={`m-0 mr-3 ${
              characterCount === 280 || error ? 'text-error' : ''
            }`}
          >
            {error && <span className='ml-2'>Something went wrong...</span>}
          </p>
          <div className='flex-row justify-flex-end align-center'>
            <svg id='thought-progress'>
              <circle class='bg' cx='15' cy='15' r='13' />
              <circle class='meter-1' cx='15' cy='15' r='13' />
            </svg>
            <button className='btn mr-3' type='submit'>
              React
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReactionForm;

