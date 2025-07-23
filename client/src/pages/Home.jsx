import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_FOLLOWING_THOUGHTS } from '../utils/queries';
import Auth from '../utils/auth';
import ThoughtList from '../components/ThoughtList';
import ThoughtForm from '../components/ThoughtForm';
import { Loader2, Users, Globe } from 'lucide-react';

const Home = () => {
  const [feedState, setFeedState] = useState('all');
  const [followingThoughts, setFollowingThoughts] = useState([]);

  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { loading: loadingFollowing, data: dataFollowing } = useQuery(QUERY_FOLLOWING_THOUGHTS);

  const thoughts = data?.thoughts || [];
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    if (dataFollowing) {
      const fetched = dataFollowing?.thoughtsFromFollowing?.following.flatMap(
        (user) => user.thoughts,
      );
      const sorted = fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFollowingThoughts(sorted);
    }
  }, [dataFollowing]);

  return (
    <section className='max-w-2xl mx-auto w-full px-4 py-6 space-y-6'>
      {loggedIn && (
        <>
          {/* Sticky Header */}
          <header className='sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-border shadow-sm'>
            <div className='flex items-center justify-between px-4 py-3'>
              <h1 className='text-lg font-semibold'>Home</h1>
            </div>

            {/* Feed Switch */}
            <div className='flex gap-2 px-4 pb-3 pt-1 border-t border-border'>
              <button
                onClick={() => setFeedState('all')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  feedState === 'all'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}>
                <Globe size={16} />
                All
              </button>
              <button
                onClick={() => setFeedState('following')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  feedState === 'following'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}>
                <Users size={16} />
                Following
              </button>
            </div>
          </header>

          {/* Thought Form */}
          <div className='bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-subtle p-4'>
            <h2 className='text-md font-semibold mb-2'>Share your thoughts</h2>
            <ThoughtForm />
          </div>
        </>
      )}

      {/* Thought Feed */}
      <div>
        {loading || loadingFollowing ? (
          <div className='flex items-center justify-center gap-2 py-12 text-gray-500 dark:text-gray-400 text-sm'>
            <Loader2 className='animate-spin' size={20} />
            Loading thoughts...
          </div>
        ) : feedState === 'following' ? (
          <ThoughtList thoughts={followingThoughts} displayFollowing />
        ) : (
          <ThoughtList thoughts={thoughts} />
        )}
      </div>
    </section>
  );
};

export default Home;
