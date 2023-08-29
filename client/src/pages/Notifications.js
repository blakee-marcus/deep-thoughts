import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import SingleNotification from '../components/SingleNotification';

import { QUERY_MY_NOTIFICATIONS } from '../utils/queries';

const Notifications = () => {
  const { loading, data } = useQuery(QUERY_MY_NOTIFICATIONS);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (data) {
      setNotifications(data.me.notifications);
    }
  }, [data]);
  
  console.log(notifications);
  return (
    <section className='flex-row justify-space-between overflow-scroll max-100-vh border-right'>
      <div className='col-12 border-bottom pb-0 sticky-header'>
        <h2 className='text-light p-3'>Notifications</h2>
      </div>
      <div className='w-100 mb-3 col-lg-12'>
        {notifications && notifications.map((notification) => (<SingleNotification notification={notification} notificationType={notification.notificationType} key={notification._id}/>))}
      </div>
    </section>
  );

};

export default Notifications;