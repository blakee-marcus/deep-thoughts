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
          <SingleThought key={thought._id} thought={thought} checkIfLiked={checkIfLiked} handleLike={handleLike} handleUnlike={handleUnlike} />
        ))}
    </div>
  );
};

export default ThoughtList;

