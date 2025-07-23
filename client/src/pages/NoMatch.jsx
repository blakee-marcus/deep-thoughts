import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NoMatch = () => {
  return (
    <main className='min-h-screen flex items-center justify-center bg-neutral-900 px-4'>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='w-full max-w-md text-center bg-neutral-800 border border-neutral-700 p-8 rounded-xl shadow-subtle space-y-4'>
        <AlertTriangle className='mx-auto text-yellow-400' size={36} />
        <h1 className='text-xl font-semibold text-white'>Page not found</h1>
        <p className='text-sm text-gray-400'>Hmm... this page doesn’t exist or has been moved.</p>
        <Link
          to='/'
          className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition'>
          Go Home
        </Link>
      </motion.section>
    </main>
  );
};

export default NoMatch;
