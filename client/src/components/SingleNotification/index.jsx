import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Auth from '../../utils/auth';

const SingleNotification = ({ notification, notificationType }) => {
  const username = Auth.getProfile().data.username;

  const cardBase =
    'bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-lg px-4 py-3 shadow-sm mb-3';
  const textBase = 'text-sm md:text-base text-zinc-200';
  const subtext = 'text-xs text-zinc-400 mt-0.5';

  const avatar = (icon, color) => (
    <div className={`p-2 rounded-full bg-${color}-500/10 text-${color}-400`}>{icon}</div>
  );

  if (notificationType === 'follow') {
    return (
      <motion.div
        key={notification._id}
        className={cardBase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}>
        <Link to={`/profile/${notification.fromUser.username}`} className='flex items-start gap-3'>
          {avatar(<User size={20} />, 'blue')}
          <div>
            <p className={`${textBase}`}>
              <span className='font-semibold text-white'>{notification.fromUser.username}</span>{' '}
              followed you
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (notificationType === 'like') {
    return (
      <motion.div
        key={notification._id}
        className={cardBase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}>
        <Link to={`/thought/${notification.relatedThought._id}`} className='flex items-start gap-3'>
          {avatar(<Heart size={20} />, 'pink')}
          <div>
            <p className={`${textBase}`}>
              <span className='font-semibold text-white'>{notification.fromUser.name}</span> liked
              your post
            </p>
            <p className={`${subtext}`}>
              {notification.relatedThought.thoughtText?.length > 50
                ? `${notification.relatedThought.thoughtText.slice(0, 50)}...`
                : notification.relatedThought.thoughtText}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (notificationType === 'reply') {
    return (
      <motion.div
        key={notification._id}
        className={cardBase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}>
        <Link to={`/profile/${notification.fromUser.username}`} className='flex items-start gap-3'>
          {avatar(<MessageCircle size={20} />, 'green')}
          <div className='flex flex-col'>
            <p className={`${textBase}`}>
              <span className='font-semibold text-white'>{notification.fromUser.name}</span>{' '}
              <span className='text-zinc-400'>@{notification.fromUser.username}</span>{' '}
              <span className='text-zinc-500'>• {notification.notificationDate}</span>
            </p>
            <p className={`${subtext}`}>
              Replying to <span className='text-primary font-medium'>@{username}</span>
            </p>
            <p className='text-zinc-300 text-sm mt-1'>{notification.reactionText}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return null;
};

export default SingleNotification;
