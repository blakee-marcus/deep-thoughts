import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [addUser, { loading }] = useMutation(ADD_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formState;
    if (!username || !email || !password) {
      toast.error('All fields are required.');
      return;
    }

    try {
      const { data } = await addUser({ variables: { ...formState } });
      Auth.login(data.addUser.token);
    } catch (err) {
      toast.error('Signup failed. Try again.');
      console.error(err);
    }
  };

  return (
    <main className='min-h-screen flex items-center justify-center px-4 dark:bg-zinc-900'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='w-full max-w-md bg-white dark:bg-zinc-800 border border-border rounded-xl shadow-subtle p-6 space-y-6'>
        <div className='text-center'>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2'>
            <UserPlus size={20} />
            Create your account
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Join Deep Thoughts to share and explore ideas
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label htmlFor='username' className='block text-sm font-medium'>
              Username
            </label>
            <div className='relative'>
              <User className='absolute left-3 top-2.5 text-gray-400' size={16} />
              <input
                id='username'
                name='username'
                type='text'
                required
                value={formState.username}
                onChange={handleChange}
                className='w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-white dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label htmlFor='email' className='block text-sm font-medium'>
              Email
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-2.5 text-gray-400' size={16} />
              <input
                id='email'
                name='email'
                type='email'
                required
                value={formState.email}
                onChange={handleChange}
                className='w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-white dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          <div className='space-y-1'>
            <label htmlFor='password' className='block text-sm font-medium'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-2.5 text-gray-400' size={16} />
              <input
                id='password'
                name='password'
                type='password'
                required
                value={formState.password}
                onChange={handleChange}
                className='w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-white dark:bg-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary'
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type='submit'
            disabled={loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md transition hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary'>
            <UserPlus size={16} />
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
};

export default Signup;
