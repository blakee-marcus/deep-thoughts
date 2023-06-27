import React from 'react';
import { Link } from 'react-router-dom';

const ThoughtList = (props) => {
    console.log('thoughtlist.js');
    console.log(props);
    if (!props.thoughts.length) {
    return (
      <section className='flex-column align-center'>
        <h3 className='text-light'>@{props.username} hasn't Thought</h3>{' '}
        <p className='text-tertiary'>When they do, their Thoughts will show up here.</p>
      </section>
    );
  }

  return (
    <div>
      {props.thoughts &&
        props.thoughts.map((thought) => (
          <div key={thought._id} className='card mb-0 mt-2'>
            <p className='mb-0'>
              <Link
                to={`/profile/${thought.author.username}`}
                style={{ fontWeight: 700 }}
                className='text-light ml-3'>
                {thought.author.name}{' '}
                <span className='text-tertiary fw-light'>
                  @{thought.author.username}
                </span>
              </Link>{' '}
              • <span className='text-tertiary'>{thought.createdAt}</span>
            </p>
            <div className='card-body flex-column'>
              <Link to={`/thought/${thought._id}`}>
                <p className='ml-2 text-left'>{thought.thoughtText}</p>
                <div className='flex-row align-center thought-reaction'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    fill='currentColor'
                    className='bi bi-chat'
                    viewBox='0 0 16 16'>
                    <path d='M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z' />
                  </svg>
                  <p className='mb-0 ml-3'>{thought.reactionCount}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;

