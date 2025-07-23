import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, HeartOff } from 'lucide-react';

export default function SingleThought({ thought, checkIfLiked, handleLike, handleUnlike }) {
  const isLiked = checkIfLiked(thought._id);

  return (
    <div className='rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 shadow-sm space-y-2 transition hover:border-neutral-700'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='text-sm text-gray-400 space-x-1'>
          <Link
            to={`/profile/${thought.author.username}`}
            className='text-gray-200 font-semibold hover:underline'>
            {thought.author.name}
            <span className='text-gray-500 font-normal ml-1'>@{thought.author.username}</span>
          </Link>
          <span className='text-gray-500'>•</span>
          <span className='text-gray-500'>{thought.createdAt}</span>
        </div>
      </div>

      {/* Thought Text */}
      <Link to={`/thought/${thought._id}`} className='block'>
        <p className='text-gray-200 text-sm leading-relaxed whitespace-pre-line'>
          {thought.thoughtText}
        </p>
      </Link>

      {/* Footer: Reactions */}
      <div className='flex items-center gap-6 text-gray-400 text-sm pt-2'>
        {/* Replies */}
        <div className='flex items-center gap-1'>
          <MessageCircle size={16} />
          <span>{thought.reactionCount}</span>
        </div>

        {/* Likes */}
        <button
          onClick={() => (isLiked ? handleUnlike(thought._id) : handleLike(thought._id))}
          className='flex items-center gap-1 transition hover:text-pink-400'
          aria-label={isLiked ? 'Unlike' : 'Like'}>
          {isLiked ? (
            <HeartOff size={16} className='text-pink-500' />
          ) : (
            <Heart size={16} className='text-gray-400' />
          )}
          <span className={isLiked ? 'text-pink-400' : 'text-gray-400'}>{thought.likeCount}</span>
        </button>
      </div>
    </div>
  );
}
