import React from 'react';
import { Link } from 'react-router-dom';

const ReactionList = ({ reactions }) => {
    console.log(`reactionlist.js:`);
    console.log(reactions);
    return (
    <div
      className={`border-right w-100 ${reactions.length === 0 && 'border-top'}`}
    >
      {reactions &&
        reactions.map((reaction) => (
          <div key={reaction._id} className='card mb-0 mt-2'>
            <p className='mb-0'>
              <Link
                to={`/profile/${reaction.username}`}
                style={{ fontWeight: 700 }}
                className='text-light ml-3'
              >
                {reaction.author.name} <span className='text-tertiary fw-light text-standard'>@{reaction.author.username} • {reaction.createdAt}</span>
              </Link>{' '}
              
            </p>
            <div className='card-body flex-column ml-2'>
              <p>{reaction.reactionBody}</p>
            </div>
          </div>
          // <p className='text-light' key={reaction._id}>
          //     {reaction.reactionBody} {"// "}
          //     <Link
          //         to={`/profile/${reaction.username}`}
          //         style={{ fontWeight: 700 }}
          //     >
          //         {reaction.username} on {reaction.createdAt}
          //     </Link>
          // </p>
        ))}
    </div>
  );
};

export default ReactionList;

