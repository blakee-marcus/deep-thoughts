import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Pencil, Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import ThoughtList from '../components/ThoughtList';
import UpdateUserForm from '../components/UpdateUserForm';

import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../utils/mutations';

const Profile = () => {
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  const isOwnProfile = Auth.loggedIn() && Auth.getProfile().data.username === userParam;

  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  useEffect(() => {
    if (user && Auth.loggedIn() && user.followers) {
      setIsFollowing(user.followers.some((f) => f._id === Auth.getProfile().data._id));
    }
  }, [user]);

  if (loading) return <div className='text-center text-gray-500 py-6'>Loading...</div>;
  if (!user?.username) window.location.replace('/login');

  const handleFollow = async () => {
    try {
      await followUser({ variables: { userId: user._id } });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser({ variables: { userId: user._id } });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className='w-full max-w-3xl mx-auto px-4 py-6 space-y-6'>
      {/* Profile Header */}
      <div className='border border-neutral-800 rounded-xl bg-neutral-900 shadow-sm p-6 space-y-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-lg font-semibold text-white'>{user.name}</h1>
            <p className='text-gray-400 text-sm'>@{user.username}</p>
          </div>
          <div className='flex gap-2'>
            {isOwnProfile && (
              <button
                className='flex items-center gap-1 px-3 py-1 text-sm border border-gray-600 rounded-md hover:border-indigo-500 text-gray-300'
                onClick={() => setModalVisible(true)}>
                <Pencil size={14} />
                Edit Profile
              </button>
            )}
            {!isOwnProfile && !isFollowing && (
              <button
                onClick={handleFollow}
                className='px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md'>
                Follow
              </button>
            )}
            {!isOwnProfile && isFollowing && (
              <button
                onClick={handleUnfollow}
                className='px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md'>
                Unfollow
              </button>
            )}
          </div>
        </div>

        {/* User Bio */}
        {user.bio && <p className='text-sm text-gray-300'>{user.bio}</p>}

        <div className='flex gap-6 text-sm text-gray-400'>
          {user.location && (
            <div className='flex items-center gap-1'>
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <a
              href={user.website}
              target='_blank'
              rel='noopener noreferrer nofollow'
              className='flex items-center gap-1 text-blue-400 hover:underline'>
              <Globe size={16} />
              <span>{user.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>

        <div className='flex gap-4 text-sm text-gray-400'>
          <Link to={`/profile/${user.username}/following`} className='hover:underline'>
            <span className='text-white'>{user.followingCount}</span> following
          </Link>
          <Link to={`/profile/${user.username}/followers`} className='hover:underline'>
            <span className='text-white'>{user.followersCount}</span> followers
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className='flex gap-6 border-t border-neutral-800 pt-3'>
          <Link
            to={`/profile/${user.username}`}
            className={`text-sm font-medium ${
              location.pathname === `/profile/${user.username}`
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}>
            Thoughts
          </Link>
          <Link
            to={`/profile/${user.username}/likes`}
            className={`text-sm font-medium ${
              location.pathname === `/profile/${user.username}/likes`
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}>
            Likes
          </Link>
        </div>
      </div>

      {/* Thought List */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}>
        {location.pathname === `/profile/${user.username}` && (
          <ThoughtList thoughts={user.thoughts} username={user.username} displayLikeList={false} />
        )}
        {location.pathname === `/profile/${user.username}/likes` && (
          <ThoughtList thoughts={user.likes} username={user.username} displayLikeList={true} />
        )}
      </motion.div>

      {modalVisible && <UpdateUserForm user={user} setModalVisible={setModalVisible} />}
    </section>
  );
};

export default Profile;
