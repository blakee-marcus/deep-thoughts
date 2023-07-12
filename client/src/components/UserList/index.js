import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import Auth from '../../utils/auth';
import { QUERY_ME } from '../../utils/queries';
import { FOLLOW_USER, UNFOLLOW_USER } from '../../utils/mutations';

const UserList = (props) => {
  const { loading, data } = useQuery(QUERY_ME);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const me = data?.me || {};
  const doesFollow = (userId) => {
    return me.following.some((user) => user._id === userId);
  };
console.log(props);
  const handleFollow = async (id) => {
    try {
      followUser({
        variables: { userId: id },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  const handleUnfollow = async (id) => {
    try {
      unfollowUser({
        variables: { userId: id },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {props.users &&
        props.users.map((user) => (
          <div key={user._id} className='card mt-2 w-100'>
            <div className='flex-row justify-space-between'>
              <div className='flex-column'>
                <Link
                  to={`/profile/${user.username}`}
                  style={{ fontWeight: 700 }}
                  className='text-light ml-3'>
                  <p className='mb-0 text-standard fw-heavy'>{user.name} </p>
                  <p className='text-tertiary text-standard fw-light m-0'>
                    @{user.username}
                  </p>
                  <p className='m-0 mb-1 text-standard fw-light'>{user.bio} </p>
                </Link>{' '}
              </div>
              <div>
                {Auth.loggedIn() && doesFollow(user._id) ? (
                  <button
                    className='mr-3 btn btn-light text-standard'
                    onClick={() => handleUnfollow(user._id)}>
                    Unfollow
                  </button>
                ) : (
                  <button
                    className='mr-3 btn btn-light text-standard'
                    onClick={() => handleFollow(user._id)}>
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserList;

