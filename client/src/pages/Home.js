import React from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/UserList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  const thoughts = data?.thoughts || [];
  const loggedIn = Auth.loggedIn();

  return (
    <section className='flex-row justify-space-between overflow-scroll max-100-vh border-right'>
      {loggedIn && (
        <div className='col-12 border-right border-bottom pb-2'>
          <h2 className='text-light p-3'>Home</h2>
          <ThoughtForm />
        </div>
      )}
      <div className='w-100 mb-3 col-lg-12'>
        {loading ? <div>Loading...</div> : <ThoughtList thoughts={thoughts} />}
        
      </div>
    </section>
  );
};

export default Home;

