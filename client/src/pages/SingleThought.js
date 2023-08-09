import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { QUERY_THOUGHT, QUERY_MY_LIKES } from '../utils/queries';
import { LIKE_THOUGHT, UNLIKE_THOUGHT } from '../utils/mutations';
import Auth from '../utils/auth';

import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';

const SingleThought = (props) => {
  const [likeThought] = useMutation(LIKE_THOUGHT);
  const [unlikeThought] = useMutation(UNLIKE_THOUGHT);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId },
  });

  const thought = data?.thought || {};

  // set liked state on load of thought data
  useEffect(() => {
    if (data) {
      setLiked(thought?.likes?.some((like) => like._id === Auth.getProfile().data._id));
      setNumberOfLikes(thought.likes.length);
    }
  }, [thought]);

  const handleLike = async () => {
    try {
      likeThought({
        variables: { thoughtId },
      });
      setLiked(true);
      setNumberOfLikes(numberOfLikes + 1);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUnlike = async () => {
    try {
      unlikeThought({
        variables: { thoughtId },
      });
      setLiked(false);
      setNumberOfLikes(numberOfLikes - 1);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div>
        <div className='card mb-0 p-3 border-right'>
          <p className='placeholder-glow w-25 mb-0'></p>
          <p className='placeholder-glow w-125 mt-1'></p>
          <p className='placeholder-glow w-50 mt-1 mb-3'></p>
          <p className='placeholder-glow w-125 mt-1 mb-3'></p>
          <div className='flex-row align-center'>
            <div className='flex-row align-center w-25'>
              <p className='placeholder-glow w-25 mr-1'></p>
              <p className='placeholder-glow w-125'></p>
            </div>
            <div className='flex-row align-center w-25'>
              <p className='placeholder-glow w-25 mr-1'></p>
              <p className='placeholder-glow w-125'></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='card mb-0 p-3 border-right'>
        <p style={{ fontWeight: 700 }} className='text-light mb-0'>
          {thought.author.name}
        </p>
        <p className='text-tertiary'>
          @{thought.author.username}
        </p>
        <p className='mb-3'>{thought.thoughtText}</p>
        <p className='text-tertiary pb-3 border-bottom'>{thought.createdAt}</p>
        <div className='flex-row align-center thought-reaction'>
          <div className='flex-row align-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              fill='currentColor'
              className='bi bi-chat align-center'
              viewBox='0 0 16 16'
            >
              <path d='M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z' />
            </svg>
            <p className='mb-0 ml-3'>{thought.reactionCount}</p>
          </div>
          <div className='flex-row align-center ml-5'>
            <button className='flex-row align-center btn-clear cursor-pointer' onClick={() => liked ? handleUnlike() : handleLike()}>
              {liked ?
                (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f91880" className="bi bi-heart-fill" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#71767b" className="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>)
              }
            </button>
            <p className={`mb-0 ml-3 ${(liked ? ('text-like') : ('text-tertiary'))}`}>{numberOfLikes}</p>
          </div>
        </div>
      </div>
      <div className='flex-row justify-space-between overflow-scroll max-100-vh'>
        {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
        {thought.reactionCount > 0 && (
          <ReactionList reactions={thought.reactions} />
        )}
      </div>
    </div>
  );
};

export default SingleThought;

