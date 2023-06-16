import React, { useState} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import ThoughtList from '../components/ThoughtList';
// import FriendList from '../components/FriendList';
// import ThoughtForm from '../components/ThoughtForm';
import UpdateUserForm from '../components/UpdateUserForm';

import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';

const Profile = () => {
    const [modalVisible, setModalVisible] = useState(false);
//   const [addFriend] = useMutation(ADD_FRIEND);
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  const isOwnProfile =
    Auth.loggedIn() && Auth.getProfile().data.username === userParam;

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

//   const handleClick = async () => {
//     try {
//       await addFriend({
//         variables: { id: user._id },
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   };

  return (
    <section className='w-100'>
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
          <div>{isOwnProfile && <button className='mr-3 btn btn-outline-light text-standard' onClick={() => setModalVisible(true)}>Edit Profile</button>}</div>
          {modalVisible && (<UpdateUserForm username={user.username} setModalVisible={setModalVisible}/>)}
        </div>

        <p>
          <span className='text-light'>{user.friendCount}</span> following
        </p>
      </div>
      <div className='flex-column justify-space-between'>
        <div className='col-12 mb-3 col-lg-8'>
          <ThoughtList thoughts={user.thoughts} username={user.username} />
        </div>

        {/* <div className='col-12 col-lg-3 mb-3'>
                    <FriendList
                        username={user.username}
                        friendCount={user.friendCount}
                        friends={user.friends}
                    />
                </div> */}
      </div>
    </section>
  );
};

export default Profile;

