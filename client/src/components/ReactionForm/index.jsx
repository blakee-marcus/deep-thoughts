import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ReactionForm = ({ thoughtId }) => {
  const [reactionBody, setBody] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addReaction, { error }] = useMutation(ADD_REACTION);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setBody(value);
      setCharacterCount(value.length);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!reactionBody.trim()) return;

    try {
      setLoading(true);
      await addReaction({
        variables: { reactionBody, thoughtId },
      });
      setBody('');
      setCharacterCount(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const percent = (characterCount / 280) * 100;
  const dashOffset = 82 - (82 * percent) / 100;

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-sm'>
      <label htmlFor='reaction' className='block text-sm font-medium text-gray-400'>
        Add a reply
      </label>

      <textarea
        id='reaction'
        value={reactionBody}
        onChange={handleChange}
        placeholder='Think your reply...'
        className='w-full h-24 rounded-md border border-neutral-700 bg-neutral-800 text-sm text-gray-200 p-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none'
      />

      <div className='flex justify-between items-center text-sm text-gray-400'>
        {error && <span className='text-red-400'>Something went wrong. Try again.</span>}

        <div className='flex items-center gap-3'>
          {/* Circular Progress Indicator */}
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
              strokeDashoffset={dashOffset}
              strokeLinecap='round'
            />
          </svg>
          <span className={`${characterCount >= 280 ? 'text-red-400' : ''}`}>
            {characterCount}/280
          </span>

          <button
            type='submit'
            disabled={loading || !reactionBody.trim()}
            className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading && <Loader2 className='animate-spin w-4 h-4' />}
            React
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default ReactionForm;
