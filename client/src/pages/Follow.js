import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

const Follow = (props) => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  const user = data?.me || data?.user || {};


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className='w-100'>
      <div className='flex-column mb-0 pl-3 border-bottom border-right'>
        <div className='flex-column'>
          <h3 className='bg-dark-transparent text-light mb-0 pb-0 display-inline-block'>
            {user.name}
          </h3>
          <p className='text-tertiary'>@{user.username}</p>
        </div>
        <div className='flex-row justify-space-around'>
          <p className={`text-light mr-3 ${props.navMode === 'following' }`}>Followers</p>
          <p className='text-light mr-3'>Following</p>
        </div>
      </div>
    </section>
  );
};

export default Follow;
