import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReactionList = ({ reactions }) => {
  const hasReactions = reactions && reactions.length > 0;

  return (
    <div className={`w-full ${!hasReactions ? 'border-t' : ''} space-y-3`}>
      <AnimatePresence>
        {hasReactions ? (
          reactions.map((reaction) => (
            <motion.div
              key={reaction._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className='rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 shadow-sm'>
              {/* Header */}
              <div className='flex justify-between items-center text-sm text-gray-400'>
                <Link
                  to={`/profile/${reaction.author.username}`}
                  className='text-gray-200 font-semibold hover:underline'>
                  {reaction.author.name}
                  <span className='ml-1 text-gray-500 font-normal'>
                    @{reaction.author.username}
                  </span>
                </Link>
                <span className='text-gray-500'>{reaction.createdAt}</span>
              </div>

              {/* Reaction Body */}
              <p className='mt-2 text-sm text-gray-300 whitespace-pre-line'>
                {reaction.reactionBody}
              </p>
            </motion.div>
          ))
        ) : (
          <div className='text-center text-gray-500 text-sm py-8 border border-neutral-800 rounded-md'>
            <MessageCircle className='mx-auto mb-2 text-gray-600' size={20} />
            No reactions yet. Be the first to reply.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionList;
