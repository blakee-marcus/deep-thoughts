import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { UPDATE_PROFILE } from '../../utils/mutations';

const UpdateUserForm = ({ user, setModalVisible }) => {
  const [formState, setFormState] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const validate = (name, value) => {
    if (name === 'name' && value.trim().length < 1) {
      return "Name can't be blank";
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrorMessage(validate(name, value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (errorMessage) return;

    try {
      await updateProfile({
        variables: { username: user.username, ...formState },
      });
      setModalVisible(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className='w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700'>
          <h2 className='text-lg font-semibold text-zinc-900 dark:text-white'>Edit Profile</h2>
          <button
            onClick={() => setModalVisible(false)}
            className='text-zinc-400 hover:text-red-500 transition'>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className='space-y-4 px-5 py-4'>
          {['name', 'bio', 'location', 'website'].map((field) => (
            <div key={field} className='space-y-1'>
              <label
                htmlFor={field}
                className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type='text'
                value={formState[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 rounded-md text-sm border ${
                  errorMessage && errorMessage.toLowerCase().includes(field)
                    ? 'border-red-500'
                    : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
              />
            </div>
          ))}

          {errorMessage && <div className='text-sm text-red-500'>{errorMessage}</div>}
        </form>

        {/* Footer */}
        <div className='flex justify-end items-center gap-2 px-5 py-4 border-t border-zinc-200 dark:border-zinc-700'>
          <button
            onClick={() => setModalVisible(false)}
            className='px-4 py-2 text-sm rounded-md text-zinc-500 hover:text-white hover:bg-zinc-700 transition'>
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition'>
            <Save size={16} />
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateUserForm;
