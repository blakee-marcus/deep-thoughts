import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Heart, HeartOff } from 'lucide-react';
import { motion } from 'framer-motion';
import SingleThought from '../SingleThought';
import { QUERY_MY_LIKES } from '../../utils/queries';
import { LIKE_THOUGHT, UNLIKE_THOUGHT } from '../../utils/mutations';

const ThoughtList = ({ thoughts, username, displayLikeList, displayFollowing }) => {
  const { data, loading } = useQuery(QUERY_MY_LIKES);
  const [likeThought] = useMutation(LIKE_THOUGHT);
  const [unlikeThought] = useMutation(UNLIKE_THOUGHT);
  const [likedThoughts, setLikedThoughts] = useState([]);

  useEffect(() => {
    if (data?.me?.likes) {
      setLikedThoughts(data.me.likes.map((like) => like._id));
    }
  }, [data]);

  const checkIfLiked = (thoughtId) => likedThoughts.includes(thoughtId);

  const handleLike = async (thoughtId) => {
    try {
      await likeThought({ variables: { thoughtId } });
      setLikedThoughts((prev) => [...prev, thoughtId]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlike = async (thoughtId) => {
    try {
      await unlikeThought({ variables: { thoughtId } });
      setLikedThoughts((prev) => prev.filter((id) => id !== thoughtId));
    } catch (e) {
      console.error(e);
    }
  };

  const EmptyState = ({ title, subtitle }) => (
    <div className='flex flex-col items-center justify-center py-12 text-center space-y-2'>
      <h3 className='text-lg font-semibold text-gray-200'>{title}</h3>
      <p className='text-sm text-gray-400'>{subtitle}</p>
    </div>
  );

  if (loading) {
    return <div className='p-4 animate-pulse text-gray-400 text-sm'>Loading thoughts...</div>;
  }

  if (!thoughts.length && displayLikeList) {
    return (
      <EmptyState
        title={`@${username} hasn't liked any Thoughts`}
        subtitle='When they do, they’ll show up here.'
      />
    );
  }

  if (!thoughts.length && displayFollowing) {
    return (
      <EmptyState
        title='Welcome to Deep Thoughts!'
        subtitle='Find people to follow and their thoughts will appear here.'
      />
    );
  }

  if (!thoughts.length) {
    return (
      <EmptyState
        title={`@${username} hasn't posted any Thoughts`}
        subtitle='When they do, you’ll see them here.'
      />
    );
  }

  return (
    <div className='space-y-4 px-4 pb-8'>
      {thoughts.map((thought) => (
        <motion.div
          key={thought._id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className='rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-sm'>
          <SingleThought
            thought={thought}
            checkIfLiked={checkIfLiked}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
          />
          <div className='flex justify-end mt-4'>
            {checkIfLiked(thought._id) ? (
              <button
                onClick={() => handleUnlike(thought._id)}
                className='flex items-center space-x-1 text-sm text-red-400 hover:text-red-500'>
                <HeartOff size={18} />
                <span>Unlike</span>
              </button>
            ) : (
              <button
                onClick={() => handleLike(thought._id)}
                className='flex items-center space-x-1 text-sm text-gray-400 hover:text-pink-400'>
                <Heart size={18} />
                <span>Like</span>
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ThoughtList;
