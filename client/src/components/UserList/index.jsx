import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus } from 'lucide-react';

import Auth from '../../utils/auth';
import { QUERY_ME } from '../../utils/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../../utils/mutations';

const UserList = ({ users }) => {
  const { loading, data } = useQuery(QUERY_ME);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const me = data?.me || {};

  const doesFollow = (userId) => me?.following?.some((u) => u._id === userId);

  const handleFollow = async (id) => {
    try {
      await followUser({ variables: { userId: id } });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await unfollowUser({ variables: { userId: id } });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className='animate-pulse text-zinc-400 px-4 py-6'>Loading users...</div>;
  }

  return (
    <div className='space-y-4'>
      {users?.map((user) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-zinc-800/60 backdrop-blur-md border border-zinc-700 rounded-lg p-4 shadow-sm flex justify-between items-start'>
          <div className='flex flex-col gap-1'>
            <Link to={`/profile/${user.username}`} className='group'>
              <h3 className='text-white text-sm md:text-base font-semibold group-hover:underline'>
                {user.name}
              </h3>
              <p className='text-zinc-400 text-sm'>@{user.username}</p>
              {user.bio && <p className='text-zinc-300 text-sm mt-1 line-clamp-2'>{user.bio}</p>}
            </Link>
          </div>

          {Auth.loggedIn() && (
            <div>
              {doesFollow(user._id) ? (
                <button
                  onClick={() => handleUnfollow(user._id)}
                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm'>
                  <UserMinus className='w-4 h-4' />
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user._id)}
                  className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-600 bg-zinc-700 text-white hover:bg-zinc-600 transition text-sm'>
                  <UserPlus className='w-4 h-4' />
                  Follow
                </button>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default UserList;
