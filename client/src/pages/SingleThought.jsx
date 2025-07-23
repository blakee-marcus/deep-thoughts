import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Heart, HeartOff, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { QUERY_THOUGHT } from '../utils/queries';
import { LIKE_THOUGHT, UNLIKE_THOUGHT } from '../utils/mutations';
import Auth from '../utils/auth';

import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';

const SingleThought = () => {
  const [likeThought] = useMutation(LIKE_THOUGHT);
  const [unlikeThought] = useMutation(UNLIKE_THOUGHT);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId },
  });

  const thought = data?.thought || {};

  useEffect(() => {
    if (data) {
      setLiked(thought?.likes?.some((like) => like._id === Auth.getProfile().data._id));
      setNumberOfLikes(thought.likes.length);
    }
  }, [thought]);

  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await unlikeThought({ variables: { thoughtId } });
        setLiked(false);
        setNumberOfLikes((prev) => prev - 1);
      } else {
        await likeThought({ variables: { thoughtId } });
        setLiked(true);
        setNumberOfLikes((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className='p-4 text-zinc-500 animate-pulse'>Loading thought...</div>;
  }

  return (
    <section className='space-y-6 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-zinc-800/60 rounded-xl p-4 border border-zinc-700 shadow'>
        <div className='text-white font-semibold text-base'>{thought.author.name}</div>
        <div className='text-sm text-zinc-400 mb-2'>@{thought.author.username}</div>
        <p className='text-zinc-100 text-base mb-3 whitespace-pre-line'>{thought.thoughtText}</p>
        <div className='text-zinc-500 text-sm mb-4 border-b border-zinc-700 pb-2'>
          {thought.createdAt}
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2 text-zinc-300'>
            <MessageCircle className='w-4 h-4' />
            <span>{thought.reactionCount}</span>
          </div>
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 ${
              liked ? 'text-pink-500' : 'text-zinc-400'
            } hover:text-pink-500 transition`}>
            {liked ? <Heart className='w-4 h-4 fill-pink-500' /> : <HeartOff className='w-4 h-4' />}
            <span>{numberOfLikes}</span>
          </button>
        </div>
      </motion.div>

      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}

      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
    </section>
  );
};

export default SingleThought;
