import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { toast } from 'sonner';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { loading }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.email || !formState.password) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      const { data } = await login({ variables: { ...formState } });
      Auth.login(data.login.token);
    } catch (err) {
      toast.error('Login failed. Check your credentials.');
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
        {/* Header */}
        <div className='text-center space-y-1'>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Sign in to Deep Thoughts
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email Field */}
          <div className='space-y-1'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
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

          {/* Password Field */}
          <div className='space-y-1'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
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

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type='submit'
            disabled={loading}
            className='w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md transition hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'>
            <LogIn size={16} />
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
};

export default Login;
