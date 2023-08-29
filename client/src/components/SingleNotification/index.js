import React from "react";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';

const SingleNotification = ({ notification, notificationType }) => {
  console.log(notification);
  if (notificationType === 'follow') {
    return (
      <div className="card mb-0 mt-2" key={notification._id}>
        <p className='mb-1 flex-row align-center'>
          <Link to={`/profile/${notification.fromUser.username}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#1d9bf0" className="bi bi-person-fill ml-3" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
            <span className="fw-heavy ml-2 mb-1">{notification.fromUser.username}</span> followed you
          </Link>
        </p>
      </div>
    );
  }
  if (notificationType === 'like') {
    return (
      <div className="card mb-0 mt-2" key={notification._id}>
        <div className='mb-1 flex-row align-center'>
          <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f91880" className="bi bi-heart-fill ml-3" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
            </svg>
          </div>
          <div>
            <span className="fw-heavy ml-2 mb-1">{notification.fromUser.name}</span> liked your post
            <p className="ml-2 mb-0 text-tertiary">
              {notification.relatedThought.thoughtText && notification.relatedThought.thoughtText.length > 50 ? notification.relatedThought.thoughtText.substring(0, 50) + '...' : notification.relatedThought.thoughtText}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (notificationType === 'reply') {
    return (
      <div className="card mb-0 mt-2" key={notification._id}>
        <p className='mb-0'>
          <Link
            to={`/profile/${notification.fromUser.username}`}
            style={{ fontWeight: 700 }}
            className='text-light ml-3'>
            {notification.fromUser.name}{' '}
            <span className='text-tertiary fw-light'>
              @{notification.fromUser.username}
            </span>
          </Link>{' '}
          <span className='text-tertiary'>•</span> <span className='text-tertiary'>{notification.notificationDate}</span>
        </p>
        <p className="ml-3 mb-0 text-tertiary">
          Replying to <span className='fw-heavy text-primary'>@{Auth.getProfile().data.username}</span>
        </p>
        <p className="ml-3 mt-0">
          {notification.reactionText}
        </p>
      </div>
    );
  }

};

export default SingleNotification;