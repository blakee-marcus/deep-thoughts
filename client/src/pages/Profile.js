import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import ThoughtList from '../components/ThoughtList';
// import FriendList from '../components/FriendList';
// import ThoughtForm from '../components/ThoughtForm';
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
    window.location.replace('/login');
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
            <h5 className='text-tertiary mt-0 text-standard fw-light mb-3'>
              @{user.username}
            </h5>
          </div>
          <div>
            {isOwnProfile && (
              <button
                className='mr-3 btn btn-outline-tertiary text-standard'
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
        <div className='flex-row text-light text-standard mb-2'>
          {user.bio}
        </div>
        <div className='flex-row text-tertiary text-standard mb-2'>
          <div className='flex-row align-center mr-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-geo-alt text-tertiary" viewBox="0 0 16 16">
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
            <p className='m-0'>{user.location}</p>
          </div>
          <a className='flex-row link-underline-primary' href={user.website} rel="noopener noreferrer nofollow" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-link-45deg text-tertiary" viewBox="0 0 16 16">
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
            </svg>
            <p className='m-0 text-primary'>{user.website}</p>
          </a>

        </div>
        <div className='flex-row text-tertiary'>
          <p>
            <Link to={`/profile/${user.username}/following`} className='link-underline-tertiary'>
              <span className='text-light'>{user.followingCount}</span>{' '}
              following
            </Link>
          </p>
          <p>
            <Link to={`/profile/${user.username}/followers`} className='link-underline-tertiary'>
              <span className='text-light pl-3 link-underline-light'>{user.followersCount}</span>{' '}
              followers
            </Link>
          </p>
        </div>
        <div className='flex-row justify-space-around'>
          <Link to={`/profile/${user.username}`} className={location.pathname === `/profile/${user.username}` ? 'nav-underline' : ''}>
            <p className={location.pathname === `/profile/${user.username}` ? 'text-light' : 'text-tertiary'}>Thoughts</p>
          </Link>
          <Link to={`/profile/${user.username}/likes`} className={location.pathname === `/profile/${user.username}/likes` ? 'nav-underline' : ''}>
            <p className={location.pathname === `/profile/${user.username}/likes` ? 'text-light' : 'text-tertiary'}>Likes</p>
          </Link>
        </div>
      </div>
      <div className='flex-column justify-space-between'>
        <div className='col-12 mb-3 col-lg-8'>
          {location.pathname === `/profile/${user.username}` && (
            <ThoughtList thoughts={user.thoughts} username={user.username} displayLikeList={false}/>)}
          {location.pathname === `/profile/${user.username}/likes` && (
            <ThoughtList thoughts={user.likes} username={user.username} displayLikeList={true} />)}
        </div>
      </div>
    </section>
  );
};

export default Profile;

