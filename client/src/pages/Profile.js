import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import ThoughtList from '../components/ThoughtList';
// import FriendList from '../components/FriendList';
// import ThoughtForm from '../components/ThoughtForm';
import UpdateUserForm from '../components/UpdateUserForm';

import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../utils/mutations';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  const isOwnProfile =
    Auth.loggedIn() && Auth.getProfile().data.username === userParam;
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  // check if logged in user is following this user
  useEffect(() => {
    if (user && Auth.loggedIn() && user.followers) {
      setIsFollowing(
        user.followers.some(
          (follower) => follower._id === Auth.getProfile().data._id
        )
      );
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  const handleFollow = async () => {
    try {
      followUser({
        variables: { userId: user._id },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  const handleUnfollow = async () => {
    try {
      unfollowUser({
        variables: { userId: user._id },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className='w-100 border-right'>
      <div className='flex-column mb-0 pl-3'>
        <h3 className='bg-dark-transparent text-light mb-0 pb-0 display-inline-block'>
          {user.name}
        </h3>
        <p className='text-tertiary'>{user.thoughts.length} thoughts</p>
      </div>
      <div className='flex-column mb-0 pl-3 border-bottom'>
        <div className='flex-row align-start justify-space-between'>
          <div className='flex-column'>
            <h4 className='text-light mb-0'>{user.name}</h4>
            <h5 className='text-tertiary mt-0 text-standard fw-light'>
              @{user.username}
            </h5>
          </div>
          <div>
            {isOwnProfile && (
              <button
                className='mr-3 btn btn-outline-light text-standard'
                onClick={() => setModalVisible(true)}>
                Edit Profile
              </button>
            )}
            {!isOwnProfile && !isFollowing && (
              <button
                className='mr-3 btn btn-light text-standard'
                onClick={handleFollow}>
                Follow
              </button>
            )}
            {isFollowing && (
              <button
                className='mr-3 btn btn-light text-standard'
                onClick={handleUnfollow}>
                Unfollow
              </button>
            )}
          </div>
          {modalVisible && (
            <UpdateUserForm user={user} setModalVisible={setModalVisible} />
          )}
        </div>

        <div className='flex-row text-tertiary'>
          <p>
            <Link to={`/profile/${user.username}/following`}>
              <span className='text-light'>{user.followingCount}</span>{' '}
              following
            </Link>
          </p>
          <p>
            <Link to={`/profile/${user.username}/followers`}>
              <span className='text-light pl-3'>{user.followersCount}</span>{' '}
              followers
            </Link>
          </p>
        </div>
      </div>
      <div className='flex-column justify-space-between'>
        <div className='col-12 mb-3 col-lg-8'>
          <ThoughtList thoughts={user.thoughts} username={user.username} />
        </div>
      </div>
    </section>
  );
};

export default Profile;

