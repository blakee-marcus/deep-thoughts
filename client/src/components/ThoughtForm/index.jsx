import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
import { Loader2 } from 'lucide-react';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.warn('First thought insertion by user!');
      }

      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setText(value);
      setCharacterCount(value.length);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!thoughtText.trim()) return;

    try {
      setLoading(true);
      await addThought({ variables: { thoughtText } });
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error('Failed to add thought:', e);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (characterCount / 280) * 100;
  const strokeDashoffset = 82 - (progressPercent * 82) / 100;

  return (
    <form
      onSubmit={handleFormSubmit}
      className='w-full max-w-xl mx-auto bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-sm space-y-4'>
      <label htmlFor='thought' className='text-sm font-medium text-gray-400'>
        What's on your mind?
      </label>
      <textarea
        id='thought'
        value={thoughtText}
        onChange={handleChange}
        placeholder='Share your thought...'
        className='w-full h-28 resize-none rounded-md border border-neutral-700 bg-neutral-800 text-sm text-gray-200 p-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
      />

      <div className='flex items-center justify-between text-sm text-gray-400'>
        <div
          className={`flex items-center gap-2 ${
            characterCount === 280 || error ? 'text-red-400' : ''
          }`}>
          <svg width='30' height='30'>
            <circle cx='15' cy='15' r='13' fill='none' stroke='#374151' strokeWidth='2' />
            <circle
              cx='15'
              cy='15'
              r='13'
              fill='none'
              stroke={characterCount >= 250 ? '#f87171' : '#60a5fa'}
              strokeWidth='2'
              strokeDasharray='82'
              strokeDashoffset={strokeDashoffset}
              strokeLinecap='round'
            />
          </svg>
          <span>{characterCount}/280</span>
        </div>

        <button
          type='submit'
          disabled={loading || !thoughtText.trim()}
          className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
          {loading ? <Loader2 className='animate-spin w-4 h-4' /> : null}
          Think
        </button>
      </div>

      {error && (
        <p className='text-red-400 text-xs mt-1'>Something went wrong. Please try again.</p>
      )}
    </form>
  );
};

export default ThoughtForm;
