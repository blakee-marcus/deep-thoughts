import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { QUERY_THOUGHTS, QUERY_FOLLOWING_THOUGHTS } from '../utils/queries';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';

const Home = () => {
  //states
  const [feedState, setFeedState] = useState('all');
  const [followingThoughts, setFollowingThoughts] = useState([]);
  //queries
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { loading: loadingFollowing, data: dataFollowing } = useQuery(QUERY_FOLLOWING_THOUGHTS);
  //data
  const thoughts = data?.thoughts || [];
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    if (dataFollowing) {
      const fetchedThoughts = dataFollowing?.thoughtsFromFollowing?.following.flatMap(user => user.thoughts);
      const sortedThoughts = fetchedThoughts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFollowingThoughts(sortedThoughts);
    }

  }, [dataFollowing]);

  return (
    <section className='flex-row justify-space-between overflow-scroll max-100-vh border-right'>
      {loggedIn && (
        <>
          <div className='col-12 border-right border-bottom pb-0 sticky-header'>
            <h2 className='text-light p-3'>Home</h2>
            <div className='flex-row justify-space-around p-0 border-bottom'>
              <button
                className={`btn-clear pb-3 text-light cursor-pointer ${feedState === 'all' && 'nav-underline'}`}
                onClick={() => setFeedState('all')}
              >
                All
              </button>
              <button
                className={`btn-clear pb-3 text-light cursor-pointer ${feedState === 'following' && 'nav-underline'}`}
                onClick={() => setFeedState('following')}
              >
                Following
              </button>
            </div>
          </div>
          <div className='col-12 border-right border-bottom pb-2'>
            <ThoughtForm />
          </div>
        </>
      )}
      <div className='w-100 mb-3 col-lg-12'>
        {loading || loadingFollowing ? <div className='text-light'>Loading...</div> : feedState === 'following' ? (<ThoughtList thoughts={followingThoughts} displayFollowing={true} />) : (<ThoughtList thoughts={thoughts} />)}
      </div>
    </section>
  );
};

export default Home;

