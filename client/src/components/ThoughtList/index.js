import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import SingleThought from '../SingleThought';

import { QUERY_MY_LIKES } from '../../utils/queries';
import { LIKE_THOUGHT, UNLIKE_THOUGHT } from '../../utils/mutations';

const ThoughtList = ({ thoughts, username, displayLikeList, displayFollowing }) => {
  const { data } = useQuery(QUERY_MY_LIKES);
  const [likeThought] = useMutation(LIKE_THOUGHT);
  const [unlikeThought] = useMutation(UNLIKE_THOUGHT);
  const [likedThoughts, setLikedThoughts] = useState([]);

  useEffect(() => {
    if (data) {
      setLikedThoughts(data?.me?.likes.map((like) => like._id));
    }
  }, [data]);

  const checkIfLiked = (thoughtId) => {
    return likedThoughts?.some((like) => like === thoughtId);
  };
  const handleLike = async (thoughtId) => {
    try {
      likeThought({
        variables: { thoughtId },
      });
      setLikedThoughts([...likedThoughts, thoughtId]);
    } catch (e) {
      console.error(e);
    }
  };
  const handleUnlike = async (thoughtId) => {
    try {
      unlikeThought({
        variables: { thoughtId },
      });
      setLikedThoughts(likedThoughts.filter((id) => id !== thoughtId));
    } catch (e) {
      console.error(e);
    }
  };

  if (!thoughts.length && displayLikeList) {
    return (
      <section className='flex-column align-center justify-center'>
        <h3 className='text-light fw-heavy'>@{username} hasn't hasn’t liked any Thoughts</h3>{' '}
        <p className='text-tertiary'>When they do, those Thoughts will show up here.</p>
      </section>
    );
  }

  if (!thoughts.length && displayFollowing) {
    return (
      <section className='flex-column align-center justify-center'>
        <h3 className='text-light fw-heavy'>Welcome to Deep Thoughts!</h3>{' '}
        <p className='text-tertiary'>This is the best place to see what’s happening in your world. Find some people to follow now.</p>
      </section>
    );
  };

  if (!thoughts.length) {
    return (
      <section className='flex-column align-center'>
        <h3 className='text-light'>@{username} hasn't Thought</h3>{' '}
        <p className='text-tertiary'>When they do, their Thoughts will show up here.</p>
      </section>
    );
  }

  return (
    <div>
      {thoughts &&
        thoughts.map((thought) => (
          // <div key={thought._id} className='card mb-0 mt-2'>
          //   <p className='mb-0'>
          //     <Link
          //       to={`/profile/${thought.author.username}`}
          //       style={{ fontWeight: 700 }}
          //       className='text-light ml-3'>
          //       {thought.author.name}{' '}
          //       <span className='text-tertiary fw-light'>
          //         @{thought.author.username}
          //       </span>
          //     </Link>{' '}
          //     <span className='text-tertiary'>•</span> <span className='text-tertiary'>{thought.createdAt}</span>
          //   </p>
          //   <div className='card-body flex-column'>
          //     <Link to={`/thought/${thought._id}`}>
          //       <p className='ml-2 text-left'>{thought.thoughtText}</p>
          //     </Link>

          //     {/* Replies */}
          //     <div className='flex-row align-center'>
          //       <div className='flex-row align-center thought-reaction'>
          //         <svg
          //           xmlns='http://www.w3.org/2000/svg'
          //           width='16'
          //           height='16'
          //           fill='currentColor'
          //           className='bi bi-chat ml-2'
          //           viewBox='0 0 16 16'>
          //           <path d='M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z' />
          //         </svg>
          //         <p className='mb-0 ml-3'>{thought.reactionCount}</p>
          //       </div>
          //       {/* Likes */}
          //       <div className='flex-row align-center ml-5'>
          //         <button className='flex-row align-center btn-clear cursor-pointer' onClick={() => checkIfLiked(thought._id) ? handleUnlike(thought._id) : handleLike(thought._id)}>
          //           {checkIfLiked(thought._id) ?
          //             (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f91880" className="bi bi-heart-fill" viewBox="0 0 16 16">
          //               <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
          //             </svg>)
          //             :
          //             (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#71767b" className="bi bi-heart" viewBox="0 0 16 16">
          //               <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          //             </svg>)
          //           }
          //         </button>
          //         <p className={`mb-0 ml-3 ${(checkIfLiked(thought._id) ? ('text-like') : ('text-tertiary'))}`}>{thought.likes.length}</p>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <SingleThought key={thought._id} thought={thought} checkIfLiked={checkIfLiked} handleLike={handleLike} handleUnlike={handleUnlike} />
        ))}
    </div>
  );
};

export default ThoughtList;

