import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <main className='min-h-screen w-full max-w-3xl mx-auto px-4 py-6 space-y-4'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-neutral-900 border-b border-neutral-800 pb-2'>
        <div className='flex items-center gap-2 text-white px-1'>
          <Bell size={20} />
          <h2 className='text-lg font-semibold'>Notifications</h2>
        </div>
      </div>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='space-y-3'>
        {loading && (
          <div className='text-sm text-gray-500 animate-pulse'>Loading notifications...</div>
        )}

        {!loading && notifications.length === 0 && (
          <div className='text-sm text-gray-400 text-center py-12 border border-neutral-800 rounded-xl bg-neutral-900 shadow-sm'>
            No notifications yet.
          </div>
        )}

        {!loading &&
          notifications.map((notification) => (
            <SingleNotification
              key={notification._id}
              notification={notification}
              notificationType={notification.notificationType}
            />
          ))}
      </motion.section>
    </main>
  );
};

export default Notifications;
