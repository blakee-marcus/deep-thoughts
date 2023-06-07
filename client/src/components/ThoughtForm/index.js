import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap in a try/catch
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: { ...me, thoughts: [...me.thoughts, addThought] },
          },
        });
      } catch (e) {
        console.warn('First thought insertion by user!');
      }

      // update thought array's cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
      const percentComplete = (event.target.value.length / 280) * 100;
      document.querySelector('.meter-1').style.strokeDashoffset =
        -82 + (percentComplete * 80) / 100;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setText('');
      setCharacterCount(0);
    } catch (e) {
        console.log('Failed to add thought');
      console.error(e);
    }
  };

  return (
    <div>
      <form
        className='flex-column justify-center justify-space-between-md align-stretch'
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="What's happening?"
          value={thoughtText}
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
          <div className='flex-row justify-center align-center'>
            <svg id='thought-progress'>
              <circle class='bg' cx='15' cy='15' r='13' />
              <circle class='meter-1' cx='15' cy='15' r='13' />
            </svg>
            <button className='btn mr-3' type='submit'>
              Think
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ThoughtForm;

