import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { QUERY_USER, QUERY_ME } from '../utils/queries';
import UserList from '../components/UserList';

const Follow = ({ navMode }) => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  const isFollowers = navMode === 'followers';
  const isFollowing = navMode === 'following';

  if (loading) {
    return <div className='text-center text-gray-500 py-6'>Loading...</div>;
  }

  return (
    <section className='w-full max-w-2xl mx-auto px-4 py-6 space-y-4'>
      {/* Profile Header */}
      <div className='border border-neutral-800 bg-neutral-900 rounded-xl shadow-sm px-6 py-4'>
        <div className='flex flex-col space-y-1'>
          <h1 className='text-lg font-semibold text-white'>{user.name}</h1>
          <p className='text-sm text-gray-400'>@{user.username}</p>
        </div>

        {/* Tabs */}
        <div className='mt-4 flex gap-6 border-t border-neutral-800 pt-3'>
          <Link
            to={`/profile/${user.username}/followers`}
            className={`flex items-center gap-1 text-sm font-medium transition ${
              isFollowers
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}>
            <Users size={16} />
            Followers
          </Link>
          <Link
            to={`/profile/${user.username}/following`}
            className={`flex items-center gap-1 text-sm font-medium transition ${
              isFollowing
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}>
            <User size={16} />
            Following
          </Link>
        </div>
      </div>

      {/* User List */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-4'>
        {isFollowers && <UserList users={user.followers} />}
        {isFollowing && <UserList users={user.following} />}
      </motion.div>
    </section>
  );
};

export default Follow;
